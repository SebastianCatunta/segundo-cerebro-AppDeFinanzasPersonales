---
tipo: "job"
fuente: "apps/api/src/application/jobs/recurring.ts"
tags:
  - "backend/jobs"
  - "modulo/M14"
actualizado: "2026-10-30"
---

# Job · `recurring.ts`

Capa de aplicación (`apps/api/src/application/jobs/recurring.ts`). Lo ejecuta [[Job - tick]] y, si tiene alcance por usuario, el *catch-up* de la primera petición del día (ADR-01). Ver [[Flujo - Tick de jobs]].

**Módulos:** [[M14 - Recurrentes]]

## Comentarios del código

- The users the recurring jobs walk, read across users (plan §4.14.3).
- The users with an active recurring rule, for `recurring.generate`.
- The users with a pending occurrence whose `pending_since` is before that instant, whatever the status of its rule, for `recurring.expirePending` (RF-M14-07).
- `recurring.generate` for every user with an active rule (plan §4.0, §4.14.3).
- `recurring.generate` for one user only, under its lock (ADR-01, RNF-13).
- `recurring.expirePending` for every user with an expired pending (plan §4.14.3, RF-M14-07).
- `recurring.expirePending` for one user only, under its lock (ADR-01, RNF-13).
- How long a pending occurrence waits for a decision before it is omitted (RF-M14-07).
- Where the notification of an omitted occurrence leads (plan §4.14.4).
- Runs the job for each user; one user's failure does not stop the others (RNF-13).
- The 30 days count from `pending_since`, also for occurrences recovered after an outage (RNF-13).

## Exportaciones

- `RecurringUsers` (interface)
- `RecurringJobsDeps` (interface)
- `RecurringJobs` (interface)
- `createRecurringJobs` (function)

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Plan 4.0 Elementos transversales]] · [[Plan 4.14 M14 - Recurrentes (V1.2)]]

