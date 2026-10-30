---
tipo: paquete
tags: [paquete/db, datos]
---
# 📦 Paquete `@finanzas/db`

↑ [[Arquitectura general]] · [[Monorepo pnpm]] · Datos: [[Modelo de datos]]

Contiene Prisma 6 sobre PostgreSQL: el `schema.prisma` (33 modelos y 34 enums), 13 migraciones SQL, el cliente exportado, los seeds y el script de carga del histórico de tasas.

| Carpeta | Contenido | Nota |
|---|---|---|
| `prisma/schema.prisma` | Modelos, relaciones y enums | [[Modelo de datos]] · [[Enums de Prisma]] |
| `prisma/migrations/` | `0001_base` … `0013_signup_ticket` | [[Migración 0001_base]] |
| `src/` | Cliente de Prisma exportado al API | [[Seeds y scripts de base de datos]] |
| `seed/` | `e2e.ts` (datos de prueba) y `preset-categories.ts` | [[Seeds y scripts de base de datos]] |
| `scripts/fx-backfill.ts` | Carga única del historial de tasas | [[Workflow fx-backfill.yml]] |
| `test/` | Restricciones, triggers y cascadas contra Postgres | [[Pruebas de los paquetes]] |

`schema.prisma` define los modelos y las relaciones. Las migraciones SQL agregan lo que Prisma no puede expresar: índices únicos parciales, `CHECK`, triggers, la función `user_rate_on` y la extensión `unaccent` ([[ADR-10 - Esquema Prisma más SQL]]). Las migraciones siguen el patrón *expand–contract* ([[Plan 1.5 Integración y despliegue continuos (ADR-20)]]).

`datasource` usa `DATABASE_URL` (pooler de Neon) y `directUrl = DATABASE_URL_DIRECT` (migraciones) → [[Variables de entorno]].
