---
tipo: "adr"
adr: "ADR-04"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-04 · Libro contable de doble asiento

## Decisión
Libro contable: `ledger_transaction` (cabecera) + `ledger_entry` (asientos con signo). Saldo = inicial + Σ asientos.

## Motivo
Transferencias, comisiones y ajustes con un solo modelo; un `SUM` uniforme.

## Alternativas descartadas
Una fila por movimiento con columnas de origen y destino.

---
## 🔗 Relacionado

- **Entidades:** [[Entidad - LedgerEntry]] · [[Entidad - LedgerTransaction]]

