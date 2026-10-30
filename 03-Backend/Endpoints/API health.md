---
tipo: "api"
modulo: "M2"
fuente: "apps/api/src/presentation/routes/health.routes.ts"
tags:
  - "backend/api"
  - "modulo/M2"
actualizado: "2026-10-30"
---

# API · health

- **Módulo:** [[M2 - Navegación y estructura]]
- **Montaje:** `/api/health`
- **Archivos:** `presentation/routes/health.routes.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (2)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/health` | — | — | `` |
| `GET` | `/api/health/ready` | — | — | `` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).
