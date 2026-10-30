---
tipo: "api"
fuente: "apps/api/src/presentation/internal"
tags:
  - "backend/api"
  - "backend/jobs"
actualizado: "2026-10-30"
---

# API · Endpoints internos

- `POST /internal/jobs/tick`: lo llama cron-job.org cada minuto con el encabezado `x-jobs-secret` (ADR-01). Ejecuta [[Job - tick]].
- `/internal/test/*`: soporte de pruebas E2E (buzón falso, usuarios, tasas y avisos). Solo existe con `INTEGRATIONS=fake`.

| Método | Ruta |
|---|---|
| `POST` | `/internal/jobs/tick` |
| `GET` | `/internal/test/mailbox` |
| `POST` | `/internal/test/users` |
| `POST` | `/internal/test/rates` |
| `POST` | `/internal/test/notifications` |

> [!quote] jobs.controller.ts
> Value the scheduler sends in the `x-jobs-secret` header (ADR-01).

> [!quote] test-support.controller.ts
> Credentials of a user created for the end-to-end tests.

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]]

