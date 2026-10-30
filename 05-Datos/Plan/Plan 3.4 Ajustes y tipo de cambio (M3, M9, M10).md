---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 3.4 Ajustes y tipo de cambio (M3, M9, M10)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 3. Esquema de Datos y Persistencia Global]] · ← [[Plan 3.3 Cuenta de usuario y seguridad (M1)]] · → [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]]

### 3.4 Ajustes y tipo de cambio (M3, M9, M10)

```sql
CREATE TABLE market_rate (                                 -- global (ADR-12)
  kind        market_rate_kind NOT NULL,
  rate_date   date NOT NULL,                               -- día calendario de Bolivia (RF-M3-13)
  value       numeric(14,2) NOT NULL CHECK (value >= 0.01),
  observed_at timestamptz NOT NULL,
  source      rate_source NOT NULL,
  PRIMARY KEY (kind, rate_date)
);

CREATE TABLE currency (
  user_id   uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  code      char(3) NOT NULL CHECK (code ~ '^[A-Z]{3}$'),
  symbol    varchar(5) NOT NULL CHECK (char_length(btrim(symbol)) BETWEEN 1 AND 5),
  is_system boolean NOT NULL DEFAULT false,                 -- BOB y USD
  status    currency_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, code),
  CHECK (NOT is_system OR status = 'active')                -- RF-M3-01
);

CREATE TABLE user_fx_event (
  id            uuid PRIMARY KEY,
  user_id       uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  kind          fx_event_kind NOT NULL,
  currency_code char(3),
  reference     market_rate_kind,
  value         numeric(14,2) CHECK (value >= 0.01),
  effective_at  timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id, currency_code) REFERENCES currency (user_id, code),
  CHECK (
    (kind = 'reference_set'  AND reference IS NOT NULL AND value IS NULL) OR
    (kind = 'manual_usd_on'  AND currency_code = 'USD' AND value IS NOT NULL) OR
    (kind = 'manual_usd_off' AND currency_code = 'USD' AND value IS NULL) OR
    (kind = 'custom_rate'    AND currency_code IS NOT NULL AND value IS NOT NULL)
  )
);
CREATE INDEX ON user_fx_event (user_id, kind, currency_code, effective_at DESC);

CREATE TABLE user_settings (
  user_id                 uuid PRIMARY KEY REFERENCES auth_user ON DELETE CASCADE,
  number_format           number_format NOT NULL DEFAULT 'dot_comma',
  date_format             date_format   NOT NULL DEFAULT 'dmy',
  week_start              week_start    NOT NULL DEFAULT 'monday',
  theme                   theme_mode    NOT NULL DEFAULT 'system',
  sidebar_collapsed       boolean NOT NULL DEFAULT false,
  base_currency           char(3) NOT NULL DEFAULT 'BOB',
  usd_reference           market_rate_kind NOT NULL DEFAULT 'parallel_median',
  manual_usd_value        numeric(14,2) CHECK (manual_usd_value >= 0.01),
  manual_usd_since        timestamptz,
  default_account_id      uuid,
  always_show_note        boolean NOT NULL DEFAULT false,
  dashboard_blocks        jsonb NOT NULL,                   -- [{key, visible}] ordenado (bloques 3 a 8)
  onboarding_step         smallint NOT NULL DEFAULT 1 CHECK (onboarding_step BETWEEN 1 AND 3),
  onboarding_completed_at timestamptz,
  updated_at              timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id, base_currency) REFERENCES currency (user_id, code),
  FOREIGN KEY (user_id, default_account_id) REFERENCES account (user_id, id) ON DELETE SET NULL (default_account_id),
  CHECK ((manual_usd_value IS NULL) = (manual_usd_since IS NULL))
);

CREATE TABLE favorite_category (
  user_id     uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  category_id uuid NOT NULL,
  kind        category_kind NOT NULL,
  position    smallint NOT NULL CHECK (position BETWEEN 1 AND 8),
  PRIMARY KEY (user_id, category_id),
  UNIQUE (user_id, kind, position) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (user_id, category_id) REFERENCES category (user_id, id) ON DELETE CASCADE
);

-- Tasa de una moneda agregada al final de un día, en la zona horaria del usuario (base X, presupuestos y metas en X).
CREATE FUNCTION user_rate_on(p_user uuid, p_code char(3), p_date date) RETURNS numeric LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    (SELECT e.value FROM user_fx_event e JOIN auth_user u ON u.id = e.user_id
      WHERE e.user_id = p_user AND e.kind = 'custom_rate' AND e.currency_code = p_code
        AND e.effective_at < ((p_date + 1)::timestamp AT TIME ZONE u.timezone)
      ORDER BY e.effective_at DESC LIMIT 1),
    (SELECT e.value FROM user_fx_event e                    -- antes del primer dato: el primer valor conocido
      WHERE e.user_id = p_user AND e.kind = 'custom_rate' AND e.currency_code = p_code
      ORDER BY e.effective_at ASC LIMIT 1))
$$;
```

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M7 - Registrar]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-12 - Datos de mercado globales]]

