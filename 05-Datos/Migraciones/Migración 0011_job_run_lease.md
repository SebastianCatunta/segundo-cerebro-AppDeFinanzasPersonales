---
tipo: "migracion"
fuente: "packages/db/prisma/migrations/0011_job_run_lease/migration.sql"
tags:
  - "datos/migracion"
actualizado: "2026-10-30"
---

# Migración 0011_job_run_lease

> [!quote] Encabezado del SQL
> Lease of each job (plan §4.0, plan §3.7): exclusion between runs of the tick that works with any connection of the pool, unlike a session advisory lock. NULL means the job is free; a run that dies leaves a lease that expires on its own.

← [[Migración 0010_deferred_fks]] · → [[Migración 0012_remove_login_alert]] · ↑ [[Modelo de datos]]

- **Tablas alteradas:** [[Entidad - JobRun|job_run]]
- **Líneas:** 5

> [!example]- SQL completo
> ```sql
> -- Lease of each job (plan §4.0, plan §3.7): exclusion between runs of the tick that works with any
> -- connection of the pool, unlike a session advisory lock. NULL means the job is free; a run that
> -- dies leaves a lease that expires on its own.
> ALTER TABLE job_run ADD COLUMN locked_until timestamptz;
> ```

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 3.7 Avisos e infraestructura (M15)]] · [[Plan 4.0 Elementos transversales]]

