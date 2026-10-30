---
tipo: "api"
modulo: "M13"
fuente: "apps/api/src/presentation/routes/debts.routes.ts"
tags:
  - "backend/api"
  - "modulo/M13"
actualizado: "2026-10-30"
---

# API · debts

- **Módulo:** [[M13 - Deudas y préstamos]]
- **Montaje:** `/api/debts`
- **Archivos:** `presentation/routes/debts.routes.ts`, `presentation/controllers/debts.controller.ts`, `presentation/presenters/debts.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (7)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/debts` | — | — | `list` |
| `POST` | `/api/debts` | — | [[Contrato - debts\|CreateDebtInput]] | `create` |
| `PATCH` | `/api/debts/:id` | — | [[Contrato - debts\|UpdateDebtInput]] | `update` |
| `POST` | `/api/debts/:id/payments` | — | [[Contrato - debts\|PaymentInput]] | `pay` |
| `DELETE` | `/api/debts/:id/payments/last` | — | — | `deleteLastPayment` |
| `POST` | `/api/debts/:id/forgive` | — | — | `forgive` |
| `DELETE` | `/api/debts/:id` | — | — | `remove` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `DebtsService` (950 líneas)

Archivo `application/services/debts.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `create` | Creates a debt, idempotent by `input.id` (ADR-11), with its optional initial movement. |
| `list` | The user's debts with the interest carried to today without writing, and the summary. |
| `pay` | Registers a payment on the debt, idempotent by `input.id` (ADR-11, plan §4.13.3). |
| `deleteLastPayment` | Removes the debt's last payment, the one with the greatest `created_at`, with its linked transactions (plan §4.13.3, RF-M13-04). |
| `update` | Edits the debt (RF-M13-10): person, note and due date while it is open, and the principal while it stays at or above the capital already paid; only person and note once it is closed. |
| `forgive` | Closes the debt as forgiven with its pending balance, without movements (RF-M13-12). |
| `remove` | Deletes the debt with its payments (RF-M13-11). When it has movements, `input.movements` says whether they are deleted too or kept as normal movements. |

**Repositorios que usa (vía UnitOfWork):** `accounts`, `categories`, `currencies`, `debtPayments`, `debts`, `ledger`, `userSettings`

## Pruebas

- HTTP: `apps/api/test/http/debts.isolation.test.ts`
- HTTP: `apps/api/test/http/debts.test.ts`
- Integración: `apps/api/test/integration/debt-repositories.test.ts`
- Integración: `apps/api/test/integration/debts-create.test.ts`
- Integración: `apps/api/test/integration/debts-delete-payment.test.ts`
- Integración: `apps/api/test/integration/debts-lifecycle.test.ts`
- Integración: `apps/api/test/integration/debts-payments.test.ts`

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Spec / Plan / Constitución:** [[Plan 4.13 M13 - Deudas y préstamos (V1.1)]]

