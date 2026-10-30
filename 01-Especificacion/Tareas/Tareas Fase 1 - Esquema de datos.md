---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 1 - Esquema de datos"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "1"
tareas: "10"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]] · → [[Tareas Fase 2 - Contratos y catálogos compartidos]]

### Fase 1 — Esquema de datos

- [x] **`TASK-011`: Migración base: extensión `unaccent`, tipos enumerados y `set_updated_at`**
  - **Dependencias:** Requiere TASK-005
  - **Trazabilidad SDD:** plan §3.1, plan §3.2, ADR-10
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0001_base/migration.sql`
    - `packages/db/test/schema-base.test.ts`
  - **Especificación de Implementación:** Todos los enums de plan §3.2 como enums de Prisma con `@@map` al nombre SQL. `CREATE EXTENSION unaccent` y la función de trigger `set_updated_at()`.
  - **Criterios de Verificación (Tests & DoD):**
    - Existen todos los tipos de plan §3.2, con sus valores exactos y en el mismo orden.
    - Existen la extensión `unaccent` y la función `set_updated_at`.

- [x] **`TASK-012`: Tablas de cuenta de usuario y seguridad (M1)**
  - **Dependencias:** Requiere TASK-011
  - **Trazabilidad SDD:** plan §3.3; RF-M1-02, RF-M1-05, RF-M1-16, RN-13
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0002_auth/migration.sql`
    - `packages/db/test/schema-auth.test.ts`
  - **Especificación de Implementación:** `auth_user`, `auth_session`, `auth_account`, `auth_verification`, `email_link`, `login_throttle`, `email_outbox` y `email_send_log`, con sus CHECK, índices (incluido `email_link_one_active`) y triggers `updated_at`, tal como plan §3.3.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-02`: un correo con mayúsculas o espacios viola el CHECK.
    - `RN-13`: un nombre con espacios al inicio o al final viola el CHECK.
    - `RF-M1-05`: no pueden coexistir dos enlaces vigentes del mismo usuario y propósito.
    - `RF-M1-16`: `email_kind` tiene exactamente los 6 correos de la cuenta.

- [x] **`TASK-013`: Tablas de tipo de cambio, monedas y ajustes (M3, M9, M10)**
  - **Dependencias:** Requiere TASK-012
  - **Trazabilidad SDD:** plan §3.4, plan §3.1 (orden de la migración), ADR-12; RF-M3-01, RF-M3-02, RF-M3-13
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0003_fx_settings/migration.sql`
    - `packages/db/test/schema-fx-settings.test.ts`
  - **Especificación de Implementación:** `market_rate` (global, sin `user_id`), `currency`, `user_fx_event`, `user_settings` (sin la clave foránea a `account`, que se crea en TASK-020), `favorite_category` (sin la clave foránea a `category`) y la función `user_rate_on`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-01`: una moneda de sistema no puede quedar inactiva.
    - `RF-M3-02`: una tasa menor que 0,01 viola el CHECK.
    - Los CHECK de `user_fx_event` rechazan cada combinación inválida de `kind`.
    - `RF-M3-13`: `user_rate_on` devuelve la última tasa del día en la zona del usuario y, antes del primer dato, el primer valor conocido.

- [x] **`TASK-014`: Tabla `account` y trigger `account_initial_immutable` (M4)**
  - **Dependencias:** Requiere TASK-013
  - **Trazabilidad SDD:** plan §3.5; RF-M4-01, RF-M4-02, RF-M4-07, EC-M4-02
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0004_account/migration.sql`
    - `packages/db/test/schema-account.test.ts`
  - **Especificación de Implementación:** Tabla `account` con sus CHECK, el índice `account_active_name`, el índice de orden y el trigger `BEFORE UPDATE` que impide cambiar `initial_balance` e `initial_balance_date`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-01`: dos cuentas activas con el mismo nombre (sin distinguir mayúsculas) violan el índice; una archivada no.
    - `RF-M4-02`: efectivo o billetera con saldo inicial negativo violan el CHECK.
    - `RF-M4-07` / `EC-M4-02`: un UPDATE del saldo inicial o de su fecha falla.
    - Los campos de tarjeta solo se aceptan en `credit_card`.

- [x] **`TASK-015`: Tabla `category` y trigger `category_guard` (M5)**
  - **Dependencias:** Requiere TASK-014
  - **Trazabilidad SDD:** plan §3.5, plan §4.5.3; RF-M5-01, RF-M5-02, RF-M5-05, EC-M5-01
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0005_category/migration.sql`
    - `packages/db/test/schema-category.test.ts`
  - **Especificación de Implementación:** Tabla `category`, índices `category_active_name` (`NULLS NOT DISTINCT`) y `category_system_key`, y el trigger `category_guard` con las reglas de plan §3.5.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M5-01`: "comida" y "Comida" activas en el mismo tipo y padre violan el índice.
    - `RF-M5-01`: cambiar el `kind` falla.
    - El trigger rechaza un segundo nivel, un padre de otro tipo o archivado, y que una categoría con hijas pase a ser hija.
    - `RF-M5-05`: en la categoría del sistema solo se pueden cambiar el color y el ícono.

- [x] **`TASK-016`: Libro contable, deshacer y atajos (M6, M7)**
  - **Dependencias:** Requiere TASK-015
  - **Trazabilidad SDD:** plan §3.5, ADR-04, ADR-07, ADR-15; RF-M6-01, RF-M6-03, RF-M7-09, RN-09
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0006_ledger/migration.sql`
    - `packages/db/test/schema-ledger.test.ts`
  - **Especificación de Implementación:** `ledger_transaction` (sin la clave foránea a `recurring_rule`, que se crea en TASK-020), `ledger_entry`, `undo_action` y `shortcut`, con los índices `ledger_tx_list` y `ledger_entry_balance` y los demás de plan §3.5.
  - **Criterios de Verificación (Tests & DoD):**
    - Un gasto o ingreso sin categoría viola el CHECK; una transferencia con categoría también.
    - `declared_rate` solo se acepta en transferencias, y `origin = 'fee'` exige `parent_transaction_id`.
    - `RN-09`: un asiento que apunta a la cuenta de otro usuario viola la clave foránea compuesta.
    - `RF-M7-09`: los CHECK de `shortcut` exigen destino solo en transferencias y categoría en los demás tipos.

- [x] **`TASK-017`: Tablas de presupuestos (M11)**
  - **Dependencias:** Requiere TASK-016
  - **Trazabilidad SDD:** plan §3.6; RF-M11-01, RF-M11-04, RF-M11-13, RNF-12
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0007_budgets/migration.sql`
    - `packages/db/test/schema-budgets.test.ts`
  - **Especificación de Implementación:** `budget`, `budget_period`, `budget_late_adjustment` y `budget_threshold_hit`, con los índices únicos parciales de plan §3.6.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M11-01`: no pueden coexistir dos presupuestos activos o pausados de la misma categoría, ni dos generales; uno `finalized` no cuenta.
    - `RF-M11-04`: un `start_day` fuera de 1–28 viola el CHECK.
    - `RF-M11-13`: más de 3 umbrales, o un umbral fuera de 1–150, viola el CHECK.
    - `RNF-12`: un mismo umbral no se registra dos veces por período.

- [x] **`TASK-018`: Tablas de metas y deudas (M12, M13)**
  - **Dependencias:** Requiere TASK-017
  - **Trazabilidad SDD:** plan §3.6, ADR-14; RF-M12-01, RF-M12-03, RF-M13-01, RF-M13-05
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0008_goals_debts/migration.sql`
    - `packages/db/test/schema-goals-debts.test.ts`
  - **Especificación de Implementación:** `goal`, `goal_allocation_event`, `debt` (`interest_unpaid numeric(24,10)`) y `debt_payment`, con sus índices y CHECK.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M12-03`: una cuenta no puede estar dedicada a dos metas, y una meta archivada no puede tener cuenta dedicada.
    - `RF-M13-01`: una tasa de interés fuera de 0,01–100 viola el CHECK.
    - `RF-M13-05`: un pago con `amount ≠ interest_part + capital_part` viola el CHECK.
    - `interest_unpaid` conserva 10 decimales.

- [x] **`TASK-019`: Tablas de recurrentes, avisos y `job_run` (M14, M15)**
  - **Dependencias:** Requiere TASK-018
  - **Trazabilidad SDD:** plan §3.6, plan §3.7; RF-M14-12, RF-M14-14, RF-M14-15, RN-10
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0009_recurring_notifications/migration.sql`
    - `packages/db/test/schema-recurring-notifications.test.ts`
  - **Especificación de Implementación:** `recurring_rule`, `recurring_occurrence`, `notification`, `notification_preference` y `job_run`, con sus CHECK e índices.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M14-12`: dos ocurrencias de la misma regla y fecha violan la restricción única.
    - `RF-M14-14`: una regla automática sin monto viola el CHECK.
    - `RF-M14-15`: un nombre vacío o de más de 40 caracteres viola el CHECK.
    - `RN-10`: dos avisos con el mismo `event_key` para el mismo usuario violan la restricción única.

- [x] **`TASK-020`: Claves foráneas diferidas y pruebas de integridad y cascadas**
  - **Dependencias:** Requiere TASK-019
  - **Trazabilidad SDD:** plan §3.1 (orden de la migración), plan §3.8, plan §3.9; RN-08, RN-09, RF-M1-15, RF-M4-13, RF-M6-05, RF-M14-11
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0010_deferred_fks/migration.sql`
    - `packages/db/test/schema-integrity.test.ts`
  - **Especificación de Implementación:** Crea las claves foráneas hacia tablas definidas después: `user_settings → account` (`SET NULL`), `favorite_category → category` (`CASCADE`) y `ledger_transaction → recurring_rule` (`SET NULL`). Las migraciones de la Fase 1 forman juntas la migración inicial de plan §3.1.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-15`: borrar `auth_user` deja 0 filas del usuario en todas las tablas de negocio.
    - `RN-08`: no se puede borrar una cuenta con asientos ni una categoría con movimientos.
    - `RF-M4-13`: los atajos caen en cascada con su cuenta.
    - `RF-M6-05`: la comisión cae en cascada con su transferencia.
    - `RF-M14-11`: al borrar una regla, sus movimientos quedan con `recurring_rule_id = NULL` y conservan `recurring_label`.
    - `RN-09`: ninguna clave foránea compuesta acepta un recurso de otro usuario.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-04 - Libro contable de doble asiento]] · [[ADR-07 - Deshacer con token]] · [[ADR-10 - Esquema Prisma más SQL]] · [[ADR-12 - Datos de mercado globales]] · [[ADR-14 - Interés de deudas como foto]] · [[ADR-15 - Nombres de tablas del libro]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Plan 3.1 Convenciones]] · [[Plan 3.2 Tipos enumerados]] · [[Plan 3.3 Cuenta de usuario y seguridad (M1)]] · [[Plan 3.4 Ajustes y tipo de cambio (M3, M9, M10)]] · [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]] · [[Plan 3.6 Planificación (M11 a M14)]] · [[Plan 3.7 Avisos e infraestructura (M15)]] · [[Plan 3.8 Integridad y cascadas]] · [[Plan 3.9 Seguridad a nivel de datos]] · [[Plan 4.5 M5 - Categorías (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - Account]] · [[Entidad - AuthAccount]] · [[Entidad - AuthSession]] · [[Entidad - AuthUser]] · [[Entidad - AuthVerification]] · [[Entidad - Budget]] · [[Entidad - BudgetLateAdjustment]] · [[Entidad - BudgetPeriod]] · [[Entidad - BudgetThresholdHit]] · [[Entidad - Category]] · [[Entidad - Currency]] · [[Entidad - Debt]] · [[Entidad - DebtPayment]] · [[Entidad - EmailLink]] · [[Entidad - EmailOutbox]] · [[Entidad - EmailSendLog]] · [[Entidad - FavoriteCategory]] · [[Entidad - Goal]] · [[Entidad - GoalAllocationEvent]] · [[Entidad - JobRun]] · [[Entidad - LedgerEntry]] · [[Entidad - LedgerTransaction]] · [[Entidad - LoginThrottle]] · [[Entidad - MarketRate]] · [[Entidad - Notification]] · [[Entidad - NotificationPreference]] · [[Entidad - RecurringOccurrence]] · [[Entidad - RecurringRule]] · [[Entidad - Shortcut]] · [[Entidad - UndoAction]] · [[Entidad - UserFxEvent]] · [[Entidad - UserSettings]]

