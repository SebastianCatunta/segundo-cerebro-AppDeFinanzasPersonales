---
tipo: "api"
modulo: "M1"
fuente: "apps/api/src/presentation/routes/auth.routes.ts"
tags:
  - "backend/api"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# API · auth

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Montaje:** `/api/auth`
- **Archivos:** `presentation/routes/auth.routes.ts`, `presentation/controllers/auth.controller.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (10)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `POST` | `/api/auth/sign-up` | — | [[Contrato - auth\|SignUpInput]] | `signUp` |
| `POST` | `/api/auth/sign-in` | — | [[Contrato - auth\|SignInInput]] | `signIn` |
| `POST` | `/api/auth/confirmation/resend` | — | [[Contrato - auth\|ResendInput]] | `resendConfirmation` |
| `POST` | `/api/auth/confirm` | — | [[Contrato - auth\|ConfirmInput]] | `confirm` |
| `POST` | `/api/auth/confirmation/status` | — | — | `confirmationStatus` |
| `POST` | `/api/auth/password/forgot` | — | [[Contrato - auth\|ForgotInput]] | `forgotPassword` |
| `POST` | `/api/auth/password/reset` | — | [[Contrato - auth\|ResetInput]] | `resetPassword` |
| `POST` | `/api/auth/password/change` | ✅ | [[Contrato - auth\|ChangePwdInput]] | `changePassword` |
| `POST` | `/api/auth/sign-out` | ✅ | — | `signOut` |
| `POST` | `/api/auth/sign-out-all` | ✅ | — | `signOutAll` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `AuthService` (447 líneas)

Archivo `application/services/auth.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `signUp` | Always answers the neutral `check_email` with a new ticket, whatever the state of the email (RF-M1-03). Keeps the ticket only for an unconfirmed account, new or replaced (EC-M1-14). |
| `signIn` | Opens a session with the email and the password. Rejects with `LOGIN_LOCKED` while a wait is running (EC-M1-04), `INVALID_CREDENTIALS` whatever the wrong data (RNF-15), or `EMAIL_NOT_CONFIRMED` without opening a session (RF-M1-04). Counts failures (RF-M1-08). |
| `signOut` | Closes that session. |
| `signOutAll` | Closes every session of the user (RF-M1-07). |
| `resendConfirmation` | Sends a new confirmation link within the limits of 60 s and 5 per hour (RF-M1-05). Always resolves, whether it sent anything or not. |
| `confirm` | Consumes the confirmation link, marks the email as verified and the ticket of the user as confirmed. Opens no session and leaves the sessions of the device alone (RF-M1-18). Rejects with `LINK_INVALID` or `LINK_ALREADY_USED` (EC-M1-01, EC-M1-02). |
| `confirmationStatus` | `pending` without a ticket, or with one that is unknown, expired, unconfirmed or already used. Once confirmed, the ticket is used up: closes `currentSessionId` (EC-M1-11) and opens the session of its user (RF-M1-18). |
| `forgotPassword` | Issues a recovery link of 1 hour, invalidating the previous one, and leaves the `reset` email in the outbox (RF-M1-09). Always resolves, whether the email has an account or not. |
| `resetPassword` | Consumes the recovery link, sets the new password, confirms the email if it was not (EC-M1-10), closes every session, opens a new one, sends `password_changed` (RF-M1-10) and deletes the registration ticket (EC-M1-14). Rejects with `LINK_INVALID`. |
| `changePassword` | Checks the current password, sets the new one, closes every other session and sends `password_changed` (RF-M1-10, EC-M1-05). Rejects with `INVALID_CURRENT_PASSWORD`. |

**Repositorios que usa (vía UnitOfWork):** `emailLinks`, `emailOutbox`, `emailSendLog`, `loginThrottle`, `signupTickets`, `users`

**Servicios compartidos relacionados:** [[Compartido - email-links]], [[Compartido - login-throttle]], [[Compartido - user-bootstrap]]

**Jobs relacionados:** [[Job - outbox]], [[Job - maintenance]]

## Pruebas

- HTTP: `apps/api/test/http/auth.test.ts`
- Integración: `apps/api/test/integration/auth-confirm.test.ts`
- Integración: `apps/api/test/integration/auth-gateway.test.ts`
- Integración: `apps/api/test/integration/auth-password.test.ts`
- Integración: `apps/api/test/integration/auth-signin.test.ts`
- Integración: `apps/api/test/integration/auth-signup-ticket.test.ts`
- Integración: `apps/api/test/integration/auth-signup.test.ts`

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.5 Privacidad y seguridad]]

