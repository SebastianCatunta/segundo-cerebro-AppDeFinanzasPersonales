---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 6 - M1 Acceso y cuenta de usuario (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M1"
fase: "6"
tareas: "22"
modulo: "M1"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 5 - Base de la web y harness E2E]] · → [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]

### Fase 6 — M1 Acceso y cuenta de usuario (V1.0)

- [x] **`TASK-047`: Contratos de M1**
  - **Dependencias:** Requiere TASK-021, TASK-023
  - **Trazabilidad SDD:** plan §4.1.1; RF-M1-01, RF-M1-02, RF-M1-11, RF-M1-13, EC-M1-08
  - **Archivos en Alcance:**
    - `packages/contracts/src/auth.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/auth.test.ts`
  - **Especificación de Implementación:** `SignUpInput`, `SignInInput`, `ResendInput`, `ConfirmInput`, `ForgotInput`, `ResetInput`, `ChangePwdInput`, `UpdateMeInput`, `DeleteAccountInput` y `MeDto`, exactamente como plan §4.1.1.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-01`: nombre de 1 a 60, contraseña de 8 a 128 y `acceptTerms` obligatorio.
    - `RF-M1-02`: " ANA@mail.com " se normaliza a "ana@mail.com".
    - `RF-M1-11`: una zona horaria inválida cae a America/La_Paz.
    - `RF-M1-13`: `UpdateMeInput` rechaza el campo `email`.
    - `EC-M1-08`: `DeleteAccountInput` solo acepta exactamente "ELIMINAR".

- [x] **`TASK-048`: Correo de la cuenta: adaptador Resend, *fake* y plantillas**
  - **Nota (Fase 27, texto obsoleto):** Reemplazada por TASK-262 y TASK-263: hoy son 5 tipos de `email_kind`, sin `login_alert` ni su plantilla. Ver `coherencia.md` §4.
  - **Dependencias:** Requiere TASK-031
  - **Trazabilidad SDD:** plan §1.4 (*fakes* de integraciones), plan §1.5 (buzón de prueba), ADR-08; RF-M1-16, RNF-25
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/email-gateway.ts`
    - `apps/api/src/infrastructure/integrations/resend.ts`
    - `apps/api/src/infrastructure/integrations/resend.fake.ts`
    - `apps/api/src/infrastructure/integrations/email-templates.ts`
    - `apps/api/test/unit/email-templates.test.ts`
  - **Especificación de Implementación:** `EmailGateway.send({ to, kind, payload })`. El adaptador real usa la API de Resend. El *fake* guarda los correos en memoria y permite leerlos por destinatario. Plantillas en español para los 6 tipos de `email_kind`: llevan solo el enlace o los datos imprescindibles, nunca contraseñas ni montos. Interfaz de `email-templates.ts`: `EMAIL_KINDS` (`as const`, los 6 tipos), `type EmailKind`, `emailTemplates: Record<EmailKind, (payload: EmailPayload) => RenderedEmail>` con exactamente 6 claves y `renderEmail(kind, payload): RenderedEmail`, donde `RenderedEmail = { subject, text, html }` y `EmailPayload = { link?: string }`. Solo `confirm` y `reset` usan `payload.link`; los otros cuatro no usan `payload`. Las plantillas ignoran cualquier otro campo del `payload`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-16`: hay exactamente una plantilla por cada tipo de `email_kind`.
    - `RNF-25`: existen las plantillas de intentos fallidos, cambio de contraseña y eliminación de la cuenta.
    - Ninguna plantilla incluye la contraseña ni el token en texto, fuera del enlace.

- [x] **`TASK-049`: Bandeja de salida de correos y job `outbox.send`**
  - **Dependencias:** Requiere TASK-038, TASK-048
  - **Trazabilidad SDD:** plan §3.3 (`email_outbox`), plan §4.1.3 (correo caído), plan §4.0 (tick); EC-M1-07, RNF-22
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/email-outbox.repository.ts`
    - `apps/api/src/application/jobs/outbox.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/outbox.test.ts`
  - **Especificación de Implementación:** `enqueue(tx, email)` inserta una fila en `email_outbox`. El job `outbox.send` toma las filas pendientes vencidas, las envía y borra cada fila enviada. Si falla, reintenta a 1, 5, 15 y 60 minutos y después marca la fila `failed`. Se registra en el tick con `container.jobs.registerJob`. El contenedor arma el `EmailGateway` real (Resend) o el *fake* según `env.INTEGRATIONS` (plan §1.4).
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M1-07`: con el *fake* fallando y un `Clock` falso, los reintentos siguen la secuencia 1, 5, 15 y 60 minutos.
    - `RNF-22`: un correo enviado borra su fila; uno pendiente sigue reintentándose.

- [x] **`TASK-050`: `AuthGateway` sobre Better Auth (prueba técnica S-1)**
  - **Dependencias:** Requiere TASK-033
  - **Trazabilidad SDD:** ADR-08, ADR-02, plan §1.3 (S-1), plan §3.3; RF-M1-07
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/auth-gateway.ts`
    - `apps/api/src/infrastructure/auth/better-auth.ts`
    - `apps/api/test/integration/auth-gateway.test.ts`
  - **Especificación de Implementación:** Implementa con la API de servidor de Better Auth: `hashPassword`, `verifyPassword` (scrypt), `createUserCredential`, `setPassword`, `markEmailVerified`, `createSession(userId)` (devuelve la cookie `HttpOnly; Secure; SameSite=Lax`), `getSession(token)`, `deleteSession(id)` y `revokeSessions(userId, exceptSessionId?)`. El manejador HTTP genérico de Better Auth no se monta.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-050` (S-1): se crea una sesión y su cookie desde código propio, y `getSession` la reconoce.
    - `RF-M1-07`: dos sesiones del mismo usuario coexisten.
    - `revokeSessions` con `exceptSessionId` conserva solo esa sesión.

- [x] **`TASK-051`: Enlaces de confirmación y recuperación (`email-links`)**
  - **Dependencias:** Requiere TASK-033
  - **Trazabilidad SDD:** plan §4.1.3 (enlace de un solo uso), plan §3.9 (tokens como SHA-256); RF-M1-05, RF-M1-09, EC-M1-01, EC-M1-02
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/email-link.repository.ts`
    - `apps/api/src/application/shared/email-links.ts`
    - `apps/api/src/infrastructure/persistence/unit-of-work.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/email-links.test.ts`
  - **Especificación de Implementación:** `createEmailLinkRepository(tx)` queda ligado a la transacción y se expone como `repos.emailLinks`, igual que el resto de repositorios. `create(userId, purpose)` invalida el enlace vigente, genera un token aleatorio de 32 bytes y guarda solo su SHA-256, con 24 h de vigencia para la confirmación y 1 h para la recuperación. `consume(token, purpose)` hace el `UPDATE … RETURNING` condicionado de plan §4.1.3; si no actualiza ninguna fila, devuelve el motivo. Para que cada repositorio nuevo no rompa a los que arman solo parte del conjunto, `BuildRepositories` devuelve `Partial<Repositories>` y `UnitOfWork.run` entrega `Repositories` completo a la capa de aplicación; `container.ts` construye también `emailLinks`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-09`: un enlace sirve una sola vez; dos consumos simultáneos dan un solo éxito.
    - `RF-M1-05`: crear un enlace nuevo invalida el anterior.
    - `EC-M1-01`: un enlace vencido o invalidado da `LINK_INVALID`.
    - `EC-M1-02`: un enlace ya usado da `LINK_ALREADY_USED`.

- [x] **`TASK-052`: Espera progresiva tras intentos fallidos (`login-throttle`)**
  - **Nota (Fase 27, texto obsoleto):** Reemplazada por TASK-262: `createLoginThrottle` ya no devuelve `shouldAlert` ni hay alerta por intentos fallidos. Ver `coherencia.md` §4.
  - **Dependencias:** Requiere TASK-033
  - **Trazabilidad SDD:** plan §4.1.3 (espera tras intentos fallidos), plan §3.9 (HMAC); RF-M1-08, EC-M1-04, EC-M1-12
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/login-throttle.repository.ts`
    - `apps/api/src/application/shared/login-throttle.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/login-throttle.test.ts`
  - **Especificación de Implementación:** `createLoginThrottleRepository(tx)` queda ligado a la transacción y se expone como `repos.loginThrottle`; `container.ts` lo construye en `buildRepositories`. `createLoginThrottle({ uow, hmacSecret })` devuelve `check`, `fail`, `reset` y `shouldAlert`. Clave HMAC-SHA256 del correo normalizado. `check(email)` devuelve los segundos que faltan. `fail(email)` hace el `INSERT … ON CONFLICT` atómico de plan §4.1.3 y fija `locked_until`. `reset(email)`. `shouldAlert(email)` permite como máximo una alerta por hora.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-08`: 5 fallos dan 60 s de espera, 10 fallos dan 15 min, y cada fallo posterior vuelve a dar 15 min.
    - `RF-M1-08`: el contador se reinicia con un éxito o tras 1 h sin intentos, y la alerta sale como máximo una vez por hora.
    - `EC-M1-04`: durante la espera, `check` informa el tiempo restante.
    - `EC-M1-12`: un correo sin cuenta recibe la misma espera.

- [x] **`TASK-053`: Datos iniciales de un usuario nuevo (`user-bootstrap`)**
  - **Dependencias:** Requiere TASK-025, TASK-033
  - **Trazabilidad SDD:** plan §4.5.3 (seed), plan §4.15.1 (valores por defecto), plan §3.4; RF-M3-01, RF-M5-05, RF-M15-02
  - **Archivos en Alcance:**
    - `apps/api/src/application/shared/user-bootstrap.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/factories/user.factory.ts`
    - `apps/api/test/integration/user-bootstrap.test.ts`
  - **Especificación de Implementación:** Dentro de la transacción del registro crea: las monedas BOB y USD de sistema, `user_settings` con sus valores por defecto (`dashboard_blocks` en el orden de spec §2.8.1), las categorías precargadas y las del sistema, y las preferencias de avisos por defecto de plan §4.15.1. `user.factory` pasa a usar este servicio. `bootstrapUser(repos, userId)` lee `repos.users`, que expone `createUserRepository(tx)`; `container.ts` lo construye en `buildRepositories`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-01`: BOB y USD quedan activas y marcadas de sistema.
    - `RF-M5-05`: se crean todas las categorías precargadas y las del sistema.
    - `RF-M15-02`: las preferencias quedan activas salvo `log_day` (21:00) y `goal_progress`.

- [x] **`TASK-054`: Registro de usuario (`signUp`)**
  - **Nota (Fase 27, texto obsoleto):** Reemplazada por TASK-265: `signUp` entrega el ticket de registro (`__Secure-signup-ticket`) y lo guarda en `signup_ticket`. Ver `coherencia.md` §4.
  - **Dependencias:** Requiere TASK-047, TASK-049, TASK-050, TASK-051, TASK-053
  - **Trazabilidad SDD:** plan §4.1.2 (`POST /api/auth/sign-up`), plan §4.1.3; RF-M1-01, RF-M1-03, RF-M1-06, RF-M1-17, EC-M1-03, EC-M1-09, RNF-15
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/auth.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/auth-signup.test.ts`
  - **Especificación de Implementación:** `createAuthService({ uow, auth, hmacSecret, webOrigin })` expone `signUp({ name, email, password, termsAccepted })`. `UserRepository` gana `findByEmail`, `createUnconfirmed` y `replaceUnconfirmed`, y `claimRegisterAttempt` (un `register_attempt` por hora y por cuenta sobre `email_send_log`, con la clave HMAC del correo); el repositorio propio de `email_send_log` nace en TASK-055. `container.ts` cablea el servicio. Con un correo nuevo, crea el usuario sin confirmar, su credencial, los datos iniciales, el enlace (24 h) y el correo `confirm`. Con un correo Sin confirmar, reemplaza el nombre y la contraseña, fija `registered_at = now()`, invalida el enlace y envía uno nuevo. Con un correo Activo, encola `register_attempt` (como máximo uno por hora). Siempre devuelve `{ status: 'check_email' }` en un tiempo igualado. Si dos registros del mismo correo chocan en el índice único, el perdedor se reintenta por la rama Sin confirmar.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Registro con correo ya existente no revela la cuenta": la respuesta es la misma, se encola `register_attempt` y sigue habiendo un solo `auth_user`.
    - `RF-M1-17`: dos intentos en menos de 1 h encolan un solo aviso.
    - `EC-M1-09`: un registro repetido Sin confirmar reemplaza los datos, invalida el enlace anterior y reinicia el plazo de 7 días (`RF-M1-06`).
    - `RF-M1-03`: la respuesta es idéntica en los tres casos.

- [x] **`TASK-055`: Reenvío y confirmación del correo**
  - **Nota (Fase 27, texto obsoleto):** Reemplazada por TASK-265: `confirm` solo confirma (`{ status: 'confirmed' }`) y la sesión la abre `confirmation/status`. Ver `coherencia.md` §4.
  - **Dependencias:** Requiere TASK-054
  - **Trazabilidad SDD:** plan §4.1.2 (`confirmation/resend`, `confirm`); RF-M1-04, RF-M1-05, EC-M1-01, EC-M1-02, EC-M1-11
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/auth.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/email-send-log.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/email-link.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/auth-confirm.test.ts`
  - **Especificación de Implementación:** `resendConfirmation` acepta el correo o un token (lo busca por hash aunque esté vencido), aplica los límites de 60 s y 5 por hora con `email_send_log` e invalida el enlace anterior; siempre responde 202. `confirm(token, currentSessionId?)` consume el enlace, marca el correo como verificado, cierra la sesión de otro usuario en el dispositivo y crea la sesión nueva.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-05`: un reenvío a los 30 s no envía nada; tras 5 reenvíos en una hora, el sexto tampoco.
    - `RF-M1-04`: la cuenta queda Activa solo al confirmar.
    - `EC-M1-01` / `EC-M1-02`: los enlaces vencidos, invalidados o usados dan su error.
    - `EC-M1-11`: confirmar con la sesión de otro usuario abierta la cierra y abre la nueva.

- [x] **`TASK-056`: Inicio y cierre de sesión**
  - **Nota (Fase 27, texto obsoleto):** Reemplazada por TASK-262: un fallo de inicio de sesión ya no encola `login_alert`. Ver `coherencia.md` §4.
  - **Dependencias:** Requiere TASK-052, TASK-055
  - **Trazabilidad SDD:** plan §4.1.2 (`sign-in`, `sign-out`, `sign-out-all`); RF-M1-04, RF-M1-07, RF-M1-08, EC-M1-04, RNF-15, RNF-25
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/auth.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user.repository.ts`
    - `apps/api/test/integration/auth-signin.test.ts`
  - **Especificación de Implementación:** Con una espera vigente → `LOGIN_LOCKED {retryAfterSeconds}`. Verifica la contraseña; si el correo no existe, usa un hash de prueba para igualar el tiempo. Ante un fallo, registra el intento y, como máximo una vez por hora, encola `login_alert` si el correo tiene cuenta. Ante un éxito, reinicia el contador; si el correo no está confirmado, responde `EMAIL_NOT_CONFIRMED` sin crear sesión. `signOut` cierra la sesión actual y `signOutAll`, todas.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Usuario sin confirmar no accede": `EMAIL_NOT_CONFIRMED` y ninguna fila en `auth_session`.
    - Escenario "Espera progresiva tras intentos fallidos": tras 5 fallos, `LOGIN_LOCKED` con unos 60 s y un solo `login_alert` (`RNF-25`).
    - `EC-M1-04`: la contraseña correcta se rechaza durante la espera.
    - `RNF-15`: correo inexistente y contraseña incorrecta dan el mismo error.
    - `RF-M1-07`: `signOutAll` deja 0 sesiones.

- [x] **`TASK-057`: Recuperar y cambiar la contraseña**
  - **Nota (Fase 27, texto obsoleto):** Reemplazada por TASK-265: `reset` invalida el ticket del registro anterior (EC-M1-14). Ver `coherencia.md` §4.
  - **Dependencias:** Requiere TASK-056
  - **Trazabilidad SDD:** plan §4.1.2 (`password/forgot`, `reset`, `change`); RF-M1-09, RF-M1-10, EC-M1-05, EC-M1-10, RNF-25
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/auth.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user.repository.ts`
    - `apps/api/test/integration/auth-password.test.ts`
  - **Especificación de Implementación:** `forgot` crea un enlace de 1 h y siempre responde 202. `reset` consume el enlace, cambia el hash, borra todas las sesiones, crea una nueva, confirma el correo si no lo estaba y encola `password_changed`. `change` verifica la contraseña actual (si falla, `INVALID_CURRENT_PASSWORD`), cambia el hash, revoca las demás sesiones y encola `password_changed`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Recuperar la contraseña cierra las demás sesiones": queda 1 sesión nueva, 0 anteriores y un `password_changed`.
    - `EC-M1-10`: recuperar la contraseña de una cuenta Sin confirmar la deja Activa.
    - `EC-M1-05`: tras `change`, la otra sesión deja de existir.
    - `RF-M1-09`: el enlace vence a la hora.

- [x] **`TASK-058`: Middlewares de sesión `requireSession` y `trackActivity`**
  - **Dependencias:** Requiere TASK-050
  - **Trazabilidad SDD:** plan §4.1.2 (middlewares); RF-M1-07, RF-M2-08, EC-M1-05, EC-M1-06
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/middlewares/require-session.ts`
    - `apps/api/src/presentation/middlewares/track-activity.ts`
    - `apps/api/test/http/session-middlewares.test.ts`
  - **Especificación de Implementación:** `requireSession` valida la cookie, rechaza con `SESSION_EXPIRED` si `last_activity_at` tiene más de 30 días o si la sesión ya no existe, y deja en la petición `{ userId, sessionId, timezone }`. `trackActivity` actualiza `last_activity_at` como máximo cada 5 minutos y nunca en las peticiones con `X-Background`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-07`: una petición con `X-Background` no renueva la sesión; una normal sí, como máximo cada 5 minutos.
    - `RF-M2-08`: una sesión de más de 30 días sin actividad da `SESSION_EXPIRED 401`.
    - `EC-M1-05` / `EC-M1-06`: una sesión revocada da `SESSION_EXPIRED` en su siguiente acción.

- [x] **`TASK-059`: Rutas HTTP de autenticación**
  - **Dependencias:** Requiere TASK-057, TASK-058
  - **Trazabilidad SDD:** plan §4.1.2 (tabla de endpoints de auth); RF-M1-03, RNF-15
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/auth.routes.ts`
    - `apps/api/src/presentation/controllers/auth.controller.ts`
    - `apps/api/src/presentation/presenters/me.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/auth.test.ts`
  - **Especificación de Implementación:** Monta `/api/auth/*` según plan §4.1.2, con validación por `contracts`, la cookie en las respuestas que abren sesión y `MePresenter.toDto`.
  - **Criterios de Verificación (Tests & DoD):**
    - Cada endpoint de plan §4.1.2 responde con sus estados y códigos de error.
    - `RNF-15`: `sign-up` y `password/forgot` dan el mismo cuerpo y estado con correos existentes e inexistentes, con una diferencia de tiempo p95 < 50 ms sobre 50 muestras.
    - La cookie de sesión es `HttpOnly`, `Secure` y `SameSite=Lax`.

- [x] **`TASK-060`: Endpoints internos de prueba (buzón y usuario listo)**
  - **Dependencias:** Requiere TASK-059
  - **Trazabilidad SDD:** plan §1.5 (`qa-e2e`: buzón de prueba y usuarios de prueba), plan §1.4 (*fakes*)
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/internal/test-support.controller.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/test-support.test.ts`
  - **Especificación de Implementación:** Solo con `INTEGRATIONS=fake`: `GET /internal/test/mailbox?to=` devuelve los correos del *fake*, y `POST /internal/test/users` crea un usuario confirmado, con el Onboarding terminado, y devuelve sus credenciales. Con `INTEGRATIONS=real`, estas rutas no se montan.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-060`: con `INTEGRATIONS=real`, las dos rutas responden 404.
    - Con `fake`, el buzón devuelve el enlace de confirmación de un registro.
    - Con `fake`, el usuario creado inicia sesión y su `me.onboarding.completed` (contrato `MeDto`, anidado) vale `true`.

- [x] **`TASK-061`: Perfil del usuario: `GET` y `PATCH /api/me`**
  - **Dependencias:** Requiere TASK-059
  - **Trazabilidad SDD:** plan §4.1.2 (`/api/me`); RF-M1-11, RF-M1-12, RF-M1-13, RN-09
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/me.service.ts`
    - `apps/api/src/presentation/routes/me.routes.ts`
    - `apps/api/src/presentation/controllers/me.controller.ts`
    - `apps/api/src/presentation/presenters/me.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/me.test.ts`
  - **Especificación de Implementación:** `GET` devuelve `MeDto` con `release` y el estado del Onboarding. `PATCH` cambia el nombre y la zona horaria.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-12`: cambiar la zona horaria no altera la fecha de un movimiento ya guardado.
    - `RF-M1-13`: enviar `email` da `VALIDATION_ERROR`.
    - `RF-M1-11`: la zona horaria se puede cambiar.
    - `RN-09`: la respuesta usa solo la sesión, nunca un id del cliente.

- [x] **`TASK-062`: Eliminar la cuenta**
  - **Dependencias:** Requiere TASK-061
  - **Trazabilidad SDD:** plan §4.1.2 (`POST /api/me/delete`), plan §4.1.3 (eliminación), plan §3.8; RF-M1-15, EC-M1-06, EC-M1-08, RNF-16, RNF-25
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/me.service.ts`
    - `apps/api/src/presentation/routes/me.routes.ts`
    - `apps/api/src/presentation/controllers/me.controller.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/me-delete.test.ts`
  - **Especificación de Implementación:** Verifica la contraseña (si falla, `INVALID_PASSWORD`) y la palabra (si no coincide, `CONFIRMATION_MISMATCH`). Con `withUserLock`, encola `account_deleted` y borra `auth_user` en cascada.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Eliminar la cuenta": 0 filas del usuario en todas las tablas, `account_deleted` encolado y las sesiones cerradas.
    - `EC-M1-08`: con una contraseña incorrecta o una palabra distinta de ELIMINAR, no se borra nada.
    - `EC-M1-06`: la sesión de otro dispositivo recibe `SESSION_EXPIRED`.
    - `RF-M1-15`: un job que toma el bloqueo del usuario no crea datos después de la eliminación.

- [x] **`TASK-063`: Job `maintenance`: descarte de registros sin confirmar y purgas de seguridad**
  - **Nota (Fase 27, texto obsoleto):** Reemplazada por TASK-265: las purgas de `maintenance` incluyen los `signup_ticket` vencidos. Ver `coherencia.md` §4.
  - **Dependencias:** Requiere TASK-055
  - **Trazabilidad SDD:** plan §4.1.3 (descarte), plan §3.9 (retención); RF-M1-06, EC-M1-03, RNF-26
  - **Archivos en Alcance:**
    - `apps/api/src/application/jobs/maintenance.ts`
    - `apps/api/src/application/ports/maintenance-store.ts`
    - `apps/api/src/infrastructure/persistence/maintenance-store.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/maintenance-auth.test.ts`
  - **Especificación de Implementación:** Borra los `auth_user` sin confirmar con `registered_at` de hace más de 7 días, los `email_send_log` de más de 24 h y los `login_throttle` sin actividad desde hace más de 1 h. Se registra en el tick con el nombre `maintenance`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-06`: un usuario sin confirmar de hace 7 días y 1 minuto se borra; uno de hace 6 días, no.
    - `EC-M1-03`: después del descarte, el mismo correo se registra como nuevo.
    - `RNF-26`: las purgas respetan 24 h y 1 h.

- [x] **`TASK-064`: Puesta al día por usuario (`catchUpUser`)**
  - **Dependencias:** Requiere TASK-058, TASK-063
  - **Trazabilidad SDD:** ADR-01 (respaldo con la primera petición del usuario), plan §4.0; RNF-13
  - **Archivos en Alcance:**
    - `apps/api/src/application/jobs/tick.ts`
    - `apps/api/src/presentation/middlewares/catch-up.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/test/integration/catch-up.test.ts`
  - **Especificación de Implementación:** La primera petición autenticada de cada usuario en su día local ejecuta `catchUpUser(userId)`: los jobs registrados que tienen alcance por usuario, sin bloquear la respuesta. La marca de "ya corrió hoy" vive en memoria (los jobs son idempotentes).
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-13`: dos peticiones el mismo día disparan una sola puesta al día, y un día nuevo la vuelve a disparar.
    - Un error en la puesta al día no cambia la respuesta de la petición.

- [x] **`TASK-065`: Web: registro, "Revisa tu correo" y confirmación**
  - **Nota (Fase 27, texto obsoleto):** Reemplazada por TASK-266: el enlace solo muestra "Correo confirmado" y la app que espera en "Revisa tu correo" continúa sola. Ver `coherencia.md` §4.
  - **Dependencias:** Requiere TASK-046, TASK-060
  - **Trazabilidad SDD:** plan §4.1.4 (rutas públicas), plan §4.2.4 (guardas); RF-M1-01, RF-M1-03, RF-M1-05, RF-M1-11, EC-M1-01, EC-M1-02
  - **Archivos en Alcance:**
    - `apps/web/src/features/auth/api.ts`
    - `apps/web/src/features/auth/hooks/use-me.ts`
    - `apps/web/src/features/auth/components/sign-up-form.tsx`
    - `apps/web/src/features/auth/components/check-email.tsx`
    - `apps/web/src/features/auth/components/confirm-link.tsx`
    - `apps/web/src/features/auth/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/auth.json`
    - `apps/api/src/presentation/controllers/auth.controller.ts`
    - `apps/api/src/application/services/auth.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `e2e/fixtures/mailbox.ts`
    - `e2e/m1-sign-up.spec.ts`
  - **Especificación de Implementación:** Corrige además el API: el registro debe guardar la zona horaria que recibe (hoy `signUp` la descarta); una zona inválida o ausente cae a America/La_Paz. `/registro` (react-hook-form con `SignUpInput`; envía la zona horaria del dispositivo), `/revisa-tu-correo` (botón de reenvío con cuenta regresiva de 60 s) y `/confirmar` (consume el token y navega a `/bienvenida`). `useMe()` usa la clave `['me']`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-03`: el registro muestra el mensaje neutro y lleva a "Revisa tu correo".
    - `RF-M1-11`: el usuario creado tiene la zona horaria del navegador.
    - `EC-M1-01`: un enlace inválido muestra "Este enlace ya no es válido" y ofrece reenviar.
    - `EC-M1-02`: un enlace ya usado lleva al inicio de sesión.
    - `RF-M1-05`: el reenvío queda deshabilitado durante 60 s.

- [x] **`TASK-066`: Web: inicio de sesión y *fixture* de usuario autenticado**
  - **Dependencias:** Requiere TASK-065
  - **Trazabilidad SDD:** plan §4.1.4 (`/entrar`); RF-M1-04, RF-M1-08, EC-M1-04, RNF-15
  - **Archivos en Alcance:**
    - `apps/web/src/features/auth/components/sign-in-form.tsx`
    - `apps/web/src/features/auth/routes.tsx`
    - `apps/web/src/locales/es-BO/auth.json`
    - `e2e/fixtures/auth.ts`
    - `e2e/m1-sign-in.spec.ts`
  - **Especificación de Implementación:** `/entrar` con `SignInInput`, la cuenta regresiva desde `retryAfterSeconds` y la redirección a "Revisa tu correo" si el correo no está confirmado. El *fixture* `authedPage` crea un usuario con `POST /internal/test/users` (con `data: {}`, porque `requireJson` responde 415 a un `POST` sin cuerpo JSON) e inicia sesión.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-15`: con credenciales incorrectas se muestra "Correo o contraseña incorrectos", sin decir cuál falló.
    - `RF-M1-04`: un usuario sin confirmar ve "Revisa tu correo".
    - `EC-M1-04`: tras 5 fallos se ve el tiempo restante.

- [x] **`TASK-067`: Web: recuperar la contraseña**
  - **Dependencias:** Requiere TASK-066
  - **Trazabilidad SDD:** plan §4.1.4 (`/olvide-mi-contrasena`, `/restablecer`); RF-M1-09, RF-M1-10, RNF-15
  - **Archivos en Alcance:**
    - `apps/web/src/features/auth/components/forgot-password-form.tsx`
    - `apps/web/src/features/auth/components/reset-password-form.tsx`
    - `apps/web/src/features/auth/routes.tsx`
    - `apps/web/src/locales/es-BO/auth.json`
    - `e2e/m1-password-reset.spec.ts`
  - **Especificación de Implementación:** Pedir el enlace (mensaje neutro) y definir la contraseña nueva con el token de la URL. Al terminar, la sesión queda iniciada y se navega a la app.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-10`: tras restablecer, otro contexto del navegador con sesión previa la pierde en su siguiente acción.
    - `RF-M1-09`: reabrir el mismo enlace muestra que ya no es válido.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M5 - Categorías]]
- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]] · [[ADR-02 - Sesión entre dominios (proxy de Vercel)]] · [[ADR-08 - Autenticación sobre Better Auth]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.8 Disponibilidad y tolerancia a fallos]] · [[Spec 3.9 Auditoría y retención]]
- **Fases de tareas:** [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]] · [[Tareas Fase 4 - Base del API]]
- **Spec / Plan / Constitución:** [[Plan 1.3 Registro de decisiones (ADR)]] · [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]] · [[Plan 1.5 Integración y despliegue continuos (ADR-20)]] · [[Plan 3.3 Cuenta de usuario y seguridad (M1)]] · [[Plan 3.4 Ajustes y tipo de cambio (M3, M9, M10)]] · [[Plan 3.8 Integridad y cascadas]] · [[Plan 3.9 Seguridad a nivel de datos]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 4.5 M5 - Categorías (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]] · [[Spec 2.8 M8 - Inicio (dashboard) (V1.0)]]
- **Entidades:** [[Entidad - AuthSession]] · [[Entidad - AuthUser]] · [[Entidad - EmailOutbox]] · [[Entidad - EmailSendLog]] · [[Entidad - LoginThrottle]] · [[Entidad - SignupTicket]] · [[Entidad - UserSettings]]

