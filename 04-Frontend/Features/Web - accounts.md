---
tipo: "frontend"
modulo: "M4"
fuente: "apps/web/src/features/accounts"
tags:
  - "frontend/feature"
  - "modulo/M4"
actualizado: "2026-10-30"
---

# Web · feature `accounts`

Carpeta `apps/web/src/features/accounts/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M4 - Cuentas]]
- **Textos (i18n):** `locales/es-BO/accounts.json` (16 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/cuentas` | `AccountsPage` | ✅ | V1.0 |
| `/cuentas/nueva` | `NewAccountPage` | — | V1.0 |
| `/cuentas/:id` | `AccountDetailPage` | — | V1.0 |
| `/cuentas/:id/editar` | `EditAccountPage` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `listAccountsEndpoint` | `GET` | `/api/accounts` |
| `reorderAccountsEndpoint` | `PUT` | `/api/accounts/order` |
| `listCurrenciesEndpoint` | `GET` | `/api/currencies` |

## Hooks (TanStack Query)

- `use-accounts.ts` — `ACCOUNTS_KEY`, `accountsQuery`, `useAccounts`, `useReorderAccounts`, `useCurrencySymbol`. Symbols of the two system currencies (RF-M3-01).

## Componentes (10)

| Archivo | Exporta | Descripción |
|---|---|---|
| `account-actions.tsx` | `AccountActions` | Ajustar, Editar, Archivar (confirming a balance other than 0), Restaurar (asking for a new name when it is taken, EC-M4-04) and Eliminar (plan §4.4.4). |
| `account-form.tsx` | `ACCOUNT_ICONS`, `DEFAULT_ICON`, `DEFAULT_COLOR`, `AccountFormValues`, `parseSignedAmount`, `cardOf`, `initialBalanceOf`, `checkName`, `useCurrencyCodes`, `applyApiError`, `FieldSelect`, `AccountForm` | Icons of the catalog that suit an account; the label of each one is in `accounts.json`. |
| `account-groups.tsx` | `groupAccounts`, `AccountGroups` | Accounts grouped by type in the catalog order, each group by `sortOrder` (RF-M4-11). |
| `account-header.tsx` | `AccountHeader` | Balance of the account and its equivalent in the base currency. A card shows "Debes X" or "A favor X", its limit, the credit available and a non-blocking notice over the limit (RF-M4-08). |
| `adjust-balance-dialog.tsx` | `AdjustBalanceDialog` | The adjustment waiting for the user to choose which earmarks to take (RF-M12-05). |
| `balance-chart.tsx` | `BalanceChart` | ADR-03: the only place a balance becomes a `number`, to draw it. |
| `card-fields.tsx` | `CardFields` | The card subform (RF-M4-08): whether the amount is the current debt or a balance in favor, and the optional cut day, pay day and limit. |
| `movements-by-day.tsx` | `MovementsByDay` | The movements of the account by day, with the M6 list and the same `from`–`to` as the balance chart (plan §4.4.4); transfers of the account are included. |
| `net-worth-summary.tsx` | `NetWorthSummary` | Net worth of the active accounts in the base currency and in the other one, with its breakdown (RF-M4-10). "Apartado para metas" arrives with goals in V1.1. |
| `quick-account-form.tsx` | `QuickAccountForm` | The minimal account form: name, type, currency and balance (EC-M7-01, EC-M4-05). It is reused where there is no active account, like Registrar and the Inicio; the rest takes its defaults. |

**Backend relacionado:** [[API accounts]]

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M3 - Monedas y tipo de cambio]] · [[M6 - Transacciones]] · [[M7 - Registrar]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]]
- **Spec / Plan / Constitución:** [[Plan 4.4 M4 - Cuentas (V1.0)]]

