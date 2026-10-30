---
tipo: "migracion"
fuente: "packages/db/prisma/migrations/0012_remove_login_alert/migration.sql"
tags:
  - "datos/migracion"
actualizado: "2026-10-30"
---

# Migración 0012_remove_login_alert

> [!quote] Encabezado del SQL
> RF-M1-16: the failed sign-in alert email is gone (TASK-262). Postgres cannot drop a value from an enum, so email_kind is rebuilt with the 5 account emails. The index on email_send_log (email_hmac, kind, sent_at DESC) is rebuilt by ALTER COLUMN TYPE; no CHECK uses kind.

← [[Migración 0011_job_run_lease]] · → [[Migración 0013_signup_ticket]] · ↑ [[Modelo de datos]]

- **Tipos creados:** `email_kind` (ver [[Enums de Prisma]])
- **Tablas alteradas:** [[Entidad - EmailOutbox|email_outbox]], [[Entidad - EmailSendLog|email_send_log]], [[Entidad - LoginThrottle|login_throttle]]
- **Líneas:** 18

> [!example]- SQL completo
> ```sql
> -- RF-M1-16: the failed sign-in alert email is gone (TASK-262). Postgres cannot drop a value from an
> -- enum, so email_kind is rebuilt with the 5 account emails. The index on email_send_log (email_hmac,
> -- kind, sent_at DESC) is rebuilt by ALTER COLUMN TYPE; no CHECK uses kind.
> BEGIN;
> 
> DELETE FROM email_outbox WHERE kind = 'login_alert';
> DELETE FROM email_send_log WHERE kind = 'login_alert';
> 
> ALTER TYPE email_kind RENAME TO email_kind_old;
> CREATE TYPE email_kind AS ENUM ('confirm','register_attempt','reset','password_changed','account_deleted');
> ALTER TABLE email_outbox ALTER COLUMN kind TYPE email_kind USING kind::text::email_kind;
> ALTER TABLE email_send_log ALTER COLUMN kind TYPE email_kind USING kind::text::email_kind;
> DROP TYPE email_kind_old;
> 
> ALTER TABLE login_throttle DROP COLUMN last_alert_sent_at;
> 
> COMMIT;
> ```

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]

