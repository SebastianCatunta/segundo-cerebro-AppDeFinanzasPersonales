---
tipo: "backend"
fuente: "apps/api/src/application/shared/recurring-generator.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M14"
actualizado: "2026-10-30"
---

# Servicio compartido · `recurring-generator.ts`

Capa de aplicación (`apps/api/src/application/shared/recurring-generator.ts`, 308 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M14 - Recurrentes]]

> [!quote] Comentario del código
> The IANA timezone of the user's profile (RNF-20); `null` when the user does not exist.

| Exportación | Tipo | Descripción |
|---|---|---|
| `UserTimezones` | interface | The IANA timezone of the user's profile (RNF-20); `null` when the user does not exist. |
| `RecurringGeneratorDeps` | interface |  |
| `RecurringGenerator` | interface |  |
| `createRecurringGenerator` | function |  |

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.7 Tiempo]]

