---
tipo: "entidad"
tabla: "recurring_rule"
modulo: "M14"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M14"
actualizado: "2026-10-30"
---

# RecurringRule → tabla `recurring_rule`

> [!quote] Comentario del schema
> Recurring rules (plan §3.6). Created by migration 0009_recurring_notifications. CHECK constraints live only in the migration SQL. The ledger_transaction.recurring_rule_id foreign key is created by migration 0010_deferred_fks.

- **Módulo:** [[M14 - Recurrentes]]
- **Diseño:** plan §3.6
- **Creada en:** [[Migración 0009_recurring_notifications]]
- **Modificada/referenciada en:** [[Migración 0010_deferred_fks]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Account]], [[Entidad - Category]], [[Entidad - RecurringOccurrence]], [[Entidad - LedgerTransaction]]
- **Enums:** [[Enums de Prisma|EntryKind]], [[Enums de Prisma|RuleFrequency]], [[Enums de Prisma|RuleEndType]], [[Enums de Prisma|RuleMode]], [[Enums de Prisma|RuleStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `name` | `name` | `String` | @db.VarChar(40) |  |
| `kind` | `kind` | `EntryKind` |  |  |
| `amount` | `amount` | `Decimal?` | @db.Decimal(14, 2) |  |
| `accountId` | `account_id` | `String` | @db.Uuid |  |
| `destAccountId` | `dest_account_id` | `String?` | @db.Uuid |  |
| `categoryId` | `category_id` | `String?` | @db.Uuid |  |
| `note` | `note` | `String?` | @db.VarChar(140) |  |
| `frequency` | `frequency` | `RuleFrequency` |  |  |
| `weekday` | `weekday` | `Int?` | @db.SmallInt |  |
| `dayOfMonth` | `day_of_month` | `Int?` | @db.SmallInt |  |
| `month` | `month` | `Int?` | @db.SmallInt |  |
| `startDate` | `start_date` | `DateTime` | @db.Date |  |
| `endType` | `end_type` | `RuleEndType` | @default(none)  |  |
| `endDate` | `end_date` | `DateTime?` | @db.Date |  |
| `endCount` | `end_count` | `Int?` | @db.SmallInt |  |
| `mode` | `mode` | `RuleMode` |  |  |
| `status` | `status` | `RuleStatus` | @default(active) |  |
| `pausedAt` | `paused_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `generatedCount` | `generated_count` | `Int` | @default(0)  |  |
| `lastGeneratedDate` | `last_generated_date` | `DateTime?` | @db.Date |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `account` | [[Entidad - Account]] `Account` | @relation("RecurringRuleAccount", fields: [userId, accountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |
| `destAccount` | [[Entidad - Account]] `Account?` | @relation("RecurringRuleDestAccount", fields: [userId, destAccountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |
| `category` | [[Entidad - Category]] `Category?` | @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |
| `occurrences` | [[Entidad - RecurringOccurrence]] `RecurringOccurrence[]` |  |
| `transactions` | [[Entidad - LedgerTransaction]] `LedgerTransaction[]` |  |

## Índices y restricciones (Prisma)

- `@@unique([userId, id])`
- `@@index([userId, status])`
- `@@map("recurring_rule")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model RecurringRule {
>   id                String        @id @db.Uuid
>   userId            String        @map("user_id") @db.Uuid
>   name              String        @db.VarChar(40)
>   kind              EntryKind
>   amount            Decimal?      @db.Decimal(14, 2)
>   accountId         String        @map("account_id") @db.Uuid
>   destAccountId     String?       @map("dest_account_id") @db.Uuid
>   categoryId        String?       @map("category_id") @db.Uuid
>   note              String?       @db.VarChar(140)
>   frequency         RuleFrequency
>   weekday           Int?          @db.SmallInt
>   dayOfMonth        Int?          @map("day_of_month") @db.SmallInt
>   month             Int?          @db.SmallInt
>   startDate         DateTime      @map("start_date") @db.Date
>   endType           RuleEndType   @default(none) @map("end_type")
>   endDate           DateTime?     @map("end_date") @db.Date
>   endCount          Int?          @map("end_count") @db.SmallInt
>   mode              RuleMode
>   status            RuleStatus    @default(active)
>   pausedAt          DateTime?     @map("paused_at") @db.Timestamptz(6)
>   generatedCount    Int           @default(0) @map("generated_count")
>   lastGeneratedDate DateTime?     @map("last_generated_date") @db.Date
>   createdAt         DateTime      @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt         DateTime      @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user         AuthUser              @relation(fields: [userId], references: [id], onDelete: Cascade)
>   account      Account               @relation("RecurringRuleAccount", fields: [userId, accountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
>   destAccount  Account?              @relation("RecurringRuleDestAccount", fields: [userId, destAccountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
>   category     Category?             @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
>   occurrences  RecurringOccurrence[]
>   transactions LedgerTransaction[]
> 
>   @@unique([userId, id])
>   @@index([userId, status])
>   @@map("recurring_rule")
> }
> ```

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 3.6 Planificación (M11 a M14)]]

