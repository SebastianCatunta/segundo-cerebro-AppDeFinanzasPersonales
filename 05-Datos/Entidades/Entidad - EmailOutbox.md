---
tipo: "entidad"
tabla: "email_outbox"
modulo: "M1"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# EmailOutbox → tabla `email_outbox`

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Creada en:** [[Migración 0002_auth]]
- **Modificada/referenciada en:** [[Migración 0012_remove_login_alert]]
- **Relaciones:** —
- **Enums:** [[Enums de Prisma|EmailKind]], [[Enums de Prisma|OutboxStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `toAddress` | `to_address` | `String` | @db.VarChar(254) |  |
| `kind` | `kind` | `EmailKind` |  |  |
| `payload` | `payload` | `Json` |  |  |
| `status` | `status` | `OutboxStatus` | @default(pending) |  |
| `attempts` | `attempts` | `Int` | @default(0) |  |
| `nextAttemptAt` | `next_attempt_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `lastError` | `last_error` | `String?` |  |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Índices y restricciones (Prisma)

- `@@map("email_outbox")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model EmailOutbox {
>   id            String       @id @db.Uuid
>   toAddress     String       @map("to_address") @db.VarChar(254)
>   kind          EmailKind
>   payload       Json
>   status        OutboxStatus @default(pending)
>   attempts      Int          @default(0)
>   nextAttemptAt DateTime     @default(now()) @map("next_attempt_at") @db.Timestamptz(6)
>   lastError     String?      @map("last_error")
>   createdAt     DateTime     @default(now()) @map("created_at") @db.Timestamptz(6)
> 
>   @@map("email_outbox")
> }
> ```
