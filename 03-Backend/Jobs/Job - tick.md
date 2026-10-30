---
tipo: "job"
fuente: "apps/api/src/application/jobs/tick.ts"
tags:
  - "backend/jobs"
actualizado: "2026-10-30"
---

# Job · `tick.ts`

Capa de aplicación (`apps/api/src/application/jobs/tick.ts`). Lo ejecuta el endpoint interno y, si tiene alcance por usuario, el *catch-up* de la primera petición del día (ADR-01). Ver [[Flujo - Tick de jobs]].

## Comentarios del código

- Jobs of the tick in the fixed order of plan §4.0, each with the module that owns it: a job of a module that is not released does not run (ADR-18). `maintenance` serves every module and runs in every release.
- One run of a job. It is idempotent: a run cut short is completed by the next one (RNF-13).
- After this time the tick starts no more jobs, so it answers in less than 25 s (plan §4.0).
- Optional per-user scope of a job: the same work restricted to one user (ADR-01).
- Registers the run of a job; each module registers its own jobs.
- Runs the registered jobs of the released modules once, in the order of plan §4.0. A job whose lease another run holds is skipped. A job that fails is recorded in `job_run` and does not stop the next ones (RNF-13).
- Runs, for one user only, the per-user scope of the registered jobs of the released modules, in the order of plan §4.0. A job that fails does not stop the next ones (RNF-13).

## Exportaciones

- `JobName` (type)
- `JobHandler` (type)
- `JobScope` (interface)
- `JobsDeps` (interface)
- `Jobs` (interface)
- `createJobs` (function)

## Orden fijo de los jobs

```ts
const JOBS = [
  { name: 'fx.fetchParallel', module: 'M3' },
  { name: 'fx.fetchOfficial', module: 'M3' },
  { name: 'outbox.send', module: 'M1' },
  { name: 'recurring.generate', module: 'M14' },
  { name: 'budgets.close', module: 'M11' },
  { name: 'budgets.defaultDecision', module: 'M11' },
  { name: 'recurring.expirePending', module: 'M14' },
  { name: 'notifications.scheduled', module: 'M15' },
  { name: 'maintenance', module: null },
] as const
```

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M11 - Presupuestos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M3 - Monedas y tipo de cambio]]
- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]] · [[ADR-18 - Entregas con RELEASE]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Plan 4.0 Elementos transversales]]
- **Entidades:** [[Entidad - JobRun]]

