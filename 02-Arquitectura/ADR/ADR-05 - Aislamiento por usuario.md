---
tipo: "adr"
adr: "ADR-05"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-05 · Aislamiento por usuario

## Decisión
Aislamiento: los repositorios reciben `userId` de la sesión; una extensión de Prisma inyecta y verifica `user_id`; claves foráneas compuestas `(user_id, x_id)` hacen imposible referenciar datos de otro usuario. Un test de aislamiento por repositorio. Sin RLS.

## Motivo
Defensa en dos capas sin el costo operativo de RLS con el pooler de Neon.

## Alternativas descartadas
RLS en Postgres.
