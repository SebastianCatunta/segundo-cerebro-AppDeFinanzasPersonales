---
tipo: "entidad"
tabla: "goal_allocation_event"
modulo: "M12"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M12"
actualizado: "2026-10-30"
---

# GoalAllocationEvent → tabla `goal_allocation_event`

- **Módulo:** [[M12 - Metas de ahorro]]
- **Creada en:** [[Migración 0008_goals_debts]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Goal]], [[Entidad - Account]]
- **Enums:** [[Enums de Prisma|AllocationOrigin]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `goalId` | `goal_id` | `String` | @db.Uuid |  |
| `accountId` | `account_id` | `String` | @db.Uuid |  |
| `amount` | `amount` | `Decimal` | @db.Decimal(14, 2) |  |
| `origin` | `origin` | `AllocationOrigin` |  |  |
| `relatedTransactionId` | `related_transaction_id` | `String?` | @db.Uuid |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `goal` | [[Entidad - Goal]] `Goal` | @relation(fields: [userId, goalId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction) |
| `account` | [[Entidad - Account]] `Account` | @relation(fields: [userId, accountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |

## Índices y restricciones (Prisma)

- `@@index([userId, accountId])`
- `@@index([goalId, createdAt])`
- `@@map("goal_allocation_event")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model GoalAllocationEvent {
>   id                   String           @id @db.Uuid
>   userId               String           @map("user_id") @db.Uuid
>   goalId               String           @map("goal_id") @db.Uuid
>   accountId            String           @map("account_id") @db.Uuid
>   amount               Decimal          @db.Decimal(14, 2)
>   origin               AllocationOrigin
>   relatedTransactionId String?          @map("related_transaction_id") @db.Uuid
>   createdAt            DateTime         @default(now()) @map("created_at") @db.Timestamptz(6)
> 
>   user    AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
>   goal    Goal     @relation(fields: [userId, goalId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction)
>   account Account  @relation(fields: [userId, accountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
> 
>   @@index([userId, accountId])
>   @@index([goalId, createdAt])
>   @@map("goal_allocation_event")
> }
> ```
