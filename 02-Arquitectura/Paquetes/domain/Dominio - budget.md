---
tipo: "dominio"
fuente: "packages/domain/src/budget.ts"
tags:
  - "paquete/domain"
  - "modulo/M11"
actualizado: "2026-10-30"
---

# Dominio · `budget.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

**Módulo:** [[M11 - Presupuestos]]

> [!quote] Comentario del código
> Inclusive budget period, as calendar days 'YYYY-MM-DD' (plan §4.11.1).

## Exportaciones (12)

| Nombre | Tipo | Descripción |
|---|---|---|
| `BudgetPeriod` | interface | Inclusive budget period, as calendar days 'YYYY-MM-DD' (plan §4.11.1). |
| `periodFor` | function | Period that contains `date` for a budget that starts on `startDay` (RF-M11-04). With a pending `nextStartDay`, the current period stretches until the day before the new start day; a date in that stretch belongs to the stretched period (RF-M11-07). |
| `nextPeriod` | function | Period that follows `period`, starting on `startDay` (RF-M11-07). |
| `periodLabel` | function | Readable label of a period, e.g. "15/10/2026 – 14/11/2026". |
| `available` | function | Available money of a period: amount + carryover in + non-voided late adjustments (RF-M11-05). |
| `result` | function | Surplus (positive) or deficit (negative) of a period: available − spent (RF-M11-08, RF-M11-14). |
| `validateSplit` | function | A surplus split into carry, goal and discard must add up exactly to the result (RF-M11-08). |
| `thresholdsCrossed` | function | Thresholds (percent of the period amount, not of the available) to notify now (RF-M11-13). Each one notifies once per period (RN-10); when a budget is created or a period starts already above several thresholds, only the highest crossed one is notified. |
| `todayShouldBe` | function | Amount that should have been spent by the end of `today` at an even pace (plan §4.11.1). |
| `BudgetPace` | interface |  |
| `pace` | function | Pace of the current period (plan §4.11.1): exceeded when the result is negative or nothing is available, over when spending is ahead of the even pace, otherwise the daily allowance. |
| `paceText` | function | Readable pace text: "Puedes gastar X/día durante N días", "Vas X por encima del ritmo" or "Superado por X". |

**Pruebas:** `packages/domain/test/budget-math.test.ts`, `packages/domain/test/budget-periods.test.ts`

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.11 M11 - Presupuestos (V1.1)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

