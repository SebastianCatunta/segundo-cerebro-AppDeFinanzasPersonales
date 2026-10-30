---
tipo: "adr"
adr: "ADR-17"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-17 · Estado de cliente mínimo

## Decisión
Estado de cliente: store mínimo propio (`useSyncExternalStore`). Borradores en sessionStorage (`draft:{userId}:{formKey}`).

## Motivo
Muy poco estado; sobrevive a que el celular descarte la pestaña y se borra al cerrarla (RF-M2-10).

## Alternativas descartadas
Zustand, solo memoria.

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]]

