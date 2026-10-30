---
tipo: "frontend"
modulo: "M6"
fuente: "apps/web/src/features/transactions"
tags:
  - "frontend/feature"
  - "modulo/M6"
actualizado: "2026-10-30"
---

# Web · feature `transactions`

Carpeta `apps/web/src/features/transactions/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M6 - Transacciones]]
- **Textos (i18n):** `locales/es-BO/transactions.json` (17 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/movimientos` | `TransactionsPage` | ✅ | V1.0 |
| `/movimientos/:id` | `TransactionDetailPage` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `listTransactionsEndpoint` | `GET` | `/api/transactions` |
| `transactionsSummaryEndpoint` | `GET` | `/api/transactions/summary` |

## Hooks (TanStack Query)

- `use-delete-transaction.ts` — `DeleteDetails`, `DeleteVariables`, `undoAccountOf`, `rememberUndoAccount`, `UNDO_MS`, `AFFECTED_KEYS`, `useDeleteTransaction`. What a confirmed deletion sends: the goals to take from (RF-M12-05). The API reads them from the body of the DELETE, but `api-client` sends the input of a DELETE as a query string. So the endpoint is declared as `PUT` (which makes the client write a JSON body) and `callWithBody` swaps the verb to `DELETE` just before the request leaves.
- `use-transactions.ts` — `TRANSACTIONS_KEY`, `transactionsQuery`, `useTransactions`, `useTransactionsSummary`. Every mutation of a movement invalidates this key (plan §4.6.4).

## Componentes (9)

| Archivo | Exporta | Descripción |
|---|---|---|
| `batch-toolbar.tsx` | `BatchToolbar` | What a batch action can change on other screens. |
| `currency-change-confirm.tsx` | `MAX_AMOUNT`, `convertWithStoredRates`, `CurrencyChangeConfirm` | The largest amount of a movement (RF-M6-01). |
| `day-groups.tsx` | `DayGroups` | The movements by day, in the order the list gives them (RF-M6-02). |
| `filters-bar.tsx` | `FiltersBar` | The filters of the list besides the month (RF-M6-02 flow, plan §4.6.4). |
| `month-selector.tsx` | `shiftMonth`, `MonthSelector` | The month `by` months away from 'YYYY-MM'. |
| `totals-bar.tsx` | `TotalsBar` | The user's base currency. |
| `transaction-detail.tsx` | `transactionEndpoint`, `isGone`, `useTransaction`, `TransactionDetail` | What the API asked to confirm before deleting (RF-M12-05). |
| `transaction-edit-form.tsx` | `TransactionEditForm` | Every mutation of a movement refreshes these (plan §4.6.4). |
| `transaction-row.tsx` | `useSignedMoney`, `TransactionRow` | "Bs +100,00" or "Bs −35,00": the sign always shows, so the amount never relies on color alone (design direction, RF-M9-02). |

**Backend relacionado:** [[API transactions]]

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M9 - Ajustes y personalización]]
- **Spec / Plan / Constitución:** [[Plan 4.6 M6 - Transacciones (V1.0)]]

