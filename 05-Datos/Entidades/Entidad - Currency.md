---
tipo: "entidad"
tabla: "currency"
modulo: "M3"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# Currency → tabla `currency`

- **Módulo:** [[M3 - Monedas y tipo de cambio]]
- **Creada en:** [[Migración 0003_fx_settings]]
- **Modificada/referenciada en:** [[Migración 0004_account]], [[Migración 0007_budgets]], [[Migración 0008_goals_debts]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - UserFxEvent]], [[Entidad - UserSettings]], [[Entidad - Account]], [[Entidad - Budget]], [[Entidad - Goal]], [[Entidad - Debt]]
- **Enums:** [[Enums de Prisma|CurrencyStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `code` | `code` | `String` | @db.Char(3) |  |
| `symbol` | `symbol` | `String` | @db.VarChar(5) |  |
| `isSystem` | `is_system` | `Boolean` | @default(false)  |  |
| `status` | `status` | `CurrencyStatus` | @default(active) |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `fxEvents` | [[Entidad - UserFxEvent]] `UserFxEvent[]` |  |
| `settingsAsBase` | [[Entidad - UserSettings]] `UserSettings[]` |  |
| `accounts` | [[Entidad - Account]] `Account[]` |  |
| `budgets` | [[Entidad - Budget]] `Budget[]` |  |
| `goals` | [[Entidad - Goal]] `Goal[]` |  |
| `debts` | [[Entidad - Debt]] `Debt[]` |  |

## Índices y restricciones (Prisma)

- `@@id([userId, code])`
- `@@map("currency")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model Currency {
>   userId    String         @map("user_id") @db.Uuid
>   code      String         @db.Char(3)
>   symbol    String         @db.VarChar(5)
>   isSystem  Boolean        @default(false) @map("is_system")
>   status    CurrencyStatus @default(active)
>   createdAt DateTime       @default(now()) @map("created_at") @db.Timestamptz(6)
> 
>   user           AuthUser       @relation(fields: [userId], references: [id], onDelete: Cascade)
>   fxEvents       UserFxEvent[]
>   settingsAsBase UserSettings[]
>   accounts       Account[]
>   budgets        Budget[]
>   goals          Goal[]
>   debts          Debt[]
> 
>   @@id([userId, code])
>   @@map("currency")
> }
> ```
