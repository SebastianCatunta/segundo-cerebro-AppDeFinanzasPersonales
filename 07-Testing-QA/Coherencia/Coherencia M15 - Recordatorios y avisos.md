---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M15 - Recordatorios y avisos"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M15"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M14 - Recurrentes]] · → [[Coherencia RNF - Requerimientos no funcionales]]

### M15 — Recordatorios y avisos

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M15-01 | Todos los avisos DEBEN llegar solo dentro de la app, sin correo de avisos ni notificaciones push. | coincide | `apps/api/test/integration/notification-emitter.test.ts`, `packages/contracts/test/notifications.test.ts` |  |
| RF-M15-02 | Los tipos y sus valores por defecto DEBEN ser: | coincide | `apps/api/test/http/notification-preferences.test.ts`, `apps/api/test/integration/goal-milestones.test.ts` (+6) |  |
| RF-M15-03 | Todos los tipos DEBEN poder desactivarse. Desactivar un tipo de decisión no oculta la decisión: los… | coincide | `apps/api/test/http/dashboard-upcoming-recurring.test.ts`, `apps/api/test/http/notification-preferences.test.ts` (+4) |  |
| RF-M15-04 | Un mismo evento NUNCA DEBE generar dos avisos (RN-10). Cada hito de meta avisa una sola vez, aunque el tipo… | coincide | `apps/api/test/integration/goal-milestones.test.ts`, `apps/api/test/integration/notification-emitter.test.ts` |  |
| RF-M15-05 | Los avisos DEBEN borrarse solos a los 90 días, salvo los que esperan una decisión. | coincide | `apps/api/test/integration/maintenance-notifications.test.ts` |  |
| RF-M15-06 | El contador de la campana DEBE mostrar los avisos no leídos. | coincide | `apps/api/test/http/notifications.test.ts`, `e2e/m15-inbox.spec.ts` |  |
| RF-M15-07 | En la V1.1 existen la campana, la bandeja y los avisos de alertas de presupuesto, cierre de período y… | coincide | `apps/api/test/http/notification-preferences.test.ts`, `apps/api/test/integration/notification-emitter.test.ts` (+1) |  |
| RF-M15-08 | El aviso de "cambio fuerte del dólar" NO existe. | coincide | `packages/contracts/test/notifications.test.ts` |  |
| RF-M15-09 | Los avisos programados sin hora configurable (vencimientos de deudas y tarjetas, pagos próximos, avance… | coincide | `apps/api/test/http/notification-preferences.test.ts`, `apps/api/test/integration/notifications-debts-job.test.ts` (+1) |  |
| RF-M15-10 | Al reactivar un tipo de aviso, NO DEBEN generarse avisos de lo ocurrido mientras estaba desactivado. | coincide | `apps/api/test/integration/notifications-payments-job.test.ts` |  |
| RF-M15-11 | Al tocar un aviso de algo que ya no existe (deuda, meta, regla), el sistema DEBE mostrar "Esto ya no existe"… | coincide | `e2e/m15-inbox.spec.ts` |  |
| RF-M15-12 | "Marcar todo como leído" y eliminar un aviso DEBEN funcionar también con los avisos que esperan una decisión.… | coincide | `apps/api/test/http/notifications.test.ts`, `e2e/m15-inbox.spec.ts` |  |
| EC-M15-01 | El usuario resuelve un pendiente desde Recurrentes. El aviso de la bandeja queda Resuelto. | coincide | `apps/api/test/integration/recurring-confirm.test.ts`, `e2e/m14-inbox-pending.spec.ts` |  |
| EC-M15-02 | Se cambia el día de pago de una tarjeta después de generado su aviso. El aviso ya generado no se repite, y el… | coincide | `apps/api/test/integration/notifications-payments-job.test.ts` |  |
| EC-M15-03 | El aviso "Registrar el día" se genera aunque ya haya movimientos ese día, porque es el comportamiento elegido. | coincide | `apps/api/test/integration/notifications-log-day-job.test.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

