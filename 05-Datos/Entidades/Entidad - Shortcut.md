---
tipo: "entidad"
tabla: "shortcut"
modulo: "M7"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M7"
actualizado: "2026-10-30"
---

# Shortcut → tabla `shortcut`

- **Módulo:** [[M7 - Registrar]]
- **Creada en:** [[Migración 0006_ledger]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - Account]], [[Entidad - Category]]
- **Enums:** [[Enums de Prisma|EntryKind]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `name` | `name` | `String` | @db.VarChar(30) |  |
| `kind` | `kind` | `EntryKind` |  |  |
| `amount` | `amount` | `Decimal?` | @db.Decimal(14, 2) |  |
| `accountId` | `account_id` | `String` | @db.Uuid |  |
| `destAccountId` | `dest_account_id` | `String?` | @db.Uuid |  |
| `categoryId` | `category_id` | `String?` | @db.Uuid |  |
| `note` | `note` | `String?` | @db.VarChar(140) |  |
| `sortOrder` | `sort_order` | `Int` |  |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `account` | [[Entidad - Account]] `Account` | @relation("ShortcutAccount", fields: [userId, accountId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction) |
| `destAccount` | [[Entidad - Account]] `Account?` | @relation("ShortcutDestAccount", fields: [userId, destAccountId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction) |
| `category` | [[Entidad - Category]] `Category?` | @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction) |

## Índices y restricciones (Prisma)

- `@@map("shortcut")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model Shortcut {
>   id            String    @id @db.Uuid
>   userId        String    @map("user_id") @db.Uuid
>   name          String    @db.VarChar(30)
>   kind          EntryKind
>   amount        Decimal?  @db.Decimal(14, 2)
>   accountId     String    @map("account_id") @db.Uuid
>   destAccountId String?   @map("dest_account_id") @db.Uuid
>   categoryId    String?   @map("category_id") @db.Uuid
>   note          String?   @db.VarChar(140)
>   sortOrder     Int       @map("sort_order")
>   createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt     DateTime  @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user        AuthUser  @relation(fields: [userId], references: [id], onDelete: Cascade)
>   account     Account   @relation("ShortcutAccount", fields: [userId, accountId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction)
>   destAccount Account?  @relation("ShortcutDestAccount", fields: [userId, destAccountId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction)
>   category    Category? @relation(fields: [userId, categoryId], references: [userId, id], onDelete: Cascade, onUpdate: NoAction)
> 
>   @@map("shortcut")
> }
> ```
