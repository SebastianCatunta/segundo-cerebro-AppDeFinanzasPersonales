---
tipo: backend
tags: [backend/infraestructura]
---
# Capa 4 · Infraestructura (`infrastructure/`)

↑ [[API - Visión general]] · implementa los puertos de [[API - Capa de aplicación]]

Implementa los puertos que define la aplicación. **Puede depender** de los puertos y tipos de la aplicación y del dominio. **No puede depender** de la presentación.

| Carpeta | Contenido | Nota |
|---|---|---|
| `persistence/prisma-client.ts` | Cliente Prisma único, con la extensión de aislamiento `forUser` | [[API - Persistencia]] |
| `persistence/unit-of-work.ts` | Transacciones interactivas, bloqueo por usuario y lecturas `REPEATABLE READ` | [[API - Unit of Work y aislamiento]] |
| `persistence/repositories/` (28) | Un repositorio por entidad o agregado | [[API - Repositorios Prisma]] |
| `persistence/job-runs.ts` | Lease de los jobs en `job_run` | [[Entidad - JobRun]] · [[Flujo - Tick de jobs]] |
| `persistence/readiness.ts` | `SELECT 1` de `/api/health/ready` | [[API health]] |
| `persistence/query-counter.ts` | Cuenta las consultas para `Server-Timing` | [[API - Persistencia]] |
| `auth/better-auth.ts` | `AuthGateway` sobre la API de servidor de Better Auth. El manejador HTTP genérico no se expone | [[ADR-08 - Autenticación sobre Better Auth]] · [[Flujo - Autenticación y sesión]] |
| `integrations/` | paralelo.bo, BCB y Resend, con sus *fakes* | [[Integración - paralelo.bo]] · [[Integración - BCB]] · [[Integración - Resend]] |
| `export/csv-zip.ts` | ZIP de CSV en streaming, con las celdas tipo fórmula neutralizadas (RF-M1-14) | [[API me]] |
| `config/env.ts` | Validación del entorno con Zod | [[API - Configuración env.ts]] |

Los *fakes* se activan con `INTEGRATIONS=fake` y están prohibidos en producción. Se usan en desarrollo, en las pruebas y en el entorno efímero de QA ([[Workflow qa-e2e.yml]]).

**Pruebas:** integración contra Postgres en Docker, incluido el aislamiento entre usuarios ([[Pruebas del API]]).
