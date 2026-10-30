---
tipo: "dominio"
fuente: "packages/domain/src/dashboard.ts"
tags:
  - "paquete/domain"
  - "modulo/M8"
actualizado: "2026-10-30"
---

# Dominio · `dashboard.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

**Módulo:** [[M8 - Inicio (dashboard)]]

> [!quote] Comentario del código
> Ranges compared on the dashboard (RF-M8-04, EC-M8-03): in the current month, the same span of days of the previous month (up to its last day if shorter); in a closed month, the whole previous month.

## Exportaciones (5)

| Nombre | Tipo | Descripción |
|---|---|---|
| `ComparisonWindow` | interface |  |
| `comparisonWindow` | function | Ranges compared on the dashboard (RF-M8-04, EC-M8-03): in the current month, the same span of days of the previous month (up to its last day if shorter); in a closed month, the whole previous month. |
| `pctChange` | function | Percentage change as an integer, half rounded up; null when the previous value is 0 (RF-M8-04). |
| `savingsRate` | function | Savings rate in whole percent; null with no income or a negative balance (RF-M8-03). |
| `savingsRateDeltaPp` | function | Savings rate variation in percentage points; null if either rate is missing (RF-M8-04). |

**Pruebas:** `packages/domain/test/dashboard.test.ts`
