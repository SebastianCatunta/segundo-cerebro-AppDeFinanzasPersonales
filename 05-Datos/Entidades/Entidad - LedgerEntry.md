---
tipo: "entidad"
tabla: "ledger_entry"
modulo: "M6"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M6"
actualizado: "2026-10-30"
---

# LedgerEntry → tabla `ledger_entry`

- **Módulo:** [[M6 - Transacciones]]
- **Creada en:** [[Migración 0006_ledger]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - LedgerTransaction]], [[Entidad - Account]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `transactionId` | `transaction_id` | `String` | @db.Uuid |  |
| `accountId` | `account_id` | `String` | @db.Uuid |  |
| `amount` | `amount` | `Decimal` | @db.Decimal(14, 2) | Signed amount (ADR-04). |
| `date` | `date` | `DateTime` | @db.Date | Copy of the transaction date. |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `transaction` | [[Entidad - LedgerTransaction]] `LedgerTransaction` | @relation(fields: [transactionId], references: [id], onDelete: Cascade) |
| `account` | [[Entidad - Account]] `Account` | @relation(fields: [userId, accountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |

## Índices y restricciones (Prisma)

- `@@index([userId, accountId, date], map: "ledger_entry_balance")`
- `@@index([transactionId])`
- `@@map("ledger_entry")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model LedgerEntry {
>   id            String   @id @db.Uuid
>   userId        String   @map("user_id") @db.Uuid
>   transactionId String   @map("transaction_id") @db.Uuid
>   accountId     String   @map("account_id") @db.Uuid
>   /// Signed amount (ADR-04).
>   amount        Decimal  @db.Decimal(14, 2)
>   /// Copy of the transaction date.
>   date          DateTime @db.Date
> 
>   user        AuthUser          @relation(fields: [userId], references: [id], onDelete: Cascade)
>   transaction LedgerTransaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
>   account     Account           @relation(fields: [userId, accountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
> 
>   @@index([userId, accountId, date], map: "ledger_entry_balance")
>   @@index([transactionId])
>   @@map("ledger_entry")
> }
> ```

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-04 - Libro contable de doble asiento]]

