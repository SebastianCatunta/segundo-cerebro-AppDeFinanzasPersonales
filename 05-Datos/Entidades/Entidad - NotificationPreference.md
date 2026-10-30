---
tipo: "entidad"
tabla: "notification_preference"
modulo: "M15"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M15"
actualizado: "2026-10-30"
---

# NotificationPreference → tabla `notification_preference`

- **Módulo:** [[M15 - Recordatorios y avisos]]
- **Creada en:** [[Migración 0009_recurring_notifications]]
- **Relaciones:** [[Entidad - AuthUser]]
- **Enums:** [[Enums de Prisma|NotificationType]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `type` | `type` | `NotificationType` |  |  |
| `enabled` | `enabled` | `Boolean` |  |  |
| `hour` | `hour` | `Int?` | @db.SmallInt |  |
| `leadDays` | `lead_days` | `Int?` | @db.SmallInt |  |
| `weekdays` | `weekdays` | `Int[]` | @db.SmallInt |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |

## Índices y restricciones (Prisma)

- `@@id([userId, type])`
- `@@map("notification_preference")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model NotificationPreference {
>   userId   String           @map("user_id") @db.Uuid
>   type     NotificationType
>   enabled  Boolean
>   hour     Int?             @db.SmallInt
>   leadDays Int?             @map("lead_days") @db.SmallInt
>   weekdays Int[]            @db.SmallInt
> 
>   user AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
> 
>   @@id([userId, type])
>   @@map("notification_preference")
> }
> ```
