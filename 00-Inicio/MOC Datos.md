---
tipo: "moc"
tags:
  - "moc"
actualizado: "2026-10-30"
---

# 🗄️ Datos (packages/db)

Esquema Prisma sobre PostgreSQL: entidades, enums, migraciones SQL y seeds.

↑ [[Inicio]]

## (raíz)

- [[Enums de Prisma]]
- [[Modelo de datos]]
- [[Seeds y scripts de base de datos]]

## Entidades

- [[Entidad - Account]]
- [[Entidad - AuthAccount]]
- [[Entidad - AuthSession]]
- [[Entidad - AuthUser]]
- [[Entidad - AuthVerification]]
- [[Entidad - Budget]]
- [[Entidad - BudgetLateAdjustment]]
- [[Entidad - BudgetPeriod]]
- [[Entidad - BudgetThresholdHit]]
- [[Entidad - Category]]
- [[Entidad - Currency]]
- [[Entidad - Debt]]
- [[Entidad - DebtPayment]]
- [[Entidad - EmailLink]]
- [[Entidad - EmailOutbox]]
- [[Entidad - EmailSendLog]]
- [[Entidad - FavoriteCategory]]
- [[Entidad - Goal]]
- [[Entidad - GoalAllocationEvent]]
- [[Entidad - JobRun]]
- [[Entidad - LedgerEntry]]
- [[Entidad - LedgerTransaction]]
- [[Entidad - LoginThrottle]]
- [[Entidad - MarketRate]]
- [[Entidad - Notification]]
- [[Entidad - NotificationPreference]]
- [[Entidad - RecurringOccurrence]]
- [[Entidad - RecurringRule]]
- [[Entidad - Shortcut]]
- [[Entidad - SignupTicket]]
- [[Entidad - UndoAction]]
- [[Entidad - UserFxEvent]]
- [[Entidad - UserSettings]]

## Migraciones

- [[Migración 0001_base]]
- [[Migración 0002_auth]]
- [[Migración 0003_fx_settings]]
- [[Migración 0004_account]]
- [[Migración 0005_category]]
- [[Migración 0006_ledger]]
- [[Migración 0007_budgets]]
- [[Migración 0008_goals_debts]]
- [[Migración 0009_recurring_notifications]]
- [[Migración 0010_deferred_fks]]
- [[Migración 0011_job_run_lease]]
- [[Migración 0012_remove_login_alert]]
- [[Migración 0013_signup_ticket]]

## Plan

- [[Plan 3. Esquema de Datos y Persistencia Global]]
- [[Plan 3.1 Convenciones]]
- [[Plan 3.2 Tipos enumerados]]
- [[Plan 3.3 Cuenta de usuario y seguridad (M1)]]
- [[Plan 3.4 Ajustes y tipo de cambio (M3, M9, M10)]]
- [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]]
- [[Plan 3.6 Planificación (M11 a M14)]]
- [[Plan 3.7 Avisos e infraestructura (M15)]]
- [[Plan 3.8 Integridad y cascadas]]
- [[Plan 3.9 Seguridad a nivel de datos]]


