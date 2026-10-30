---
tipo: "api"
modulo: "M8"
fuente: "apps/api/src/presentation/routes/dashboard.routes.ts"
tags:
  - "backend/api"
  - "modulo/M8"
actualizado: "2026-10-30"
---

# API · dashboard

- **Módulo:** [[M8 - Inicio (dashboard)]]
- **Montaje:** `/api/dashboard`
- **Archivos:** `presentation/routes/dashboard.routes.ts`, `presentation/controllers/dashboard.controller.ts`, `presentation/presenters/dashboard.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (1)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/dashboard` | ✅ | — | `get` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `DashboardService` (584 líneas)

Archivo `application/services/dashboard.service.ts`.

**Repositorios que usa (vía UnitOfWork):** `budgetPeriods`, `budgets`, `categories`, `dashboard`, `debts`, `recurringRules`, `userSettings`

## Pruebas

- HTTP: `apps/api/test/http/dashboard-budgets.test.ts`
- HTTP: `apps/api/test/http/dashboard-upcoming-recurring.test.ts`
- HTTP: `apps/api/test/http/dashboard-upcoming.test.ts`
- HTTP: `apps/api/test/http/dashboard.test.ts`
- Integración: `apps/api/test/integration/dashboard-cards.test.ts`
- Integración: `apps/api/test/integration/dashboard-cost.test.ts`
