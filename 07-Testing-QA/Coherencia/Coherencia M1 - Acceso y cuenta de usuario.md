---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M1 - Acceso y cuenta de usuario"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M1"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · → [[Coherencia M2 - Navegación y estructura]]

### M1 — Acceso y cuenta de usuario

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M1-01 | El sistema DEBE exigir nombre (1-60 caracteres), correo con formato válido, contraseña de 8 a 128 caracteres… | coincide | `apps/api/test/integration/auth-signup.test.ts`, `packages/contracts/test/auth.test.ts` (+2) |  |
| RF-M1-02 | El sistema DEBE tratar el correo sin espacios al inicio ni al final y sin distinguir mayúsculas. | coincide | `packages/contracts/test/auth.test.ts`, `packages/db/test/schema-auth.test.ts` |  |
| RF-M1-03 | El sistema DEBE responder con el mismo mensaje neutro al registrarse o pedir la recuperación, exista o no el… | coincide | `apps/api/test/http/auth.test.ts`, `apps/api/test/integration/auth-signup.test.ts` (+1) |  |
| RF-M1-04 | El sistema DEBE impedir todo acceso a los datos hasta que el correo esté confirmado. Registrarse o iniciar… | coincide | `apps/api/test/http/auth.test.ts`, `apps/api/test/integration/auth-confirm.test.ts` (+6) |  |
| RF-M1-05 | El sistema DEBE permitir reenviar la confirmación una vez cada 60 segundos y como máximo 5 veces por hora.… | coincide | `apps/api/test/integration/auth-confirm.test.ts`, `apps/api/test/integration/email-links.test.ts` (+2) |  |
| RF-M1-06 | El sistema DEBE descartar los registros sin confirmar a los 7 días del último registro con ese correo. Un… | coincide | `apps/api/test/integration/auth-signup.test.ts`, `apps/api/test/integration/maintenance-auth.test.ts` |  |
| RF-M1-07 | El sistema DEBE mantener la sesión durante 30 días desde la última acción del usuario (las peticiones en… | coincide | `apps/api/test/http/session-middlewares.test.ts`, `apps/api/test/integration/auth-gateway.test.ts` (+4) |  |
| RF-M1-08 | El sistema DEBE contar los intentos fallidos por correo, exista o no una cuenta con ese correo. Tras 5 fallos… | coincide | `apps/api/test/integration/auth-signin.test.ts`, `apps/api/test/integration/login-throttle.test.ts` (+1) |  |
| RF-M1-09 | El enlace de recuperación DEBE vencer en 1 hora y servir una sola vez. Pedir uno nuevo invalida el anterior. | coincide | `apps/api/test/integration/auth-password.test.ts`, `apps/api/test/integration/email-links.test.ts` (+1) |  |
| RF-M1-10 | Al cambiar o recuperar la contraseña, el sistema DEBE revocar todas las demás sesiones y enviar un correo de… | coincide | `apps/api/test/integration/auth-password.test.ts`, `e2e/m1-password-reset.spec.ts` (+1) |  |
| RF-M1-11 | El sistema DEBE detectar la zona horaria del dispositivo al registrarse (Bolivia, si no puede detectarla) y… | coincide | `apps/api/test/http/me.test.ts`, `packages/contracts/test/auth.test.ts` (+2) |  |
| RF-M1-12 | Cambiar la zona horaria NO DEBE alterar la fecha de los movimientos ya registrados. | coincide | `apps/api/test/http/me.test.ts` |  |
| RF-M1-13 | El sistema NO DEBE permitir cambiar el correo de la cuenta. | coincide | `apps/api/test/http/me.test.ts`, `packages/contracts/test/auth.test.ts` (+1) |  |
| RF-M1-14 | La exportación DEBE incluir todos los datos del usuario, archivados incluidos, y generarse en el momento, sin… | coincide | `apps/api/test/http/me-export-v1-1.test.ts`, `apps/api/test/http/me-export-v1-2.test.ts` (+3) |  |
| RF-M1-15 | La eliminación de la cuenta DEBE exigir la contraseña y la palabra ELIMINAR. Debe borrar todos los datos del… | coincide | `apps/api/test/http/me-delete.test.ts`, `packages/db/test/schema-integrity.test.ts` (+2) |  |
| RF-M1-16 | Los únicos correos que envía el sistema son: confirmación, intento de registro con un correo existente,… | coincide | `apps/api/test/integration/auth-signin.test.ts`, `apps/api/test/integration/login-throttle.test.ts` (+3) |  |
| RF-M1-17 | El aviso de intento de registro con un correo existente DEBE enviarse como máximo una vez por hora por cuenta. | coincide | `apps/api/test/integration/auth-signup.test.ts` |  |
| RF-M1-18 | El enlace de confirmación DEBE servir solo para confirmar la cuenta: no abre sesión ni lleva al Onboarding.… | coincide | `apps/api/test/http/auth.test.ts`, `apps/api/test/http/dashboard.test.ts` (+23) |  |
| EC-M1-01 | Se abre un enlace de confirmación vencido o invalidado. El sistema muestra "Este enlace ya no es válido" y… | coincide | `apps/api/test/integration/auth-confirm.test.ts`, `apps/api/test/integration/email-links.test.ts` (+1) |  |
| EC-M1-02 | Se abre un enlace de confirmación ya usado con la cuenta activa. El sistema lleva al inicio de sesión. | coincide | `apps/api/test/integration/auth-confirm.test.ts`, `apps/api/test/integration/email-links.test.ts` (+1) |  |
| EC-M1-03 | Alguien se registra con un correo cuyo registro sin confirmar fue descartado. Se trata como un registro nuevo. | coincide | `apps/api/test/integration/auth-signup.test.ts`, `apps/api/test/integration/maintenance-auth.test.ts` |  |
| EC-M1-04 | Se intenta iniciar sesión durante el tiempo de espera, aunque sea con la contraseña correcta. Se rechaza y se… | coincide | `apps/api/test/integration/auth-signin.test.ts`, `apps/api/test/integration/login-throttle.test.ts` (+1) |  |
| EC-M1-05 | Se cambia la contraseña en el dispositivo A mientras B está abierto. B pierde la sesión en su siguiente… | coincide | `apps/api/test/http/session-middlewares.test.ts`, `apps/api/test/integration/auth-password.test.ts` (+2) |  |
| EC-M1-06 | Se elimina la cuenta en A mientras B está abierto. B pierde la sesión en su siguiente acción. | coincide | `apps/api/test/http/me-delete.test.ts`, `apps/api/test/http/session-middlewares.test.ts` (+1) |  |
| EC-M1-07 | El servicio de correo falla. El registro o la recuperación muestran el mismo mensaje neutro, y el usuario… | coincide | `apps/api/test/integration/outbox.test.ts` |  |
| EC-M1-08 | La contraseña de la eliminación es incorrecta, o la palabra no es exactamente ELIMINAR. No se elimina nada y… | coincide | `apps/api/test/http/me-delete.test.ts`, `packages/contracts/test/auth.test.ts` (+1) |  |
| EC-M1-09 | Alguien se registra con un correo que tiene un registro Sin confirmar (aún no descartado). Se reemplazan el… | coincide | `apps/api/test/http/auth.test.ts`, `apps/api/test/integration/auth-signup-ticket.test.ts` (+1) |  |
| EC-M1-10 | Se recupera la contraseña de una cuenta Sin confirmar. Al definir la contraseña nueva, la cuenta queda Activa. | coincide | `apps/api/test/http/auth.test.ts`, `apps/api/test/integration/auth-password.test.ts` (+1) |  |
| EC-M1-11 | Se confirma el correo de A mientras la app que lo espera está en un navegador con la sesión de B abierta. Se… | coincide | `e2e/m1-sign-up-confirm-sync.spec.ts`, `apps/api/test/http/auth.test.ts` (+1) | D-01 resuelta en TASK-273: al confirmar se descartan los borradores de B. |
| EC-M1-12 | Hay intentos fallidos con un correo sin cuenta. Se aplica la misma espera que a uno con cuenta, para no… | coincide | `apps/api/test/integration/auth-signin.test.ts`, `apps/api/test/integration/login-throttle.test.ts` |  |
| EC-M1-13 | El usuario cierra la app donde se registró antes de confirmar. Al abrir el enlace, nada continúa solo: la… | coincide | `e2e/m1-sign-up-confirm-sync.spec.ts` |  |
| EC-M1-14 | Una cuenta Sin confirmar recupera su contraseña (EC-M1-10), o alguien se registra de nuevo con su correo… | coincide | `apps/api/test/http/auth.test.ts`, `apps/api/test/integration/auth-password.test.ts` (+2) |  |

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]

