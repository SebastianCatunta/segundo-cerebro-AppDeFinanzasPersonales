---
tipo: "backend"
fuente: "apps/api/src/infrastructure/persistence"
tags:
  - "backend/infraestructura"
actualizado: "2026-10-30"
---

# Persistencia (cliente Prisma, lease de jobs, readiness)

Infraestructura de datos fuera de los repositorios: cliente Prisma único con la extensión de aislamiento, [[API - Unit of Work y aislamiento]], contador de consultas para `Server-Timing`, readiness de `/api/health/ready`, lease de `job_run` y el almacén de mantenimiento.

| Archivo | Líneas | Descripción (comentario del código) | Exporta |
|---|---|---|---|
| `job-runs.ts` | 37 | Prisma implementation of the `JobRuns` port: the lease of plan §4.0 in `job_run`. A lease is a row with an expiry, so it works with any connection of the pool or of the pooler; a session advisory lock could be taken and released on different connections and stay taken. | `createJobRuns` |
| `maintenance-store.ts` | 49 | Prisma implementation of the `MaintenanceStore` port: the deletions of the `maintenance` job. | `createMaintenanceStore` |
| `prisma-client.ts` | 35 | The API's single Prisma client, built from the validated env. The composition root creates it once and every user-scoped access wraps it with `forUser` (ADR-05). Prisma's `$disconnect` waits for a connection attempt in flight and rejects with its error when the database is unreachable (for example after the readiness probe gave up on it, plan §4.2.2). Shutting down never depends on the database answering: once that attempt has failed there is no connection left, so a second `$disconnect` just closes the client. | `buildPrismaClient` |
| `query-counter.ts` | 28 | `QueryCounter` over `AsyncLocalStorage` (plan §4.0): each request gets its own store when it begins, so concurrent requests keep separate counts. Outside a request there is no store and `record` is ignored. | `createQueryCounter` |
| `readiness.ts` | 35 | Limit of the database check (plan §4.2.2). | `createReadinessProbe` |
| `unit-of-work.ts` | 62 | Client of one interactive transaction. When the run locks a user, its model queries go through the isolation extension of that user (ADR-05). | `TransactionClient`, `BuildRepositories`, `createUnitOfWork` |

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-05 - Aislamiento por usuario]]
- **Spec / Plan / Constitución:** [[Plan 4.0 Elementos transversales]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]]
- **Entidades:** [[Entidad - JobRun]]

