---
tipo: "feature"
modulo: "M1"
entrega: "V1.0"
aliases:
  - "M1"
  - "Acceso y cuenta"
tags:
  - "feature"
  - "modulo/M1"
  - "entrega/V1.0"
actualizado: "2026-10-30"
---

# M1 · Acceso y cuenta

> [!summary] Entrega V1.0
> Registro con confirmación por correo, inicio de sesión con espera progresiva ante fallos, recuperación y cambio de contraseña, cierre de sesión (una o todas), perfil, exportación de datos en ZIP de CSV y borrado de la cuenta. La autenticación usa la API de servidor de Better Auth detrás de endpoints propios (ADR-08). Los correos de cuenta (5 tipos) salen por una bandeja de salida (outbox) hacia Resend. En la Fase 27 se quitó el correo de intentos fallidos y se agregó el ticket de registro, que deja continuar sola a la app que espera en "Revisa tu correo".

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.1 M1 - Acceso y cuenta de usuario (V1.0)]]
- **Plan técnico (cómo):** [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]]
- **Tareas:** [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]], [[Tareas Fase 16 - Exportación de datos (M1, V1.0)]]
- **Coherencia con el código:** [[Coherencia M1 - Acceso y cuenta de usuario]]

## ⚙️ Backend

- **Endpoints:** [[API auth]], [[API me]]
- **Servicios compartidos:** [[Compartido - email-links]], [[Compartido - login-throttle]], [[Compartido - user-bootstrap]]
- **Jobs:** [[Job - outbox]], [[Job - maintenance]]
- **Integraciones:** [[Integración - Resend]]

## 🖥️ Frontend

- **Features:** [[Web - auth]], [[Web - profile]]

## 🗄️ Datos

- [[Entidad - AuthUser]]
- [[Entidad - AuthSession]]
- [[Entidad - AuthAccount]]
- [[Entidad - AuthVerification]]
- [[Entidad - EmailLink]]
- [[Entidad - SignupTicket]]
- [[Entidad - LoginThrottle]]
- [[Entidad - EmailOutbox]]
- [[Entidad - EmailSendLog]]

## 🧩 Paquetes compartidos

- **Dominio:** —
- **Contratos:** [[Contrato - auth]]

## 🧪 Pruebas E2E

- `e2e/m1-delete-account.spec.ts` — TASK-076 eliminar la cuenta
- `e2e/m1-export.spec.ts` — TASK-165 exportar mis datos
- `e2e/m1-password-reset.spec.ts` — TASK-067 recuperar la contraseña
- `e2e/m1-profile.spec.ts` — TASK-074 pantalla de perfil
- `e2e/m1-sign-in.spec.ts` — TASK-066 inicio de sesión
- `e2e/m1-sign-up-confirm-sync.spec.ts` — TASK-266 la app que espera continúa sola al Onboarding
- `e2e/m1-sign-up.spec.ts` — TASK-065 registro, revisa tu correo y confirmación

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-08 - Autenticación sobre Better Auth]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]

