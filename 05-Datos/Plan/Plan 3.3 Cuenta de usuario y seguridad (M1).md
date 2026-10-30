---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 3.3 Cuenta de usuario y seguridad (M1)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 3. Esquema de Datos y Persistencia Global]] · ← [[Plan 3.2 Tipos enumerados]] · → [[Plan 3.4 Ajustes y tipo de cambio (M3, M9, M10)]]

### 3.3 Cuenta de usuario y seguridad (M1)

```sql
CREATE TABLE auth_user (                                   -- Better Auth (modelo "user")
  id                uuid PRIMARY KEY,
  name              varchar(60)  NOT NULL CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 60),
  email             varchar(254) NOT NULL UNIQUE CHECK (email = lower(btrim(email))),
  email_verified    boolean      NOT NULL DEFAULT false,   -- false = Sin confirmar · true = Activa
  image             text,
  timezone          varchar(64)  NOT NULL DEFAULT 'America/La_Paz',
  locale            varchar(10)  NOT NULL DEFAULT 'es-BO' CHECK (locale = 'es-BO'),
  terms_accepted_at timestamptz  NOT NULL,
  registered_at     timestamptz  NOT NULL,                  -- reinicia con cada registro (RF-M1-06)
  created_at        timestamptz  NOT NULL DEFAULT now(),
  updated_at        timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX auth_user_unconfirmed_idx ON auth_user (registered_at) WHERE NOT email_verified;

CREATE TABLE auth_session (                                -- Better Auth (modelo "session")
  id               uuid PRIMARY KEY,
  token            text NOT NULL UNIQUE,
  user_id          uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  expires_at       timestamptz NOT NULL,
  last_activity_at timestamptz NOT NULL,                    -- RF-M1-07
  ip_address       text,
  user_agent       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON auth_session (user_id);

CREATE TABLE auth_account (                                -- Better Auth (credencial)
  id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  account_id text NOT NULL, provider_id text NOT NULL, password text,
  access_token text, refresh_token text, id_token text, access_token_expires_at timestamptz,
  refresh_token_expires_at timestamptz, scope text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, account_id)
);
CREATE TABLE auth_verification (                           -- requerida por Better Auth; no se usa para enlaces
  id uuid PRIMARY KEY, identifier text NOT NULL, value text NOT NULL, expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE email_link (
  id             uuid PRIMARY KEY,
  user_id        uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  purpose        email_link_purpose NOT NULL,
  token_hash     char(64) NOT NULL UNIQUE,                  -- SHA-256 del token; el token solo viaja en el correo
  expires_at     timestamptz NOT NULL,                      -- 24 h confirmación · 1 h recuperación
  used_at        timestamptz,
  invalidated_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (used_at IS NULL OR invalidated_at IS NULL)
);
CREATE UNIQUE INDEX email_link_one_active ON email_link (user_id, purpose)
  WHERE used_at IS NULL AND invalidated_at IS NULL;

CREATE TABLE signup_ticket (                              -- RF-M1-18: la app que espera la confirmación; migración 0013 (TASK-264)
  token_hash   char(64) PRIMARY KEY,                       -- SHA-256 del valor de la cookie; el valor nunca se guarda
  user_id      uuid NOT NULL UNIQUE REFERENCES auth_user(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,                       -- 24 h, como el enlace de confirmación
  confirmed_at timestamptz                                 -- solo lo marca el enlace de confirmación, nunca la recuperación
);

CREATE TABLE login_throttle (                              -- sin last_alert_sent_at desde la migración 0012 (TASK-263)
  email_hmac           char(64) PRIMARY KEY,                -- HMAC-SHA256(email normalizado, secreto)
  consecutive_failures integer NOT NULL DEFAULT 0 CHECK (consecutive_failures >= 0),
  last_failure_at      timestamptz,
  locked_until         timestamptz
);

CREATE TABLE email_outbox (                                -- transitoria: la fila se borra al enviarse
  id              uuid PRIMARY KEY,
  to_address      varchar(254) NOT NULL,
  kind            email_kind NOT NULL,
  payload         jsonb NOT NULL,
  status          outbox_status NOT NULL DEFAULT 'pending',
  attempts        integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON email_outbox (next_attempt_at) WHERE status = 'pending';

CREATE TABLE email_send_log (                              -- límites de envío; sin el correo en claro; purga a 24 h
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email_hmac char(64) NOT NULL,
  kind       email_kind NOT NULL,
  sent_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON email_send_log (email_hmac, kind, sent_at DESC);
```

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M3 - Monedas y tipo de cambio]] · [[M9 - Ajustes y personalización]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]

