---
tipo: "job"
fuente: "apps/api/src/application/jobs/outbox.ts"
tags:
  - "backend/jobs"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# Job · `outbox.ts`

Capa de aplicación (`apps/api/src/application/jobs/outbox.ts`). Lo ejecuta [[Job - tick]] y, si tiene alcance por usuario, el *catch-up* de la primera petición del día (ADR-01). Ver [[Flujo - Tick de jobs]].

**Módulos:** [[M1 - Acceso y cuenta]]

## Comentarios del código

- Wait before each retry after the n-th failure: 1, 5, 15 and 60 min (plan §4.1.3, EC-M1-07).
- Rows taken per run, so one run stays within the tick budget (plan §4.0).
- The `outbox.send` job: sends the due pending emails and deletes each one that was sent. A failed send is retried after 1, 5, 15 and 60 min; after the fifth failure the row is marked `failed`. A failure of one email does not stop the others (RNF-22, EC-M1-07).

## Exportaciones

- `OutboxSendDeps` (interface)
- `createOutboxSend` (function)

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]]
- **Requerimientos no funcionales:** [[Spec 3.8 Disponibilidad y tolerancia a fallos]]
- **Spec / Plan / Constitución:** [[Plan 4.0 Elementos transversales]] · [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]]

