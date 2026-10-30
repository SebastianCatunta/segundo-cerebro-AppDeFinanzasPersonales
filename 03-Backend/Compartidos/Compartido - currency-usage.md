---
tipo: "backend"
fuente: "apps/api/src/application/shared/currency-usage.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# Servicio compartido · `currency-usage.ts`

Capa de aplicación (`apps/api/src/application/shared/currency-usage.ts`, 90 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M3 - Monedas y tipo de cambio]]

> [!quote] Comentario del código
> Tells whether the user still uses a currency in one module (accounts, goals, budgets, debts or rules), inside the transaction that deactivates it (plan §4.3.3, EC-M3-05).

| Exportación | Tipo | Descripción |
|---|---|---|
| `CurrencyUsageCheck` | type | Tells whether the user still uses a currency in one module (accounts, goals, budgets, debts or rules), inside the transaction that deactivates it (plan §4.3.3, EC-M3-05). |
| `CurrencyUsage` | const | Registry of the modules that use currencies (plan §4.0). Each module registers its check in its own phase; deactivating a currency asks all of them. |

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.0 Elementos transversales]] · [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]]

