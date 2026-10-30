---
tipo: "devops"
fuente: "docs/latencia-despliegue.md § Mantener despiertos los servicios"
documento: "[[Latencia del despliegue]]"
tags:
  - "devops/latencia"
actualizado: "2026-10-30"
---

↑ [[Latencia del despliegue]] · ← [[Latencia - Cómo medirlos]]

## Mantener despiertos los servicios

En el plan gratis, Render duerme el API tras 15 minutos sin tráfico y Neon suspende la base tras 5. Una medición con el servicio dormido incluye el arranque y no sirve. En cron-job.org, el tick debe seguir llamando cada minuto a `POST /internal/jobs/tick`.
