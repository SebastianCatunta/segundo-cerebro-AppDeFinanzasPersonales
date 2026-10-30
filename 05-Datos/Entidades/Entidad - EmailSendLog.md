---
tipo: "entidad"
tabla: "email_send_log"
modulo: "M1"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# EmailSendLog → tabla `email_send_log`

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Creada en:** [[Migración 0002_auth]]
- **Modificada/referenciada en:** [[Migración 0012_remove_login_alert]]
- **Relaciones:** —
- **Enums:** [[Enums de Prisma|EmailKind]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `BigInt` | @id @default(autoincrement()) |  |
| `emailHmac` | `email_hmac` | `String` | @db.Char(64) |  |
| `kind` | `kind` | `EmailKind` |  |  |
| `sentAt` | `sent_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Índices y restricciones (Prisma)

- `@@index([emailHmac, kind, sentAt(sort: Desc)])`
- `@@map("email_send_log")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model EmailSendLog {
>   id        BigInt    @id @default(autoincrement())
>   emailHmac String    @map("email_hmac") @db.Char(64)
>   kind      EmailKind
>   sentAt    DateTime  @default(now()) @map("sent_at") @db.Timestamptz(6)
> 
>   @@index([emailHmac, kind, sentAt(sort: Desc)])
>   @@map("email_send_log")
> }
> ```
