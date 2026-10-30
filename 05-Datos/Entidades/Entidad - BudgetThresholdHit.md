---
tipo: "entidad"
tabla: "budget_threshold_hit"
modulo: "M11"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M11"
actualizado: "2026-10-30"
---

# BudgetThresholdHit → tabla `budget_threshold_hit`

- **Módulo:** [[M11 - Presupuestos]]
- **Creada en:** [[Migración 0007_budgets]]
- **Relaciones:** [[Entidad - BudgetPeriod]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `periodId` | `period_id` | `String` | @db.Uuid |  |
| `threshold` | `threshold` | `Int` | @db.SmallInt |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `period` | [[Entidad - BudgetPeriod]] `BudgetPeriod` | @relation(fields: [periodId], references: [id], onDelete: Cascade) |

## Índices y restricciones (Prisma)

- `@@id([periodId, threshold])`
- `@@map("budget_threshold_hit")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model BudgetThresholdHit {
>   periodId  String   @map("period_id") @db.Uuid
>   threshold Int      @db.SmallInt
>   createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
> 
>   period BudgetPeriod @relation(fields: [periodId], references: [id], onDelete: Cascade)
> 
>   // One notice per threshold and period (RNF-12).
>   @@id([periodId, threshold])
>   @@map("budget_threshold_hit")
> }
> ```

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]

