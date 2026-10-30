---
tipo: "frontend"
modulo: "M11"
fuente: "apps/web/src/features/budgets"
tags:
  - "frontend/feature"
  - "modulo/M11"
actualizado: "2026-10-30"
---

# Web · feature `budgets`

Carpeta `apps/web/src/features/budgets/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M11 - Presupuestos]]
- **Textos (i18n):** `locales/es-BO/budgets.json` (17 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/presupuestos` | `BudgetsPage` | ✅ | solo si M11 está liberado |
| `/presupuestos/:id` | `BudgetDetailPage` | — | solo si M11 está liberado |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `listBudgetsEndpoint` | `GET` | `/api/budgets` |
| `createBudgetEndpoint` | `POST` | `/api/budgets` |

## Hooks (TanStack Query)

- `use-budgets.ts` — `BUDGETS_KEY`, `budgetKey`, `budgetsQuery`, `useBudgets`, `useBudget`, `useFetchBudget`, `useCreateBudget`, `useUpdateBudget`, `useBudgetAction`, `useResetCarryover`, `useDeleteBudget`, `useCloseDecision`. Reads a budget through the cache, to edit the existing one (EC-M11-06).

## Componentes (10)

| Archivo | Exporta | Descripción |
|---|---|---|
| `budget-actions.tsx` | `BudgetActions` | Editar, Pausar, Reanudar, Reiniciar arrastre (confirming the amount, RF-M11-12) and Eliminar, in a secondary menu; only Eliminar uses the destructive button (design, M11). |
| `budget-form.tsx` | `BudgetForm` | Up to 3 distinct whole percentages between 1 and 150, or `null` when one is not valid. |
| `budget-list.tsx` | `BudgetStatusBadges`, `BudgetList` | Neutral text badge of the status, plus "Decidir cierre" when a close awaits a decision. |
| `budget-progress.tsx` | `useBudgetName`, `BudgetBar`, `BudgetProgress` | Share of `part` in `whole` as a whole percentage; nothing available counts as full (EC-M11-01). |
| `carryover-breakdown.tsx` | `signedMoney`, `CarryoverBreakdown` | An amount with its sign in front: "−Bs 200,00" or "+Bs 50,00" (design, montos). |
| `close-decision-card.tsx` | `CloseDecisionCard`, `CloseDecisionNotice` | "Enviar a meta" is offered by the general budget or, when there is none, by the budgets of root categories; subcategories only carry or discard (RF-M11-09). |
| `deficit-choice.tsx` | `DeficitChoice` | The excess of a closed period is carried or absorbed (RF-M11-08). A finalized budget has no next period, so it only offers Absorber (EC-M11-09). |
| `pace-text.tsx` | `PaceText` | "Puedes gastar … por día durante … días", "Vas … por encima del ritmo" or "Superado por …". |
| `period-history.tsx` | `PeriodHistory` | The 12 last periods, the most recent on top (plan §4.11.4). |
| `surplus-split-form.tsx` | `SurplusSplitForm` | A typed amount: empty counts as 0, `null` when it is not a valid non-negative amount. |

**Backend relacionado:** [[API budgets]]

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.11 M11 - Presupuestos (V1.1)]]

