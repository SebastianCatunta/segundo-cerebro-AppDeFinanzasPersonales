---
tipo: "entidad"
tabla: "auth_account"
modulo: "M1"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# AuthAccount → tabla `auth_account`

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Creada en:** [[Migración 0002_auth]]
- **Relaciones:** [[Entidad - AuthUser]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `accountId` | `account_id` | `String` |  |  |
| `providerId` | `provider_id` | `String` |  |  |
| `password` | `password` | `String?` |  |  |
| `accessToken` | `access_token` | `String?` |  |  |
| `refreshToken` | `refresh_token` | `String?` |  |  |
| `idToken` | `id_token` | `String?` |  |  |
| `accessTokenExpiresAt` | `access_token_expires_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `refreshTokenExpiresAt` | `refresh_token_expires_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `scope` | `scope` | `String?` |  |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |

## Índices y restricciones (Prisma)

- `@@unique([providerId, accountId])`
- `@@map("auth_account")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model AuthAccount {
>   id                    String    @id @db.Uuid
>   userId                String    @map("user_id") @db.Uuid
>   accountId             String    @map("account_id")
>   providerId            String    @map("provider_id")
>   password              String?
>   accessToken           String?   @map("access_token")
>   refreshToken          String?   @map("refresh_token")
>   idToken               String?   @map("id_token")
>   accessTokenExpiresAt  DateTime? @map("access_token_expires_at") @db.Timestamptz(6)
>   refreshTokenExpiresAt DateTime? @map("refresh_token_expires_at") @db.Timestamptz(6)
>   scope                 String?
>   createdAt             DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt             DateTime  @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
> 
>   @@unique([providerId, accountId])
>   @@map("auth_account")
> }
> ```
