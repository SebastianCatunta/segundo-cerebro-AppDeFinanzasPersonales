---
tipo: "entidad"
tabla: "market_rate"
modulo: "M3"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# MarketRate → tabla `market_rate`

- **Módulo:** [[M3 - Monedas y tipo de cambio]]
- **Creada en:** [[Migración 0003_fx_settings]]
- **Relaciones:** —
- **Enums:** [[Enums de Prisma|MarketRateKind]], [[Enums de Prisma|RateSource]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `kind` | `kind` | `MarketRateKind` |  |  |
| `rateDate` | `rate_date` | `DateTime` | @db.Date |  |
| `value` | `value` | `Decimal` | @db.Decimal(14, 2) |  |
| `observedAt` | `observed_at` | `DateTime` | @db.Timestamptz(6) |  |
| `source` | `source` | `RateSource` |  |  |

## Índices y restricciones (Prisma)

- `@@id([kind, rateDate])`
- `@@map("market_rate")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model MarketRate {
>   kind       MarketRateKind
>   rateDate   DateTime       @map("rate_date") @db.Date
>   value      Decimal        @db.Decimal(14, 2)
>   observedAt DateTime       @map("observed_at") @db.Timestamptz(6)
>   source     RateSource
> 
>   @@id([kind, rateDate])
>   @@map("market_rate")
> }
> ```
