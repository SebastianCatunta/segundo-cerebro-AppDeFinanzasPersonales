---
tipo: "job"
fuente: "apps/api/src/application/jobs/maintenance.ts"
tags:
  - "backend/jobs"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# Job · `maintenance.ts`

Capa de aplicación (`apps/api/src/application/jobs/maintenance.ts`). Lo ejecuta [[Job - tick]] y, si tiene alcance por usuario, el *catch-up* de la primera petición del día (ADR-01). Ver [[Flujo - Tick de jobs]].

**Módulos:** [[M1 - Acceso y cuenta]]

## Comentarios del código

- Unconfirmed registrations are discarded after 7 days (RF-M1-06, RNF-26).
- The email send log is kept for 24 h (RNF-26).
- A login throttle without activity for 1 h is dropped (RNF-26).
- A deleted movement is deleted for good 1 minute later, past its 12 s undo (plan §4.6.3).
- A notification is kept for 90 days, unless it awaits a decision (RF-M15-05, RNF-26).
- The `maintenance` job: discards the unconfirmed registrations, purges the security tables and deletes for good the deleted movements, the expired undo actions and the old notifications (plan §4.1.3, §3.9, §4.6.3, §4.15.3, EC-M6-06). Each deletion is independent and idempotent.

## Exportaciones

- `MaintenanceDeps` (interface)
- `createMaintenance` (function)

---
## 🔗 Relacionado

- **Módulos:** [[M15 - Recordatorios y avisos]] · [[M6 - Transacciones]]
- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]]
- **Requerimientos no funcionales:** [[Spec 3.9 Auditoría y retención]]
- **Spec / Plan / Constitución:** [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Plan 4.6 M6 - Transacciones (V1.0)]]

