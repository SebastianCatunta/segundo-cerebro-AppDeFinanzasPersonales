---
tipo: "contrato"
fuente: "packages/contracts/src/debts.ts"
tags:
  - "paquete/contracts"
  - "modulo/M13"
actualizado: "2026-10-30"
---

# Contratos Zod · `debts.ts`

Archivo `packages/contracts/src/debts.ts` del paquete [[Paquete contracts]]. Define schemas Zod compartidos por la web y el API (única fuente de entradas, salidas y errores).

**Módulo:** [[M13 - Deudas y préstamos]]

> [!quote] Comentario del código
> The interest rate in percent: 0.01 to 100 with up to 4 decimals (RF-M13-01).

## Exportaciones (21)

| Nombre | Tipo | Descripción |
|---|---|---|
| `DebtDirection` | const |  |
| `DebtDirection` | type |  |
| `InterestPeriod` | const |  |
| `InterestPeriod` | type |  |
| `DebtStatus` | const |  |
| `DebtStatus` | type |  |
| `InterestRate` | const | The interest rate in percent: 0.01 to 100 with up to 4 decimals (RF-M13-01). |
| `CreateDebtInput` | const |  |
| `CreateDebtInput` | type |  |
| `UpdateDebtInput` | const | Direction, currency, rate and period are fixed once created (RF-M13-03, RF-M13-10). |
| `UpdateDebtInput` | type |  |
| `PaymentInput` | const |  |
| `PaymentInput` | type |  |
| `DeleteDebtInput` | const |  |
| `DeleteDebtInput` | type |  |
| `PaymentDto` | const |  |
| `PaymentDto` | type |  |
| `DebtDto` | const |  |
| `DebtDto` | type |  |
| `DebtsSummaryDto` | const | Totals per direction and, optionally, the net balance per person (RF-M13-13). |
| `DebtsSummaryDto` | type |  |
