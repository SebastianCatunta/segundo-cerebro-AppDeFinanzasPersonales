---
tipo: "dominio"
fuente: "packages/domain/src/goals.ts"
tags:
  - "paquete/domain"
  - "modulo/M12"
actualizado: "2026-10-30"
---

# Dominio · `goals.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

**Módulo:** [[M12 - Metas de ahorro]]

> [!quote] Comentario del código
> Bs per unit of each currency (BOB = 1).

## Exportaciones (11)

| Nombre | Tipo | Descripción |
|---|---|---|
| `GoalMoney` | interface |  |
| `GoalRates` | interface |  |
| `GoalStatus` | type |  |
| `GoalStatusInput` | interface |  |
| `SuggestedMonthly` | interface |  |
| `EarmarkSource` | interface |  |
| `EarmarkTake` | interface |  |
| `progress` | function |  |
| `status` | function |  |
| `suggestedMonthly` | function |  |
| `earmarkProposal` | function |  |

**Pruebas:** `packages/domain/test/goals.test.ts`
