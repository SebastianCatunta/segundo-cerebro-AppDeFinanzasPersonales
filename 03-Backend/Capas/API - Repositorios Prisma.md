---
tipo: "backend"
fuente: "apps/api/src/infrastructure/persistence/repositories"
tags:
  - "backend/infraestructura"
actualizado: "2026-10-30"
---

# Repositorios Prisma

Implementaciones de los puertos de repositorio sobre Prisma. Reciben el cliente de la transacción y el `userId` de la sesión (aislamiento, [[ADR-05 - Aislamiento por usuario]]). Nunca abren transacciones: eso lo hace el [[API - Unit of Work y aislamiento]].

| Archivo | Líneas | Descripción (comentario del código) | Exporta |
|---|---|---|---|
| `account.repository.ts` → [[Entidad - Account]] | 176 | The `SET` assignments of the fields present in the patch. | `createAccountRepository` |
| `budget-period.repository.ts` → [[Entidad - BudgetPeriod]] | 298 | The `SET` assignments of the fields present in the patch. | `createBudgetPeriodRepository` |
| `budget.repository.ts` → [[Entidad - Budget]] | 242 | The `SET` assignments of the fields present in the patch. | `createBudgetRepository` |
| `category.repository.ts` → [[Entidad - Category]] | 220 | `true` when the category hangs from a parent of the same status. | `createCategoryRepository` |
| `currency.repository.ts` → [[Entidad - Currency]] | 76 | Prisma implementation over `currency`, always filtered by the user of the transaction (RN-09). | `createCurrencyRepository` |
| `dashboard.repository.ts` | 162 | Expense of one day and category, in the base currency, as decimal text. | `ExpenseRow`, `DashboardExpenseReader`, `createDashboardExpenseReader`, `createDashboardRepository` |
| `debt-payment.repository.ts` → [[Entidad - DebtPayment]] | 97 | Prisma implementation over `debt_payment`, always filtered by the user of the transaction (RN-09). | `createDebtPaymentRepository` |
| `debt.repository.ts` → [[Entidad - Debt]] | 164 | The `SET` assignments of the fields present in the patch. | `createDebtRepository` |
| `email-link.repository.ts` → [[Entidad - EmailLink]] | 74 | Prisma implementation of the email links of plan §4.1.3, bound to the transaction `tx`. | `createEmailLinkRepository` |
| `email-outbox.repository.ts` → [[Entidad - EmailOutbox]] | 67 | Prisma implementation of the email outbox of plan §3.3, bound to the transaction `tx`. | `createEmailOutboxRepository` |
| `email-send-log.repository.ts` → [[Entidad - EmailSendLog]] | 21 | Prisma implementation of the send limits log of plan §3.3, bound to the transaction `tx`. | `createEmailSendLogRepository` |
| `export.repository.ts` | 512 | An instant column in ISO 8601 UTC; `column` is always a constant of this file. | `createExportRepository` |
| `favorite-category.repository.ts` → [[Entidad - FavoriteCategory]] | 21 | Prisma implementation of the favorite categories, bound to the transaction `tx`. | `createFavoriteCategoryRepository` |
| `goal-allocation.repository.ts` | 96 | Prisma implementation over `goal_allocation_event`, filtered by the user of the transaction (RN-09). | `createGoalAllocationRepository` |
| `goal.repository.ts` → [[Entidad - Goal]] | 143 | The `SET` assignments of the fields present in the patch. | `createGoalRepository` |
| `ledger.repository.ts` → [[Entidad - LedgerTransaction]] | 491 | `created_at` in UTC with its microseconds, so the cursor keeps the exact moment. | `createLedgerRepository` |
| `login-throttle.repository.ts` → [[Entidad - LoginThrottle]] | 36 | Prisma implementation of the login throttle of plan §4.1.3, bound to the transaction `tx`. | `createLoginThrottleRepository` |
| `market-rate.repository.ts` → [[Entidad - MarketRate]] | 84 | Prisma implementation over `market_rate`, a global table (ADR-12). | `createMarketRateRepository` |
| `notification-preference.repository.ts` → [[Entidad - NotificationPreference]] | 48 | Prisma implementation of the `notification_preference` rows of plan §3.7, bound to the transaction `tx`. | `createNotificationPreferenceRepository` |
| `notification.repository.ts` → [[Entidad - Notification]] | 44 | Prisma implementation of the `notification` rows of plan §3.7, bound to the transaction `tx`. | `createNotificationRepository` |
| `recurring-occurrence.repository.ts` → [[Entidad - RecurringOccurrence]] | 76 | Prisma implementation over `recurring_occurrence`, always filtered by the user of the transaction (RN-09). | `createRecurringOccurrenceRepository` |
| `recurring-rule.repository.ts` → [[Entidad - RecurringRule]] | 224 | The `weekday`, `day_of_month` and `month` columns of a frequency. | `createRecurringRuleRepository` |
| `shortcut.repository.ts` → [[Entidad - Shortcut]] | 138 | The `SET` assignments of the fields present in the patch. | `createShortcutRepository` |
| `signup-ticket.repository.ts` → [[Entidad - SignupTicket]] | 39 | Prisma implementation of the registration tickets of plan §4.1.2, bound to the transaction `tx`. | `createSignupTicketRepository` |
| `undo-action.repository.ts` → [[Entidad - UndoAction]] | 39 | Prisma implementation over `undo_action`, always filtered by the user of the transaction (RN-09). | `createUndoActionRepository` |
| `user-fx-event.repository.ts` → [[Entidad - UserFxEvent]] | 49 | Prisma implementation over `user_fx_event`, always filtered by the user of the transaction (RN-09). | `createUserFxEventRepository` |
| `user-settings.repository.ts` → [[Entidad - UserSettings]] | 149 | Prisma implementation of the general settings, bound to the transaction `tx`. | `createUserSettingsRepository` |
| `user.repository.ts` | 134 | Prisma implementation of the initial rows of a new user, bound to the transaction `tx`. | `createUserRepository` |

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-12 - Datos de mercado globales]]
- **Spec / Plan / Constitución:** [[Plan 3.3 Cuenta de usuario y seguridad (M1)]] · [[Plan 3.7 Avisos e infraestructura (M15)]] · [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - GoalAllocationEvent]]

