---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M15"
modulo: "M15"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.14 M14 - Recurrentes (V1.2)]]

### 4.15 M15 — Recordatorios y avisos (bandeja V1.1, completo V1.2)

#### 4.15.1 Contratos

```ts
NotificationDto = { id, type, params, targetRoute, createdAt, read: boolean,
  decision?: { kind: 'budget_period'|'occurrence'; ref: string; status: 'waiting'|'resolved' } }
NotificationsQuery = z.object({ cursor: z.string().optional(), limit: z.number().int().max(50).default(20) });
PreferencesInput = z.array(z.object({ type: NotificationType, enabled: z.boolean(), hour: z.number().int().min(0).max(23).optional(),
  leadDays: z.number().int().min(0).max(7).optional(), weekdays: z.array(z.number().int().min(0).max(6)).optional() }));
```

**Valores por defecto (RF-M15-02)**, que se crean con el usuario:

| Tipo | Activo | Comportamiento |
|---|---|---|
| `payment_upcoming` | Sí | Recurrentes de gasto y transferencia semanales o de frecuencia mayor: 1 día antes. Tarjetas: el día de corte y 3 días antes del pago. Deudas, en ambas direcciones: d-3, d0 y d+1. |
| `budget_alert` | Sí | — |
| `period_close` | Sí | — |
| `recurring_pending` | Sí | Pendientes, pendientes omitidos y reglas pausadas al archivar o eliminar su cuenta o al archivar su categoría. |
| `log_day` | No | 21:00, todos los días. |
| `goal_progress` | No | — |

#### 4.15.2 Endpoints

| Método y ruta | Comportamiento |
|---|---|
| `GET /api/notifications` | Por cursor, del más nuevo al más viejo. |
| `GET /api/notifications/unread-count` | Se pide con `X-Background` (RF-M15-06). |
| `POST /api/notifications/:id/read` · `POST /api/notifications/read-all` | Incluye los avisos que esperan decisión (RF-M15-12). |
| `DELETE /api/notifications/:id` | Deslizar o el menú "…". La decisión sigue en su módulo. |
| `GET /api/notification-preferences` · `PATCH` | V1.2. En V1.1 los tipos existen pero no se pueden configurar (RF-M15-07). |

#### 4.15.3 Ciclo de vida y concurrencia
- **No leído → Leído → Eliminado.** Si espera una decisión: `decision_status` en espera → resuelto, cuando el módulo decide en su propia transacción o cuando se aplica el valor por defecto (7 días para un cierre, 30 para un pendiente).
- **Un solo aviso por evento (RN-10, RF-M15-04):** `UNIQUE (user_id, event_key)`. Toda creación es `INSERT … ON CONFLICT DO NOTHING`.
- **Generación por eventos:** en la misma transacción del evento (umbral cruzado, cierre, pendiente, omisión, hito), con `notifications.emit(tx, …)`. Si la preferencia está desactivada no se crea nada, pero la decisión sigue visible en su módulo (RF-M15-03).
- **Generación programada:** el job `notifications.scheduled` recorre los usuarios cuya hora local ya pasó la hora del tipo (08:00 por defecto, RF-M15-09; `log_day` a su hora y en sus días elegidos, EC-M15-03) y crea los de hoy con su `event_key` con fecha.
  - Al reactivar un tipo no hay avisos retroactivos, porque solo se evalúa el día en curso (RF-M15-10).
  - Si cambia el día de pago de una tarjeta, el aviso ya generado no se repite y el próximo usa la nueva fecha, porque la clave incluye la fecha (EC-M15-02).
- **Retención (RF-M15-05):** `notifications.retention` borra los de más de 90 días con `decision_status IS NULL OR decision_status = 'resolved'`.
- **Entrega:** se filtra por `RELEASE`. En V1.1 solo existen `budget_alert`, `period_close` y los avisos de deuda de `payment_upcoming`.
- **Destino eliminado (RF-M15-11):** si la entidad del destino ya no existe, la ruta destino responde 404 y la web muestra "Esto ya no existe" y marca el aviso como leído.

#### 4.15.4 UI y estado
- **Cabecera:** `<BellButton>` con el contador.
- **`<NotificationsPanel>`** (Sheet de shadcn) con `<NotificationItem>`: el texto i18n con sus parámetros, tocar marca como leído y navega, botones de decisión inline (`<CloseDecisionCard compact>` y Confirmar u Omitir pendiente), y un menú "…" con Eliminar (alternativa de teclado al deslizar, RNF-06). Incluye "Marcar todo como leído".
- **`/ajustes/recordatorios`** (V1.2): `<PreferencesList>` con interruptor, hora, anticipación de 0 a 7 días y días de la semana, según el tipo.
- **Estado:** `['notifications']` y `['notifications','unread']`, refrescado cada 60 s en segundo plano y al reenfocar la ventana.

---

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

