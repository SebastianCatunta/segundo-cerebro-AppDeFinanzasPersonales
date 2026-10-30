---
tipo: "adr"
adr: "ADR-19"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-19 · Backend en capas

## Decisión
Backend en capas: presentación → aplicación → dominio. La infraestructura implementa los puertos que define la aplicación, y una raíz de composición los une. dependency-cruiser verifica las reglas en CI (1.4).

## Motivo
Separa HTTP, reglas e infraestructura; los casos de uso se prueban sin Express ni Prisma; las reglas de dependencia no se rompen sin que CI lo note.

## Alternativas descartadas
Organización por módulos con rutas, servicio y repositorio juntos, sin reglas verificadas.
