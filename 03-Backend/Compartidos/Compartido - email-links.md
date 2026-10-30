---
tipo: "backend"
fuente: "apps/api/src/application/shared/email-links.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# Servicio compartido · `email-links.ts`

Capa de aplicación (`apps/api/src/application/shared/email-links.ts`, 20 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M1 - Acceso y cuenta]]

> [!quote] Comentario del código
> Lifetime of each kind of link, in seconds (RF-M1-05 confirmation 24 h, RF-M1-09 recovery 1 h).

| Exportación | Tipo | Descripción |
|---|---|---|
| `EMAIL_LINK_LIFETIME_SECONDS` | const | Lifetime of each kind of link, in seconds (RF-M1-05 confirmation 24 h, RF-M1-09 recovery 1 h). |
| `generateEmailLinkToken` | function | A random 32-byte token, as base64url text (43 characters). |
| `hashEmailLinkToken` | function | SHA-256 of a token in hex: the only form that is stored (plan §3.9). |

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 3.9 Seguridad a nivel de datos]]

