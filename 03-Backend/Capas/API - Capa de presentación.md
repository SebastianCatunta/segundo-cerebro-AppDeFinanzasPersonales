---
tipo: "backend"
tags:
  - "backend/presentacion"
actualizado: "2026-10-30"
---

# Capa 1 · Presentación (`presentation/`)

↑ [[API - Visión general]] · siguiente capa: [[API - Capa de aplicación]]

Es el borde HTTP del API. **Puede depender** de la aplicación (servicios y errores) y de `packages/contracts`. **No puede depender** de la infraestructura, Prisma ni Better Auth ([[Config - dependency-cruiser]]).

| Pieza | Responsabilidad | Nota |
|---|---|---|
| `app.ts` | Middlewares globales, montaje de routers y `errorHandler` | [[Flujo - Petición HTTP en el API]] |
| `routes/*.routes.ts` | Un router por grupo. Encadena `requireSession`, `trackActivity` y `validate(schema)` | [[Catálogo de endpoints]] |
| `controllers/*.controller.ts` | Valida, arma el contexto `{ userId, timezone, now, traceId }` y llama a **un** método del servicio | notas `API <grupo>` |
| `presenters/*.presenter.ts` | Convierte la entidad en el DTO de contracts | [[API - Presentadores]] |
| `middlewares/` | Origen, JSON, sesión, actividad, validación, entrega, timing, catch-up y errores | [[API - Middlewares]] |
| `internal/` | Tick de jobs y soporte de pruebas | [[API internal (jobs y test-support)]] |

**Errores en una sola dirección:** la aplicación lanza `AppError(code, data)` y `errorHandler` lo traduce a problem+json. Ningún error de Prisma ni de Better Auth llega a la presentación ([[ADR-09 - Errores problem+json]]).

**Pruebas:** contratos HTTP con supertest en `apps/api/test/http` ([[Pruebas del API]]).
