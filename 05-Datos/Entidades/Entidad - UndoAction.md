---
tipo: "entidad"
tabla: "undo_action"
modulo: "M6"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M6"
actualizado: "2026-10-30"
---

# UndoAction → tabla `undo_action`

- **Módulo:** [[M6 - Transacciones]]
- **Creada en:** [[Migración 0006_ledger]]
- **Relaciones:** [[Entidad - AuthUser]]
- **Enums:** [[Enums de Prisma|UndoKind]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid | The undoToken (ADR-07). |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `kind` | `kind` | `UndoKind` |  |  |
| `payload` | `payload` | `Json` |  |  |
| `expiresAt` | `expires_at` | `DateTime` | @db.Timestamptz(6) |  |
| `consumedAt` | `consumed_at` | `DateTime?` | @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |

## Índices y restricciones (Prisma)

- `@@index([expiresAt])`
- `@@map("undo_action")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model UndoAction {
>   /// The undoToken (ADR-07).
>   id         String    @id @db.Uuid
>   userId     String    @map("user_id") @db.Uuid
>   kind       UndoKind
>   payload    Json
>   expiresAt  DateTime  @map("expires_at") @db.Timestamptz(6)
>   consumedAt DateTime? @map("consumed_at") @db.Timestamptz(6)
> 
>   user AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
> 
>   @@index([expiresAt])
>   @@map("undo_action")
> }
> ```

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-07 - Deshacer con token]]

