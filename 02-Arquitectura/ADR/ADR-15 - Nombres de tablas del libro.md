---
tipo: "adr"
adr: "ADR-15"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-15 · Nombres de tablas del libro

## Decisión
Tablas del libro contable: `ledger_transaction` y `ledger_entry` en lugar de `transaction` y `transaction_entry`.

## Motivo
`TRANSACTION` es palabra clave de SQL.

## Alternativas descartadas
Comillas en todas las consultas.

---
## 🔗 Relacionado

- **Entidades:** [[Entidad - LedgerEntry]] · [[Entidad - LedgerTransaction]]

