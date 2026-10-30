---
tipo: "entidad"
tabla: "email_link"
modulo: "M1"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# EmailLink → tabla `email_link`

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Creada en:** [[Migración 0002_auth]]
- **Relaciones:** [[Entidad - AuthUser]]
- **Enums:** [[Enums de Prisma|EmailLinkPurpose]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `purpose` | `purpose` | `EmailLinkPurpose` |  |  |
| `tokenHash` | `token_hash` | `String` | @unique @db.Char(64) |  |
| `expiresAt` | `expires_at` | `DateTime` | @db.Timestamptz(6) |  |
| `usedAt` | `used_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `invalidatedAt` | `invalidated_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |

## Índices y restricciones (Prisma)

- `@@map("email_link")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model EmailLink {
>   id            String           @id @db.Uuid
>   userId        String           @map("user_id") @db.Uuid
>   purpose       EmailLinkPurpose
>   tokenHash     String           @unique @map("token_hash") @db.Char(64)
>   expiresAt     DateTime         @map("expires_at") @db.Timestamptz(6)
>   usedAt        DateTime?        @map("used_at") @db.Timestamptz(6)
>   invalidatedAt DateTime?        @map("invalidated_at") @db.Timestamptz(6)
>   createdAt     DateTime         @default(now()) @map("created_at") @db.Timestamptz(6)
> 
>   user AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
> 
>   @@map("email_link")
> }
> ```
