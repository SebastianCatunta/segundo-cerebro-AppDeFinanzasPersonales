---
tipo: "frontend"
modulo: "M15"
fuente: "apps/web/src/features/notifications"
tags:
  - "frontend/feature"
  - "modulo/M15"
actualizado: "2026-10-30"
---

# Web · feature `notifications`

Carpeta `apps/web/src/features/notifications/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M15 - Recordatorios y avisos]]
- **Textos (i18n):** `locales/es-BO/notifications.json` (4 claves de primer nivel) → [[Web - i18n y locales]]

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `listNotificationsEndpoint` | `GET` | `/api/notifications` |
| `unreadCountEndpoint` | `GET` | `/api/notifications/unread-count` |
| `markAllReadEndpoint` | `POST` | `/api/notifications/read-all` |

## Hooks (TanStack Query)

- `use-notifications.ts` — `NOTIFICATIONS_KEY`, `UNREAD_KEY`, `useUnreadCount`, `useNotifications`, `useMarkRead`, `useMarkAllRead`, `useRemoveNotification`. Every change of the inbox invalidates this key, the list and the count (plan §4.15.4).

## Componentes (4)

| Archivo | Exporta | Descripción |
|---|---|---|
| `bell-button.tsx` | `BellButton` | The bell of the header with the unread count (RF-M15-06), from the release of the inbox (M15). |
| `notification-item.tsx` | `NotificationItem` | One notification of the inbox (plan §4.15.4): its i18n text with its parameters, a tap that opens it and a "…" menu with Eliminar, the keyboard alternative to swiping (RNF-06). |
| `notifications-panel.tsx` | `NotificationsPanel` | Only routes of the app itself: a target never leaves the site. |
| `pending-decision.tsx` | `PendingDecision` | Confirmar and Omitir of a pending occurrence, with the same endpoints as Recurrentes (plan §4.15.4, EC-M15-01). An occurrence with its amount is confirmed as scheduled; one without amount, or one the server rejects (an archived account or category), opens the same dialog as Recurrentes to adjust it. Once decided, the inbox refreshes and the notice shows as resolved. Loaded on demand by the inbox item, so Recurrentes stays out of the app shell (RNF-01). |

**Backend relacionado:** [[API notifications]]

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.2 Compatibilidad y accesibilidad]]
- **Spec / Plan / Constitución:** [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]]

