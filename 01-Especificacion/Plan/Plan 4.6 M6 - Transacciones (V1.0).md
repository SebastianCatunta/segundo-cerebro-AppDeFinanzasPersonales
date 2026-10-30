---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.6 M6 - Transacciones (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M6"
modulo: "M6"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.5 M5 - Categorías (V1.0)]] · → [[Plan 4.7 M7 - Registrar (V1.0)]]

### 4.6 M6 — Transacciones (V1.0)

#### 4.6.1 Contratos

```ts
const Amount = Money.refine(v => { const d = new Decimal(v); return d.gte('0.01') && d.lte('999999999.99'); });  // RF-M6-01
const Note   = z.string().trim().max(140);                                                                     // RF-M6-03
const LocalDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);              // el servidor valida ≤ hoy (RN-07)
const EarmarkWithdrawals = z.array(z.object({ goalId: z.string().uuid(), accountId: z.string().uuid(), amount: Amount }));

CreateTransactionInput = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('expense'), id, accountId, categoryId, amount: Amount, date: LocalDate, note: Note.optional(),
             earmarkWithdrawals: EarmarkWithdrawals.optional(), manualUsdRate: Rate.optional() }),
  z.object({ kind: z.literal('income'),  /* igual que expense */ }),
  z.object({ kind: z.literal('transfer'), id, fromAccountId, toAccountId, amountOut: Amount, amountIn: Amount.optional(),
             declaredRate: Rate.optional(), date: LocalDate, note: Note.optional(),
             fee: z.object({ id: z.string().uuid(), amount: Amount, categoryId: z.string().uuid().optional() }).optional(),
             earmarkWithdrawals: EarmarkWithdrawals.optional() })
]).refine(t => t.kind !== 'transfer' || t.fromAccountId !== t.toAccountId, 'SAME_ACCOUNT');                  // RF-M6-04
UpdateTransactionInput = z.object({ amount: Amount, accountId: z.string().uuid(), amountInNewCurrency: Amount,
  fromAccountId: z.string().uuid(), toAccountId: z.string().uuid(),                  // solo transferencias (RF-M6-07)
  categoryId: z.string().uuid(), date: LocalDate, note: Note.nullable(), rateUsdBob: Rate, rateCurBob: Rate,
  declaredRate: Rate, earmarkWithdrawals: EarmarkWithdrawals }).partial().strict()
  .refine(t => !t.fromAccountId || t.fromAccountId !== t.toAccountId, 'SAME_ACCOUNT');                      // RF-M6-04
ListQuery = z.object({ month: z.string().regex(/^\d{4}-\d{2}$/).optional(), from: LocalDate.optional(), to: LocalDate.optional(),
  accountId: z.string().uuid().optional(), categoryId: z.string().uuid().optional(),
  kind: z.enum(['expense','income','transfer','adjustment']).optional(), q: z.string().trim().max(60).optional(),
  cursor: z.string().optional(), limit: z.number().int().min(1).max(100).default(50) });
BatchDeleteInput      = z.object({ ids: z.array(z.string().uuid()).min(1).max(200) });
BatchRecategorizeInput = BatchDeleteInput.extend({ categoryId: z.string().uuid() });
UndoInput = z.object({ undoToken: z.string().uuid() });

TransactionDto = { id, kind, date, note, category?, entries: { accountId, amount, currencyCode }[], origin, originId?,
  linkedLocked: boolean, recurringLabel?, beforeInitialBalance: boolean, rateUsdBob?, rateCurBob, declaredRate?,
  amountInBase, createdAt, fee?: TransactionDto }
```

**Convención de la tasa declarada:** "1 unidad de la moneda que no es BOB = X Bs". Entre dos monedas que no son BOB: "1 unidad de origen = X de destino". En BOB↔USD, `rate_usd_bob` = la tasa declarada (RF-M3-09).

#### 4.6.2 Endpoints

| Método y ruta | Comportamiento transaccional | Errores |
|---|---|---|
| `POST /api/transactions` | Idempotente (ADR-11). Valida la cuenta y la categoría (activas, del mismo tipo), la fecha ≤ hoy y el monto. Tasas: `resolveUsdRate`; en una transferencia entre monedas distintas, la tasa declarada (con `amountIn` calculado; si el usuario editó el monto que llega, ese manda y la tasa se recalcula, RF-M3-08). Asientos con `BalanceGuard` (interactive) junto con la comisión. Luego `LedgerHooks.afterChange` y la creación de un `undo_action(create)`. | `NEGATIVE_BALANCE 422` · `EARMARK_CONFIRMATION_REQUIRED 409` · `RATE_REQUIRED 409` · `ACCOUNT_ARCHIVED 409` · `CATEGORY_ARCHIVED 409` · `CATEGORY_KIND_MISMATCH 422` · `FUTURE_DATE 422` · `IDEMPOTENCY_CONFLICT 409` |
| `GET /api/transactions` | Paginación por cursor `(date, created_at, id)`. La búsqueda `q` es por nota (`unaccent(lower(note)) LIKE unaccent(lower('%q%'))`) o, si `q` es un monto, por monto exacto en la moneda original. `categoryId` incluye las hijas. Incluye `dayNets` de los días de la página, sin RN-02 (RF-M6-12). | — |
| `GET /api/transactions/summary` | Los mismos filtros → `{income, expense, net}` en la base, con las tasas guardadas, sin RN-02. | — |
| `GET /api/transactions/:id` | Detalle con su comisión y el origen para "Ir a…". | `NOT_FOUND 404` |
| `PATCH /api/transactions/:id` | Gana la última edición (EC-M6-01). La tasa se conserva aunque cambien la fecha o la cuenta; solo cambia si llega `rateUsdBob` o `rateCurBob` (RF-M3-10). Cambio a una cuenta de otra moneda: exige `amountInNewCurrency`, que el cliente precarga con la tasa guardada (RF-M6-07). Transferencias: las cuentas cambian con `fromAccountId` y `toAccountId` (no con `accountId`), cada una a una cuenta activa de la misma moneda que la que reemplaza y distinta de la otra (RF-M6-04, RF-M6-07); la comisión acompaña la fecha y el origen, y su monto no se edita (RF-M6-05). Vinculados: monto, cuenta y fecha bloqueados (RF-M6-09). Recalcula los asientos con `BalanceGuard` y los hooks. | `NOT_FOUND 404` (EC-M6-02, RNF-09) · `LINKED_FIELD_LOCKED 422 {originType, originId}` · `NEGATIVE_BALANCE` · `EARMARK_CONFIRMATION_REQUIRED` · `AMOUNT_OUT_OF_RANGE 422` · `ACCOUNT_ARCHIVED 409` · `VALIDATION_ERROR 400` (`SAME_ACCOUNT`, `CURRENCY_MISMATCH` o un campo que no corresponde al tipo) |
| `DELETE /api/transactions/:id` | `deleted_at = now()` en la transacción y su comisión (EC-M6-05), con `BalanceGuard` (quitar un ingreso puede dejar el efectivo en negativo, EC-M4-01) y los hooks → `undo_action(delete)`. Un vinculado (pago de deuda, transferencia de meta) solo se elimina desde su origen. | `LINKED_DELETE_FORBIDDEN 422` · `NEGATIVE_BALANCE` · `EARMARK_CONFIRMATION_REQUIRED` |
| `POST /api/transactions/undo` | `UPDATE undo_action SET consumed_at = now() WHERE id = $1 AND consumed_at IS NULL AND expires_at > now()` (un solo uso). Revierte según el tipo: delete → `deleted_at = NULL`; create → eliminación; recategorize → restaura las categorías. Pasa por `BalanceGuard` y los hooks. | `UNDO_EXPIRED 410` · `NEGATIVE_BALANCE 422` (EC-M6-03) |
| `POST /api/transactions/batch-delete` · `/batch-recategorize` | Por cada id: omite los vinculados (al eliminar), las transferencias, los ajustes y los de la categoría del sistema (al recategorizar), y los que violarían un negativo o un apartado (`BalanceGuard` en modo batch). Un solo `undo_action` (RF-M6-13). | `MIXED_KINDS 422` · `CATEGORY_KIND_MISMATCH 422` |

#### 4.6.3 Ciclo de vida y concurrencia
- **Registrado → Eliminado (deshacible) → Eliminado definitivo:** `deleted_at` + `undo_action` (12 s). El job `maintenance` borra de verdad las transacciones con `deleted_at` de más de 1 minuto (sus asientos caen en cascada). Cambiar de pantalla oculta el "Deshacer" en el cliente (EC-M6-06).
- **Pendiente → Registrado:** está en M14 (`recurring_occurrence`). Los pendientes nunca están en `ledger_transaction` (RF-M6-11).
- **El tipo nunca cambia (RF-M6-06):** el contrato de PATCH no acepta `kind`.
- **Doble toque (RF-M6-14, RNF-11):** el `id` lo genera el cliente → `ON CONFLICT (id) DO NOTHING`. Un `undo` repetido no hace nada (`consumed_at`).
- **Concurrencia de saldo (RNF-10):** cada mutación toma `FOR UPDATE` sobre las cuentas antes de validar. Dos gastos simultáneos desde el mismo efectivo se serializan, y el segundo ve el saldo del primero.
- **Comisión (RF-M6-05):** es otra `ledger_transaction(kind=expense, origin=fee, parent_transaction_id)` en "Servicios › Comisiones bancarias". Si esa categoría no existe o está archivada, se pide `fee.categoryId` (`FEE_CATEGORY_REQUIRED 422`, EC-M6-08). Se valida junto con la transferencia.
- **Recurrentes (RF-M6-10):** `origin = recurring` + `recurring_label`. Son movimientos normales, editables y eliminables.

#### 4.6.4 UI y estado
- **`/movimientos`:**
  - `<MonthSelector>` y `<FiltersBar>`, ambos en la URL vía `useValidatedSearch`;
  - `<TotalsBar>`, que usa summary;
  - `<DayGroups>` con `<DayHeader neto>` y `<TransactionRow>` (distintivos "anterior al saldo inicial" y "De recurrente: X"), con scroll infinito vía `useInfiniteQuery`;
  - `<BatchToolbar>`: pulsación larga en el celular o casillas en escritorio, más la tecla espacio para seleccionar.
- **`/movimientos/:id`:** `<TransactionDetail>` (con "Ir a…") y `<TransactionEditForm>` con `useDraft('transaction-edit:'+id)`. Si el movimiento pasa a otra moneda, `<CurrencyChangeConfirm>`.
- **Global:** `<UndoToast>` con 10 s y cuenta regresiva.
- **Optimismo:** eliminar es optimista (la fila desaparece al instante y vuelve si hay error). Crear y editar no son optimistas: se espera la respuesta para mostrar los errores de saldo. Toda mutación invalida `['transactions']`, `['accounts']`, `['dashboard']` y `['budgets']`.

---

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]]
- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Requerimientos no funcionales:** [[Spec 3.3 Concurrencia]] · [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - LedgerTransaction]] · [[Entidad - RecurringOccurrence]] · [[Entidad - UndoAction]]

