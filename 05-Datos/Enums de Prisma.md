---
tipo: "datos"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/enum"
actualizado: "2026-10-30"
---

# Enums de Prisma

Tipos enumerados de PostgreSQL definidos en `schema.prisma` y creados por la [[Migración 0001_base]] (ver [[Plan 3.2 Tipos enumerados]]).

## EmailLinkPurpose (`email_link_purpose`)

- **Valores:** `confirmEmail`, `resetPassword`
- **Usado por:** [[Entidad - EmailLink]]

## EmailKind (`email_kind`)

- **Valores:** `confirm`, `registerAttempt`, `reset`, `passwordChanged`, `accountDeleted`
- **Usado por:** [[Entidad - EmailOutbox]], [[Entidad - EmailSendLog]]

## OutboxStatus (`outbox_status`)

- **Valores:** `pending`, `sent`, `failed`
- **Usado por:** [[Entidad - EmailOutbox]]

## NumberFormat (`number_format`)

- **Valores:** `dotComma`, `commaDot`
- **Usado por:** [[Entidad - UserSettings]]

## DateFormat (`date_format`)

- **Valores:** `dmy`, `iso`, `shortText`
- **Usado por:** [[Entidad - UserSettings]]

## WeekStart (`week_start`)

- **Valores:** `monday`, `sunday`
- **Usado por:** [[Entidad - UserSettings]]

## ThemeMode (`theme_mode`)

- **Valores:** `system`, `light`, `dark`
- **Usado por:** [[Entidad - UserSettings]]

## MarketRateKind (`market_rate_kind`)

- **Valores:** `parallelBid`, `parallelAsk`, `parallelMedian`, `official`
- **Usado por:** [[Entidad - MarketRate]], [[Entidad - UserFxEvent]], [[Entidad - UserSettings]]

## RateSource (`rate_source`)

- **Valores:** `paraleloBo`, `bcb`, `seed`
- **Usado por:** [[Entidad - MarketRate]]

## CurrencyStatus (`currency_status`)

- **Valores:** `active`, `inactive`
- **Usado por:** [[Entidad - Currency]]

## FxEventKind (`fx_event_kind`)

- **Valores:** `referenceSet`, `manualUsdOn`, `manualUsdOff`, `customRate`
- **Usado por:** [[Entidad - UserFxEvent]]

## AccountType (`account_type`)

- **Valores:** `cash`, `bank`, `ewallet`, `creditCard`, `savings`, `other`
- **Usado por:** [[Entidad - Account]]

## LifecycleStatus (`lifecycle_status`)

- **Valores:** `active`, `archived`
- **Usado por:** [[Entidad - Account]], [[Entidad - Category]]

## CategoryKind (`category_kind`)

- **Valores:** `expense`, `income`
- **Usado por:** [[Entidad - FavoriteCategory]], [[Entidad - Category]]

## SystemCategoryKey (`system_category_key`)

- **Valores:** `debts`, `debtsInterest`
- **Usado por:** [[Entidad - Category]]

## TransactionKind (`transaction_kind`)

- **Valores:** `expense`, `income`, `transfer`, `adjustment`
- **Usado por:** [[Entidad - LedgerTransaction]]

## TransactionOrigin (`transaction_origin`)

- **Valores:** `manual`, `recurring`, `debtInitial`, `debtPayment`, `fee`, `goalTransfer`
- **Usado por:** [[Entidad - LedgerTransaction]]

## UndoKind (`undo_kind`)

- **Valores:** `delete`, `recategorize`, `create`
- **Usado por:** [[Entidad - UndoAction]]

## EntryKind (`entry_kind`)

- **Valores:** `expense`, `income`, `transfer`
- **Usado por:** [[Entidad - Shortcut]], [[Entidad - RecurringRule]]

## BudgetScope (`budget_scope`)

- **Valores:** `category`, `general`
- **Usado por:** [[Entidad - Budget]]

## BudgetStatus (`budget_status`)

- **Valores:** `active`, `paused`, `finalizing`, `finalized`
- **Usado por:** [[Entidad - Budget]]

## BudgetDefaultAction (`budget_default_action`)

- **Valores:** `discard`, `carry`
- **Usado por:** [[Entidad - Budget]]

## BudgetPeriodStatus (`budget_period_status`)

- **Valores:** `open`, `closedPending`, `decided`, `defaulted`
- **Usado por:** [[Entidad - BudgetPeriod]]

## AllocationOrigin (`allocation_origin`)

- **Valores:** `manual`, `budget`, `confirmedSpend`, `useAndClose`, `adjustment`
- **Usado por:** [[Entidad - GoalAllocationEvent]]

## DebtDirection (`debt_direction`)

- **Valores:** `iOwe`, `owedToMe`
- **Usado por:** [[Entidad - Debt]]

## DebtStatus (`debt_status`)

- **Valores:** `active`, `paid`, `forgiven`
- **Usado por:** [[Entidad - Debt]]

## InterestPeriod (`interest_period`)

- **Valores:** `monthly`, `yearly`
- **Usado por:** [[Entidad - Debt]]

## RuleFrequency (`rule_frequency`)

- **Valores:** `daily`, `weekly`, `monthly`, `yearly`
- **Usado por:** [[Entidad - RecurringRule]]

## RuleEndType (`rule_end_type`)

- **Valores:** `none`, `until`, `count`
- **Usado por:** [[Entidad - RecurringRule]]

## RuleMode (`rule_mode`)

- **Valores:** `auto`, `confirm`
- **Usado por:** [[Entidad - RecurringRule]]

## RuleStatus (`rule_status`)

- **Valores:** `active`, `paused`, `finished`
- **Usado por:** [[Entidad - RecurringRule]]

## OccurrenceStatus (`occurrence_status`)

- **Valores:** `pending`, `registered`, `skipped`, `omitted`
- **Usado por:** [[Entidad - RecurringOccurrence]]

## NotificationType (`notification_type`)

- **Valores:** `paymentUpcoming`, `budgetAlert`, `periodClose`, `recurringPending`, `logDay`, `goalProgress`
- **Usado por:** [[Entidad - Notification]], [[Entidad - NotificationPreference]]

## DecisionStatus (`decision_status`)

- **Valores:** `waiting`, `resolved`
- **Usado por:** [[Entidad - Notification]]
