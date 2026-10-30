---
tipo: "migracion"
fuente: "packages/db/prisma/migrations/0013_signup_ticket/migration.sql"
tags:
  - "datos/migracion"
actualizado: "2026-10-30"
---

# Migración 0013_signup_ticket

> [!quote] Encabezado del SQL
> RF-M1-18: the app waiting on "Revisa tu correo" learns about the confirmation through a secret ticket kept in a cookie. Only the SHA-256 of the cookie value is stored (plan §3.3, TASK-264).

← [[Migración 0012_remove_login_alert]] · → — · ↑ [[Modelo de datos]]

- **Tablas creadas:** [[Entidad - SignupTicket|signup_ticket]]
- **Índices:** `signup_ticket_user_id_key`
- **Líneas:** 14

> [!example]- SQL completo
> ```sql
> -- RF-M1-18: the app waiting on "Revisa tu correo" learns about the confirmation through a secret
> -- ticket kept in a cookie. Only the SHA-256 of the cookie value is stored (plan §3.3, TASK-264).
> 
> CREATE TABLE signup_ticket (
>   token_hash   char(64)    NOT NULL,
>   user_id      uuid        NOT NULL,
>   created_at   timestamptz NOT NULL DEFAULT now(),
>   expires_at   timestamptz NOT NULL,
>   confirmed_at timestamptz,
>   CONSTRAINT signup_ticket_pkey PRIMARY KEY (token_hash),
>   CONSTRAINT signup_ticket_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth_user (id) ON DELETE CASCADE
> );
> CREATE UNIQUE INDEX signup_ticket_user_id_key ON signup_ticket (user_id);
> ```

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]
- **Spec / Plan / Constitución:** [[Plan 3.3 Cuenta de usuario y seguridad (M1)]]

