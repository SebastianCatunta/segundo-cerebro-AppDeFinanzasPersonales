---
tipo: "entidad"
tabla: "budget_late_adjustment"
modulo: "M11"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M11"
actualizado: "2026-10-30"
---

# BudgetLateAdjustment → tabla `budget_late_adjustment`

- **Módulo:** [[M11 - Presupuestos]]
- **Creada en:** [[Migración 0007_budgets]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - BudgetPeriod]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `periodId` | `period_id` | `String` | @db.Uuid | The period in progress. |
| `sourcePeriodId` | `source_period_id` | `String` | @db.Uuid | The closed period the adjustment comes from. |
| `amount` | `amount` | `Decimal` | @db.Decimal(14, 2) |  |
| `voidedAt` | `voided_at` | `DateTime?` | @db.Timestamptz(6) | Set by "Reiniciar arrastre". |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `period` | [[Entidad - BudgetPeriod]] `BudgetPeriod` | @relation("AdjustmentPeriod", fields: [periodId], references: [id], onDelete: Cascade) |
| `sourcePeriod` | [[Entidad - BudgetPeriod]] `BudgetPeriod` | @relation("AdjustmentSourcePeriod", fields: [sourcePeriodId], references: [id], onDelete: Cascade) |

## Índices y restricciones (Prisma)

- `@@map("budget_late_adjustment")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model BudgetLateAdjustment {
>   id             String    @id @db.Uuid
>   userId         String    @map("user_id") @db.Uuid
>   /// The period in progress.
>   periodId       String    @map("period_id") @db.Uuid
>   /// The closed period the adjustment comes from.
>   sourcePeriodId String    @map("source_period_id") @db.Uuid
>   amount         Decimal   @db.Decimal(14, 2)
>   /// Set by "Reiniciar arrastre".
>   voidedAt       DateTime? @map("voided_at") @db.Timestamptz(6)
>   createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
> 
>   user         AuthUser     @relation(fields: [userId], references: [id], onDelete: Cascade)
>   period       BudgetPeriod @relation("AdjustmentPeriod", fields: [periodId], references: [id], onDelete: Cascade)
>   sourcePeriod BudgetPeriod @relation("AdjustmentSourcePeriod", fields: [sourcePeriodId], references: [id], onDelete: Cascade)
> 
>   @@map("budget_late_adjustment")
> }
> ```
