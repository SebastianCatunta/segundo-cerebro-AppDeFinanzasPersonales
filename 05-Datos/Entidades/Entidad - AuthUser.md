---
tipo: "entidad"
tabla: "auth_user"
modulo: "M1"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# AuthUser → tabla `auth_user`

> [!quote] Comentario del schema
> User account and security (plan §3.3). Created by migration 0002_auth. CHECK constraints and partial indexes live only in the migration SQL.

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Diseño:** plan §3.3
- **Creada en:** [[Migración 0002_auth]]
- **Modificada/referenciada en:** [[Migración 0003_fx_settings]], [[Migración 0004_account]], [[Migración 0005_category]], [[Migración 0006_ledger]], [[Migración 0007_budgets]], [[Migración 0008_goals_debts]], [[Migración 0009_recurring_notifications]], [[Migración 0013_signup_ticket]]
- **Relaciones:** [[Entidad - AuthSession]], [[Entidad - AuthAccount]], [[Entidad - EmailLink]], [[Entidad - SignupTicket]], [[Entidad - Currency]], [[Entidad - UserFxEvent]], [[Entidad - UserSettings]], [[Entidad - FavoriteCategory]], [[Entidad - Account]], [[Entidad - Category]], [[Entidad - LedgerTransaction]], [[Entidad - LedgerEntry]], [[Entidad - UndoAction]], [[Entidad - Shortcut]], [[Entidad - Budget]], [[Entidad - BudgetPeriod]], [[Entidad - BudgetLateAdjustment]], [[Entidad - Goal]], [[Entidad - GoalAllocationEvent]], [[Entidad - Debt]], [[Entidad - DebtPayment]], [[Entidad - RecurringRule]], [[Entidad - RecurringOccurrence]], [[Entidad - Notification]], [[Entidad - NotificationPreference]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `name` | `name` | `String` | @db.VarChar(60) |  |
| `email` | `email` | `String` | @unique @db.VarChar(254) |  |
| `emailVerified` | `email_verified` | `Boolean` | @default(false)  |  |
| `image` | `image` | `String?` |  |  |
| `timezone` | `timezone` | `String` | @default("America/La_Paz") @db.VarChar(64) |  |
| `locale` | `locale` | `String` | @default("es-BO") @db.VarChar(10) |  |
| `termsAcceptedAt` | `terms_accepted_at` | `DateTime` | @db.Timestamptz(6) |  |
| `registeredAt` | `registered_at` | `DateTime` | @db.Timestamptz(6) |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `sessions` | [[Entidad - AuthSession]] `AuthSession[]` |  |
| `accounts` | [[Entidad - AuthAccount]] `AuthAccount[]` |  |
| `emailLinks` | [[Entidad - EmailLink]] `EmailLink[]` |  |
| `signupTicket` | [[Entidad - SignupTicket]] `SignupTicket?` |  |
| `currencies` | [[Entidad - Currency]] `Currency[]` |  |
| `fxEvents` | [[Entidad - UserFxEvent]] `UserFxEvent[]` |  |
| `settings` | [[Entidad - UserSettings]] `UserSettings?` |  |
| `favoriteCategories` | [[Entidad - FavoriteCategory]] `FavoriteCategory[]` |  |
| `financialAccounts` | [[Entidad - Account]] `Account[]` |  |
| `categories` | [[Entidad - Category]] `Category[]` |  |
| `transactions` | [[Entidad - LedgerTransaction]] `LedgerTransaction[]` |  |
| `ledgerEntries` | [[Entidad - LedgerEntry]] `LedgerEntry[]` |  |
| `undoActions` | [[Entidad - UndoAction]] `UndoAction[]` |  |
| `shortcuts` | [[Entidad - Shortcut]] `Shortcut[]` |  |
| `budgets` | [[Entidad - Budget]] `Budget[]` |  |
| `budgetPeriods` | [[Entidad - BudgetPeriod]] `BudgetPeriod[]` |  |
| `budgetAdjustments` | [[Entidad - BudgetLateAdjustment]] `BudgetLateAdjustment[]` |  |
| `goals` | [[Entidad - Goal]] `Goal[]` |  |
| `goalAllocations` | [[Entidad - GoalAllocationEvent]] `GoalAllocationEvent[]` |  |
| `debts` | [[Entidad - Debt]] `Debt[]` |  |
| `debtPayments` | [[Entidad - DebtPayment]] `DebtPayment[]` |  |
| `recurringRules` | [[Entidad - RecurringRule]] `RecurringRule[]` |  |
| `occurrences` | [[Entidad - RecurringOccurrence]] `RecurringOccurrence[]` |  |
| `notifications` | [[Entidad - Notification]] `Notification[]` |  |
| `notificationPrefs` | [[Entidad - NotificationPreference]] `NotificationPreference[]` |  |

## Índices y restricciones (Prisma)

- `@@map("auth_user")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model AuthUser {
>   id              String   @id @db.Uuid
>   name            String   @db.VarChar(60)
>   email           String   @unique @db.VarChar(254)
>   emailVerified   Boolean  @default(false) @map("email_verified")
>   image           String?
>   timezone        String   @default("America/La_Paz") @db.VarChar(64)
>   locale          String   @default("es-BO") @db.VarChar(10)
>   termsAcceptedAt DateTime @map("terms_accepted_at") @db.Timestamptz(6)
>   registeredAt    DateTime @map("registered_at") @db.Timestamptz(6)
>   createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt       DateTime @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   sessions           AuthSession[]
>   accounts           AuthAccount[]
>   emailLinks         EmailLink[]
>   signupTicket       SignupTicket?
>   currencies         Currency[]
>   fxEvents           UserFxEvent[]
>   settings           UserSettings?
>   favoriteCategories FavoriteCategory[]
>   financialAccounts  Account[]
>   categories         Category[]
>   transactions       LedgerTransaction[]
>   ledgerEntries      LedgerEntry[]
>   undoActions        UndoAction[]
>   shortcuts          Shortcut[]
>   budgets            Budget[]
>   budgetPeriods      BudgetPeriod[]
>   budgetAdjustments  BudgetLateAdjustment[]
>   goals              Goal[]
>   goalAllocations    GoalAllocationEvent[]
>   debts              Debt[]
>   debtPayments       DebtPayment[]
>   recurringRules     RecurringRule[]
>   occurrences        RecurringOccurrence[]
>   notifications      Notification[]
>   notificationPrefs  NotificationPreference[]
> 
>   @@map("auth_user")
> }
> ```

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 3.3 Cuenta de usuario y seguridad (M1)]]

