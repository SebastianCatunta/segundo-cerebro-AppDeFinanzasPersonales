---
tipo: "backend"
fuente: "apps/api/src/application/shared/budget-ledger-hook.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M11"
actualizado: "2026-10-30"
---

# Servicio compartido · `budget-ledger-hook.ts`

Capa de aplicación (`apps/api/src/application/shared/budget-ledger-hook.ts`, 113 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M11 - Presupuestos]]

> [!quote] Comentario del código
> Statuses whose budgets do not react to ledger changes (RF-M11-11, RF-M11-13).

| Exportación | Tipo | Descripción |
|---|---|---|
| `BudgetLedgerHookDeps` | interface |  |
| `includedCarry` | function | `true` when the applied decision included carrying: a surplus with something carried, or a deficit carried to the next period (plan §4.11.3). |
| `createBudgetLedgerHook` | function | The `LedgerHooks` handler of budgets (plan §4.11.3): notifies the thresholds crossed in the period in course once each (RF-M11-13, RNF-12) and moves to its carryover the difference of the late movements of a period decided with carry (RF-M11-11, EC-M11-05). |

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Plan 4.11 M11 - Presupuestos (V1.1)]]

