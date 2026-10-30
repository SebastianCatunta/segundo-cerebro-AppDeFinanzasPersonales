---
tipo: "api"
modulo: "M6"
fuente: "apps/api/src/presentation/routes/transactions.routes.ts"
tags:
  - "backend/api"
  - "modulo/M6"
actualizado: "2026-10-30"
---

# API · transactions

- **Módulo:** [[M6 - Transacciones]]
- **Montaje:** `/api/transactions`
- **Archivos:** `presentation/routes/transactions.routes.ts`, `presentation/controllers/transactions.controller.ts`, `presentation/presenters/transactions.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (9)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/transactions` | ✅ | — | `list` |
| `GET` | `/api/transactions/summary` | ✅ | — | `summary` |
| `POST` | `/api/transactions` | ✅ | [[Contrato - transactions\|CreateTransactionInput]] | `create` |
| `POST` | `/api/transactions/undo` | ✅ | [[Contrato - transactions\|UndoInput]] | `undo` |
| `POST` | `/api/transactions/batch-delete` | ✅ | [[Contrato - transactions\|BatchDeleteInput]] | `batchDelete` |
| `POST` | `/api/transactions/batch-recategorize` | ✅ | [[Contrato - transactions\|BatchRecategorizeInput]] | `batchRecategorize` |
| `GET` | `/api/transactions/:id` | ✅ | — | `get` |
| `PATCH` | `/api/transactions/:id` | ✅ | [[Contrato - transactions\|UpdateTransactionInput]] | `update` |
| `DELETE` | `/api/transactions/:id` | ✅ | — | `remove` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `TransactionsService` (1662 líneas)

Archivo `application/services/transactions.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `create` | Creates an expense, an income or a transfer with its fee, idempotent by the client's id (ADR-11, plan §4.6.2). |
| `update` | Edits the user's movement in place, with its fee: the last edit wins and no history is kept (EC-M6-01, RNF-24, plan §4.6.2). |
| `get` | The user's movement with its fee and its origin for "Ir a…"; another user's or a deleted one gives `NOT_FOUND` (RNF-09, RNF-14, plan §4.6.2). |
| `delete` | Deletes the user's movement with its fee (EC-M6-05); it can be undone with the returned token until it expires (plan §4.6.2, §4.6.3). |
| `undo` | Consumes the single-use token and reverts its action: a deletion is restored, a creation is deleted and a recategorization gets its categories back (plan §4.6.2). |
| `batchDelete` | Deletes the selected movements with their fees, leaving out the linked ones and those that would leave an account below zero; one `undo` restores them all (RF-M6-13, plan §4.6.2). |
| `batchRecategorize` | Moves the selected expenses or incomes to the category, leaving out transfers, adjustments and the linked ones in a system category; one `undo` restores them all (RF-M6-13). |
| `list` | A page of the user's movements that match the query, the current month by default, with the net of each of its days in the base currency (RF-M6-11, RF-M6-12, plan §4.6.2). A caller that already read the user's base currency passes it and saves that read. |
| `summary` | Income, expense and net in the base currency of the movements that match the query, each with its stored rates and without what RN-02 leaves out (RF-M6-12, RN-05). |

**Repositorios que usa (vía UnitOfWork):** `accounts`, `categories`, `currencies`, `ledger`, `undoActions`, `userFxEvents`, `userSettings`

**Servicios compartidos relacionados:** [[Compartido - ledger-hooks]]

## Pruebas

- Integración: `apps/api/test/integration/transactions-create.test.ts`
- Integración: `apps/api/test/integration/transactions-delete-undo.test.ts`
- Integración: `apps/api/test/integration/transactions-transfer.test.ts`
- Integración: `apps/api/test/integration/transactions-update.test.ts`

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Requerimientos no funcionales:** [[Spec 3.3 Concurrencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.9 Auditoría y retención]]
- **Spec / Plan / Constitución:** [[Plan 4.6 M6 - Transacciones (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

