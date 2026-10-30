---
tipo: "backend"
fuente: "apps/api/src/application/shared/balance-guard.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M4"
  - "modulo/M12"
actualizado: "2026-10-30"
---

# Servicio compartido · `balance-guard.ts`

Capa de aplicación (`apps/api/src/application/shared/balance-guard.ts`, 179 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M4 - Cuentas]], [[M12 - Metas de ahorro]]

> [!quote] Comentario del código
> A signed change to the balance of an account: negative takes money out (plan §4.0).

| Exportación | Tipo | Descripción |
|---|---|---|
| `BalanceDelta` | interface | A signed change to the balance of an account: negative takes money out (plan §4.0). |
| `BalanceGuardMode` | type |  |
| `EarmarkWithdrawal` | interface | Money taken out of a goal's earmark on an account to cover a spend (RF-M12-05). |
| `BalanceGuardOptions` | interface |  |
| `AutoBlocked` | interface | An `automatic` change that touches earmarked money: the caller leaves it pending (EC-M12-05). |
| `BalanceGuardOutcome` | type | What the guard tells a `batch` caller when the change must not be applied. |
| `BalanceGuard` | const |  |

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.0 Elementos transversales]]

