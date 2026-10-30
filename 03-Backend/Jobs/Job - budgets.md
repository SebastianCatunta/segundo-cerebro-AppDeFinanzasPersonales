---
tipo: "job"
fuente: "apps/api/src/application/jobs/budgets.ts"
tags:
  - "backend/jobs"
  - "modulo/M11"
actualizado: "2026-10-30"
---

# Job · `budgets.ts`

Capa de aplicación (`apps/api/src/application/jobs/budgets.ts`). Lo ejecuta [[Job - tick]] y, si tiene alcance por usuario, el *catch-up* de la primera petición del día (ADR-01). Ver [[Flujo - Tick de jobs]].

**Módulos:** [[M11 - Presupuestos]]

## Comentarios del código

- The decision of a closed period waits 7 days from the moment it is generated (RF-M11-10).
- The `budgets.close` handler of the tick: closes the ended periods of every user.
- The per-user scope of `budgets.close`, for the catch-up of the user (ADR-01).
- The `budgets.defaultDecision` handler of the tick: applies the default action when the deadline passed.
- The `budgets.close` job (plan §4.11.3): every `open` period that ended before the today of its user (RNF-20) moves to `closed_pending` with a 7-day deadline counted from now (RF-M11-10), the next period starts with `carryover_in = 0` and `next_start_day` applied, and the close notice waits for its decision. A `finalizing` budget gets no next period and becomes `finalized` (EC-M11-09). Each user runs under its lock and the `open` guard, so it is idempotent (RNF-13).
- Notifies only the highest threshold the new period starts above (RF-M11-13).
- Carries the amount to the period after the closed one, as the manual decision does.

## Exportaciones

- `BudgetsJobsDeps` (interface)
- `BudgetsJobs` (interface)
- `createBudgetsJobs` (function)

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]] · [[Spec 3.7 Tiempo]]
- **Spec / Plan / Constitución:** [[Plan 4.11 M11 - Presupuestos (V1.1)]]

