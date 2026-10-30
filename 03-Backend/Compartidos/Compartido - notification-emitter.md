---
tipo: "backend"
fuente: "apps/api/src/application/shared/notification-emitter.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M15"
actualizado: "2026-10-30"
---

# Servicio compartido · `notification-emitter.ts`

Capa de aplicación (`apps/api/src/application/shared/notification-emitter.ts`, 62 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M15 - Recordatorios y avisos]]

> [!quote] Comentario del código
> A notification produced by an event of a module (plan §4.15.3).

| Exportación | Tipo | Descripción |
|---|---|---|
| `EmitNotification` | interface | A notification produced by an event of a module (plan §4.15.3). |
| `NotificationEmitterDeps` | interface |  |
| `NotificationEmitter` | interface |  |
| `createNotificationEmitter` | function | The emitter of in-app notifications that modules call inside their transactions (plan §4.15.3). |

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]]

