---
tipo: "entidad"
tabla: "login_throttle"
modulo: "M1"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# LoginThrottle → tabla `login_throttle`

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Creada en:** [[Migración 0002_auth]]
- **Modificada/referenciada en:** [[Migración 0012_remove_login_alert]]
- **Relaciones:** —

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `emailHmac` | `email_hmac` | `String` | @id @db.Char(64) |  |
| `consecutiveFailures` | `consecutive_failures` | `Int` | @default(0)  |  |
| `lastFailureAt` | `last_failure_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `lockedUntil` | `locked_until` | `DateTime?` | @db.Timestamptz(6) |  |

## Índices y restricciones (Prisma)

- `@@map("login_throttle")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model LoginThrottle {
>   emailHmac           String    @id @map("email_hmac") @db.Char(64)
>   consecutiveFailures Int       @default(0) @map("consecutive_failures")
>   lastFailureAt       DateTime? @map("last_failure_at") @db.Timestamptz(6)
>   lockedUntil         DateTime? @map("locked_until") @db.Timestamptz(6)
> 
>   @@map("login_throttle")
> }
> ```
