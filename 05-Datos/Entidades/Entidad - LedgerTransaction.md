---
tipo: "entidad"
tabla: "ledger_transaction"
modulo: "M6"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M6"
actualizado: "2026-10-30"
---

# LedgerTransaction → tabla `ledger_transaction`

> [!quote] Comentario del schema
> Ledger, undo and shortcuts (plan §3.5, ADR-04, ADR-07, ADR-15). Created by migration 0006_ledger. CHECK constraints, the partial indexes ledger_tx_list, (user_id, category_id, date) and (deleted_at) live only in the migration SQL. The recurring_rule foreign key is created by migration 0010_deferred_fks with ON DELETE SET NULL (recurring_rule_id), which Prisma cannot express: it lives only in the SQL.

- **Módulo:** [[M6 - Transacciones]]
- **Diseño:** plan §3.5
- **Creada en:** [[Migración 0006_ledger]]
- **Modificada/referenciada en:** [[Migración 0008_goals_debts]], [[Migración 0009_recurring_notifications]], [[Migración 0010_deferred_fks]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Category]], [[Entidad - LedgerEntry]], [[Entidad - RecurringRule]], [[Entidad - Debt]], [[Entidad - DebtPayment]], [[Entidad - RecurringOccurrence]]
- **Enums:** [[Enums de Prisma|TransactionKind]], [[Enums de Prisma|TransactionOrigin]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `kind` | `kind` | `TransactionKind` |  |  |
| `date` | `date` | `DateTime` | @db.Date |  |
| `note` | `note` | `String?` | @db.VarChar(140) |  |
| `categoryId` | `category_id` | `String?` | @db.Uuid |  |
| `origin` | `origin` | `TransactionOrigin` | @default(manual) |  |
| `originId` | `origin_id` | `String?` | @db.Uuid |  |
| `parentTransactionId` | `parent_transaction_id` | `String?` | @db.Uuid |  |
| `recurringRuleId` | `recurring_rule_id` | `String?` | @db.Uuid |  |
| `recurringLabel` | `recurring_label` | `String?` | @db.VarChar(40) |  |
| `rateCurBob` | `rate_cur_bob` | `Decimal` | @db.Decimal(14, 2) |  |
| `rateUsdBob` | `rate_usd_bob` | `Decimal?` | @db.Decimal(14, 2) |  |
| `declaredRate` | `declared_rate` | `Decimal?` | @db.Decimal(14, 2) |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `deletedAt` | `deleted_at` | `DateTime?` | @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `category` | [[Entidad - Category]] `Category?` | @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |
| `parent` | [[Entidad - LedgerTransaction]] `LedgerTransaction?` | @relation("TransactionFee", fields: [parentTransactionId], references: [id], onDelete: Cascade) |
| `fees` | [[Entidad - LedgerTransaction]] `LedgerTransaction[]` | @relation("TransactionFee") |
| `entries` | [[Entidad - LedgerEntry]] `LedgerEntry[]` |  |
| `recurringRule` | [[Entidad - RecurringRule]] `RecurringRule?` | @relation(fields: [userId, recurringRuleId], references: [userId, id], onDelete: NoAction, onUpdate: NoAction) |
| `initialOfDebts` | [[Entidad - Debt]] `Debt[]` |  |
| `debtCapitalPayments` | [[Entidad - DebtPayment]] `DebtPayment[]` | @relation("DebtPaymentCapital") |
| `debtInterestPayments` | [[Entidad - DebtPayment]] `DebtPayment[]` | @relation("DebtPaymentInterest") |
| `occurrences` | [[Entidad - RecurringOccurrence]] `RecurringOccurrence[]` |  |

## Índices y restricciones (Prisma)

- `@@unique([userId, id])`
- `@@map("ledger_transaction")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model LedgerTransaction {
>   id                  String            @id @db.Uuid
>   userId              String            @map("user_id") @db.Uuid
>   kind                TransactionKind
>   date                DateTime          @db.Date
>   note                String?           @db.VarChar(140)
>   categoryId          String?           @map("category_id") @db.Uuid
>   origin              TransactionOrigin @default(manual)
>   originId            String?           @map("origin_id") @db.Uuid
>   parentTransactionId String?           @map("parent_transaction_id") @db.Uuid
>   recurringRuleId     String?           @map("recurring_rule_id") @db.Uuid
>   recurringLabel      String?           @map("recurring_label") @db.VarChar(40)
>   rateCurBob          Decimal           @map("rate_cur_bob") @db.Decimal(14, 2)
>   rateUsdBob          Decimal?          @map("rate_usd_bob") @db.Decimal(14, 2)
>   declaredRate        Decimal?          @map("declared_rate") @db.Decimal(14, 2)
>   createdAt           DateTime          @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt           DateTime          @default(now()) @map("updated_at") @db.Timestamptz(6)
>   deletedAt           DateTime?         @map("deleted_at") @db.Timestamptz(6)
> 
>   user          AuthUser            @relation(fields: [userId], references: [id], onDelete: Cascade)
>   category      Category?           @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
>   parent        LedgerTransaction?  @relation("TransactionFee", fields: [parentTransactionId], references: [id], onDelete: Cascade)
>   fees          LedgerTransaction[] @relation("TransactionFee")
>   entries       LedgerEntry[]
>   recurringRule RecurringRule?      @relation(fields: [userId, recurringRuleId], references: [userId, id], onDelete: NoAction, onUpdate: NoAction)
> 
>   initialOfDebts       Debt[]
>   debtCapitalPayments  DebtPayment[]         @relation("DebtPaymentCapital")
>   debtInterestPayments DebtPayment[]         @relation("DebtPaymentInterest")
>   occurrences          RecurringOccurrence[]
> 
>   @@unique([userId, id])
>   @@map("ledger_transaction")
> }
> ```

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-04 - Libro contable de doble asiento]] · [[ADR-07 - Deshacer con token]] · [[ADR-15 - Nombres de tablas del libro]]
- **Spec / Plan / Constitución:** [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]]

