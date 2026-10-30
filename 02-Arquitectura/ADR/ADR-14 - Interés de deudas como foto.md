---
tipo: "adr"
adr: "ADR-14"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-14 · Interés de deudas como foto

## Decisión
Interés de deudas como foto: `capital_outstanding`, `interest_unpaid NUMERIC(24,10)`, `accrued_through`. Cada evento primero lleva el interés hasta hoy.

## Motivo
El interés nunca se recalcula hacia atrás (RF-M13-04) y no acumula error de redondeo (RNF-18).

## Alternativas descartadas
Recalcular por tramos desde el inicio.

---
## 🔗 Relacionado

- **Módulos:** [[M13 - Deudas y préstamos]]
- **Requerimientos no funcionales:** [[Spec 3.6 Exactitud monetaria]]

