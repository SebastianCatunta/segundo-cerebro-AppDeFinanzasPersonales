---
tipo: "entidad"
tabla: "goal"
modulo: "M12"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M12"
actualizado: "2026-10-30"
---

# Goal → tabla `goal`

> [!quote] Comentario del schema
> Goals and debts (plan §3.6, ADR-14). Created by migration 0008_goals_debts. CHECK constraints live only in the migration SQL.

- **Módulo:** [[M12 - Metas de ahorro]]
- **Diseño:** plan §3.6
- **Creada en:** [[Migración 0008_goals_debts]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Currency]], [[Entidad - Account]], [[Entidad - GoalAllocationEvent]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `name` | `name` | `String` | @db.VarChar(40) |  |
| `target` | `target` | `Decimal` | @db.Decimal(14, 2) |  |
| `currencyCode` | `currency_code` | `String` | @db.Char(3) |  |
| `targetDate` | `target_date` | `DateTime?` | @db.Date |  |
| `icon` | `icon` | `String` | @db.VarChar(32) |  |
| `color` | `color` | `String` | @db.VarChar(16) |  |
| `dedicatedAccountId` | `dedicated_account_id` | `String?` | @unique @db.Uuid | A dedicated account belongs to a single goal (RF-M12-03). |
| `celebratedAt` | `celebrated_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `archivedAt` | `archived_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `currency` | [[Entidad - Currency]] `Currency` | @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction) |
| `dedicatedAccount` | [[Entidad - Account]] `Account?` | @relation(fields: [userId, dedicatedAccountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |
| `allocations` | [[Entidad - GoalAllocationEvent]] `GoalAllocationEvent[]` |  |

## Índices y restricciones (Prisma)

- `@@unique([userId, id])`
- `@@map("goal")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model Goal {
>   id                 String    @id @db.Uuid
>   userId             String    @map("user_id") @db.Uuid
>   name               String    @db.VarChar(40)
>   target             Decimal   @db.Decimal(14, 2)
>   currencyCode       String    @map("currency_code") @db.Char(3)
>   targetDate         DateTime? @map("target_date") @db.Date
>   icon               String    @db.VarChar(32)
>   color              String    @db.VarChar(16)
>   /// A dedicated account belongs to a single goal (RF-M12-03).
>   dedicatedAccountId String?   @unique @map("dedicated_account_id") @db.Uuid
>   celebratedAt       DateTime? @map("celebrated_at") @db.Timestamptz(6)
>   archivedAt         DateTime? @map("archived_at") @db.Timestamptz(6)
>   createdAt          DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt          DateTime  @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user             AuthUser              @relation(fields: [userId], references: [id], onDelete: Cascade)
>   currency         Currency              @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction)
>   dedicatedAccount Account?              @relation(fields: [userId, dedicatedAccountId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
>   allocations      GoalAllocationEvent[]
> 
>   @@unique([userId, id])
>   @@map("goal")
> }
> ```

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-14 - Interés de deudas como foto]]
- **Spec / Plan / Constitución:** [[Plan 3.6 Planificación (M11 a M14)]]

