---
tipo: "adr"
adr: "ADR-16"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-16 · Navegación con React Router

## Decisión
Navegación: React Router. El mes, los filtros y el detalle van en la URL, validados con Zod (`useValidatedSearch`). La memoria de cada pestaña es por módulo, en sessionStorage.

## Motivo
RF-M2-04 y RF-M2-06 con el botón Atrás nativo.

## Alternativas descartadas
TanStack Router.

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]]

