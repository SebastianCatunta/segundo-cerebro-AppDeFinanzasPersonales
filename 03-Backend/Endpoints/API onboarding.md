---
tipo: "api"
modulo: "M10"
fuente: "apps/api/src/presentation/routes/onboarding.routes.ts"
tags:
  - "backend/api"
  - "modulo/M10"
actualizado: "2026-10-30"
---

# API · onboarding

- **Módulo:** [[M10 - Onboarding]]
- **Montaje:** `/api/onboarding`
- **Archivos:** `presentation/routes/onboarding.routes.ts`, `presentation/controllers/onboarding.controller.ts`, `presentation/presenters/onboarding.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (6)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/onboarding` | ✅ | — | `get` |
| `POST` | `/api/onboarding/step1` | ✅ | [[Contrato - onboarding\|Step1Input]] | `step1` |
| `POST` | `/api/onboarding/step2` | ✅ | [[Contrato - onboarding\|Step2Input]] | `step2` |
| `POST` | `/api/onboarding/step3` | ✅ | [[Contrato - onboarding\|Step3Input]] | `step3` |
| `POST` | `/api/onboarding/skip` | ✅ | [[Contrato - onboarding\|SkipInput]] | `skip` |
| `POST` | `/api/onboarding/skip-all` | ✅ | — | `skipAll` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `OnboardingService` (325 líneas)

Archivo `application/services/onboarding.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `get` | The pending step with what it shows; `ONBOARDING_DONE` once finished (plan §4.10.3). |
| `step1` | Stores the chosen base currency and moves to step 2 (RF-M10-01). |
| `step2` | Creates the accounts of step 2, idempotent by their ids (ADR-11), with the balance dated the user's today (RF-M10-04), and moves to step 3 in the same transaction: an account rejected by RF-M4-01 or RF-M4-02 leaves none of them and the Onboarding in step 2 (EC-M10-01, EC-M10-02). |
| `step3` | Removes the unchecked categories, each parent with its subcategories, creates the new ones, idempotent by their ids (ADR-11), and finishes the Onboarding, all in the same transaction: unchecking a system category is `SYSTEM_CATEGORY` (RF-M10-05) and leaves everything as it was, with the Onboarding in step 3. Every non-system category of a kind may go (EC-M10-03). |
| `skip` | Skips the pending step: step 1 leaves BOB as the base (RF-M10-02), step 2 creates no account (RF-M10-03) and step 3 keeps every category (RF-M10-06) and finishes the Onboarding. |
| `skipAll` | Finishes the Onboarding from the pending step; from step 1 it leaves BOB (RF-M10-02). |

**Repositorios que usa (vía UnitOfWork):** `categories`, `userSettings`

**Servicios compartidos relacionados:** [[Compartido - user-bootstrap]]

## Pruebas

- HTTP: `apps/api/test/http/onboarding.test.ts`
- Integración: `apps/api/test/integration/onboarding-step1.test.ts`
- Integración: `apps/api/test/integration/onboarding-step2.test.ts`
- Integración: `apps/api/test/integration/onboarding-step3.test.ts`

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]]
- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Spec / Plan / Constitución:** [[Plan 4.10 M10 - Onboarding (V1.0)]]

