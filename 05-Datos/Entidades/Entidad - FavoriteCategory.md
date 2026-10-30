---
tipo: "entidad"
tabla: "favorite_category"
modulo: "M5"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M5"
actualizado: "2026-10-30"
---

# FavoriteCategory → tabla `favorite_category`

- **Módulo:** [[M5 - Categorías]]
- **Creada en:** [[Migración 0003_fx_settings]]
- **Modificada/referenciada en:** [[Migración 0010_deferred_fks]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Category]]
- **Enums:** [[Enums de Prisma|CategoryKind]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `categoryId` | `category_id` | `String` | @db.Uuid |  |
| `kind` | `kind` | `CategoryKind` |  |  |
| `position` | `position` | `Int` | @db.SmallInt |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `category` | [[Entidad - Category]] `Category` | @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction) |

## Índices y restricciones (Prisma)

- `@@id([userId, categoryId])`
- `@@unique([userId, kind, position])`
- `@@map("favorite_category")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model FavoriteCategory {
>   userId     String       @map("user_id") @db.Uuid
>   categoryId String       @map("category_id") @db.Uuid
>   kind       CategoryKind
>   position   Int          @db.SmallInt
> 
>   user     AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
>   category Category @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction)
> 
>   @@id([userId, categoryId])
>   @@unique([userId, kind, position])
>   @@map("favorite_category")
> }
> ```
