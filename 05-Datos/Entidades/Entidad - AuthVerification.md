---
tipo: "entidad"
tabla: "auth_verification"
modulo: "M1"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# AuthVerification → tabla `auth_verification`

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Creada en:** [[Migración 0002_auth]]
- **Relaciones:** —

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `identifier` | `identifier` | `String` |  |  |
| `value` | `value` | `String` |  |  |
| `expiresAt` | `expires_at` | `DateTime` | @db.Timestamptz(6) |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Índices y restricciones (Prisma)

- `@@map("auth_verification")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model AuthVerification {
>   id         String   @id @db.Uuid
>   identifier String
>   value      String
>   expiresAt  DateTime @map("expires_at") @db.Timestamptz(6)
>   createdAt  DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt  DateTime @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   @@map("auth_verification")
> }
> ```
