---
tipo: "entidad"
tabla: "budget_period"
modulo: "M11"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M11"
actualizado: "2026-10-30"
---

# BudgetPeriod → tabla `budget_period`

- **Módulo:** [[M11 - Presupuestos]]
- **Creada en:** [[Migración 0007_budgets]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Budget]], [[Entidad - BudgetLateAdjustment]], [[Entidad - BudgetThresholdHit]]
- **Enums:** [[Enums de Prisma|BudgetPeriodStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `budgetId` | `budget_id` | `String` | @db.Uuid |  |
| `startDate` | `start_date` | `DateTime` | @db.Date |  |
| `endDate` | `end_date` | `DateTime` | @db.Date |  |
| `amount` | `amount` | `Decimal` | @db.Decimal(14, 2) | Copy of the budget amount in force for the period. |
| `carryoverIn` | `carryover_in` | `Decimal` | @default(0) @db.Decimal(14, 2) |  |
| `status` | `status` | `BudgetPeriodStatus` | @default(open) |  |
| `spentAtDecision` | `spent_at_decision` | `Decimal?` | @db.Decimal(14, 2) |  |
| `resultAtDecision` | `result_at_decision` | `Decimal?` | @db.Decimal(14, 2) |  |
| `decision` | `decision` | `Json?` |  |  |
| `decisionDeadline` | `decision_deadline` | `DateTime?` | @db.Timestamptz(6) |  |
| `decidedAt` | `decided_at` | `DateTime?` | @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `budget` | [[Entidad - Budget]] `Budget` | @relation(fields: [budgetId], references: [id], onDelete: Cascade) |
| `lateAdjustments` | [[Entidad - BudgetLateAdjustment]] `BudgetLateAdjustment[]` | @relation("AdjustmentPeriod") |
| `sourceAdjustments` | [[Entidad - BudgetLateAdjustment]] `BudgetLateAdjustment[]` | @relation("AdjustmentSourcePeriod") |
| `thresholdHits` | [[Entidad - BudgetThresholdHit]] `BudgetThresholdHit[]` |  |

## Índices y restricciones (Prisma)

- `@@unique([budgetId, startDate])`
- `@@index([userId, status, endDate])`
- `@@map("budget_period")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model BudgetPeriod {
>   id               String             @id @db.Uuid
>   userId           String             @map("user_id") @db.Uuid
>   budgetId         String             @map("budget_id") @db.Uuid
>   startDate        DateTime           @map("start_date") @db.Date
>   endDate          DateTime           @map("end_date") @db.Date
>   /// Copy of the budget amount in force for the period.
>   amount           Decimal            @db.Decimal(14, 2)
>   carryoverIn      Decimal            @default(0) @map("carryover_in") @db.Decimal(14, 2)
>   status           BudgetPeriodStatus @default(open)
>   spentAtDecision  Decimal?           @map("spent_at_decision") @db.Decimal(14, 2)
>   resultAtDecision Decimal?           @map("result_at_decision") @db.Decimal(14, 2)
>   decision         Json?
>   decisionDeadline DateTime?          @map("decision_deadline") @db.Timestamptz(6)
>   decidedAt        DateTime?          @map("decided_at") @db.Timestamptz(6)
> 
>   user              AuthUser               @relation(fields: [userId], references: [id], onDelete: Cascade)
>   budget            Budget                 @relation(fields: [budgetId], references: [id], onDelete: Cascade)
>   lateAdjustments   BudgetLateAdjustment[] @relation("AdjustmentPeriod")
>   sourceAdjustments BudgetLateAdjustment[] @relation("AdjustmentSourcePeriod")
>   thresholdHits     BudgetThresholdHit[]
> 
>   @@unique([budgetId, startDate])
>   @@index([userId, status, endDate])
>   @@map("budget_period")
> }
> ```
