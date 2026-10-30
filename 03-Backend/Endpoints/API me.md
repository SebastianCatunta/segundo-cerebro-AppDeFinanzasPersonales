---
tipo: "api"
modulo: "M1"
fuente: "apps/api/src/presentation/routes/me.routes.ts"
tags:
  - "backend/api"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# API · me

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Montaje:** `/api/me`
- **Archivos:** `presentation/routes/me.routes.ts`, `presentation/controllers/me.controller.ts`, `presentation/presenters/me.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (4)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/me` | ✅ | — | `get` |
| `PATCH` | `/api/me` | ✅ | [[Contrato - auth\|UpdateMeInput]] | `update` |
| `GET` | `/api/me/export` | ✅ | — | `exportData` |
| `POST` | `/api/me/delete` | ✅ | `DeleteAccountBody` | `deleteAccount` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `MeService` (86 líneas)

Archivo `application/services/me.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `get` |  |
| `update` |  |
| `deleteAccount` | Deletes the account after checking the password and the word ELIMINAR (RF-M1-15). |

## Servicio `ExportService` (143 líneas)

Archivo `application/services/export.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `export` | The ZIP with every datum of the user, archived ones included, generated now and streamed (RNF-16, RF-M1-14). Only the user's own rows go in (RN-09). |

**Repositorios que usa (vía UnitOfWork):** `exports`

**Servicios compartidos relacionados:** [[Compartido - email-links]], [[Compartido - login-throttle]], [[Compartido - user-bootstrap]]

**Jobs relacionados:** [[Job - outbox]], [[Job - maintenance]]

## Pruebas

- HTTP: `apps/api/test/http/me-delete.test.ts`
- HTTP: `apps/api/test/http/me-export-v1-1.test.ts`
- HTTP: `apps/api/test/http/me-export-v1-2.test.ts`
- HTTP: `apps/api/test/http/me-export.test.ts`
- HTTP: `apps/api/test/http/me.test.ts`

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.5 Privacidad y seguridad]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

