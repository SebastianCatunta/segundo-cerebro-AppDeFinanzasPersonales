---
tipo: "entidad"
tabla: "signup_ticket"
modulo: "M1"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# SignupTicket → tabla `signup_ticket`

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Creada en:** [[Migración 0013_signup_ticket]]
- **Relaciones:** [[Entidad - AuthUser]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `tokenHash` | `token_hash` | `String` | @id @db.Char(64) |  |
| `userId` | `user_id` | `String` | @unique @db.Uuid |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `expiresAt` | `expires_at` | `DateTime` | @db.Timestamptz(6) |  |
| `confirmedAt` | `confirmed_at` | `DateTime?` | @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |

## Índices y restricciones (Prisma)

- `@@map("signup_ticket")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model SignupTicket {
>   tokenHash   String    @id @map("token_hash") @db.Char(64)
>   userId      String    @unique @map("user_id") @db.Uuid
>   createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
>   expiresAt   DateTime  @map("expires_at") @db.Timestamptz(6)
>   confirmedAt DateTime? @map("confirmed_at") @db.Timestamptz(6)
> 
>   user AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
> 
>   @@map("signup_ticket")
> }
> ```
