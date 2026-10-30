---
tipo: "testing"
fuente: "packages/*/test"
tags:
  - "testing/paquetes"
actualizado: "2026-10-30"
---

# Pruebas de los paquetes compartidos

## domain (`packages/domain/test`)

| Archivo | Primer describe | Casos | Módulo |
|---|---|---|---|
| `balance.test.ts` | balanceFrom (RN-01, RN-12) | 29 | — |
| `budget-math.test.ts` | available (RF-M11-05, EC-M11-01) | 16 | — |
| `budget-periods.test.ts` | periodFor (RF-M11-04) | 9 | — |
| `dashboard.test.ts` | comparisonWindow (RF-M8-04, EC-M8-03) | 16 | — |
| `dates.test.ts` | dates: todayFor e isFutureFor (RN-07, RNF-20) | 27 | — |
| `debts.test.ts` | dailyRate (RF-M13-02) | 16 | — |
| `format-date.test.ts` | format: formatDate (RF-M9-03) | 15 | — |
| `format-money.test.ts` | format: formatMoney (RF-M9-02) | 15 | — |
| `fx-convert.test.ts` | convert (RN-06, RN-05) | 28 | — |
| `fx-gap.test.ts` | classifyBidAsk (ADR-06) | 6 | — |
| `fx-resolve.test.ts` | resolveUsdRate | 19 | — |
| `goals.test.ts` | progress (RF-M12-02, EC-M12-04) | 15 | — |
| `money.test.ts` | money: round2 | 14 | — |
| `net-worth.test.ts` | netWorth (RF-M4-10, RN-05, RN-06) | 11 | — |
| `recurrence.test.ts` | recurrence: nextDates (RF-M14-01, RF-M14-02) | 15 | — |

## contracts (`packages/contracts/test`)

| Archivo | Primer describe | Casos | Módulo |
|---|---|---|---|
| `accounts.test.ts` | AccountType | 16 | — |
| `auth.test.ts` | SignUpInput (RF-M1-01) | 28 | — |
| `budgets.test.ts` | CreateBudgetInput | 18 | — |
| `catalogs.test.ts` | catalogs: PaletteKey (RF-M5-04, RNF-06) | 10 | — |
| `categories.test.ts` | CreateCategoryInput | 17 | — |
| `common.test.ts` | Amount (RF-M6-01) | 30 | — |
| `dashboard.test.ts` | DashboardQuery | 5 | — |
| `debts.test.ts` | CreateDebtInput | 17 | — |
| `errors.test.ts` | ErrorCode (plan 4.0, ADR-09) | 10 | — |
| `fx.test.ts` | fx: CreateCurrencyInput (RF-M3-02) | 20 | — |
| `goals.test.ts` | CreateGoalInput | 13 | — |
| `notifications.test.ts` | NotificationType | 15 | — |
| `onboarding.test.ts` | Step1Input | 17 | — |
| `recurring.test.ts` | CreateRuleInput | 18 | — |
| `releases.test.ts` | MODULE_RELEASE (RF-M2-03, spec 1.2) | 13 | — |
| `settings.test.ts` | UpdateSettingsInput: barra lateral (RF-M2-09) | 24 | — |
| `transactions.test.ts` | CreateTransactionInput | 27 | — |

## db (`packages/db/test`)

Verifican restricciones, triggers y cascadas del esquema contra Postgres.

| Archivo | Primer describe | Casos | Módulo |
|---|---|---|---|
| `fx-backfill.test.ts` | TASK-091 fx-backfill with a 10-day client | 11 | — |
| `global-setup.ts` |  | 0 | — |
| `helpers.ts` |  | 0 | — |
| `isolation-extension.test.ts` | forUser: lecturas | 22 | — |
| `preset-categories.test.ts` | preset categories | 8 | — |
| `schema-account.test.ts` | TASK-014 account table, indexes and trigger exist | 25 | — |
| `schema-auth.test.ts` | TASK-012 auth tables exist | 39 | — |
| `schema-base.test.ts` | TASK-011 base migration: enumerated types | 5 | — |
| `schema-budgets.test.ts` | TASK-017 budget tables exist | 20 | — |
| `schema-category.test.ts` | TASK-015 category table, indexes and trigger exist | 39 | — |
| `schema-fx-settings.test.ts` | TASK-013 fx and settings tables exist | 30 | — |
| `schema-goals-debts.test.ts` | TASK-018 goal and debt tables exist | 19 | — |
| `schema-integrity.test.ts` | TASK-020 deferred foreign keys | 36 | — |
| `schema-ledger.test.ts` | TASK-016 ledger tables and indexes exist | 45 | — |
| `schema-recurring-notifications.test.ts` | TASK-019 recurring, notification and job_run tables exist | 10 | — |
| `seed-e2e.test.ts` | TASK-166 seed:e2e known users and fixed rates | 9 | — |

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-06 - Fuentes de tasas de cambio]] · [[ADR-09 - Errores problem+json]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.7 Tiempo]]
- **Fases de tareas:** [[Tareas Fase 1 - Esquema de datos]] · [[Tareas Fase 17 - Cierre de V1.0 rendimiento, accesibilidad y despliegue]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

