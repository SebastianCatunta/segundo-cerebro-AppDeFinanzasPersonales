---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.1 M1 - Acceso y cuenta de usuario (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M1"
modulo: "M1"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.0 Elementos transversales]] · → [[Plan 4.2 M2 - Navegación y estructura (V1.0)]]

### 4.1 M1 — Acceso y cuenta de usuario (V1.0)

#### 4.1.1 Contratos y schemas de validación

```ts
const Email    = z.string().trim().toLowerCase().email().max(254);           // RF-M1-02
const Password = z.string().min(8).max(128);
const PersonName = z.string().trim().min(1).max(60);
const Timezone = z.string().refine(isIanaTimezone).catch('America/La_Paz');  // RF-M1-11

SignUpInput        = z.object({ name: PersonName, email: Email, password: Password, acceptTerms: z.literal(true), timezone: Timezone.optional() });
SignInInput        = z.object({ email: Email, password: z.string().min(1).max(128) });
ResendInput        = z.union([z.object({ email: Email }), z.object({ token: z.string().min(32) })]);
ConfirmInput       = z.object({ token: z.string().min(32) });
ForgotInput        = z.object({ email: Email });
ResetInput         = z.object({ token: z.string().min(32), newPassword: Password });
ChangePwdInput     = z.object({ currentPassword: z.string().min(1), newPassword: Password });
UpdateMeInput      = z.object({ name: PersonName.optional(), timezone: Timezone.optional() });
DeleteAccountInput = z.object({ password: z.string().min(1), confirmation: z.literal('ELIMINAR') });

MeDto = { id, name, email, timezone, locale: 'es-BO', release: '1.0'|'1.1'|'1.2', onboarding: { step, completed } }
```

#### 4.1.2 Endpoints

| Método y ruta | Sesión | Comportamiento transaccional | Respuestas y errores |
|---|---|---|---|
| `POST /api/auth/sign-up` | No | Iguala el tiempo de respuesta. Correo nuevo → crea `auth_user` sin confirmar + `email_link` (24 h) + bandeja de salida. Correo Sin confirmar → reemplaza nombre y contraseña, `registered_at = now()`, invalida el enlace vigente y crea otro. Correo Activo → bandeja de salida `register_attempt` (máximo 1/h, RF-M1-17). En los tres casos fija la cookie `__Secure-signup-ticket` (valor aleatorio; `HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=86400`); solo con una cuenta Sin confirmar (nueva o reemplazada) guarda su SHA-256 en `signup_ticket`, en lugar del anterior (EC-M1-14). | `202 {status:'check_email'}` y la cookie, siempre (RF-M1-03) |
| `POST /api/auth/sign-in` | No | Si hay espera vigente → `LOGIN_LOCKED`. Verifica la contraseña (hash de prueba si el correo no existe). Fallo → `throttle.fail()` (atómico); no se envía ningún correo. Éxito → `throttle.reset()`; sin confirmar → sin sesión. | `200 {me, next}` + cookie · `INVALID_CREDENTIALS 401` · `EMAIL_NOT_CONFIRMED 403` · `LOGIN_LOCKED 429 {retryAfterSeconds}` |
| `POST /api/auth/confirmation/resend` | No | Con correo o con token (busca por hash aunque esté vencido). Límites: 60 s y 5/h (`email_send_log`). Invalida el enlace anterior. | `202` siempre |
| `POST /api/auth/confirm` | No | Consume el enlace (`UPDATE … RETURNING`) + `email_verified = true` + marca `signup_ticket.confirmed_at` del usuario. No crea sesión ni toca la que el dispositivo traiga (RF-M1-18). | `200 {status:'confirmed'}` · `LINK_INVALID 410 {canResend}` · `LINK_ALREADY_USED 409` |
| `POST /api/auth/confirmation/status` | No (cookie del ticket) | Sin cookie, con un valor desconocido o vencido, o sin `confirmed_at` → `pending`. Con `confirmed_at`: `DELETE … RETURNING user_id` (un solo uso) + cierra la sesión que el navegador traiga (EC-M1-11) + crea la sesión + borra la cookie del ticket. Es `POST` porque abre sesión, y `checkOrigin` rechaza otros orígenes. Un ticket inexistente y el de un correo Activo responden igual (RNF-15). | `200 {status:'pending'}` · `200 {status:'confirmed', next:'onboarding'}` + cookie de sesión |
| `POST /api/auth/password/forgot` | No | Enlace de 1 h, invalida el anterior, bandeja de salida. | `202` siempre |
| `POST /api/auth/password/reset` | No | Consume el enlace + nuevo hash + borra todas las sesiones + crea una + confirma el correo si no lo estaba (EC-M1-10) + bandeja de salida `password_changed` + borra los `signup_ticket` del usuario (EC-M1-14). | `200 {next}` · `LINK_INVALID 410` |
| `POST /api/auth/password/change` | Sí | Verifica la actual + nuevo hash + borra las demás sesiones + bandeja de salida. | `204` · `INVALID_CURRENT_PASSWORD 401` |
| `POST /api/auth/sign-out` · `/sign-out-all` | Sí | Borra la sesión actual o todas. | `204` |
| `GET /api/me` · `PATCH /api/me` | Sí | El cambio de zona horaria no toca fechas (RF-M1-12). | `MeDto` |
| `GET /api/me/export` | Sí | Streaming con `archiver` de los exportadores de cada módulo (CSV en UTF-8, coma, `1234.56`, celdas neutralizadas). | `200 application/zip` |
| `POST /api/me/delete` | Sí | Verifica la contraseña → `withUserLock` → bandeja de salida `account_deleted` → `DELETE auth_user` (cascada). | `204` · `INVALID_PASSWORD 401` · `CONFIRMATION_MISMATCH 422` |

**Middlewares:**
- `requireSession`: valida la cookie con Better Auth y rechaza con `SESSION_EXPIRED` si `last_activity_at < now() − 30 d`.
- `trackActivity`: actualiza `last_activity_at` en las peticiones sin `X-Background`, como máximo cada 5 min.
- `requireJson` y `checkOrigin`.

#### 4.1.3 Ciclo de vida y concurrencia
- **Enlace de un solo uso (RF-M1-09):** `UPDATE email_link SET used_at = now() WHERE token_hash = $1 AND used_at IS NULL AND invalidated_at IS NULL AND expires_at > now() RETURNING user_id, purpose`. Si no actualiza ninguna fila, se consulta el motivo (EC-M1-01 o EC-M1-02). Ante un doble clic gana una sola petición.
- **Un enlace vigente por usuario y propósito:** índice único parcial. Crear un enlace nuevo invalida el vigente en la misma transacción (RF-M1-05).
- **Sin confirmar → Activa:** `UPDATE auth_user SET email_verified = true WHERE id = $1 AND NOT email_verified`.
- **Descarte (RF-M1-06):** job `maintenance` → `DELETE FROM auth_user WHERE NOT email_verified AND registered_at < now() − 7 d`. El bloqueo de fila lo serializa con una confirmación simultánea.
- **Registro simultáneo del mismo correo:** `UNIQUE(email)`. El perdedor se reintenta por el camino de "Sin confirmar".
- **Espera tras intentos fallidos (RF-M1-08):** `INSERT INTO login_throttle … ON CONFLICT (email_hmac) DO UPDATE SET consecutive_failures = CASE WHEN last_failure_at < now() − 1 h THEN 1 ELSE consecutive_failures + 1 END, last_failure_at = now() RETURNING consecutive_failures`. Con 5 fallos, `locked_until` = ahora + 1 min; con 10 o más, ahora + 15 min.
- **Revocación (RF-M1-10, EC-M1-05, EC-M1-06):** `DELETE FROM auth_session WHERE user_id = $1 AND id <> $actual`. El otro dispositivo recibe `SESSION_EXPIRED` en su siguiente acción.
- **Eliminación (RF-M1-15):** usa `withUserLock`, que también toman los jobs, así ningún job crea datos después.
- **Correo caído (EC-M1-07):** la respuesta sigue siendo la neutra. `outbox.send` reintenta con espera exponencial (1, 5, 15 y 60 min). El usuario puede reenviar respetando los límites.

#### 4.1.4 UI y estado
- **Rutas públicas:** `/registro` (SignUpForm), `/entrar` (SignInForm con cuenta regresiva desde `retryAfterSeconds`), `/revisa-tu-correo` (CheckEmail con reenvío cada 60 s), `/confirmar` (ConfirmLink), `/olvide-mi-contrasena`, `/restablecer`.
- **Rutas privadas:** `/perfil` (ProfileForm: nombre, zona horaria, idioma fijo, correo en solo lectura con su explicación, cambio de contraseña, cerrar sesión, cerrar todas, exportar) y `/perfil/eliminar` (DeleteAccount con la palabra ELIMINAR y la opción de exportar antes).
- **Servidor:** `useMe()`, con la clave `['me']`.
- **Cliente:** formularios con react-hook-form y los schemas de `contracts`; la cuenta regresiva vive en el componente.
- **Confirmación desde otro dispositivo (RF-M1-18, EC-M1-11, EC-M1-13):** `CheckEmail` usa `useConfirmationWatch`, que llama a `POST /api/auth/confirmation/status` cada 3 s mientras la pestaña está visible (cada 10 s pasados 5 minutos), al recuperar el foco y al volverse visible, y se detiene al confirmar, al desmontarse o a las 24 h. Con `confirmed`, invalida `['me']` y navega a `/bienvenida`. `ConfirmLink` solo llama a `confirm` y muestra "Correo confirmado: vuelve a la app donde creaste tu cuenta, que continúa sola; si ya la cerraste, inicia sesión", con un enlace a `/entrar`: no navega ni abre sesión. Los errores de red del sondeo se ignoran.
- **Exportar:** descarga con `fetch` + `blob`, con un indicador de progreso.

---

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]]
- **Requerimientos no funcionales:** [[Spec 3.5 Privacidad y seguridad]]
- **Entidades:** [[Entidad - AuthUser]] · [[Entidad - EmailLink]] · [[Entidad - EmailSendLog]] · [[Entidad - SignupTicket]]

