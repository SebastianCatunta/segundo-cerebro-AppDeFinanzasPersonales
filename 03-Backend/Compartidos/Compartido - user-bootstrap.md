---
tipo: "backend"
fuente: "apps/api/src/application/shared/user-bootstrap.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M1"
  - "modulo/M10"
actualizado: "2026-10-30"
---

# Servicio compartido · `user-bootstrap.ts`

Capa de aplicación (`apps/api/src/application/shared/user-bootstrap.ts`, 68 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M1 - Acceso y cuenta]], [[M10 - Onboarding]]

> [!quote] Comentario del código
> Blocks 3 to 8 of the Home, in the order of spec §2.8.1.

| Exportación | Tipo | Descripción |
|---|---|---|
| `bootstrapUser` | function | Gives a new user its initial rows, inside the transaction of the registration: the system currencies, the settings, the preset and system categories and the default notification preferences (plan §4.5.3, §4.15.1). |

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.5 M5 - Categorías (V1.0)]] · [[Spec 2.8 M8 - Inicio (dashboard) (V1.0)]]

