---
tipo: "entidad"
tabla: "debt"
modulo: "M13"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M13"
actualizado: "2026-10-30"
---

# Debt → tabla `debt`

- **Módulo:** [[M13 - Deudas y préstamos]]
- **Creada en:** [[Migración 0008_goals_debts]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Currency]], [[Entidad - LedgerTransaction]], [[Entidad - DebtPayment]]
- **Enums:** [[Enums de Prisma|DebtDirection]], [[Enums de Prisma|InterestPeriod]], [[Enums de Prisma|DebtStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `direction` | `direction` | `DebtDirection` |  |  |
| `person` | `person` | `String` | @db.VarChar(40) |  |
| `personKey` | `person_key` | `String` | @db.VarChar(40) | lower(unaccent(person)). |
| `principal` | `principal` | `Decimal` | @db.Decimal(14, 2) |  |
| `currencyCode` | `currency_code` | `String` | @db.Char(3) |  |
| `startDate` | `start_date` | `DateTime` | @db.Date |  |
| `dueDate` | `due_date` | `DateTime?` | @db.Date |  |
| `note` | `note` | `String?` | @db.VarChar(140) |  |
| `interestRate` | `interest_rate` | `Decimal?` | @db.Decimal(7, 4) |  |
| `interestPeriod` | `interest_period` | `InterestPeriod?` |  |  |
| `status` | `status` | `DebtStatus` | @default(active) |  |
| `forgivenAmount` | `forgiven_amount` | `Decimal?` | @db.Decimal(14, 2) |  |
| `initialTransactionId` | `initial_transaction_id` | `String?` | @db.Uuid |  |
| `capitalOutstanding` | `capital_outstanding` | `Decimal` | @db.Decimal(14, 2) |  |
| `interestUnpaid` | `interest_unpaid` | `Decimal` | @default(0) @db.Decimal(24, 10) |  |
| `accruedThrough` | `accrued_through` | `DateTime` | @db.Date |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `currency` | [[Entidad - Currency]] `Currency` | @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction) |
| `initialTransaction` | [[Entidad - LedgerTransaction]] `LedgerTransaction?` | @relation(fields: [initialTransactionId], references: [id], onDelete: SetNull) |
| `payments` | [[Entidad - DebtPayment]] `DebtPayment[]` |  |

## Índices y restricciones (Prisma)

- `@@unique([userId, id])`
- `@@index([userId, status, dueDate])`
- `@@index([userId, personKey])`
- `@@map("debt")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model Debt {
>   id                   String          @id @db.Uuid
>   userId               String          @map("user_id") @db.Uuid
>   direction            DebtDirection
>   person               String          @db.VarChar(40)
>   /// lower(unaccent(person)).
>   personKey            String          @map("person_key") @db.VarChar(40)
>   principal            Decimal         @db.Decimal(14, 2)
>   currencyCode         String          @map("currency_code") @db.Char(3)
>   startDate            DateTime        @map("start_date") @db.Date
>   dueDate              DateTime?       @map("due_date") @db.Date
>   note                 String?         @db.VarChar(140)
>   interestRate         Decimal?        @map("interest_rate") @db.Decimal(7, 4)
>   interestPeriod       InterestPeriod? @map("interest_period")
>   status               DebtStatus      @default(active)
>   forgivenAmount       Decimal?        @map("forgiven_amount") @db.Decimal(14, 2)
>   initialTransactionId String?         @map("initial_transaction_id") @db.Uuid
>   capitalOutstanding   Decimal         @map("capital_outstanding") @db.Decimal(14, 2)
>   interestUnpaid       Decimal         @default(0) @map("interest_unpaid") @db.Decimal(24, 10)
>   accruedThrough       DateTime        @map("accrued_through") @db.Date
>   createdAt            DateTime        @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt            DateTime        @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user               AuthUser           @relation(fields: [userId], references: [id], onDelete: Cascade)
>   currency           Currency           @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction)
>   initialTransaction LedgerTransaction? @relation(fields: [initialTransactionId], references: [id], onDelete: SetNull)
>   payments           DebtPayment[]
> 
>   @@unique([userId, id])
>   @@index([userId, status, dueDate])
>   @@index([userId, personKey])
>   @@map("debt")
> }
> ```
