---
tipo: "backend"
fuente: "apps/api/src/application/ports"
tags:
  - "backend/aplicacion"
actualizado: "2026-10-30"
---

# Puertos de la capa de aplicación

Interfaces que la aplicación define y la infraestructura implementa (inversión de dependencias, ADR-19). `repositories.ts` reúne todos los repositorios (1.400 líneas).

| Archivo | Líneas | Descripción (comentario del código) | Exporta |
|---|---|---|---|
| `auth-gateway.ts` | 30 | A session created by the gateway: its id, its opaque token and the `Set-Cookie` header value. | `CreatedSession`, `ResolvedSession`, `AuthGateway` |
| `clock.ts` | 10 | Calendar date in the user's timezone, formatted as YYYY-MM-DD. | `Instant`, `LocalDate`, `Clock` |
| `email-gateway.ts` | 21 |  | `EmailKind`, `EmailPayload`, `SendEmailInput`, `EmailGateway` |
| `id-generator.ts` | 5 | Returns a new UUID v7. | `IdGenerator` |
| `job-runs.ts` | 17 | Runs of the tick's jobs in `job_run` (plan §4.0, plan §3.7). Each job holds a lease while it runs, so two runs never execute the same job at once and a run that dies frees it on its own. | `JobRuns` |
| `maintenance-store.ts` | 26 | Deletions of the `maintenance` job (plan §4.1.3, §3.9); each one takes its cutoff instant. | `MaintenanceStore` |
| `query-counter.ts` | 17 | What one request spent on the database: operations and milliseconds waiting for them. | `QueryCount`, `QueryCounter` |
| `rates-gateway.ts` | 31 | SOURCE_ERROR covers network errors, non-200 HTTP, JSON-RPC errors and isError results. | `RateFailure`, `RateResult`, `ParallelQuote`, `OfficialQuote`, `RatesGateway` |
| `readiness.ts` | 8 | Readiness of the API's dependencies (plan §4.2.2): `GET /api/health/ready` answers 204 when the probe passes and 503 otherwise. It never throws and never reveals why it failed. | `ReadinessProbe` |
| `repositories.ts` | 1402 | An email to leave in the outbox (plan §3.3). | `OutboxEmail`, `DueOutboxEmail`, `EmailOutboxRepository`, `EmailLinkPurpose`, `EmailLinkFailure`, `ConsumeEmailLinkResult`, `EmailLinkRepository`, `EmailLinkOwner`, `EmailSendLogRepository`, `SignupTicketRepository`, `LoginThrottleRepository`, `CategoryKind`, `SystemCategoryKey`, `NewCategory`, `DashboardBlock`, `NotificationType`, `NewNotificationPreference`, `NewUnconfirmedUser`, `UserCredential`, `UserAccount`, `UserRepository`, `UserSettingsData`, `UserSettingsChanges`, `FavoriteCategoriesChange`, `FavoriteCategoryRepository`, `UserFxSettings`, `UserFxSettingsChanges`, `OnboardingStep`, `OnboardingProgress`, `OnboardingTransition`, `UserSettingsRepository`, `Repositories`, `NotificationDecisionKind`, `NewNotification`, `NotificationRepository`, `NotificationPreferenceRepository`, `NotificationPreferenceData`, `NotificationPreferenceChange`, `ExportTable`, `ExportRepository`, `PeriodTotals`, `DashboardRepository`, `MarketRateKind`, `RateSource`, `CurrencyStatus`, `FxEventKind`, `MarketRateRow`, `MarketRateRepository`, `CurrencyRow`, `CurrencyRepository`, `UserFxEventRow`, `UserFxEventRepository`, `AccountType`, `LifecycleStatus`, `AccountRow`, `NewAccount`, `AccountPatch`, `AccountRepository`, `TransactionKind`, `TransactionOrigin`, `LedgerTransactionHeader`, `LedgerEntryInput`, `LedgerTransactionChanges`, `LedgerEntryChange`, `BalancePoint`, `LedgerListFilters`, `LedgerEntryView`, `LedgerTransactionView`, `LedgerTransactionDetail`, `DayNet`, `LedgerPage`, `LedgerTotals`, `LedgerGetOptions`, `LedgerRepository`, `CategoryRow`, `NewUserCategory`, `CategoryPatch`, `CategoryTreeNode`, `CategoryUsage`, `CategoryRepository`, `UndoKind`, `UndoAction`, `UndoActionRepository`, `ShortcutKind`, `ShortcutRow`, `ShortcutPatch`, `ShortcutRepository`, `RuleKind`, `RuleMode`, `RuleStatus`, `OccurrenceStatus`, `RecurringRuleRow`, `NewRecurringRule`, `RecurringRulePatch`, `RecurringRuleRepository`, `RecurringOccurrenceRow`, `RecurringOccurrenceRepository`, `DebtDirection`, `StoredDebtStatus`, `DebtInterestPeriod`, `DebtRow`, `NewDebt`, `DebtPatch`, `DebtRepository`, `DebtPaymentRow`, `NewDebtPayment`, `DebtPaymentRepository`, `AllocationOrigin`, `GoalRow`, `NewGoal`, `GoalPatch`, `GoalRepository`, `NewAllocationEvent`, `GoalEarmark`, `AccountEarmark`, `GoalHistoryItem`, `GoalAllocationRepository`, `BudgetScope`, `BudgetDefaultAction`, `BudgetStatus`, `BudgetPeriodStatus`, `BudgetRow`, `NewBudget`, `BudgetPatch`, `BudgetRepository`, `PendingClosePeriod`, `BudgetPeriodRow`, `NewBudgetPeriod`, `BudgetPeriodPatch`, `NewLateAdjustment`, `LateAdjustmentRow`, `ClosedBudgetPeriod`, `PeriodDecision`, `BudgetPeriodRepository` |
| `unit-of-work.ts` | 20 | User the run is scoped to: the repositories only see that user's rows (RNF-14). A run that writes also takes that user's exclusive advisory lock, so two writes of one user queue (RNF-10). | `UnitOfWorkOptions`, `UnitOfWork` |

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-19 - Backend en capas]]
- **Requerimientos no funcionales:** [[Spec 3.3 Concurrencia]] · [[Spec 3.5 Privacidad y seguridad]]
- **Spec / Plan / Constitución:** [[Plan 3.3 Cuenta de usuario y seguridad (M1)]] · [[Plan 3.7 Avisos e infraestructura (M15)]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]]
- **Entidades:** [[Entidad - JobRun]]

