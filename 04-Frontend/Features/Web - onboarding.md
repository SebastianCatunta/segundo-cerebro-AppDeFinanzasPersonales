---
tipo: "frontend"
modulo: "M10"
fuente: "apps/web/src/features/onboarding"
tags:
  - "frontend/feature"
  - "modulo/M10"
actualizado: "2026-10-30"
---

# Web · feature `onboarding`

Carpeta `apps/web/src/features/onboarding/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M10 - Onboarding]]
- **Textos (i18n):** `locales/es-BO/onboarding.json` (6 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/bienvenida` | `OnboardingPage` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `getOnboardingEndpoint` | `GET` | `/api/onboarding` |
| `step1Endpoint` | `POST` | `/api/onboarding/step1` |
| `step2Endpoint` | `POST` | `/api/onboarding/step2` |
| `step3Endpoint` | `POST` | `/api/onboarding/step3` |
| `skipEndpoint` | `POST` | `/api/onboarding/skip` |
| `skipAllEndpoint` | `POST` | `/api/onboarding/skip-all` |

## Componentes (4)

| Archivo | Exporta | Descripción |
|---|---|---|
| `accounts-step.tsx` | `AccountsStep` | Most accounts step 2 creates at once, the same bound as the API (plan §4.10.2). |
| `base-currency-step.tsx` | `BaseCurrencyStep` | The base currencies of step 1, BOB first because it is the default (spec §2.10.1). |
| `categories-step.tsx` | `CategoriesStep` | The icon a category created here starts with; it can be changed later in Categorías. |
| `onboarding-stepper.tsx` | `OnboardingStepper` | The three steps of the Onboarding, in order (spec §2.10.1). |

**Backend relacionado:** [[API onboarding]]

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.10 M10 - Onboarding (V1.0)]] · [[Spec 2.10 M10 - Onboarding (V1.0)]]

