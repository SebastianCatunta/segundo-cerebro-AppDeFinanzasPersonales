---
tipo: "entidad"
tabla: "debt_payment"
modulo: "M13"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M13"
actualizado: "2026-10-30"
---

# DebtPayment → tabla `debt_payment`

- **Módulo:** [[M13 - Deudas y préstamos]]
- **Creada en:** [[Migración 0008_goals_debts]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Debt]], [[Entidad - Account]], [[Entidad - LedgerTransaction]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `debtId` | `debt_id` | `String` | @db.Uuid |  |
| `amount` | `amount` | `Decimal` | @db.Decimal(14, 2) |  |
| `interestPart` | `interest_part` | `Decimal` | @db.Decimal(14, 2) |  |
| `capitalPart` | `capital_part` | `Decimal` | @db.Decimal(14, 2) |  |
| `date` | `date` | `DateTime` | @db.Date |  |
| `accountId` | `account_id` | `String?` | @db.Uuid |  |
| `declaredRate` | `declared_rate` | `Decimal?` | @db.Decimal(14, 2) |  |
| `accountAmount` | `account_amount` | `Decimal?` | @db.Decimal(14, 2) |  |
| `capitalTransactionId` | `capital_transaction_id` | `String?` | @db.Uuid |  |
| `interestTransactionId` | `interest_transaction_id` | `String?` | @db.Uuid |  |
| `note` | `note` | `String?` | @db.VarChar(140) |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `debt` | [[Entidad - Debt]] `Debt` | @relation(fields: [debtId], references: [id], onDelete: Cascade) |
| `account` | [[Entidad - Account]] `Account?` | @relation(fields: [userId, accountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |
| `capitalTransaction` | [[Entidad - LedgerTransaction]] `LedgerTransaction?` | @relation("DebtPaymentCapital", fields: [capitalTransactionId], references: [id], onDelete: SetNull) |
| `interestTransaction` | [[Entidad - LedgerTransaction]] `LedgerTransaction?` | @relation("DebtPaymentInterest", fields: [interestTransactionId], references: [id], onDelete: SetNull) |

## Índices y restricciones (Prisma)

- `@@index([debtId, createdAt(sort: Desc)])`
- `@@map("debt_payment")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model DebtPayment {
>   id                    String   @id @db.Uuid
>   userId                String   @map("user_id") @db.Uuid
>   debtId                String   @map("debt_id") @db.Uuid
>   amount                Decimal  @db.Decimal(14, 2)
>   interestPart          Decimal  @map("interest_part") @db.Decimal(14, 2)
>   capitalPart           Decimal  @map("capital_part") @db.Decimal(14, 2)
>   date                  DateTime @db.Date
>   accountId             String?  @map("account_id") @db.Uuid
>   declaredRate          Decimal? @map("declared_rate") @db.Decimal(14, 2)
>   accountAmount         Decimal? @map("account_amount") @db.Decimal(14, 2)
>   capitalTransactionId  String?  @map("capital_transaction_id") @db.Uuid
>   interestTransactionId String?  @map("interest_transaction_id") @db.Uuid
>   note                  String?  @db.VarChar(140)
>   createdAt             DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
> 
>   user                AuthUser           @relation(fields: [userId], references: [id], onDelete: Cascade)
>   debt                Debt               @relation(fields: [debtId], references: [id], onDelete: Cascade)
>   account             Account?           @relation(fields: [userId, accountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
>   capitalTransaction  LedgerTransaction? @relation("DebtPaymentCapital", fields: [capitalTransactionId], references: [id], onDelete: SetNull)
>   interestTransaction LedgerTransaction? @relation("DebtPaymentInterest", fields: [interestTransactionId], references: [id], onDelete: SetNull)
> 
>   @@index([debtId, createdAt(sort: Desc)])
>   @@map("debt_payment")
> }
> ```
