---
tipo: "api"
modulo: "M11"
fuente: "apps/api/src/presentation/routes/budgets.routes.ts"
tags:
  - "backend/api"
  - "modulo/M11"
actualizado: "2026-10-30"
---

# API · budgets

- **Módulo:** [[M11 - Presupuestos]]
- **Montaje:** `/api/budgets`
- **Archivos:** `presentation/routes/budgets.routes.ts`, `presentation/controllers/budgets.controller.ts`, `presentation/presenters/budgets.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (9)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/budgets` | — | — | `list` |
| `POST` | `/api/budgets` | — | [[Contrato - budgets\|CreateBudgetInput]] | `create` |
| `GET` | `/api/budgets/:id` | — | — | `get` |
| `PATCH` | `/api/budgets/:id` | — | [[Contrato - budgets\|UpdateBudgetInput]] | `update` |
| `DELETE` | `/api/budgets/:id` | — | — | `remove` |
| `POST` | `/api/budgets/:id/pause` | — | — | `pause` |
| `POST` | `/api/budgets/:id/resume` | — | — | `resume` |
| `POST` | `/api/budgets/:id/reset-carryover` | — | — | `resetCarryover` |
| `POST` | `/api/budgets/:id/periods/:periodId/decision` | — | [[Contrato - budgets\|DecisionInput]] | `decide` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `BudgetsService` (834 líneas)

Archivo `application/services/budgets.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `create` | Creates a budget, idempotent by `input.id` (ADR-11), with its period in course; only the highest threshold already crossed is notified (RF-M11-13). |
| `list` | The budgets of the user with their period in course (plan §4.11.2). |
| `get` | One budget with its 12 last periods (plan §4.11.2). |
| `update` | Amount, default action and thresholds apply to the period in course (RF-M11-06); `startDay` is kept as `nextStartDay` and stretches the period in course (RF-M11-07). |
| `pause` | Freezes the carryover in force and drops the period in course (plan §4.11.3). |
| `resume` | Opens the period that contains today with the frozen carryover (EC-M11-08). |
| `resetCarryover` | Carryover of the period in course to 0 and its late adjustments voided (RF-M11-12). |
| `remove` | Deletes the budget with its history and resolves its decision notices (plan §4.11.2). |
| `decide` | Decides a closed period once (RNF-11): a surplus is split into carry, goal and discard, a deficit is carried or absorbed; the carry replaces that of the next period (RF-M11-08). |

**Repositorios que usa (vía UnitOfWork):** `accounts`, `budgetPeriods`, `budgets`, `categories`, `currencies`, `goalAllocations`, `goals`, `ledger`

**Servicios compartidos relacionados:** [[Compartido - budget-ledger-hook]]

**Jobs relacionados:** [[Job - budgets]]

## Pruebas

- HTTP: `apps/api/test/http/budgets.isolation.test.ts`
- HTTP: `apps/api/test/http/budgets.test.ts`
- Integración: `apps/api/test/integration/budget-ledger-hook.test.ts`
- Integración: `apps/api/test/integration/budget-repositories.test.ts`
- Integración: `apps/api/test/integration/budgets-close-job.test.ts`
- Integración: `apps/api/test/integration/budgets-create.test.ts`
- Integración: `apps/api/test/integration/budgets-decision.test.ts`
- Integración: `apps/api/test/integration/budgets-default-job.test.ts`
- Integración: `apps/api/test/integration/budgets-lifecycle.test.ts`

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Plan 4.11 M11 - Presupuestos (V1.1)]]

