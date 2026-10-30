---
tipo: "api"
modulo: "M12"
fuente: "apps/api/src/presentation/routes/goals.routes.ts"
tags:
  - "backend/api"
  - "modulo/M12"
actualizado: "2026-10-30"
---

# API · goals

- **Módulo:** [[M12 - Metas de ahorro]]
- **Montaje:** `/api/goals`
- **Archivos:** `presentation/routes/goals.routes.ts`, `presentation/controllers/goals.controller.ts`, `presentation/presenters/goals.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (12)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/goals` | — | — | `list` |
| `POST` | `/api/goals` | — | [[Contrato - goals\|CreateGoalInput]] | `create` |
| `GET` | `/api/goals/:id` | — | — | `get` |
| `PATCH` | `/api/goals/:id` | — | [[Contrato - goals\|UpdateGoalInput]] | `update` |
| `DELETE` | `/api/goals/:id` | — | — | `remove` |
| `POST` | `/api/goals/:id/earmarks` | — | [[Contrato - goals\|EarmarkInput]] | `earmark` |
| `POST` | `/api/goals/:id/earmarks/release` | — | [[Contrato - goals\|ReleaseInput]] | `release` |
| `POST` | `/api/goals/:id/dedicate` | — | [[Contrato - goals\|DedicateInput]] | `dedicate` |
| `POST` | `/api/goals/:id/use-and-close` | — | — | `useAndClose` |
| `POST` | `/api/goals/:id/archive` | — | — | `archive` |
| `POST` | `/api/goals/:id/restore` | — | — | `restore` |
| `POST` | `/api/goals/:id/celebrated` | — | — | `celebrated` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `GoalsService` (532 líneas)

Archivo `application/services/goals.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `create` | Creates a goal, idempotent by `input.id` (ADR-11); a dedicated account is validated (RF-M12-01). |
| `update` | Edits a goal; a target date before today is rejected (RF-M12-01). |
| `list` | The goals that are not archived, with progress, status and suggestion (RF-M12-02, RF-M12-06). |
| `get` | One goal with its progress by account and its history (RF-M12-07). |
| `earmark` | Earmarks an amount of an account for the goal, within its free balance (RF-M12-04). |
| `release` | Releases part of what the goal has earmarked in an account (RF-M12-04). |
| `dedicate` | Dedicates an account to the goal (RF-M12-03). |
| `useAndClose` | Releases every earmark, drops the dedicated account and archives the goal (RF-M12-09). |
| `archive` | Archives an empty goal. |
| `restore` | Restores an archived goal; earmarks are not recovered. |
| `remove` | Deletes an empty goal with its history. |
| `celebrated` | Marks the celebration as shown, once. |

**Repositorios que usa (vía UnitOfWork):** `accounts`, `currencies`, `goalAllocations`, `goals`, `ledger`

**Servicios compartidos relacionados:** [[Compartido - goal-milestones]], [[Compartido - balance-guard]]

## Pruebas

- HTTP: `apps/api/test/http/goals.isolation.test.ts`
- HTTP: `apps/api/test/http/goals.test.ts`
- Integración: `apps/api/test/integration/goal-milestones.test.ts`
- Integración: `apps/api/test/integration/goal-repositories.test.ts`
- Integración: `apps/api/test/integration/goals-crud.test.ts`
- Integración: `apps/api/test/integration/goals-earmarks.test.ts`
- Integración: `apps/api/test/integration/goals-lifecycle.test.ts`

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]

