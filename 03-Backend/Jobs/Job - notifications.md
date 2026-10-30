---
tipo: "job"
fuente: "apps/api/src/application/jobs/notifications.ts"
tags:
  - "backend/jobs"
  - "modulo/M15"
actualizado: "2026-10-30"
---

# Job · `notifications.ts`

Capa de aplicación (`apps/api/src/application/jobs/notifications.ts`). Lo ejecuta [[Job - tick]] y, si tiene alcance por usuario, el *catch-up* de la primera petición del día (ADR-01). Ver [[Flujo - Tick de jobs]].

**Módulos:** [[M15 - Recordatorios y avisos]]

## Comentarios del código

- A user the job walks, with the timezone of their profile (RNF-20).
- The users the scheduled notifications are evaluated for.
- `null` when there is no such user.
- The rates of the monthly goal notice; read from the unit of work when absent.
- The batch run of the tick and its per-user scope for `catchUpUser` (ADR-01).
- Local time from which the notices without a configurable hour are generated (RF-M15-09).
- Days from today to the due date of each debt notice, by its key suffix (RF-M13-14).
- Minutes since local midnight of that instant in the timezone.
- Whole days from `from` to `to`, both `YYYY-MM-DD`.
- Today's due notice of the debt, if any: active debts with a balance only (RF-M13-14).
- Days before its date a recurring payment is announced when the user set none (RF-M15-02).
- Days before the pay day of a card its notice arrives (RF-M15-02).
- The date `days` calendar days after `date`, both `YYYY-MM-DD`.
- `true` when that day of the month falls on the date; a missing day is the last one (RF-M4-08).
- Recurring payments: expenses and transfers, weekly or longer, never daily (RF-M15-02).
- Local hour of the `log_day` notice when the user set none (RF-M15-02).
- Every weekday, 0 = Sunday: the `log_day` days when the user set none (RF-M15-02).
- Weekday of the date, 0 = Sunday.
- The "Registrar el día" notice: with the type active, from its hour and on its weekdays, one per local day, even if the user already registered movements that day (RF-M15-02, EC-M15-03).
- The `notifications.scheduled` job (plan §4.15.3): for each user whose local time already passed 08:00 (RF-M15-09), it creates today's due notices of their active debts in both directions (RF-M13-14) and, from the V1.2, the upcoming payments of their recurring rules and the cut and pay days of their cards (RF-M15-02, RF-M4-08) and, on day 1, the monthly notice of the goals whose contribution fell short; also from the V1.2, the "Registrar el día" notice at its own hour and weekdays (EC-M15-03). Only today is evaluated, and each notice has a dated `event_key`, so running it again creates nothing new (RNF-12, RF-M15-10, EC-M15-02).

## Exportaciones

- `ScheduledUser` (interface)
- `ScheduledUsers` (interface)
- `ScheduledNotificationsDeps` (interface)
- `ScheduledNotifications` (interface)
- `createScheduledNotifications` (function)

---
## 🔗 Relacionado

- **Módulos:** [[M13 - Deudas y préstamos]] · [[M4 - Cuentas]]
- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]] · [[Spec 3.7 Tiempo]]
- **Spec / Plan / Constitución:** [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]]

