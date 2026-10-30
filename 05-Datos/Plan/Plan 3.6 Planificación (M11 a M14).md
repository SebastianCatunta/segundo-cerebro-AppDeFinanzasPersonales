---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 3.6 Planificación (M11 a M14)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 3. Esquema de Datos y Persistencia Global]] · ← [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]] · → [[Plan 3.7 Avisos e infraestructura (M15)]]

### 3.6 Planificación (M11 a M14)

```sql
CREATE TABLE budget (
  id               uuid PRIMARY KEY,
  user_id          uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  scope            budget_scope NOT NULL,
  category_id      uuid,
  amount           numeric(14,2) NOT NULL CHECK (amount BETWEEN 0.01 AND 999999999.99),
  currency_code    char(3) NOT NULL,
  start_day        smallint NOT NULL CHECK (start_day BETWEEN 1 AND 28),
  next_start_day   smallint CHECK (next_start_day BETWEEN 1 AND 28),
  default_action   budget_default_action NOT NULL DEFAULT 'discard',
  thresholds       smallint[] NOT NULL DEFAULT '{80,100}'
                   CHECK (cardinality(thresholds) <= 3 AND 1 <= ALL (thresholds) AND 150 >= ALL (thresholds)),
  status           budget_status NOT NULL DEFAULT 'active',
  frozen_carryover numeric(14,2),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, id),
  FOREIGN KEY (user_id, category_id)   REFERENCES category (user_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id, currency_code) REFERENCES currency (user_id, code),
  CHECK ((scope = 'general') = (category_id IS NULL))
);
CREATE UNIQUE INDEX budget_one_per_category ON budget (user_id, category_id)
  WHERE scope = 'category' AND status IN ('active','paused','finalizing');
CREATE UNIQUE INDEX budget_one_general ON budget (user_id)
  WHERE scope = 'general' AND status IN ('active','paused','finalizing');
-- los umbrales sin repetir y ordenados se validan en el servicio (Zod + domain)

CREATE TABLE budget_period (
  id                 uuid PRIMARY KEY,
  user_id            uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  budget_id          uuid NOT NULL REFERENCES budget ON DELETE CASCADE,
  start_date         date NOT NULL,
  end_date           date NOT NULL CHECK (end_date >= start_date),
  amount             numeric(14,2) NOT NULL,               -- copia del monto vigente del período
  carryover_in       numeric(14,2) NOT NULL DEFAULT 0,
  status             budget_period_status NOT NULL DEFAULT 'open',
  spent_at_decision  numeric(14,2),
  result_at_decision numeric(14,2),
  decision           jsonb,
  decision_deadline  timestamptz,
  decided_at         timestamptz,
  UNIQUE (budget_id, start_date),
  CHECK ((status IN ('decided','defaulted')) = (decided_at IS NOT NULL))
);
CREATE INDEX ON budget_period (user_id, status, end_date);

CREATE TABLE budget_late_adjustment (
  id               uuid PRIMARY KEY,
  user_id          uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  period_id        uuid NOT NULL REFERENCES budget_period ON DELETE CASCADE,  -- período en curso
  source_period_id uuid NOT NULL REFERENCES budget_period ON DELETE CASCADE,  -- período cerrado de origen
  amount           numeric(14,2) NOT NULL,
  voided_at        timestamptz,                                               -- "Reiniciar arrastre"
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE budget_threshold_hit (
  period_id  uuid NOT NULL REFERENCES budget_period ON DELETE CASCADE,
  threshold  smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (period_id, threshold)                                          -- un aviso por umbral y período
);

CREATE TABLE goal (
  id                   uuid PRIMARY KEY,
  user_id              uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  name                 varchar(40) NOT NULL CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 40),
  target               numeric(14,2) NOT NULL CHECK (target BETWEEN 0.01 AND 999999999.99),
  currency_code        char(3) NOT NULL,
  target_date          date,
  icon                 varchar(32) NOT NULL,
  color                varchar(16) NOT NULL,
  dedicated_account_id uuid UNIQUE,
  celebrated_at        timestamptz,
  archived_at          timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, id),
  FOREIGN KEY (user_id, currency_code)        REFERENCES currency (user_id, code),
  FOREIGN KEY (user_id, dedicated_account_id) REFERENCES account (user_id, id) ON DELETE RESTRICT,
  CHECK (archived_at IS NULL OR dedicated_account_id IS NULL)
);

CREATE TABLE goal_allocation_event (                       -- apartados (+) y retiros (−)
  id                     uuid PRIMARY KEY,
  user_id                uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  goal_id                uuid NOT NULL,
  account_id             uuid NOT NULL,
  amount                 numeric(14,2) NOT NULL CHECK (amount <> 0),
  origin                 allocation_origin NOT NULL,
  related_transaction_id uuid,
  created_at             timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id, goal_id)    REFERENCES goal (user_id, id)    ON DELETE CASCADE,
  FOREIGN KEY (user_id, account_id) REFERENCES account (user_id, id) ON DELETE RESTRICT
);
CREATE INDEX ON goal_allocation_event (user_id, account_id);
CREATE INDEX ON goal_allocation_event (goal_id, created_at);

CREATE TABLE debt (
  id                     uuid PRIMARY KEY,
  user_id                uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  direction              debt_direction NOT NULL,
  person                 varchar(40) NOT NULL CHECK (person = btrim(person) AND char_length(person) BETWEEN 1 AND 40),
  person_key             varchar(40) NOT NULL,             -- lower(unaccent(person))
  principal              numeric(14,2) NOT NULL CHECK (principal BETWEEN 0.01 AND 999999999.99),
  currency_code          char(3) NOT NULL,
  start_date             date NOT NULL,
  due_date               date,
  note                   varchar(140),
  interest_rate          numeric(7,4) CHECK (interest_rate BETWEEN 0.01 AND 100),
  interest_period        interest_period,
  status                 debt_status NOT NULL DEFAULT 'active',
  forgiven_amount        numeric(14,2),
  initial_transaction_id uuid REFERENCES ledger_transaction ON DELETE SET NULL,
  capital_outstanding    numeric(14,2) NOT NULL CHECK (capital_outstanding >= 0),
  interest_unpaid        numeric(24,10) NOT NULL DEFAULT 0 CHECK (interest_unpaid >= 0),
  accrued_through        date NOT NULL,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, id),
  FOREIGN KEY (user_id, currency_code) REFERENCES currency (user_id, code),
  CHECK ((interest_rate IS NULL) = (interest_period IS NULL)),
  CHECK ((status = 'forgiven') = (forgiven_amount IS NOT NULL))
);
CREATE INDEX ON debt (user_id, status, due_date);
CREATE INDEX ON debt (user_id, person_key);

CREATE TABLE debt_payment (
  id                      uuid PRIMARY KEY,
  user_id                 uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  debt_id                 uuid NOT NULL REFERENCES debt ON DELETE CASCADE,
  amount                  numeric(14,2) NOT NULL CHECK (amount > 0),
  interest_part           numeric(14,2) NOT NULL CHECK (interest_part >= 0),
  capital_part            numeric(14,2) NOT NULL CHECK (capital_part >= 0),
  date                    date NOT NULL,
  account_id              uuid,
  declared_rate           numeric(14,2) CHECK (declared_rate >= 0.01),
  account_amount          numeric(14,2),
  capital_transaction_id  uuid REFERENCES ledger_transaction ON DELETE SET NULL,
  interest_transaction_id uuid REFERENCES ledger_transaction ON DELETE SET NULL,
  note                    varchar(140),
  created_at              timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id, account_id) REFERENCES account (user_id, id) ON DELETE RESTRICT,
  CHECK (amount = interest_part + capital_part)
);
CREATE INDEX ON debt_payment (debt_id, created_at DESC);

CREATE TABLE recurring_rule (
  id                  uuid PRIMARY KEY,
  user_id             uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  name                varchar(40) NOT NULL CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 40),
  kind                entry_kind NOT NULL,
  amount              numeric(14,2) CHECK (amount BETWEEN 0.01 AND 999999999.99),
  account_id          uuid NOT NULL,
  dest_account_id     uuid,
  category_id         uuid,
  note                varchar(140),
  frequency           rule_frequency NOT NULL,
  weekday             smallint CHECK (weekday BETWEEN 0 AND 6),
  day_of_month        smallint CHECK (day_of_month BETWEEN 1 AND 31),
  month               smallint CHECK (month BETWEEN 1 AND 12),
  start_date          date NOT NULL,
  end_type            rule_end_type NOT NULL DEFAULT 'none',
  end_date            date,
  end_count           smallint CHECK (end_count BETWEEN 1 AND 999),
  mode                rule_mode NOT NULL,
  status              rule_status NOT NULL DEFAULT 'active',
  paused_at           timestamptz,
  generated_count     integer NOT NULL DEFAULT 0,
  last_generated_date date,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, id),
  FOREIGN KEY (user_id, account_id)      REFERENCES account (user_id, id)  ON DELETE RESTRICT,
  FOREIGN KEY (user_id, dest_account_id) REFERENCES account (user_id, id)  ON DELETE RESTRICT,
  FOREIGN KEY (user_id, category_id)     REFERENCES category (user_id, id) ON DELETE RESTRICT,
  CHECK (amount IS NOT NULL OR mode = 'confirm'),
  CHECK ((kind = 'transfer') = (dest_account_id IS NOT NULL AND category_id IS NULL)),
  CHECK (kind = 'transfer' OR category_id IS NOT NULL),
  CHECK ((frequency = 'weekly')  = (weekday IS NOT NULL)),
  CHECK ((frequency IN ('monthly','yearly')) = (day_of_month IS NOT NULL)),
  CHECK ((frequency = 'yearly')  = (month IS NOT NULL)),
  CHECK ((end_type = 'until') = (end_date IS NOT NULL) AND (end_date IS NULL OR end_date >= start_date)),
  CHECK ((end_type = 'count') = (end_count IS NOT NULL)),
  CHECK ((status = 'paused') = (paused_at IS NOT NULL))
);
CREATE INDEX ON recurring_rule (user_id, status);

CREATE TABLE recurring_occurrence (
  id             uuid PRIMARY KEY,
  user_id        uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  rule_id        uuid NOT NULL REFERENCES recurring_rule ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  status         occurrence_status NOT NULL,
  transaction_id uuid REFERENCES ledger_transaction ON DELETE SET NULL,
  pending_since  timestamptz,
  decided_at     timestamptz,
  UNIQUE (rule_id, scheduled_date)                                            -- RF-M14-12
);
CREATE INDEX ON recurring_occurrence (user_id, status, pending_since);
```

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M4 - Cuentas]] · [[M7 - Registrar]]

