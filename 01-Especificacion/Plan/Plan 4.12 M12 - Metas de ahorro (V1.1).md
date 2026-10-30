---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.12 M12 - Metas de ahorro (V1.1)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M12"
modulo: "M12"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.11 M11 - Presupuestos (V1.1)]] · → [[Plan 4.13 M13 - Deudas y préstamos (V1.1)]]

### 4.12 M12 — Metas de ahorro (V1.1)

#### 4.12.1 Contratos

```ts
CreateGoalInput = z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(40), target: Amount, currencyCode: CurrencyCode,
  targetDate: LocalDate.optional(), icon: IconKey, color: PaletteKey, dedicatedAccountId: z.string().uuid().optional() });
UpdateGoalInput = CreateGoalInput.omit({ id: true, dedicatedAccountId: true }).partial();     // fecha ≥ hoy (RF-M12-01)
EarmarkInput  = z.object({ id: z.string().uuid(), accountId: z.string().uuid(), amount: Amount });
ReleaseInput  = z.object({ accountId: z.string().uuid(), amount: Amount });
DedicateInput = z.object({ accountId: z.string().uuid() });
GoalDto = { id, name, target, currencyCode, targetDate?, icon, color, status: 'in_progress'|'achieved'|'overdue'|'archived',
  progress: Money, pct: number, byAccount: { accountId, name, amount, dedicated: boolean }[],
  suggested: { kind: 'monthly'|'this_month'|'calculator'|'pick_new_date'|'none'; amount?: Money; untilMonth?: string },
  dedicatedAccount?: { id, name }, firstAchievement: boolean }
```

**`packages/domain/goals`:**
- `progress(dedicatedBalance, earmarks[], rates)`: el saldo de la dedicada con mínimo 0 (EC-M12-04) más los apartados de las otras cuentas, convertido a la moneda de la meta con la tasa vigente (RF-M12-02).
- `status(goal, progress, today)` (ADR-13).
- `suggestedMonthly(target, progress, targetDate, today)` (RF-M12-06).
- `earmarkProposal(shortfall, earmarksByGoal)`: primero la meta con la fecha más lejana o sin fecha (RF-M12-05).

#### 4.12.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/goals` · `GET /api/goals/:id` | Progreso y estado calculados al leer. El historial une los `goal_allocation_event` con los asientos de la dedicada, cada uno con su origen (RF-M12-07). | — |
| `POST /api/goals` | Idempotente, con tope de 50. Si dedica una cuenta, valida lo mismo que `/dedicate`. | `LIMIT_REACHED` · `ACCOUNT_NOT_DEDICABLE 422` |
| `PATCH /api/goals/:id` | Cambiar la moneda no vuelve a avisar hitos ya cruzados. | `TARGET_DATE_IN_PAST 422` |
| `POST /api/goals/:id/earmarks` | La cuenta va bajo `FOR UPDATE`: el monto debe ser ≤ saldo libre (saldo − Σ apartados). Inserta un evento `manual`. | `EARMARK_EXCEEDS_FREE 422 {free}` (EC-M12-01) · `ACCOUNT_NOT_DEDICABLE 422` (tarjeta) |
| `POST /api/goals/:id/earmarks/release` | El monto debe ser ≤ lo apartado en esa cuenta. Inserta un evento negativo `manual`. | `RELEASE_EXCEEDS_EARMARK 422` |
| `POST /api/goals/:id/dedicate` | La cuenta no es tarjeta, no está dedicada a otra meta y no tiene apartados de otras metas. | `ACCOUNT_HAS_OTHER_EARMARKS 409` (EC-M12-06) · `ACCOUNT_ALREADY_DEDICATED 409` · `ACCOUNT_NOT_DEDICABLE 422` |
| `POST /api/goals/:id/use-and-close` | Eventos `use_and_close` que dejan cada apartado en 0, `dedicated_account_id = NULL`, `archived_at = now()` (RF-M12-09). | — |
| `POST /api/goals/:id/archive` · `/restore` · `DELETE /api/goals/:id` | Archivar y eliminar solo si la meta está vacía (sin apartados ni dedicada). | `GOAL_NOT_EMPTY 409` |
| `POST /api/goals/:id/celebrated` | Marca `celebrated_at`: la celebración se muestra una sola vez. | — |

#### 4.12.3 Ciclo de vida y concurrencia
- **Estados:** en curso, cumplida y vencida se derivan al leer (ADR-13), así que siguen solas al progreso, a los retiros y al tipo de cambio (EC-M12-03). Archivada se guarda (`archived_at`). Restaurar no recupera apartados anteriores.
- **Protección de apartados (RF-M12-05):** la aplica `BalanceGuard` con el saldo vigente bajo `FOR UPDATE`, ante cualquier operación que baje el saldo: gastos, transferencias, ediciones, eliminaciones, deshacer, ajustes, pagos de deuda y eliminación de una deuda con sus movimientos (EC-M12-07).
  - En modo interactivo pide confirmación con la propuesta precargada; al confirmar, inserta eventos `confirmed_spend` en la misma transacción del gasto.
  - Un recurrente automático no se registra y queda pendiente (EC-M12-05).
  - En las acciones en lote, el movimiento se omite.
- **Cuenta dedicada:**
  - Sus salidas no piden confirmación; Registrar muestra el aviso (RF-M7-14).
  - Su progreso es su saldo, así que ingresos, transferencias y cobros de deudas "Me deben" suman solos.
  - Un ajuste en la dedicada cambia el progreso y aparece en la historia con el origen "ajuste".
- **Hitos (RF-M15-04, V1.2):** se evalúan después de cada evento de apartado, de cada asiento de una dedicada y del job horario de tasas. El aviso `goal:{id}:milestone:{25|50|75|100}` tiene clave única, así que el tipo de cambio no puede hacerlo repetir.
- **Total neto (RF-M12-08):** no cambia por los apartados. El desglose suma la línea "Apartado para metas" (apartados + saldo positivo de las dedicadas).

#### 4.12.4 UI y estado
- **`/metas`:** `<GoalCards>` con anillo de progreso y estado.
- **`/metas/:id`:** `<GoalProgress>`, `<ProgressByAccount>`, `<GoalHistory>`, `<SuggestedBox>` (sugerido, "Faltan X este mes", calculadora o "Elige una nueva fecha") y `<Celebration>` la primera vez.
- **Diálogos:** `<GoalForm>`, `<EarmarkDialog>` (muestra el saldo libre), `<ReleaseDialog>`, `<DedicateDialog>`, `<UseAndCloseDialog>`, y `<EarmarkConfirmDialog>` (compartido con M6, M7 y M13).
- **Estado:** `['goals']` y `['goal', id]`. Toda mutación de movimientos o apartados invalida `['goals']` y `['accounts']`.

---

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M15 - Recordatorios y avisos]] · [[M6 - Transacciones]] · [[M7 - Registrar]]
- **Decisiones (ADR):** [[ADR-13 - Estados derivados al leer]]
- **Entidades:** [[Entidad - GoalAllocationEvent]]

