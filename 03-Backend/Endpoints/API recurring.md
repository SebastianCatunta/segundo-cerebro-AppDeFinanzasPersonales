---
tipo: "api"
modulo: "M14"
fuente: "apps/api/src/presentation/routes/recurring.routes.ts"
tags:
  - "backend/api"
  - "modulo/M14"
actualizado: "2026-10-30"
---

# API · recurring

- **Módulo:** [[M14 - Recurrentes]]
- **Montaje:** `/api/recurring`
- **Archivos:** `presentation/routes/recurring.routes.ts`, `presentation/controllers/recurring.controller.ts`, `presentation/presenters/recurring.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (9)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/recurring` | — | — | `overview` |
| `POST` | `/api/recurring` | — | — | `create` |
| `POST` | `/api/recurring/occurrences/:id/confirm` | — | [[Contrato - recurring\|ConfirmOccurrenceInput]] | `confirm` |
| `POST` | `/api/recurring/occurrences/:id/skip` | — | — | `skip` |
| `PATCH` | `/api/recurring/:id` | — | [[Contrato - recurring\|UpdateRuleInput]] | `update` |
| `DELETE` | `/api/recurring/:id` | — | — | `remove` |
| `POST` | `/api/recurring/:id/pause` | — | — | `pause` |
| `GET` | `/api/recurring/:id/skipped` | — | — | `skipped` |
| `POST` | `/api/recurring/:id/resume` | — | [[Contrato - recurring\|ResumeInput]] | `resume` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `RecurringService` (887 líneas)

Archivo `application/services/recurring.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `create` | Creates a rule, idempotent by `input.id` (ADR-11), with a cap of 100 (RNF-28). The start date is today or later; a rule that starts today generates today's occurrence (RF-M14-03). |
| `overview` | The rules with their next dates, the pending occurrences and the next 30 days (RF-M14-13). |
| `confirm` | Registers a pending occurrence as a movement `origin = recurring` with its original date or another one up to today, and resolves its notice (RF-M14-08, EC-M15-01). Of simultaneous decisions only one succeeds; the others get `ALREADY_DECIDED` (RNF-11). |
| `skip` | Skips a pending occurrence without a movement and resolves its notice (plan §4.14.2). |
| `pause` | Pauses an active rule; while paused it generates nothing (plan §4.14.2). |
| `skipped` | The dates skipped while the rule was paused, in order, respecting N and the end (RF-M14-09). |
| `resume` | Resumes a paused rule registering the chosen skipped dates in order, with their date and the rate of that date; the ones that would block M4 or M12 stay pending. On reaching N or when the end passed, the rule is Finalizada (RF-M14-09, EC-M14-05, EC-M14-06). |
| `update` | Edits a rule; only the dates still to come change, never the pending occurrences nor the movements already created. Extending the end of a Finalizada rule makes it Activa (RF-M14-10). |
| `remove` | Deletes a rule: its pending occurrences go in cascade with their notices resolved, and its movements keep their `recurring_label` (RF-M14-11, EC-M14-04). |

**Repositorios que usa (vía UnitOfWork):** `accounts`, `categories`, `currencies`, `ledger`, `notifications`, `recurringOccurrences`, `recurringRules`, `userFxEvents`

**Servicios compartidos relacionados:** [[Compartido - recurring-generator]]

**Jobs relacionados:** [[Job - recurring]]

## Pruebas

- HTTP: `apps/api/test/http/recurring.isolation.test.ts`
- HTTP: `apps/api/test/http/recurring.test.ts`
- Integración: `apps/api/test/integration/recurring-cascades.test.ts`
- Integración: `apps/api/test/integration/recurring-confirm.test.ts`
- Integración: `apps/api/test/integration/recurring-create.test.ts`
- Integración: `apps/api/test/integration/recurring-expire-job.test.ts`
- Integración: `apps/api/test/integration/recurring-generate-job.test.ts`
- Integración: `apps/api/test/integration/recurring-repositories.test.ts`
- Integración: `apps/api/test/integration/recurring-resume.test.ts`
- Integración: `apps/api/test/integration/recurring-update-delete.test.ts`

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M15 - Recordatorios y avisos]] · [[M4 - Cuentas]]
- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Requerimientos no funcionales:** [[Spec 3.10 Límites por usuario]] · [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Plan 4.14 M14 - Recurrentes (V1.2)]]

