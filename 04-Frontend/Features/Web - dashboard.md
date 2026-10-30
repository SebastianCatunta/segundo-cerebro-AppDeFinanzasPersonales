---
tipo: "frontend"
modulo: "M8"
fuente: "apps/web/src/features/dashboard"
tags:
  - "frontend/feature"
  - "modulo/M8"
actualizado: "2026-10-30"
---

# Web · feature `dashboard`

Carpeta `apps/web/src/features/dashboard/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M8 - Inicio (dashboard)]]
- **Textos (i18n):** `locales/es-BO/dashboard.json` (11 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/` | `DashboardPage` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `getDashboardEndpoint` | `GET` | `/api/dashboard` |

## Hooks (TanStack Query)

- `use-dashboard.ts` — `DASHBOARD_KEY`, `dashboardQuery`, `useDashboard`, `currentMonthFor`. The month (`YYYY-MM`) the Inicio shows first: the current one in the user's time zone.

## Componentes (8)

| Archivo | Exporta | Descripción |
|---|---|---|
| `balances-block.tsx` | `BalancesBlock` | "Saldos al día de hoy": net worth in both currencies and the first accounts (RF-M8-07). |
| `budget-block.tsx` | `BudgetBlock` | "Presupuesto del mes": one bar per budget with its period, linking to Presupuestos. |
| `category-bars.tsx` | `CategoryBars` | "Gasto por categoría": top 5 plus "Otras", each linking to Movimientos (RF-M8-05). |
| `dashboard-blocks.tsx` | `DashboardBlocks` | Keeps the title and the room of the chart while it is not drawn, so the blocks below do not jump. |
| `pace-chart.tsx` | `PaceChart` | "Ritmo del gasto": cumulative spending of the month against the previous one (RF-M8-06). |
| `recent-block.tsx` | `RecentBlock` | "Últimos movimientos": the five most recent, linking to Movimientos. |
| `summary-cards.tsx` | `SummaryCards` | Text shown, e.g. "+100 %", "+3 pp", "—". |
| `upcoming-block.tsx` | `UpcomingBlock` | Where each due date leads: a debt to its detail, a card to its account, a rule to Recurrentes. |

**Backend relacionado:** [[API dashboard]]
