---
tipo: "entidad"
tabla: "user_settings"
modulo: "M9"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M9"
actualizado: "2026-10-30"
---

# UserSettings → tabla `user_settings`

- **Módulo:** [[M9 - Ajustes y personalización]]
- **Creada en:** [[Migración 0003_fx_settings]]
- **Modificada/referenciada en:** [[Migración 0010_deferred_fks]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Currency]], [[Entidad - Account]]
- **Enums:** [[Enums de Prisma|NumberFormat]], [[Enums de Prisma|DateFormat]], [[Enums de Prisma|WeekStart]], [[Enums de Prisma|ThemeMode]], [[Enums de Prisma|MarketRateKind]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `userId` | `user_id` | `String` | @id @db.Uuid |  |
| `numberFormat` | `number_format` | `NumberFormat` | @default(dotComma)  |  |
| `dateFormat` | `date_format` | `DateFormat` | @default(dmy)  |  |
| `weekStart` | `week_start` | `WeekStart` | @default(monday)  |  |
| `theme` | `theme` | `ThemeMode` | @default(system) |  |
| `sidebarCollapsed` | `sidebar_collapsed` | `Boolean` | @default(false)  |  |
| `baseCurrency` | `base_currency` | `String` | @default("BOB") @db.Char(3) |  |
| `usdReference` | `usd_reference` | `MarketRateKind` | @default(parallelMedian)  |  |
| `manualUsdValue` | `manual_usd_value` | `Decimal?` | @db.Decimal(14, 2) |  |
| `manualUsdSince` | `manual_usd_since` | `DateTime?` | @db.Timestamptz(6) |  |
| `defaultAccountId` | `default_account_id` | `String?` | @db.Uuid |  |
| `alwaysShowNote` | `always_show_note` | `Boolean` | @default(false)  |  |
| `dashboardBlocks` | `dashboard_blocks` | `Json` |  |  |
| `onboardingStep` | `onboarding_step` | `Int` | @default(1) @db.SmallInt |  |
| `onboardingCompletedAt` | `onboarding_completed_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `baseCurrencyRecord` | [[Entidad - Currency]] `Currency` | @relation(fields: [userId, baseCurrency], references: [userId, code], onDelete: NoAction, onUpdate: NoAction) |
| `defaultAccount` | [[Entidad - Account]] `Account?` | @relation(fields: [userId, defaultAccountId], references: [userId, id], onDelete: NoAction, onUpdate: NoAction) |

## Índices y restricciones (Prisma)

- `@@map("user_settings")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model UserSettings {
>   userId                String         @id @map("user_id") @db.Uuid
>   numberFormat          NumberFormat   @default(dotComma) @map("number_format")
>   dateFormat            DateFormat     @default(dmy) @map("date_format")
>   weekStart             WeekStart      @default(monday) @map("week_start")
>   theme                 ThemeMode      @default(system)
>   sidebarCollapsed      Boolean        @default(false) @map("sidebar_collapsed")
>   baseCurrency          String         @default("BOB") @map("base_currency") @db.Char(3)
>   usdReference          MarketRateKind @default(parallelMedian) @map("usd_reference")
>   manualUsdValue        Decimal?       @map("manual_usd_value") @db.Decimal(14, 2)
>   manualUsdSince        DateTime?      @map("manual_usd_since") @db.Timestamptz(6)
>   defaultAccountId      String?        @map("default_account_id") @db.Uuid
>   alwaysShowNote        Boolean        @default(false) @map("always_show_note")
>   dashboardBlocks       Json           @map("dashboard_blocks")
>   onboardingStep        Int            @default(1) @map("onboarding_step") @db.SmallInt
>   onboardingCompletedAt DateTime?      @map("onboarding_completed_at") @db.Timestamptz(6)
>   updatedAt             DateTime       @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user               AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
>   baseCurrencyRecord Currency @relation(fields: [userId, baseCurrency], references: [userId, code], onDelete: NoAction, onUpdate: NoAction)
>   defaultAccount     Account? @relation(fields: [userId, defaultAccountId], references: [userId, id], onDelete: NoAction, onUpdate: NoAction)
> 
>   @@map("user_settings")
> }
> ```
