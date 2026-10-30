---
tipo: "frontend"
modulo: "M13"
fuente: "apps/web/src/features/debts"
tags:
  - "frontend/feature"
  - "modulo/M13"
actualizado: "2026-10-30"
---

# Web · feature `debts`

Carpeta `apps/web/src/features/debts/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M13 - Deudas y préstamos]]
- **Textos (i18n):** `locales/es-BO/debts.json` (16 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/deudas` | `DebtsPage` | ✅ | solo si M13 está liberado |
| `/deudas/:id` | `DebtDetailPage` | — | solo si M13 está liberado |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `listDebtsEndpoint` | `GET` | `/api/debts` |
| `forgiveDebtEndpoint` | `POST` | `${debtPath(id)}/forgive` |
| `deleteLastPaymentEndpoint` | `DELETE` | `${debtPath(id)}/payments/last` |

## Hooks (TanStack Query)

- `use-debts.ts` — `DEBTS_KEY`, `debtsQuery`, `useDebts`, `useDebt`, `useForgiveDebt`, `useDeleteLastPayment`, `useDeleteDebt`. The mutations of a debt also refresh the movements, the accounts and Inicio (plan §4.13.4).

## Componentes (8)

| Archivo | Exporta | Descripción |
|---|---|---|
| `debt-form.tsx` | `invalidateAfterDebtChange`, `useDeclaredRate`, `amountInAccount`, `ExchangeField`, `DebtForm` | What a change in a debt refreshes besides the debts: movements, accounts and Inicio. |
| `debt-header.tsx` | `DebtHeader` | The capital, the accrued interest and the pending balance, shown apart (RF-M13-06). |
| `debt-list.tsx` | `DebtList`, `PersonList` | Each debt with its pending balance (RF-M13-06). |
| `debts-summary.tsx` | `DebtsSummary` | "Debes X · Te deben Y", in the base currency (RF-M13-13). |
| `delete-debt-dialog.tsx` | `DeleteDebtDialog` | Deleting a debt with linked movements: delete the N movements too or keep them as normal ones (RF-M13-11). N comes from the API and includes the initial movement. |
| `payment-form.tsx` | `PaymentForm` | The payment waiting for the user to choose which earmarks to take (EC-M13-04). |
| `payments-list.tsx` | `PaymentsList` | The payments of a debt; only the last one can be deleted (EC-M13-05). |
| `view-toggle.tsx` | `ViewToggle` | The list by debt or by person (RF-M13-13). Toggle buttons, not tabs: the toggle reorders one list and has no panels of its own for `aria-controls` to point at (RNF-06). |

**Backend relacionado:** [[API debts]]

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]]
- **Spec / Plan / Constitución:** [[Plan 4.13 M13 - Deudas y préstamos (V1.1)]]

