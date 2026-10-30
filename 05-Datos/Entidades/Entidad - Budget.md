---
tipo: "entidad"
tabla: "budget"
modulo: "M11"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M11"
actualizado: "2026-10-30"
---

# Budget → tabla `budget`

> [!quote] Comentario del schema
> Budgets (plan §3.6). Created by migration 0007_budgets. CHECK constraints and the partial unique indexes budget_one_per_category and budget_one_general live only in the migration SQL.

- **Módulo:** [[M11 - Presupuestos]]
- **Diseño:** plan §3.6
- **Creada en:** [[Migración 0007_budgets]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Category]], [[Entidad - Currency]], [[Entidad - BudgetPeriod]]
- **Enums:** [[Enums de Prisma|BudgetScope]], [[Enums de Prisma|BudgetDefaultAction]], [[Enums de Prisma|BudgetStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `scope` | `scope` | `BudgetScope` |  |  |
| `categoryId` | `category_id` | `String?` | @db.Uuid |  |
| `amount` | `amount` | `Decimal` | @db.Decimal(14, 2) |  |
| `currencyCode` | `currency_code` | `String` | @db.Char(3) |  |
| `startDay` | `start_day` | `Int` | @db.SmallInt |  |
| `nextStartDay` | `next_start_day` | `Int?` | @db.SmallInt |  |
| `defaultAction` | `default_action` | `BudgetDefaultAction` | @default(discard)  |  |
| `thresholds` | `thresholds` | `Int[]` | @default([80, 100]) @db.SmallInt |  |
| `status` | `status` | `BudgetStatus` | @default(active) |  |
| `frozenCarryover` | `frozen_carryover` | `Decimal?` | @db.Decimal(14, 2) |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `category` | [[Entidad - Category]] `Category?` | @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |
| `currency` | [[Entidad - Currency]] `Currency` | @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction) |
| `periods` | [[Entidad - BudgetPeriod]] `BudgetPeriod[]` |  |

## Índices y restricciones (Prisma)

- `@@unique([userId, id])`
- `@@map("budget")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model Budget {
>   id              String              @id @db.Uuid
>   userId          String              @map("user_id") @db.Uuid
>   scope           BudgetScope
>   categoryId      String?             @map("category_id") @db.Uuid
>   amount          Decimal             @db.Decimal(14, 2)
>   currencyCode    String              @map("currency_code") @db.Char(3)
>   startDay        Int                 @map("start_day") @db.SmallInt
>   nextStartDay    Int?                @map("next_start_day") @db.SmallInt
>   defaultAction   BudgetDefaultAction @default(discard) @map("default_action")
>   thresholds      Int[]               @default([80, 100]) @db.SmallInt
>   status          BudgetStatus        @default(active)
>   frozenCarryover Decimal?            @map("frozen_carryover") @db.Decimal(14, 2)
>   createdAt       DateTime            @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt       DateTime            @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user     AuthUser       @relation(fields: [userId], references: [id], onDelete: Cascade)
>   category Category?      @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
>   currency Currency       @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction)
>   periods  BudgetPeriod[]
> 
>   @@unique([userId, id])
>   @@map("budget")
> }
> ```

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 3.6 Planificación (M11 a M14)]]

