---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.13 M13 - Deudas y préstamos (V1.1)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M13"
modulo: "M13"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.12 M12 - Metas de ahorro (V1.1)]] · → [[Plan 4.14 M14 - Recurrentes (V1.2)]]

### 4.13 M13 — Deudas y préstamos (V1.1)

#### 4.13.1 Contratos

```ts
CreateDebtInput = z.object({ id: z.string().uuid(), direction: z.enum(['i_owe','owed_to_me']), person: z.string().trim().min(1).max(40),
  principal: Amount, currencyCode: CurrencyCode, startDate: LocalDate, dueDate: LocalDate.optional(), note: Note.optional(),
  interest: z.object({ rate: z.string().regex(/^\d{1,3}(\.\d{1,4})?$/), period: z.enum(['monthly','yearly']) }).optional(),
  initialMovement: z.object({ transactionId: z.string().uuid(), accountId: z.string().uuid(), declaredRate: Rate.optional() }).optional() });
UpdateDebtInput  = z.object({ person, note, dueDate: LocalDate.nullable(), principal: Amount }).partial().strict();
PaymentInput = z.object({ id: z.string().uuid(), amount: Amount, interestPart: Money, capitalPart: Money, date: LocalDate,
  account: z.object({ accountId: z.string().uuid(), declaredRate: Rate.optional(),
                      capitalTransactionId: z.string().uuid(), interestTransactionId: z.string().uuid() }).optional(),
  note: Note.optional(), earmarkWithdrawals: EarmarkWithdrawals.optional() });
DeleteDebtInput = z.object({ movements: z.enum(['delete','keep']).optional() });
DebtDto = { id, direction, person, principal, currencyCode, startDate, dueDate?, status: 'active'|'overdue'|'paid'|'forgiven',
  capitalOutstanding: Money, interestAccrued: Money, pending: Money, interest?: { rate, period },
  payments: PaymentDto[], canDeleteLastPayment: boolean, forgivenAmount? }
DebtsSummaryDto = { iOwe: Money; owedToMe: Money; byPerson?: { personKey; person; net: Money }[] }   // RF-M13-13
```

**`packages/domain/debts`:**
- `dailyRate(rate, period)` = rate ÷ 100 ÷ 30 (mensual) o ÷ 365 (anual).
- `accrue(capital, interestUnpaid, dailyRate, fromDate, toDate)`: precisión exacta; con capital 0 no acumula (EC-M13-02).
- `proposeSplit(amount, interestAccrued, capital)`: primero el interés (RF-M13-05).
- `validatePayment(...)`: interés ≤ acumulado, capital ≤ pendiente, suma exacta y monto ≤ saldo (RF-M13-06).

#### 4.13.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/debts?view=debt\|person` | Interés al día calculado al leer, sin escribir. Resumen en la base con la tasa vigente; la vista por persona agrupa por `person_key` (EC-M13-06). | — |
| `POST /api/debts` | Idempotente, con tope de 200. `capital_outstanding = principal`, `accrued_through = start_date` (con fecha pasada se lleva el interés desde entonces, EC-M13-08). Movimiento inicial opcional en la categoría del sistema: ingreso si "Debo", gasto si "Me deben", con tasa declarada si la cuenta es de otra moneda; pasa por `BalanceGuard`. | `LIMIT_REACHED` · `NEGATIVE_BALANCE` · `EARMARK_CONFIRMATION_REQUIRED` |
| `PATCH /api/debts/:id` | Activa: persona, nota y fecha límite (extenderla saca la deuda de vencida); monto original ≥ capital pagado. Pagada o condonada: solo persona y nota (RF-M13-10). | `PRINCIPAL_BELOW_PAID 422` · `FIELD_LOCKED 422` |
| `POST /api/debts/:id/payments` | Ver 4.13.3. La fecha va entre el inicio y hoy (RF-M13-07). | `PAYMENT_EXCEEDS_BALANCE 422 {pending}` (EC-M13-01) · `SPLIT_INVALID 422 {reason}` · `DEBT_CLOSED 409` · `NEGATIVE_BALANCE` (EC-M13-03) · `EARMARK_CONFIRMATION_REQUIRED` (EC-M13-04) |
| `DELETE /api/debts/:id/payments/last` | Ver 4.13.3. | `NOT_LAST_PAYMENT 409` · `DEBT_FORGIVEN 409` · `NEGATIVE_BALANCE` · `EARMARK_CONFIRMATION_REQUIRED` |
| `POST /api/debts/:id/forgive` | `forgiven_amount` = saldo pendiente, `status = forgiven`, sin movimientos (RF-M13-12). | `DEBT_CLOSED 409` |
| `DELETE /api/debts/:id` | Con movimientos asociados exige `movements`: `delete` los borra (con `BalanceGuard`); `keep` los convierte en movimientos normales (`origin = manual`, misma categoría) (RF-M13-11). | `MOVEMENTS_CHOICE_REQUIRED 409 {count}` |

#### 4.13.3 Ciclo de vida y concurrencia
- **Toda operación sobre una deuda** toma `SELECT debt … FOR UPDATE`, así dos pagos simultáneos se serializan.
- **"Llevar el interés a hoy" (ADR-14):** `interest_unpaid += accrue(capital_outstanding, …, accrued_through → hoy)` y `accrued_through = hoy`. Se ejecuta antes de cada pago y antes de eliminar el último pago. Así lo ya acumulado nunca se recalcula: un pago con fecha pasada reduce el capital desde que se registra (RF-M13-04).
- **Pago:** se lleva el interés a hoy y se valida. Si tiene cuenta, se crean las transacciones vinculadas (capital en "Deudas y préstamos" e interés en "Intereses"; gastos si "Debo", ingresos si "Me deben") con `BalanceGuard`. Luego `capital_outstanding -= capital_part`, `interest_unpaid -= interest_part`, y si los dos quedan en 0, `status = paid`.
- **Eliminar el último pago (R3):** se lleva el interés a hoy, luego `capital_outstanding += capital_part` e `interest_unpaid += interest_part`. Se borran las transacciones vinculadas con `BalanceGuard`, se borra el pago, y si estaba `paid` vuelve a `active`. El "último" es el de mayor `created_at`.
- **Estados:**
  - activa → vencida se deriva al leer (fecha límite pasada y saldo > 0);
  - activa → pagada es automática;
  - pagada → activa solo al eliminar el último pago;
  - condonada y eliminada son finales. Una deuda pagada o condonada no admite pagos nuevos.
- **Avisos de vencimiento (RF-M13-14, V1.1):** los genera el job `notifications.scheduled` a las 08:00 locales para deudas activas en ambas direcciones: tres días antes, el día del vencimiento y el día siguiente si quedó vencida. La clave única `debt:{id}:due:{dueDate}:{d-3|d0|d+1}` impide repetirlos, y no insisten después.

#### 4.13.4 UI y estado
- **`/deudas`:** `<DebtsSummary>` ("Debes X · Te deben Y"), `<ViewToggle>` (por deuda o por persona) y `<DebtList>` con el saldo pendiente.
- **`/deudas/:id`:** `<DebtHeader>` (capital, interés acumulado y pendiente, mostrados por separado) y `<PaymentsList>` ("Eliminar último pago" solo en el último). Acciones Condonar y Eliminar (`<DeleteDebtDialog>` con las dos opciones).
- **Formularios:**
  - `<DebtForm>`: persona con autocompletado de `person` ya usados, interés opcional y movimiento inicial opcional;
  - `<PaymentForm>`: desglose precargado y editable, cuenta opcional y tasa si la cuenta es de otra moneda.
- **Estado:** `['debts', view]` y `['debt', id]`. Las mutaciones invalidan además `['transactions']`, `['accounts']` y `['dashboard']`.

---

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]]
- **Decisiones (ADR):** [[ADR-14 - Interés de deudas como foto]]

