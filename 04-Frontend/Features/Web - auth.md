---
tipo: "frontend"
modulo: "M1"
fuente: "apps/web/src/features/auth"
tags:
  - "frontend/feature"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# Web · feature `auth`

Carpeta `apps/web/src/features/auth/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Textos (i18n):** `locales/es-BO/auth.json` (6 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/registro` | `SignUpForm` | — | V1.0 |
| `/entrar` | `SignInForm` | — | V1.0 |
| `/revisa-tu-correo` | `CheckEmail` | — | V1.0 |
| `/confirmar` | `ConfirmLink` | — | V1.0 |
| `/olvide-mi-contrasena` | `ForgotPasswordForm` | — | V1.0 |
| `/restablecer` | `ResetPasswordForm` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `signUpEndpoint` | `POST` | `/api/auth/sign-up` |
| `resendConfirmationEndpoint` | `POST` | `/api/auth/confirmation/resend` |
| `confirmEndpoint` | `POST` | `/api/auth/confirm` |
| `confirmationStatusEndpoint` | `POST` | `/api/auth/confirmation/status` |
| `meEndpoint` | `GET` | `/api/me` |

## Hooks (TanStack Query)

- `use-confirmation-watch.ts` — `WatchedDocument`, `CreateConfirmationWatchOptions`, `ConfirmationWatch`, `createConfirmationWatch`, `UseConfirmationWatchOptions`, `useConfirmationWatch`. Plan §4.1.4: every 3 s while visible, every 10 s after 5 minutes, and never after 24 h.
- `use-me.ts` — `ME_QUERY_KEY`, `meQuery`, `useMe`. Asks for the profile and keeps the hint of this device in step: a confirmed session leaves its hint, a `401` (no session) erases it, and any other failure leaves it as it was.

## Componentes (6)

| Archivo | Exporta | Descripción |
|---|---|---|
| `check-email.tsx` | `CheckEmail` | RF-M1-05: one resend every 60 seconds. |
| `confirm-link.tsx` | `ConfirmLink` |  |
| `forgot-password-form.tsx` | `ForgotPasswordForm` |  |
| `reset-password-form.tsx` | `ResetPasswordForm` |  |
| `sign-in-form.tsx` | `SignInForm` | `m:ss` text of the remaining wait (EC-M1-04). |
| `sign-up-form.tsx` | `SignUpForm` | IANA zone of the device (RF-M1-11); the API falls back to Bolivia when it is missing. |

**Backend relacionado:** [[API auth]], [[API me]]

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]]

