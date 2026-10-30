---
tipo: "adr"
adr: "ADR-10"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-10 · Esquema Prisma más SQL

## Decisión
Esquema: `schema.prisma` para modelos y relaciones. Las migraciones SQL agregan lo que Prisma no expresa: índices únicos parciales, `CHECK`, triggers, la función `user_rate_on`, la extensión `unaccent`.

## Motivo
Prisma es la puerta de acceso (§2); la integridad vive en la base.

## Alternativas descartadas
Solo validaciones en el servicio.
