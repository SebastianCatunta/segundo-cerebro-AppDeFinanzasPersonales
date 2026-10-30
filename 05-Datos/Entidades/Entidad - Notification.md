---
tipo: "entidad"
tabla: "notification"
modulo: "M15"
fuente: "packages/db/prisma/schema.prisma"
tags:
  - "datos/entidad"
  - "modulo/M15"
actualizado: "2026-10-30"
---

# Notification → tabla `notification`

> [!quote] Comentario del schema
> Notifications and job monitoring (plan §3.7). Created by migration 0009_recurring_notifications. CHECK constraints and the partial index on unread notifications live only in the migration SQL.

- **Módulo:** [[M15 - Recordatorios y avisos]]
- **Diseño:** plan §3.7
- **Creada en:** [[Migración 0009_recurring_notifications]]
- **Relaciones:** [[Entidad - AuthUser]]
- **Enums:** [[Enums de Prisma|NotificationType]], [[Enums de Prisma|DecisionStatus]]

## Columnas

| Campo | Columna | Tipo | Atributos | Nota |
|---|---|---|---|---|
| `id` | `id` | `String` | @id @db.Uuid |  |
| `userId` | `user_id` | `String` | @db.Uuid |  |
| `type` | `type` | `NotificationType` |  |  |
| `eventKey` | `event_key` | `String` | @db.VarChar(200) | For example debt:<id>:due:2026-10-20:d-3. |
| `params` | `params` | `Json` |  | Data for the i18n text. |
| `targetRoute` | `target_route` | `String` | @db.VarChar(200) |  |
| `decisionKind` | `decision_kind` | `String?` | @db.VarChar(32) | 'budget_period' \| 'occurrence'. |
| `decisionRef` | `decision_ref` | `String?` | @db.Uuid |  |
| `decisionStatus` | `decision_status` | `DecisionStatus?` |  |  |
| `readAt` | `read_at` | `DateTime?` | @db.Timestamptz(6) |  |
| `createdAt` | `created_at` | `DateTime` | @default(now()) @db.Timestamptz(6) |  |

## Relaciones de Prisma

| Campo | Modelo | Detalle |
|---|---|---|
| `user` | [[Entidad - AuthUser]] `AuthUser` | @relation(fields: [userId], references: [id], onDelete: Cascade) |

## Índices y restricciones (Prisma)

- `@@unique([userId, eventKey])`
- `@@index([userId, createdAt(sort: Desc)])`
- `@@map("notification")`

> [!example]- Bloque original en schema.prisma
> ```prisma
> model Notification {
>   id             String           @id @db.Uuid
>   userId         String           @map("user_id") @db.Uuid
>   type           NotificationType
>   /// For example debt:<id>:due:2026-10-20:d-3.
>   eventKey       String           @map("event_key") @db.VarChar(200)
>   /// Data for the i18n text.
>   params         Json
>   targetRoute    String           @map("target_route") @db.VarChar(200)
>   /// 'budget_period' | 'occurrence'.
>   decisionKind   String?          @map("decision_kind") @db.VarChar(32)
>   decisionRef    String?          @map("decision_ref") @db.Uuid
>   decisionStatus DecisionStatus?  @map("decision_status")
>   readAt         DateTime?        @map("read_at") @db.Timestamptz(6)
>   createdAt      DateTime         @default(now()) @map("created_at") @db.Timestamptz(6)
> 
>   user AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
> 
>   // One event never produces two notifications (RN-10, RNF-12).
>   @@unique([userId, eventKey])
>   @@index([userId, createdAt(sort: Desc)])
>   @@map("notification")
> }
> ```

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Plan 3.7 Avisos e infraestructura (M15)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

