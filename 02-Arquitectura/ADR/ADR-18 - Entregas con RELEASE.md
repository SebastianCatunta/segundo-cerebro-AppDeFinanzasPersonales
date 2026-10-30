---
tipo: "adr"
adr: "ADR-18"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-18 · Entregas con RELEASE

## Decisión
Entregas: variable `RELEASE` del API, devuelta en `GET /api/me`. Las rutas de módulos no liberados responden 404 y sus jobs no corren.

## Motivo
Una sola fuente; liberar no exige recompilar el frontend (RF-M2-03).

## Alternativas descartadas
Variable de compilación en cada app.

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]]

