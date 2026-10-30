---
tipo: "adr"
adr: "ADR-07"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-07 · Deshacer con token

## Decisión
Deshacer: `deleted_at` + token de un solo uso (`undo_action`, vence a los 12 s). Un job purga.

## Motivo
Restaura lo vinculado de forma atómica; las consultas filtran `deleted_at IS NULL`.

## Alternativas descartadas
Borrado real + recrear desde el cliente.

---
## 🔗 Relacionado

- **Entidades:** [[Entidad - UndoAction]]

