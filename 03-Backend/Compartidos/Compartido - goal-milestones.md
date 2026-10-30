---
tipo: "backend"
fuente: "apps/api/src/application/shared/goal-milestones.ts"
tags:
  - "backend/aplicacion"
  - "modulo/M12"
  - "modulo/M15"
actualizado: "2026-10-30"
---

# Servicio compartido · `goal-milestones.ts`

Capa de aplicación (`apps/api/src/application/shared/goal-milestones.ts`, 311 líneas). Lo usan varios casos de uso dentro de la misma transacción.

**Módulos:** [[M12 - Metas de ahorro]], [[M15 - Recordatorios y avisos]]

> [!quote] Comentario del código
> The progress milestones of a goal, in percent (RF-M15-02).

| Exportación | Tipo | Descripción |
|---|---|---|
| `GOAL_MILESTONES` | const | The progress milestones of a goal, in percent (RF-M15-02). |
| `GoalRatesReader` | type | The rates read inside the caller's transaction. |
| `GoalNoticeUser` | interface | A user with goal notices turned on, with the timezone of their profile (RNF-20). |
| `GoalNoticeUsers` | interface | The users the hourly rates job evaluates milestones for. |
| `GoalMilestonesDeps` | interface |  |
| `GoalMilestones` | interface |  |
| `createGoalMilestones` | function |  |
| `emitMonthlyGoalNotices` | function | The monthly notice of RF-M15-02, inside the caller's transaction: on day 1, for each goal whose contribution of last month was below the suggested one. The contribution is the earmarks plus the entries to the dedicated account minus the withdrawals, each converted at the current rate, so the exchange rate has no effect on it. One notice per goal and month (RNF-12). |

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]] · [[Spec 3.7 Tiempo]]

