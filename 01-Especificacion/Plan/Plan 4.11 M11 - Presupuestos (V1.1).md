---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.11 M11 - Presupuestos (V1.1)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M11"
modulo: "M11"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.10 M10 - Onboarding (V1.0)]] · → [[Plan 4.12 M12 - Metas de ahorro (V1.1)]]

### 4.11 M11 — Presupuestos (V1.1)

#### 4.11.1 Contratos

```ts
CreateBudgetInput = z.object({ id: z.string().uuid(), scope: z.enum(['category','general']), categoryId: z.string().uuid().optional(),
  amount: Amount, currencyCode: CurrencyCode, startDay: z.number().int().min(1).max(28).default(1),
  defaultAction: z.enum(['discard','carry']).default('discard'),
  thresholds: z.array(z.number().int().min(1).max(150)).max(3).default([80, 100])
    .refine(t => new Set(t).size === t.length).transform(t => [...t].sort((a, b) => a - b)) });
UpdateBudgetInput = z.object({ amount: Amount, defaultAction, thresholds, startDay }).partial().strict();   // la moneda no cambia
DecisionInput = z.discriminatedUnion('result', [
  z.object({ result: z.literal('surplus'), carry: Money, discard: Money,
             toGoal: z.object({ goalId, accountId, amount: Amount, mode: z.enum(['earmark','transfer']) }).optional() }),
  z.object({ result: z.literal('deficit'), mode: z.enum(['carry','absorb']) })
]);
BudgetDto = { id, scope, category?, amount, currencyCode, startDay, nextStartDay?, defaultAction, thresholds, status,
  current?: { periodId, start, end, spent, available, carryover, lateAdjustments: { sourceLabel, amount }[],
              todayShouldBe: Money, pace: { kind: 'daily'|'over'|'exceeded'; amount: Money; days?: number } },
  pendingClose?: { periodId, label, result: Money, deadline }, childrenExceedParent: boolean }
```

**`packages/domain/budget`:**
- `periodFor(startDay, nextStartDay, date)`: un período mensual que empieza en `startDay`. Si hay `nextStartDay`, el período en curso se alarga hasta el día anterior al próximo día de inicio (RF-M11-07).
- `available = amount + carryover_in + Σ ajustes tardíos no anulados` (RF-M11-05).
- `result = available − spent`.
- `validateSplit(result, carry, toGoal, discard)`: la suma tiene que ser exacta (RF-M11-08).
- `thresholdsCrossed(spent, amount, thresholds, alreadyHit, isPeriodStart)`: se mide sobre el monto; al crear o al empezar un período ya superado, solo cuenta el más alto (RF-M11-13).
- `paceText(...)`: "Puedes gastar X/día durante N días" no se muestra si el disponible es ≤ 0.

#### 4.11.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/budgets` · `GET /api/budgets/:id` | Gasto del período: Σ de los gastos del alcance (con hijas; general = todos los gastos menos RN-02), convertidos a la moneda del presupuesto con las tasas guardadas (RF-M11-03). El detalle trae los 12 últimos períodos. | — |
| `POST /api/budgets` | Idempotente, con tope de 100. Valida la categoría (de gasto y activa; no "Deudas y préstamos", sí "Intereses"). Crea el período en curso y evalúa los umbrales (solo el más alto). | `BUDGET_EXISTS 409 {budgetId}` (EC-M11-06) · `CATEGORY_NOT_BUDGETABLE 422` · `LIMIT_REACHED` |
| `PATCH /api/budgets/:id` | El monto, la acción y los umbrales aplican al período en curso (RF-M11-06). `startDay` se guarda en `next_start_day` y la respuesta trae la fecha de fin del período alargado. | `CURRENCY_IMMUTABLE 422` |
| `POST /api/budgets/:id/pause` · `/resume` · `/reset-carryover` | Ver 4.11.3. | `INVALID_STATE 409` |
| `DELETE /api/budgets/:id` | Cascada con su historia. Resuelve sus avisos de decisión. | — |
| `POST /api/budgets/:id/periods/:periodId/decision` | `UPDATE budget_period … WHERE id = $1 AND status = 'closed_pending' RETURNING`, luego aplica la decisión (ver 4.11.3). "Enviar a meta" solo en el presupuesto general o, si no existe, en los de categorías principales (RF-M11-09). | `DECISION_ALREADY_MADE 409` · `SPLIT_MISMATCH 422` · `TO_GOAL_NOT_ALLOWED 422` · `EARMARK_EXCEEDS_FREE 422` (EC-M11-02) · `GOAL_NOT_AVAILABLE 409` (EC-M11-03) |

#### 4.11.3 Ciclo de vida y concurrencia

| Transición | Mecanismo |
|---|---|
| Período open → closed_pending | Job `budgets.close` (con `withUserLock`): si `end_date < hoy` (zona del usuario) → `UPDATE … WHERE status = 'open'`, `decision_deadline = now() + 7 d` (cuenta desde que se genera, aunque el sistema haya estado caído) + crea el período siguiente (`carryover_in = 0`, aplicando `next_start_day`) + aviso `period_close:{periodId}` con su decisión. Si el presupuesto está `finalizing`, no crea período siguiente y pasa a `finalized`. |
| closed_pending → decided | Endpoint de decisión. Guarda `spent_at_decision` y `result_at_decision`. Sobrante: `carry` → `carryover_in` del período siguiente (reemplaza, no suma); `toGoal` → `goal_allocation_event(origin=budget)` con la cuenta bajo `FOR UPDATE`, o una transferencia real si la meta tiene cuenta dedicada (`origin=goal_transfer`). Exceso: `carry` → `carryover_in` negativo; `absorb` → nada. El aviso queda resuelto. |
| closed_pending → defaulted | Job `budgets.defaultDecision`: si `decision_deadline < now()`, aplica `default_action` (descartar = absorber ante un exceso). Un período finalizado no ofrece arrastrar. |
| Activo → Pausado → Activo | Pausar: `frozen_carryover = arrastre vigente`, el período en curso se elimina si no tiene decisión (no se renueva ni alerta). Reanudar: crea el período que contiene hoy con `carryover_in = frozen_carryover` (EC-M11-08). |
| Activo o Pausado → finalizing → finalized | Lo dispara archivar la categoría (RF-M5-07, EC-M11-04). La decisión pendiente sigue disponible hasta su plazo. |
| Reiniciar arrastre (RF-M11-12) | `carryover_in = 0` + `voided_at` en los ajustes tardíos del período en curso, con confirmación que muestra el monto. |

- **Movimientos tardíos (RF-M11-11, EC-M11-05):** `LedgerHooks.afterChange` encuentra los presupuestos cuyo alcance incluye las categorías afectadas y cuyos períodos cerrados contienen las fechas afectadas:
  - si la decisión está pendiente, no hace nada (el resultado se calcula en vivo);
  - si se decidió con arrastre, inserta un `budget_late_adjustment` con la diferencia en el período en curso;
  - si se decidió descartar, absorber o enviar a meta, o si el presupuesto está pausado, finalizado o eliminado, no hace nada.
- **Umbrales (RF-M11-13, RNF-12):** el mismo hook recalcula el % del período en curso → `INSERT INTO budget_threshold_hit … ON CONFLICT DO NOTHING RETURNING` → solo si se insertó una fila crea el aviso `budget_alert:{periodId}:{threshold}`. Un presupuesto pausado no alerta.
- **Un solo presupuesto por categoría (RF-M11-01):** índices únicos parciales.
- **Presupuestos anidados (RF-M11-02):** un gasto cuenta en su subcategoría, en su padre y en el general, porque cada uno suma su propio alcance. El aviso "los hijos suman más que el padre" se calcula al leer, sin bloquear.

#### 4.11.4 UI y estado
- **`/presupuestos`:** `<BudgetList>` con barras y el período visible.
- **`/presupuestos/:id`:**
  - `<BudgetProgress>` con la marca "hoy deberías llevar X", `<PaceText>` y `<CarryoverBreakdown>` ("Monto ± arrastre = disponible", con los ajustes tardíos);
  - `<CloseDecisionCard>` con `<SurplusSplitForm>` (suma exacta en vivo, selector de meta y cuenta) o `<DeficitChoice>`;
  - `<PeriodHistory>` con 12 períodos.
- **Formulario:** `<BudgetForm>` con useDraft.
- **En la bandeja:** el aviso de cierre muestra los mismos botones y llama al mismo endpoint.
- **Estado:** `['budgets']` y `['budget', id]`. Toda mutación de movimientos las invalida.

---

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M5 - Categorías]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - BudgetLateAdjustment]]

