---
tipo: "readme"
fuente: "README.md § Estructura"
documento: "[[README - App de Finanzas Personales]]"
tags:
  - "readme"
actualizado: "2026-10-30"
---

↑ [[README - App de Finanzas Personales]] · ← [[README - Stack]] · → [[README - Cómo correrlo en local]]

## Estructura

```
apps/api           API Express en capas (presentation, application, domain, infrastructure)
apps/web           SPA React + Vite
packages/contracts Schemas Zod compartidos por la web y el API
packages/domain    Reglas puras: dinero, fechas y formatos
packages/db        Prisma: schema, migraciones y seed
packages/config    TypeScript, ESLint y Vitest compartidos
docs/              Constitución, protocolo de ejecución, dirección de diseño y asignaciones
001-appFinanzas-mvp/  spec.md, plan.md y tasks.md de la funcionalidad
e2e/               Pruebas E2E con Playwright (accesibilidad y rendimiento incluidos)
tools/sdd/         Scripts del pipeline de tareas (gates, check, cierre, pre-push)
.claude/           Hooks, subagentes y la skill /implement-task
```
