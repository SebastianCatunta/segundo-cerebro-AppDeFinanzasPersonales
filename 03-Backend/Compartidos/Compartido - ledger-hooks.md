---
tipo: "backend"
fuente: "apps/api/src/application/shared/ledger-hooks.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M6"
actualizado: "2026-10-30"
---

# Servicio compartido · `ledger-hooks.ts`

Capa de aplicación (`apps/api/src/application/shared/ledger-hooks.ts`, 36 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M6 - Transacciones]]

> [!quote] Comentario del código
> What a ledger change touched, for the modules that react to it (plan §4.0).

| Exportación | Tipo | Descripción |
|---|---|---|
| `LedgerChange` | interface | What a ledger change touched, for the modules that react to it (plan §4.0). |
| `LedgerChangeHandler` | type | Runs inside the transaction of the change; if it throws, the whole change is rolled back. |
| `LedgerHooks` | interface |  |
| `createLedgerHooks` | function |  |

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.0 Elementos transversales]]

