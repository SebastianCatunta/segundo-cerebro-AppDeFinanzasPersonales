---
tipo: "api"
modulo: "M15"
fuente: "apps/api/src/presentation/routes/notifications.routes.ts"
tags:
  - "backend/api"
  - "modulo/M15"
actualizado: "2026-10-30"
---

# API · notifications

- **Módulo:** [[M15 - Recordatorios y avisos]]
- **Montaje:** `/api/notifications`, `/api/notification-preferences`
- **Archivos:** `presentation/routes/notifications.routes.ts`, `presentation/controllers/notifications.controller.ts`, `presentation/presenters/notifications.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (7)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/notifications` | — | — | `list` |
| `GET` | `/api/notifications/unread-count` | — | — | `unreadCount` |
| `POST` | `/api/notifications/read-all` | — | — | `markAllRead` |
| `POST` | `/api/notifications/:id/read` | — | — | `markRead` |
| `DELETE` | `/api/notifications/:id` | — | — | `remove` |
| `GET` | `/api/notification-preferences` | — | — | `list` |
| `PATCH` | `/api/notification-preferences` | — | [[Contrato - notifications\|PreferencesInput]] | `update` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `NotificationsService` (211 líneas)

Archivo `application/services/notifications.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `list` | A page of the user's notifications, newest first (plan §4.15.2). |
| `unreadCount` | The counter of the bell: only the unread notifications (RF-M15-06). |
| `markRead` | Also for a notification waiting for a decision; the decision stays in its module (RF-M15-12). |
| `markAllRead` | Includes the notifications waiting for a decision (RF-M15-12). |
| `remove` | Also for a notification waiting for a decision; the decision stays in its module (RF-M15-12). |

**Repositorios que usa (vía UnitOfWork):** `notificationPreferences`

**Servicios compartidos relacionados:** [[Compartido - notification-emitter]], [[Compartido - goal-milestones]]

**Jobs relacionados:** [[Job - notifications]]

## Pruebas

- HTTP: `apps/api/test/http/notifications.test.ts`
- Integración: `apps/api/test/integration/notification-emitter.test.ts`
- Integración: `apps/api/test/integration/notifications-debts-job.test.ts`
- Integración: `apps/api/test/integration/notifications-log-day-job.test.ts`
- Integración: `apps/api/test/integration/notifications-payments-job.test.ts`

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]]

