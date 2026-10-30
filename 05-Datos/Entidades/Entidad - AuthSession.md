---
tipo: "entidad"
tabla: "auth_session"
modulo: "M1"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# AuthSession → tabla `auth_session`

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Creada en:** [[Migración 0002_auth]]
- **Relaciones:** [[Entidad - AuthUser]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `token` | `token` | `String` | @unique |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `expiresAt` | `expires_at` | `DateTime` | @db.Timestamptz(6) |  |
| `lastActivityAt` | `last_activity_at` | `DateTime` | @db.Timestamptz(6) |  |
| `ipAddress` | `ip_address` | `String?` |  |  |
| `userAgent` | `user_agent` | `String?` |  |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |

## Índices y restricciones (Prisma)

- `@@index([userId])`
- `@@map("auth_session")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model AuthSession {
>   id             String   @id @db.Uuid
>   token          String   @unique
>   userId         String   @map("user_id") @db.Uuid
>   expiresAt      DateTime @map("expires_at") @db.Timestamptz(6)
>   lastActivityAt DateTime @map("last_activity_at") @db.Timestamptz(6)
>   ipAddress      String?  @map("ip_address")
>   userAgent      String?  @map("user_agent")
>   createdAt      DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt      DateTime @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
> 
>   @@index([userId])
>   @@map("auth_session")
> }
> ```
