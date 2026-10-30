---
tipo: "api"
modulo: "M7"
fuente: "apps/api/src/presentation/routes/shortcuts.routes.ts"
tags:
  - "backend/api"
  - "modulo/M7"
actualizado: "2026-10-30"
---

# API · shortcuts

- **Módulo:** [[M7 - Registrar]]
- **Montaje:** `/api/shortcuts`
- **Archivos:** `presentation/routes/shortcuts.routes.ts`, `presentation/controllers/shortcuts.controller.ts`, `presentation/presenters/shortcuts.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (5)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/shortcuts` | ✅ | — | `list` |
| `POST` | `/api/shortcuts` | ✅ | [[Contrato - register\|CreateShortcutInput]] | `create` |
| `PUT` | `/api/shortcuts/order` | ✅ | [[Contrato - register\|ReorderShortcutsInput]] | `reorder` |
| `PATCH` | `/api/shortcuts/:id` | ✅ | [[Contrato - register\|UpdateShortcutInput]] | `update` |
| `DELETE` | `/api/shortcuts/:id` | ✅ | — | `remove` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `ShortcutsService` (221 líneas)

Archivo `application/services/shortcuts.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `list` | Every shortcut of the user, hidden ones included, in their order (RF-M7-10). |
| `listVisible` | The shortcuts whose account, and destination or category, are active (plan §4.7.3). |
| `create` | Creates a shortcut, idempotent by `input.id` (ADR-11). The user has at most 12, hidden ones included (RF-M7-09, EC-M7-06). |
| `update` | Changes the fields sent; a transfer drops its category and the others their destination. |
| `reorder` | Gives the shortcuts the order of `ids`, which must be exactly all of them (RF-M7-10). |
| `remove` |  |

**Repositorios que usa (vía UnitOfWork):** `accounts`, `categories`, `shortcuts`

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Spec / Plan / Constitución:** [[Plan 4.7 M7 - Registrar (V1.0)]]

