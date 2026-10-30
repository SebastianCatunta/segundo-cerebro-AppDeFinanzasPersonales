---
tipo: "adr"
adr: "ADR-01"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-01 · Jobs con cron externo

## Decisión
Jobs: API en Render gratis. cron-job.org llama cada minuto a `POST /internal/jobs/tick` (secreto en un encabezado, directo a Render). Jobs idempotentes que se ponen al día. Respaldo: la primera petición de cada usuario ejecuta lo vencido para él.

## Motivo
Costo 0. El ping mantiene despierto el servidor (sin arranque en frío). Los atrasos se recuperan solos (RF-M14-12, RNF-13).

## Alternativas descartadas
pg-boss o node-cron (necesitan un servidor siempre encendido), GitHub Actions (mínimo cada 5 min y con retrasos), Railway Hobby (USD 5/mes).

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]

