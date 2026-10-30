---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.4 M4 - Cuentas (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M4"
modulo: "M4"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]] · → [[Plan 4.5 M5 - Categorías (V1.0)]]

### 4.4 M4 — Cuentas (V1.0)

#### 4.4.1 Contratos

```ts
AccountType = z.enum(['cash','bank','ewallet','credit_card','savings','other']);
const AccountName = z.string().trim().min(1).max(40);
const AmountAbs = Money.refine(v => new Decimal(v).abs().lte('999999999.99'));
CardFields = z.object({ cutDay: z.number().int().min(1).max(31).nullable(), payDay: z.number().int().min(1).max(31).nullable(), limit: Money.nullable() });
CreateAccountInput = z.object({
  id: z.string().uuid(), type: AccountType, name: AccountName, currencyCode: CurrencyCode,
  initialBalance: z.union([AmountAbs, z.object({ kind: z.enum(['debt','credit']), amount: AmountAbs })]),  // la tarjeta usa la forma objeto
  initialBalanceDate: LocalDate,                 // ≤ hoy
  color: PaletteKey, icon: IconKey, card: CardFields.optional()
});
UpdateAccountInput = z.object({ name: AccountName, type: AccountType, color: PaletteKey, icon: IconKey, card: CardFields, currencyCode: CurrencyCode }).partial().strict();
AdjustInput  = z.object({ transactionId: z.string().uuid(), realBalance: z.union([Money, z.object({ kind: z.enum(['debt','credit']), amount: AmountAbs })]), note: Note.optional() });
ArchiveInput = z.object({ confirmNonZero: z.boolean().default(false) });
RestoreInput = z.object({ newName: AccountName.optional() });
ReorderInput = z.object({ ids: z.array(z.string().uuid()).min(1) });

AccountDto = { id, type, name, currencyCode, color, icon, status, sortOrder, initialBalance, initialBalanceDate,
  card?: { cutDay, payDay, limit, creditAvailable, overLimit }, balance, balanceInBase, balanceInOther,
  earmarked, free, dedicatedGoal?: { id, name } }
AccountsSummaryDto = { netWorth: { base, other }, breakdown: { liquid, savings, cardDebt, earmarked } }   // RF-M4-10
```

#### 4.4.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/accounts?status=active\|archived` | Saldos con un `SUM` agrupado por cuenta. Total neto y desglose con la tasa vigente, redondeado por cuenta y sumado. | — |
| `POST /api/accounts` | Idempotente. `withUserLock` + `assertLimit(50)` + `FOR SHARE` sobre la moneda. La tarjeta guarda la deuda como negativa. | `NAME_TAKEN 409` · `LIMIT_REACHED 409` · `CURRENCY_INACTIVE 422` · `VALIDATION_ERROR` |
| `PATCH /api/accounts/:id` | Cambio de tipo: valida RF-M4-02 contra el saldo inicial, RF-M4-04 contra el saldo actual, y que una cuenta dedicada o con apartados no pase a tarjeta; al dejar de ser tarjeta, borra sus campos. La moneda cambia solo sin asientos. | `IMMUTABLE_FIELD 422` · `TYPE_CHANGE_INVALID 422 {reason}` · `CURRENCY_LOCKED 409` · `NAME_TAKEN 409` |
| `PUT /api/accounts/order` | Reasigna `sort_order` en una transacción. | `VALIDATION_ERROR` (ids ajenos o faltantes) |
| `POST /api/accounts/:id/adjust` | Bajo `FOR UPDATE`: delta = real − actual. Si es 0, `200 {created:false}` (EC-M4-08). Si no, `ledger_transaction(kind=adjustment, date=hoy)` + un asiento + `BalanceGuard`. | `NEGATIVE_BALANCE 422` · `EARMARK_CONFIRMATION_REQUIRED 409` |
| `POST /api/accounts/:id/archive` | `UPDATE … WHERE status='active'`. Con saldo distinto de 0 sin confirmar, pide confirmación. Rechaza si tiene apartados o es dedicada (V1.1). Quita la cuenta por defecto y pausa sus reglas con aviso (V1.2). | `ARCHIVE_CONFIRMATION_REQUIRED 409 {balance}` · `ACCOUNT_HAS_EARMARKS 409 {goals}` · `ACCOUNT_DEDICATED 409` |
| `POST /api/accounts/:id/restore` | `UPDATE … WHERE status='archived'`. | `NAME_TAKEN 409` · `CURRENCY_INACTIVE 422` |
| `DELETE /api/accounts/:id` | Sin asientos (incluidos los que están dentro de la ventana de deshacer), no dedicada y sin regla recurrente que la use (`recurring_rule.account_id` es `RESTRICT`). Limpieza de RF-M4-13. | `ACCOUNT_HAS_MOVEMENTS 409` · `ACCOUNT_DEDICATED 409` · `ACCOUNT_IN_USE 409 {recurring}` |
| `GET /api/accounts/:id/balance-series?from&to` | Saldo inicial + suma acumulada (`SUM … OVER (ORDER BY date)`) por día del rango. | — |

#### 4.4.3 Ciclo de vida y concurrencia
- **Estados** Activa ⇄ Archivada → Eliminada, con actualizaciones condicionadas. Un trigger impide editar el saldo inicial (RF-M4-07).
- **Bloqueo de negativos (RF-M4-04, EC-M4-01, EC-M7-02):** solo con `BalanceGuard`, con el saldo vigente bajo `FOR UPDATE` (RNF-10). No se validan días pasados: la guarda compara el saldo actual total.
- **Banco con saldo negativo (EC-M4-06):** se permite, porque la guarda solo aplica a efectivo y billetera.
- **Movimiento anterior al saldo inicial (RF-M4-03, RN-12):** no entra en el `SUM` del saldo. La lista lo marca con `date < account.initial_balance_date`.
- **Pago de tarjeta:** es una transferencia, así que no cuenta como gasto (RN-02).
- **Sin cuentas activas (EC-M4-05):** Registrar e Inicio muestran `<QuickAccountForm>` o una invitación a crear una.

#### 4.4.4 UI y estado
- **`/cuentas`:** `<NetWorthSummary>` y `<AccountGroups>` (agrupadas por tipo y ordenadas por `sort_order`; reordenables con dnd-kit y con botones Subir/Bajar). Enlace a `/cuentas?archivadas=1`.
- **`/cuentas/:id`:**
  - `<AccountHeader>`: saldo y equivalente; en tarjetas, "Debes X" o "A favor X", límite, crédito disponible y aviso de límite superado;
  - `<BalanceChart>` y `<MovementsByDay>`, que comparten `?from&to` (por defecto el mes actual) y reutilizan la lista de M6;
  - acciones Ajustar, Editar, Archivar, Restaurar y Eliminar.
- **Formularios:** `<AccountForm>` con useDraft y el subformulario de tarjeta; `<AdjustBalanceDialog>`.
- **Estado:** `['accounts', status]` y `['account', id]`. Toda mutación de movimientos invalida `['accounts']` y `['dashboard']`.

---

---
## 🔗 Relacionado

- **Módulos:** [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]]
- **Requerimientos no funcionales:** [[Spec 3.3 Concurrencia]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

