---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 3.5 Cuentas, categorías y libro contable (M4 a M7)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 3. Esquema de Datos y Persistencia Global]] · ← [[Plan 3.4 Ajustes y tipo de cambio (M3, M9, M10)]] · → [[Plan 3.6 Planificación (M11 a M14)]]

### 3.5 Cuentas, categorías y libro contable (M4 a M7)

```sql
CREATE TABLE account (
  id                   uuid PRIMARY KEY,
  user_id              uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  type                 account_type NOT NULL,
  name                 varchar(40) NOT NULL CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 40),
  currency_code        char(3) NOT NULL,
  initial_balance      numeric(14,2) NOT NULL DEFAULT 0 CHECK (abs(initial_balance) <= 999999999.99),
  initial_balance_date date NOT NULL,
  color                varchar(16) NOT NULL,
  icon                 varchar(32) NOT NULL,
  card_cut_day         smallint CHECK (card_cut_day BETWEEN 1 AND 31),
  card_pay_day         smallint CHECK (card_pay_day BETWEEN 1 AND 31),
  card_limit           numeric(14,2) CHECK (card_limit > 0),
  status               lifecycle_status NOT NULL DEFAULT 'active',
  archived_at          timestamptz,
  sort_order           integer NOT NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, id),
  FOREIGN KEY (user_id, currency_code) REFERENCES currency (user_id, code),
  CHECK (type = 'credit_card' OR (card_cut_day IS NULL AND card_pay_day IS NULL AND card_limit IS NULL)),
  CHECK (type NOT IN ('cash','ewallet') OR initial_balance >= 0),
  CHECK ((status = 'archived') = (archived_at IS NOT NULL))
);
CREATE UNIQUE INDEX account_active_name ON account (user_id, lower(name)) WHERE status = 'active';
CREATE INDEX ON account (user_id, status, sort_order);
-- trigger account_initial_immutable: BEFORE UPDATE → error si cambian initial_balance o initial_balance_date (RF-M4-07)

CREATE TABLE category (
  id          uuid PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  kind        category_kind NOT NULL,
  parent_id   uuid,
  name        varchar(30) NOT NULL CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 30),
  color       varchar(16) NOT NULL,
  icon        varchar(32) NOT NULL,
  is_system   boolean NOT NULL DEFAULT false,
  system_key  system_category_key,
  seed_order  smallint,
  status      lifecycle_status NOT NULL DEFAULT 'active',
  archived_at timestamptz,
  sort_order  integer NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, id),
  FOREIGN KEY (user_id, parent_id) REFERENCES category (user_id, id) ON DELETE RESTRICT,
  CHECK (is_system = (system_key IS NOT NULL)),
  CHECK ((status = 'archived') = (archived_at IS NOT NULL))
);
CREATE UNIQUE INDEX category_active_name ON category (user_id, kind, parent_id, lower(name))
  NULLS NOT DISTINCT WHERE status = 'active';
CREATE UNIQUE INDEX category_system_key ON category (user_id, kind, system_key) WHERE system_key IS NOT NULL;
-- trigger category_guard (BEFORE INSERT/UPDATE): un solo nivel; padre del mismo tipo y activo;
-- una categoría con hijas no pasa a hija; el tipo no cambia; la del sistema solo cambia color e ícono.

CREATE TABLE ledger_transaction (
  id                    uuid PRIMARY KEY,
  user_id               uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  kind                  transaction_kind NOT NULL,
  date                  date NOT NULL,
  note                  varchar(140),
  category_id           uuid,
  origin                transaction_origin NOT NULL DEFAULT 'manual',
  origin_id             uuid,                               -- deuda, pago, meta: destino de "Ir a…"
  parent_transaction_id uuid REFERENCES ledger_transaction ON DELETE CASCADE,  -- comisión → transferencia
  recurring_rule_id     uuid,
  recurring_label       varchar(40),
  rate_cur_bob          numeric(14,2) NOT NULL CHECK (rate_cur_bob >= 0.01),     -- 1.00 si es BOB
  rate_usd_bob          numeric(14,2) CHECK (rate_usd_bob >= 0.01),              -- NULL solo sin ninguna tasa
  declared_rate         numeric(14,2) CHECK (declared_rate >= 0.01),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz,
  UNIQUE (user_id, id),
  FOREIGN KEY (user_id, category_id) REFERENCES category (user_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id, recurring_rule_id) REFERENCES recurring_rule (user_id, id) ON DELETE SET NULL (recurring_rule_id),
  CHECK ((kind IN ('expense','income')) = (category_id IS NOT NULL)),
  CHECK (declared_rate IS NULL OR kind = 'transfer'),
  CHECK ((origin = 'fee') = (parent_transaction_id IS NOT NULL))
);
CREATE INDEX ledger_tx_list ON ledger_transaction (user_id, date DESC, created_at DESC, id) WHERE deleted_at IS NULL;
CREATE INDEX ON ledger_transaction (user_id, category_id, date) WHERE deleted_at IS NULL;
CREATE INDEX ON ledger_transaction (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE TABLE ledger_entry (
  id             uuid PRIMARY KEY,
  user_id        uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  transaction_id uuid NOT NULL REFERENCES ledger_transaction ON DELETE CASCADE,
  account_id     uuid NOT NULL,
  amount         numeric(14,2) NOT NULL CHECK (amount <> 0),   -- con signo
  date           date NOT NULL,                                -- copia de la cabecera
  FOREIGN KEY (user_id, account_id) REFERENCES account (user_id, id) ON DELETE RESTRICT
);
CREATE INDEX ledger_entry_balance ON ledger_entry (user_id, account_id, date);
CREATE INDEX ON ledger_entry (transaction_id);

CREATE TABLE undo_action (
  id          uuid PRIMARY KEY,                               -- undoToken
  user_id     uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  kind        undo_kind NOT NULL,
  payload     jsonb NOT NULL,                                 -- ids afectados / categorías anteriores
  expires_at  timestamptz NOT NULL,                           -- creación + 12 s
  consumed_at timestamptz
);
CREATE INDEX ON undo_action (expires_at);

CREATE TABLE shortcut (
  id              uuid PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  name            varchar(30) NOT NULL CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 30),
  kind            entry_kind NOT NULL,
  amount          numeric(14,2) CHECK (amount BETWEEN 0.01 AND 999999999.99),
  account_id      uuid NOT NULL,
  dest_account_id uuid,
  category_id     uuid,
  note            varchar(140),
  sort_order      integer NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id, account_id)      REFERENCES account (user_id, id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id, dest_account_id) REFERENCES account (user_id, id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id, category_id)     REFERENCES category (user_id, id) ON DELETE CASCADE,
  CHECK ((kind = 'transfer') = (dest_account_id IS NOT NULL AND category_id IS NULL)),
  CHECK (kind = 'transfer' OR category_id IS NOT NULL)
);
```

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M14 - Recurrentes]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M7 - Registrar]] · [[M9 - Ajustes y personalización]]

