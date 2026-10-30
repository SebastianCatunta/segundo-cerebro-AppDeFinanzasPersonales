---
tipo: "entidad"
tabla: "recurring_occurrence"
modulo: "M14"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M14"
actualizado: "2026-10-30"
---

# RecurringOccurrence → tabla `recurring_occurrence`

- **Módulo:** [[M14 - Recurrentes]]
- **Creada en:** [[Migración 0009_recurring_notifications]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - RecurringRule]], [[Entidad - LedgerTransaction]]
- **Enums:** [[Enums de Prisma|OccurrenceStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `ruleId` | `rule_id` | `String` | @db.Uuid |  |
| `scheduledDate` | `scheduled_date` | `DateTime` | @db.Date |  |
| `status` | `status` | `OccurrenceStatus` |  |  |
| `transactionId` | `transaction_id` | `String?` | @db.Uuid |  |
| `pendingSince` | `pending_since` | `DateTime?` | @db.Timestamptz(6) |  |
| `decidedAt` | `decided_at` | `DateTime?` | @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `rule` | [[Entidad - RecurringRule]] `RecurringRule` | @relation(fields: [ruleId], references: [id], onDelete: Cascade) |
| `transaction` | [[Entidad - LedgerTransaction]] `LedgerTransaction?` | @relation(fields: [transactionId], references: [id], onDelete: SetNull) |

## Índices y restricciones (Prisma)

- `@@unique([ruleId, scheduledDate])`
- `@@index([userId, status, pendingSince])`
- `@@map("recurring_occurrence")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model RecurringOccurrence {
>   id            String           @id @db.Uuid
>   userId        String           @map("user_id") @db.Uuid
>   ruleId        String           @map("rule_id") @db.Uuid
>   scheduledDate DateTime         @map("scheduled_date") @db.Date
>   status        OccurrenceStatus
>   transactionId String?          @map("transaction_id") @db.Uuid
>   pendingSince  DateTime?        @map("pending_since") @db.Timestamptz(6)
>   decidedAt     DateTime?        @map("decided_at") @db.Timestamptz(6)
> 
>   user        AuthUser           @relation(fields: [userId], references: [id], onDelete: Cascade)
>   rule        RecurringRule      @relation(fields: [ruleId], references: [id], onDelete: Cascade)
>   transaction LedgerTransaction? @relation(fields: [transactionId], references: [id], onDelete: SetNull)
> 
>   // At most one occurrence per rule and date (RF-M14-12).
>   @@unique([ruleId, scheduledDate])
>   @@index([userId, status, pendingSince])
>   @@map("recurring_occurrence")
> }
> ```
