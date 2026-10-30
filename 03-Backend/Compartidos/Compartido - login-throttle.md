---
tipo: "backend"
fuente: "apps/api/src/application/shared/login-throttle.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# Servicio compartido · `login-throttle.ts`

Capa de aplicación (`apps/api/src/application/shared/login-throttle.ts`, 31 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M1 - Acceso y cuenta]]

> [!quote] Comentario del código
> Seconds left of the wait for that email; `0` when it can try.

| Exportación | Tipo | Descripción |
|---|---|---|
| `LoginThrottle` | interface |  |
| `LoginThrottleDeps` | interface |  |
| `createLoginThrottle` | function | Progressive wait after failed logins (RF-M1-08), keyed by HMAC-SHA256 of the email (plan §3.9). |

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 3.9 Seguridad a nivel de datos]]

