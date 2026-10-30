---
tipo: "adr"
adr: "ADR-13"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-13 · Estados derivados al leer

## Decisión
Los estados que dependen del tipo de cambio o del tiempo se derivan al leer: meta (en curso, cumplida, vencida), deuda vencida.

## Motivo
Siguen al progreso sin jobs ni carreras (RF-M12-02, EC-M12-03).

## Alternativas descartadas
Columnas de estado mantenidas por jobs.

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]]

