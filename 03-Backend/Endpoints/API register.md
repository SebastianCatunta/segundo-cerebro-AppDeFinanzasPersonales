---
tipo: "api"
modulo: "M7"
fuente: "apps/api/src/presentation/routes/register.routes.ts"
tags:
  - "backend/api"
  - "modulo/M7"
actualizado: "2026-10-30"
---

# API · register

- **Módulo:** [[M7 - Registrar]]
- **Montaje:** `/api/register`
- **Archivos:** `presentation/routes/register.routes.ts`, `presentation/controllers/register.controller.ts`, `presentation/presenters/register.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (1)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/register/context` | ✅ | — | `context` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `RegisterService` (206 líneas)

Archivo `application/services/register.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `context` | `GET /api/register/context` (plan §4.7.2). |
| `todayRecent` | The last 3 movements created today, whatever their date (RF-M7-07). |

**Repositorios que usa (vía UnitOfWork):** `categories`, `userSettings`

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.7 M7 - Registrar (V1.0)]]

