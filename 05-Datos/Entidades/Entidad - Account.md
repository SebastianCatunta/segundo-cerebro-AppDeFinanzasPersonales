---
tipo: "entidad"
tabla: "account"
modulo: "M4"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M4"
actualizado: "2026-10-30"
---

# Account → tabla `account`

> [!quote] Comentario del schema
> Accounts (plan §3.5). Created by migration 0004_account. CHECK constraints, the partial unique index account_active_name and the account_initial_immutable trigger live only in the migration SQL.

- **Módulo:** [[M4 - Cuentas]]
- **Diseño:** plan §3.5
- **Creada en:** [[Migración 0004_account]]
- **Modificada/referenciada en:** [[Migración 0006_ledger]], [[Migración 0008_goals_debts]], [[Migración 0009_recurring_notifications]], [[Migración 0010_deferred_fks]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Currency]], [[Entidad - UserSettings]], [[Entidad - LedgerEntry]], [[Entidad - Shortcut]], [[Entidad - Goal]], [[Entidad - GoalAllocationEvent]], [[Entidad - DebtPayment]], [[Entidad - RecurringRule]]
- **Enums:** [[Enums de Prisma|AccountType]], [[Enums de Prisma|LifecycleStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `type` | `type` | `AccountType` |  |  |
| `name` | `name` | `String` | @db.VarChar(40) |  |
| `currencyCode` | `currency_code` | `String` | @db.Char(3) |  |
| `initialBalance` | `initial_balance` | `Decimal` | @default(0) @db.Decimal(14, 2) |  |
| `initialBalanceDate` | `initial_balance_date` | `DateTime` | @db.Date |  |
| `color` | `color` | `String` | @db.VarChar(16) |  |
| `icon` | `icon` | `String` | @db.VarChar(32) |  |
| `cardCutDay` | `card_cut_day` | `Int?` | @db.SmallInt |  |
| `cardPayDay` | `card_pay_day` | `Int?` | @db.SmallInt |  |
| `cardLimit` | `card_limit` | `Decimal?` | @db.Decimal(14, 2) |  |
| `status` | `status` | `LifecycleStatus` | @default(active) |  |
| `archivedAt` | `archived_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `sortOrder` | `sort_order` | `Int` |  |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `currency` | [[Entidad - Currency]] `Currency` | @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction) |
| `defaultOfSettings` | [[Entidad - UserSettings]] `UserSettings[]` |  |
| `entries` | [[Entidad - LedgerEntry]] `LedgerEntry[]` |  |
| `shortcuts` | [[Entidad - Shortcut]] `Shortcut[]` | @relation("ShortcutAccount") |
| `shortcutDestinations` | [[Entidad - Shortcut]] `Shortcut[]` | @relation("ShortcutDestAccount") |
| `dedicatedGoals` | [[Entidad - Goal]] `Goal[]` |  |
| `goalAllocations` | [[Entidad - GoalAllocationEvent]] `GoalAllocationEvent[]` |  |
| `debtPayments` | [[Entidad - DebtPayment]] `DebtPayment[]` |  |
| `recurringRules` | [[Entidad - RecurringRule]] `RecurringRule[]` | @relation("RecurringRuleAccount") |
| `recurringRuleDests` | [[Entidad - RecurringRule]] `RecurringRule[]` | @relation("RecurringRuleDestAccount") |

## Índices y restricciones (Prisma)

- `@@unique([userId, id])`
- `@@index([userId, status, sortOrder])`
- `@@map("account")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model Account {
>   id                 String          @id @db.Uuid
>   userId             String          @map("user_id") @db.Uuid
>   type               AccountType
>   name               String          @db.VarChar(40)
>   currencyCode       String          @map("currency_code") @db.Char(3)
>   initialBalance     Decimal         @default(0) @map("initial_balance") @db.Decimal(14, 2)
>   initialBalanceDate DateTime        @map("initial_balance_date") @db.Date
>   color              String          @db.VarChar(16)
>   icon               String          @db.VarChar(32)
>   cardCutDay         Int?            @map("card_cut_day") @db.SmallInt
>   cardPayDay         Int?            @map("card_pay_day") @db.SmallInt
>   cardLimit          Decimal?        @map("card_limit") @db.Decimal(14, 2)
>   status             LifecycleStatus @default(active)
>   archivedAt         DateTime?       @map("archived_at") @db.Timestamptz(6)
>   sortOrder          Int             @map("sort_order")
>   createdAt          DateTime        @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt          DateTime        @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user                 AuthUser              @relation(fields: [userId], references: [id], onDelete: Cascade)
>   currency             Currency              @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction)
>   defaultOfSettings    UserSettings[]
>   entries              LedgerEntry[]
>   shortcuts            Shortcut[]            @relation("ShortcutAccount")
>   shortcutDestinations Shortcut[]            @relation("ShortcutDestAccount")
>   dedicatedGoals       Goal[]
>   goalAllocations      GoalAllocationEvent[]
>   debtPayments         DebtPayment[]
>   recurringRules       RecurringRule[]       @relation("RecurringRuleAccount")
>   recurringRuleDests   RecurringRule[]       @relation("RecurringRuleDestAccount")
> 
>   @@unique([userId, id])
>   @@index([userId, status, sortOrder])
>   @@map("account")
> }
> ```

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]]

