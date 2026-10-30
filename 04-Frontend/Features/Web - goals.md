---
tipo: "frontend"
modulo: "M12"
fuente: "apps/web/src/features/goals"
tags:
  - "frontend/feature"
  - "modulo/M12"
actualizado: "2026-10-30"
---

# Web · feature `goals`

Carpeta `apps/web/src/features/goals/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M12 - Metas de ahorro]]
- **Textos (i18n):** `locales/es-BO/goals.json` (21 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/metas` | `GoalsPage` | ✅ | solo si M12 está liberado |
| `/metas/:id` | `GoalDetailPage` | — | solo si M12 está liberado |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `listGoalsEndpoint` | `GET` | `/api/goals` |
| `goalEndpoint` | `GET` | `/api/goals/${encodeURIComponent(id)}` |
| `celebratedEndpoint` | `POST` | `/api/goals/${encodeURIComponent(id)}/celebrated` |

## Hooks (TanStack Query)

- `use-goals.ts` — `GOALS_KEY`, `goalsQuery`, `useGoals`, `useGoal`, `useMarkCelebrated`. Marks the celebration as shown, so it appears only once.

## Componentes (12)

| Archivo | Exporta | Descripción |
|---|---|---|
| `celebration.tsx` | `Celebration` | Shown the first time a goal is achieved; closing it marks it as celebrated (spec §2.12.2). |
| `dedicate-dialog.tsx` | `DedicateDialog` | "Dedicar": a card is never offered (RF-M12-03, EC-M12-08). |
| `earmark-confirm-dialog.tsx` | `EarmarkConfirmDialog` | Renders again when a bundle is added, so the text that arrives late replaces any key shown. |
| `earmark-dialog.tsx` | `EarmarkDialog` | "Apartar": earmarks part of the free balance of an account for the goal (EC-M12-01). |
| `goal-cards.tsx` | `GoalCards` | Cards of the goals, each with its progress ring and its status (plan §4.12.4). |
| `goal-form.tsx` | `useInvalidateGoals`, `GoalForm` | Every goal mutation changes the goals and the free balance of the accounts (plan §4.12.4). |
| `goal-history.tsx` | `GoalHistory` | Earmarks and releases with their origin (RF-M12-07). A release carries a minus sign. |
| `goal-progress.tsx` | `ProgressRing`, `GoalProgress` | Progress ring: the percentage is text and `aria-valuenow`, never only color (design). |
| `progress-by-account.tsx` | `ProgressByAccount` | What each account contributes to the goal (RF-M12-07). |
| `release-dialog.tsx` | `ReleaseDialog` | "Liberar": returns earmarked money of one account to its free balance (RF-M12-03). |
| `suggested-box.tsx` | `SuggestedBox` | The suggested monthly contribution and its variants (RF-M12-06). Nothing when reached. |
| `use-and-close-dialog.tsx` | `UseAndCloseDialog` | "Usar y cerrar": releases every earmark and archives the goal (RF-M12-09). |

**Backend relacionado:** [[API goals]]

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.12 M12 - Metas de ahorro (V1.1)]] · [[Spec 2.12 M12 - Metas de ahorro (V1.1)]]

