---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.14 M14 - Recurrentes (V1.2)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M14"
modulo: "M14"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.13 M13 - Deudas y préstamos (V1.1)]] · → [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]]

### 4.14 M14 — Recurrentes (V1.2)

#### 4.14.1 Contratos

```ts
CreateRuleInput = z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(40), kind: z.enum(['expense','income','transfer']),
  amount: Amount.optional(), accountId, destAccountId: z.string().uuid().optional(), categoryId: z.string().uuid().optional(), note: Note.optional(),
  frequency: z.discriminatedUnion('type', [
    z.object({ type: z.literal('daily') }),
    z.object({ type: z.literal('weekly'), weekday: z.number().int().min(0).max(6) }),
    z.object({ type: z.literal('monthly'), day: z.number().int().min(1).max(31) }),
    z.object({ type: z.literal('yearly'), month: z.number().int().min(1).max(12), day: z.number().int().min(1).max(31) }) ]),
  startDate: LocalDate,                                                               // ≥ hoy (RF-M14-03)
  end: z.discriminatedUnion('type', [ z.object({ type: z.literal('none') }),
    z.object({ type: z.literal('until'), date: LocalDate }), z.object({ type: z.literal('count'), count: z.number().int().min(1).max(999) }) ]),
  mode: z.enum(['auto','confirm']) }).refine(r => r.amount !== undefined || r.mode === 'confirm', 'AMOUNT_REQUIRED_FOR_AUTO');  // RF-M14-14
UpdateRuleInput = CreateRuleInput.omit({ id: true }).partial();                                                // solo afecta lo futuro
ConfirmOccurrenceInput = z.object({ transactionId: z.string().uuid(), amount: Amount.optional(), date: LocalDate.optional(),
  rateUsdBob: Rate.optional(), declaredRate: Rate.optional(), accountId: z.string().uuid().optional(), categoryId: z.string().uuid().optional(),
  earmarkWithdrawals: EarmarkWithdrawals.optional() });
ResumeInput = z.object({ registerDates: z.array(LocalDate) });
RecurringOverviewDto = { rules: RuleDto[] /* nextDate, next3, "Cuota X de N" */, pending: OccurrenceDto[], upcoming30: UpcomingDto[] }  // RF-M14-13
```

**`packages/domain/recurrence`:**
- `nextDates(rule, fromDate, n)`: si el día no existe en el mes, cae el último día; el 29 de febrero pasa al 28 en años no bisiestos (RF-M14-02, EC-M14-01).
- `skippedDates(rule, pausedAt, today)`.
- `isFinished(rule, generatedCount, date)`.

#### 4.14.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/recurring` | Reglas con su próxima fecha, pendientes y vencimientos de 30 días. | — |
| `POST /api/recurring` | Idempotente, con tope de 100. Si `startDate = hoy`, genera la ocurrencia de hoy en la misma transacción (RF-M14-03, EC-M14-07). | `AMOUNT_REQUIRED_FOR_AUTO 422` · `START_DATE_IN_PAST 422` · `LIMIT_REACHED` |
| `PATCH /api/recurring/:id` | Solo afecta las fechas futuras. Pendientes y movimientos no cambian (RF-M14-10). | — |
| `POST /api/recurring/:id/pause` · `GET /api/recurring/:id/skipped` · `POST /api/recurring/:id/resume` | Reanudar registra las fechas elegidas en orden, con su fecha y la tasa de esa fecha. Las que bloquearían un negativo o un apartado quedan como pendientes. Respeta N y la fecha de fin (EC-M14-05, EC-M14-06). | `INVALID_STATE 409` · `DATE_NOT_SKIPPED 422` |
| `DELETE /api/recurring/:id` | Los pendientes caen en cascada y sus avisos se resuelven. Los movimientos se conservan con `recurring_label` (RF-M14-11, EC-M14-04). | — |
| `POST /api/recurring/occurrences/:id/confirm` | `UPDATE recurring_occurrence … WHERE status = 'pending' RETURNING` → crea la transacción (`origin = recurring`; fecha original u otra, ≤ hoy; puede ser anterior al saldo inicial; cuenta o categoría archivada → hay que elegir otra) → `registered` → aviso resuelto (EC-M15-01). | `ALREADY_DECIDED 409` · `ACCOUNT_ARCHIVED 409` · `CATEGORY_ARCHIVED 409` · `NEGATIVE_BALANCE` · `EARMARK_CONFIRMATION_REQUIRED` |
| `POST /api/recurring/occurrences/:id/skip` | `pending → skipped`, y el aviso queda resuelto. | `ALREADY_DECIDED 409` |

#### 4.14.3 Ciclo de vida y concurrencia
- **Job `recurring.generate`** (cada tick, con `withUserLock`). Para cada regla `active` cuya próxima fecha sea ≤ hoy en la zona del usuario, genera todas las fechas faltantes desde `last_generated_date` (puesta al día tras una caída, EC-M14-03):
  1. `INSERT INTO recurring_occurrence … ON CONFLICT (rule_id, scheduled_date) DO NOTHING`. Si no se insertó, ya existía y se salta (RF-M14-12).
  2. **Modo auto:** crea la transacción con `BalanceGuard` en modo automatic. Si queda bloqueada (negativo o apartado), la ocurrencia pasa a `pending` + aviso (RF-M14-05, EC-M4-03, EC-M12-05). Una transferencia usa la precarga de RF-M3-07 de ese día (RF-M14-06).
  3. **Modo confirm:** `pending` + aviso `recurring_pending:{occurrenceId}`.
  4. `generated_count++`. Al llegar a N, o al pasar la fecha de fin, la regla queda `finished`.
- **La hora local se compara como fecha, no como instante.** Así el horario de verano o un cambio de zona no repiten ni pierden fechas (RF-M14-04).
- **Job `recurring.expirePending`:** un pendiente con `pending_since < now() − 30 d` pasa a `omitted` + aviso `recurring_omitted:{occurrenceId}` (RF-M14-07). Para los recuperados tras una caída, los 30 días cuentan desde `pending_since`. Las ocurrencias siguientes se generan aunque haya pendientes.
- **Regla:**
  - activa ⇄ pausada (manual, o automática al archivarse su cuenta o categoría, con un aviso `recurring_pending` de clave `rule:{id}:paused:{fecha}`; EC-M14-02);
  - activa o pausada → finalizada;
  - finalizada → activa si se extiende el fin;
  - eliminada es final.

#### 4.14.4 UI y estado
- **`/recurrentes`:**
  - `<RulesList>` con la próxima fecha, las 3 siguientes y "Cuota X de N";
  - `<PendingList>` con Confirmar (`<ConfirmPendingDialog>`, que permite ajustar monto, fecha y tasa) y Omitir;
  - `<Upcoming30>`.
- **Diálogos:** `<RuleForm>` (frecuencia, inicio, fin y modo; monto opcional solo en confirmación) y `<ResumeDialog>` con casillas para las fechas saltadas.
- **Estado:** `['recurring']`. Confirmar invalida además `['transactions']`, `['accounts']` y `['dashboard']`.

---

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]]

