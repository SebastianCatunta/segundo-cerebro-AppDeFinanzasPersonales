---
tipo: "entidad"
tabla: "job_run"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
actualizado: "2026-10-30"
---

# JobRun → tabla `job_run`

- **Módulo:** infraestructura (jobs)
- **Creada en:** [[Migración 0009_recurring_notifications]]
- **Modificada/referenciada en:** [[Migración 0011_job_run_lease]]
- **Relaciones:** —

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `job` | `job` | `String` | @id @db.VarChar(64) |  |
| `lastStartedAt` | `last_started_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `lastFinishedAt` | `last_finished_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `lastError` | `last_error` | `String?` |  |  |
| `lockedUntil` | `locked_until` | `DateTime?` | @db.Timestamptz(6) | Lease in force until this instant; NULL means the job is free. |

## Índices y restricciones (Prisma)

- `@@map("job_run")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model JobRun {
>   job            String    @id @db.VarChar(64)
>   lastStartedAt  DateTime? @map("last_started_at") @db.Timestamptz(6)
>   lastFinishedAt DateTime? @map("last_finished_at") @db.Timestamptz(6)
>   lastError      String?   @map("last_error")
>   /// Lease in force until this instant; NULL means the job is free.
>   lockedUntil    DateTime? @map("locked_until") @db.Timestamptz(6)
> 
>   @@map("job_run")
> }
> ```
