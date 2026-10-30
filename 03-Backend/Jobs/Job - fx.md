---
tipo: "job"
fuente: "apps/api/src/application/jobs/fx.ts"
tags:
  - "backend/jobs"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# Job · `fx.ts`

Capa de aplicación (`apps/api/src/application/jobs/fx.ts`). Lo ejecuta [[Job - tick]] y, si tiene alcance por usuario, el *catch-up* de la primera petición del día (ADR-01). Ver [[Flujo - Tick de jobs]].

**Módulos:** [[M3 - Monedas y tipo de cambio]]

## Comentarios del código

- Runs after a new parallel rate is stored, e.g. the goal milestones (plan §4.12.3).
- Runs when the latest capture is older than 60 minutes, or always with `force` (on demand).
- Runs once a day; it retries on every tick until a source answers (plan §4.3.2).
- A valid rate is at least 0.01 and has at most 2 decimals (EC-M3-04).
- One refresh at a time through the `fx_refresh` lease; a source failure never throws.

## Exportaciones

- `FxJobsDeps` (interface)
- `FxJobs` (interface)
- `createFxJobs` (function)

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]]
- **Spec / Plan / Constitución:** [[Plan 4.12 M12 - Metas de ahorro (V1.1)]] · [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]]

