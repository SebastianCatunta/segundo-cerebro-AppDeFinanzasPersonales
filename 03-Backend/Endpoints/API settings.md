---
tipo: "api"
modulo: "M9"
fuente: "apps/api/src/presentation/routes/settings.routes.ts"
tags:
  - "backend/api"
  - "modulo/M9"
actualizado: "2026-10-30"
---

# API · settings

- **Módulo:** [[M9 - Ajustes y personalización]]
- **Montaje:** `/api/settings`
- **Archivos:** `presentation/routes/settings.routes.ts`, `presentation/controllers/settings.controller.ts`, `presentation/presenters/settings.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (3)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/settings` | ✅ | — | `get` |
| `PATCH` | `/api/settings` | ✅ | [[Contrato - settings\|UpdateSettingsInput]] | `update` |
| `POST` | `/api/settings/reset` | ✅ | [[Contrato - settings\|ResetSettingsInput]] | `reset` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `SettingsService` (194 líneas)

Archivo `application/services/settings.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `get` |  |
| `update` | Partial update; the last write wins (EC-M9-01, RNF-08). |
| `reset` | Puts one section back to its defaults; it never touches data (RF-M9-05). |

**Repositorios que usa (vía UnitOfWork):** `accounts`, `categories`, `userFxEvents`, `userSettings`

## Pruebas

- HTTP: `apps/api/test/http/settings-register.test.ts`
- HTTP: `apps/api/test/http/settings-reset.test.ts`
- HTTP: `apps/api/test/http/settings.test.ts`

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.3 Concurrencia]]

