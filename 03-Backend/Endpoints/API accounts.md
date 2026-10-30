---
tipo: "api"
modulo: "M4"
fuente: "apps/api/src/presentation/routes/accounts.routes.ts"
tags:
  - "backend/api"
  - "modulo/M4"
actualizado: "2026-10-30"
---

# API · accounts

- **Módulo:** [[M4 - Cuentas]]
- **Montaje:** `/api/accounts`
- **Archivos:** `presentation/routes/accounts.routes.ts`, `presentation/controllers/accounts.controller.ts`, `presentation/presenters/accounts.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (9)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/accounts` | ✅ | — | `list` |
| `POST` | `/api/accounts` | ✅ | [[Contrato - accounts\|CreateAccountInput]] | `create` |
| `PUT` | `/api/accounts/order` | ✅ | [[Contrato - accounts\|ReorderInput]] | `reorder` |
| `PATCH` | `/api/accounts/:id` | ✅ | [[Contrato - accounts\|UpdateAccountInput]] | `update` |
| `DELETE` | `/api/accounts/:id` | ✅ | — | `remove` |
| `POST` | `/api/accounts/:id/adjust` | ✅ | [[Contrato - accounts\|AdjustInput]] | `adjust` |
| `POST` | `/api/accounts/:id/archive` | ✅ | `optionalBody` | `archive` |
| `POST` | `/api/accounts/:id/restore` | ✅ | `optionalBody` | `restore` |
| `GET` | `/api/accounts/:id/balance-series` | ✅ | — | `balanceSeries` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `AccountsService` (802 líneas)

Archivo `application/services/accounts.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `create` | Creates an active account, idempotent by `input.id` (ADR-11): the same id with the same data gives the existing account with `created: false`; with other data, `IDEMPOTENCY_CONFLICT`. |
| `list` | Accounts of that status with their balance, its equivalents and the card data (RF-M4-08). |
| `summary` | Net worth of the active accounts and its breakdown, with the rate in force (RF-M4-09, RF-M4-10, RN-05); a missing rate leaves its amounts as `null`. |
| `listWithSummary` | The active accounts and the net worth of those same accounts, from one read of the ledger and one reading of the rates: the same answer as `list` plus `summary`, without doing them twice. |
| `update` | Edits the name, color, icon, card fields, type and currency (RF-M4-07); the initial balance and its date are not editable (EC-M4-02). The last write wins (RNF-08). |
| `reorder` | Gives the user's accounts the order of `ids`, which must be exactly all of them (RF-M4-11). |
| `adjust` | Brings the balance to the real one with an adjustment dated today (RF-M4-05, RN-01), which is neither income nor expense (RN-02). The same balance creates nothing (EC-M4-08), and the same `transactionId` gives the adjustment already made (ADR-11). |
| `archive` | Archives an active account (RF-M4-09); a balance other than 0 needs `confirmNonZero`. It stops being the default account (RF-M4-12, EC-M7-05) and its active rules are paused with a notice to choose another account (EC-M14-02). An archived account stays as it is. |
| `restore` | Restores an archived account with a free name, or `newName` (EC-M4-04), in an active currency (EC-M4-07). An active account stays as it is. |
| `remove` | Deletes an account without entries, counting those of deleted movements still undoable; it stops being the default account and its shortcuts are deleted (RF-M4-13). An account used by a recurring rule is not deleted: `ACCOUNT_IN_USE {recurring}`. |

**Repositorios que usa (vía UnitOfWork):** `accounts`, `currencies`, `goalAllocations`, `goals`, `ledger`, `recurringRules`, `userSettings`

**Servicios compartidos relacionados:** [[Compartido - balance-guard]]

## Pruebas

- Integración: `apps/api/test/integration/account-ledger-repositories.test.ts`
- Integración: `apps/api/test/integration/accounts-goals.test.ts`

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]] · [[M7 - Registrar]]
- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Requerimientos no funcionales:** [[Spec 3.3 Concurrencia]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

