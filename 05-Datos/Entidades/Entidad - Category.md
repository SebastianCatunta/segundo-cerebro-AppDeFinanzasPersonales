---
tipo: "entidad"
tabla: "category"
modulo: "M5"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M5"
actualizado: "2026-10-30"
---

# Category → tabla `category`

> [!quote] Comentario del schema
> Categories (plan §3.5). Created by migration 0005_category. CHECK constraints, the partial unique indexes category_active_name (NULLS NOT DISTINCT) and category_system_key, and the category_guard trigger live only in the migration SQL.

- **Módulo:** [[M5 - Categorías]]
- **Diseño:** plan §3.5
- **Creada en:** [[Migración 0005_category]]
- **Modificada/referenciada en:** [[Migración 0006_ledger]], [[Migración 0007_budgets]], [[Migración 0009_recurring_notifications]], [[Migración 0010_deferred_fks]]
- **Relaciones:** [[Entidad - AuthUser]], [[Entidad - LedgerTransaction]], [[Entidad - Shortcut]], [[Entidad - Budget]], [[Entidad - RecurringRule]], [[Entidad - FavoriteCategory]]
- **Enums:** [[Enums de Prisma|CategoryKind]], [[Enums de Prisma|SystemCategoryKey]], [[Enums de Prisma|LifecycleStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `kind` | `kind` | `CategoryKind` |  |  |
| `parentId` | `parent_id` | `String?` | @db.Uuid |  |
| `name` | `name` | `String` | @db.VarChar(30) |  |
| `color` | `color` | `String` | @db.VarChar(16) |  |
| `icon` | `icon` | `String` | @db.VarChar(32) |  |
| `isSystem` | `is_system` | `Boolean` | @default(false)  |  |
| `systemKey` | `system_key` | `SystemCategoryKey?` |  |  |
| `seedOrder` | `seed_order` | `Int?` | @db.SmallInt |  |
| `status` | `status` | `LifecycleStatus` | @default(active) |  |
| `archivedAt` | `archived_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `sortOrder` | `sort_order` | `Int` |  |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |
| `updatedAt` | `updated_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |
| `parent` | [[Entidad - Category]] `Category?` | @relation("CategoryHierarchy", fields: [userId, parentId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction) |
| `subcategories` | [[Entidad - Category]] `Category[]` | @relation("CategoryHierarchy") |
| `transactions` | [[Entidad - LedgerTransaction]] `LedgerTransaction[]` |  |
| `shortcuts` | [[Entidad - Shortcut]] `Shortcut[]` |  |
| `budgets` | [[Entidad - Budget]] `Budget[]` |  |
| `recurringRules` | [[Entidad - RecurringRule]] `RecurringRule[]` |  |
| `favorites` | [[Entidad - FavoriteCategory]] `FavoriteCategory[]` |  |

## Índices y restricciones (Prisma)

- `@@unique([userId, id])`
- `@@map("category")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model Category {
>   id         String             @id @db.Uuid
>   userId     String             @map("user_id") @db.Uuid
>   kind       CategoryKind
>   parentId   String?            @map("parent_id") @db.Uuid
>   name       String             @db.VarChar(30)
>   color      String             @db.VarChar(16)
>   icon       String             @db.VarChar(32)
>   isSystem   Boolean            @default(false) @map("is_system")
>   systemKey  SystemCategoryKey? @map("system_key")
>   seedOrder  Int?               @map("seed_order") @db.SmallInt
>   status     LifecycleStatus    @default(active)
>   archivedAt DateTime?          @map("archived_at") @db.Timestamptz(6)
>   sortOrder  Int                @map("sort_order")
>   createdAt  DateTime           @default(now()) @map("created_at") @db.Timestamptz(6)
>   updatedAt  DateTime           @default(now()) @map("updated_at") @db.Timestamptz(6)
> 
>   user           AuthUser            @relation(fields: [userId], references: [id], onDelete: Cascade)
>   parent         Category?           @relation("CategoryHierarchy", fields: [userId, parentId], references: [userId, id], onDelete: Restrict, onUpdate: NoAction)
>   subcategories  Category[]          @relation("CategoryHierarchy")
>   transactions   LedgerTransaction[]
>   shortcuts      Shortcut[]
>   budgets        Budget[]
>   recurringRules RecurringRule[]
>   favorites      FavoriteCategory[]
> 
>   @@unique([userId, id])
>   @@map("category")
> }
> ```

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]]

