---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 3.7 Avisos e infraestructura (M15)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 3. Esquema de Datos y Persistencia Global]] · ← [[Plan 3.6 Planificación (M11 a M14)]] · → [[Plan 3.8 Integridad y cascadas]]

### 3.7 Avisos e infraestructura (M15)

```sql
CREATE TABLE notification (
  id              uuid PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  type            notification_type NOT NULL,
  event_key       varchar(200) NOT NULL,                    -- p. ej. debt:{id}:due:2026-10-20:d-3
  params          jsonb NOT NULL,                           -- datos para el texto i18n
  target_route    varchar(200) NOT NULL,
  decision_kind   varchar(32),                              -- 'budget_period' | 'occurrence'
  decision_ref    uuid,
  decision_status decision_status,
  read_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_key),                              -- RN-10, RNF-12
  CHECK ((decision_ref IS NULL) = (decision_status IS NULL))
);
CREATE INDEX ON notification (user_id, created_at DESC);
CREATE INDEX ON notification (user_id) WHERE read_at IS NULL;

CREATE TABLE notification_preference (
  user_id   uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE,
  type      notification_type NOT NULL,
  enabled   boolean NOT NULL,
  hour      smallint CHECK (hour BETWEEN 0 AND 23),
  lead_days smallint CHECK (lead_days BETWEEN 0 AND 7),
  weekdays  smallint[],
  PRIMARY KEY (user_id, type)
);

CREATE TABLE job_run (                                     -- monitoreo y exclusión entre corridas (lease, §4.0)
  job              varchar(64) PRIMARY KEY,
  last_started_at  timestamptz,
  last_finished_at timestamptz,
  last_error       text,
  locked_until     timestamptz                             -- lease vigente; NULL = libre (migración 0011_job_run_lease)
);
```

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

