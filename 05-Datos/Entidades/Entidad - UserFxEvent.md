---
tipo: "entidad"
tabla: "user_fx_event"
modulo: "M3"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# UserFxEvent → tabla `user_fx_event`

- **Módulo:** [[M3 - Monedas y tipo de cambio]]
- **Creada en:** [[Migración 0003_fx_settings]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Currency]]
- **Enums:** [[Enums de Prisma|FxEventKind]], [[Enums de Prisma|MarketRateKind]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `kind` | `kind` | `FxEventKind` |  |  |
| `currencyCode` | `currency_code` | `String?` | @db.Char(3) |  |
| `reference` | `reference` | `MarketRateKind?` |  |  |
| `value` | `value` | `Decimal?` | @db.Decimal(14, 2) |  |
| `effectiveAt` | `effective_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `currency` | [[Entidad - Currency]] `Currency?` | @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction) |

## Índices y restricciones (Prisma)

- `@@index([userId, kind, currencyCode, effectiveAt(sort: Desc)])`
- `@@map("user_fx_event")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model UserFxEvent {
>   id           String          @id @db.Uuid
>   userId       String          @map("user_id") @db.Uuid
>   kind         FxEventKind
>   currencyCode String?         @map("currency_code") @db.Char(3)
>   reference    MarketRateKind?
>   value        Decimal?        @db.Decimal(14, 2)
>   effectiveAt  DateTime        @default(now()) @map("effective_at") @db.Timestamptz(6)
> 
>   user     AuthUser  @relation(fields: [userId], references: [id], onDelete: Cascade)
>   currency Currency? @relation(fields: [userId, currencyCode], references: [userId, code], onDelete: NoAction, onUpdate: NoAction)
> 
>   @@index([userId, kind, currencyCode, effectiveAt(sort: Desc)])
>   @@map("user_fx_event")
> }
> ```
