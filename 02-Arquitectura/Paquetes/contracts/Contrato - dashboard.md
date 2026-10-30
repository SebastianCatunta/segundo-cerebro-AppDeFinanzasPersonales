---
tipo: "contrato"
fuente: "packages/contracts/src/dashboard.ts"
tags:
  - "paquete/contracts"
  - "modulo/M8"
actualizado: "2026-10-30"
---

# Contratos Zod · `dashboard.ts`

Archivo `packages/contracts/src/dashboard.ts` del paquete [[Paquete contracts]]. Define schemas Zod compartidos por la web y el API (única fuente de entradas, salidas y errores).

**Módulo:** [[M8 - Inicio (dashboard)]]

> [!quote] Comentario del código
> A movement of the "Últimos movimientos" block. With USD as the base, a movement saved without a dollar rate has no amount in the base currency (EC-M3-02), so `amountInBase` can be null.

## Exportaciones (12)

| Nombre | Tipo | Descripción |
|---|---|---|
| `DashboardQuery` | const |  |
| `DashboardQuery` | type |  |
| `BudgetBarDto` | const |  |
| `BudgetBarDto` | type |  |
| `UpcomingItemDto` | const |  |
| `UpcomingItemDto` | type |  |
| `RecentMovementDto` | const | A movement of the "Últimos movimientos" block. With USD as the base, a movement saved without a dollar rate has no amount in the base currency (EC-M3-02), so `amountInBase` can be null. |
| `RecentMovementDto` | type |  |
| `DashboardDto` | const |  |
| `DashboardDto` | type |  |
| `DashboardViewDto` | const | The answer of the Inicio: the blocks hidden by the user come without data (RF-M8-10). |
| `DashboardViewDto` | type |  |

---
## 🔗 Relacionado

- **Módulos:** [[M3 - Monedas y tipo de cambio]]

