---
tipo: "backend"
fuente: "apps/api/src/presentation/presenters"
tags:
  - "backend/presentacion"
actualizado: "2026-10-30"
---

# Presentadores (entidad → DTO)

Convierten las entidades de aplicación en los DTO de `packages/contracts` que devuelve cada endpoint. Uno por grupo de rutas.

| Archivo | Líneas | Descripción (comentario del código) | Exporta |
|---|---|---|---|
| `accounts.presenter.ts` ([[API accounts]]) | 33 | Net worth and breakdown of the active accounts (RF-M4-10). Without a rate needed to convert, the amounts that depend on it are `null` (EC-M3-02). | `AccountsSummaryResponse`, `AccountListResponse`, `BalanceSeriesResponse`, `AccountsPresenter` |
| `budgets.presenter.ts` ([[API budgets]]) | 19 | Builds the answers of `/api/budgets` (plan §4.11.2). Money travels as text (ADR-03). | `BudgetsPresenter` |
| `categories.presenter.ts` ([[API categories]]) | 32 | Category responses of `/api/categories` (plan §4.5.1). | `CategoriesPresenter` |
| `currencies.presenter.ts` ([[API currencies]]) | 24 | Builds the answers of `/api/currencies` (plan §4.3.2); rates travel as decimal text (ADR-03). | `CurrencyListDto`, `CurrenciesPresenter` |
| `dashboard.presenter.ts` ([[API dashboard]]) | 18 | Builds the answer of `GET /api/dashboard` (plan §4.8.2); amounts travel as decimal text (ADR-03). | `DashboardResponse`, `DashboardPresenter` |
| `debts.presenter.ts` ([[API debts]]) | 15 | Builds the answers of `/api/debts` (plan §4.13.2). Money travels as text (ADR-03). | `DebtsPresenter` |
| `fx.presenter.ts` ([[API fx]]) | 27 | One day of a rate history: the date and its value as decimal text (ADR-03). | `RateHistoryPointDto`, `RateHistoryDto`, `FxPresenter` |
| `goals.presenter.ts` ([[API goals]]) | 30 | Builds the answers of `/api/goals` (plan §4.12.2). Money travels as text (ADR-03). | `GoalsPresenter` |
| `me.presenter.ts` ([[API me]]) | 29 | The profile of the user behind a session, as the API reads it. | `MeProfile`, `Release`, `MePresenter` |
| `notifications.presenter.ts` ([[API notifications]]) | 33 | Builds the answers of `/api/notifications` (plan §4.15.1, §4.15.2). | `NotificationsPresenter` |
| `onboarding.presenter.ts` ([[API onboarding]]) | 28 | Where the Onboarding is after a step, the same shape as `MeDto['onboarding']`. | `OnboardingProgressDto`, `OnboardingPresenter` |
| `recurring.presenter.ts` ([[API recurring]]) | 23 | Builds the answers of `/api/recurring` (plan §4.14.2). Money travels as text (ADR-03). | `RecurringPresenter` |
| `register.presenter.ts` ([[API register]]) | 49 | The answer of `GET /api/register/context` (plan §4.7.2). Without a rate to convert it, the `amountInBase` of a recent movement is `null` (EC-M3-02). | `RegisterContextResponse`, `RegisterPresenter` |
| `settings.presenter.ts` ([[API settings]]) | 24 | Builds the `SettingsDto` of the contracts (plan §4.9.2). | `SettingsPresenter` |
| `shortcuts.presenter.ts` ([[API shortcuts]]) | 25 | Builds the answers of `/api/shortcuts` (plan §4.7.2); amounts travel as decimal text (ADR-03). | `ShortcutsPresenter` |
| `transactions.presenter.ts` ([[API transactions]]) | 111 | A movement of the answers (`TransactionDto`, plan §4.6.1). Without a rate to convert it, `amountInBase` is `null` (EC-M3-02). | `TransactionResponse`, `CreatedTransactionResponse`, `TransactionPageResponse`, `TransactionTotalsResponse`, `BatchResponse`, `TransactionsPresenter` |

---
## 🔗 Relacionado

- **Módulos:** [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]]
- **Spec / Plan / Constitución:** [[Plan 4.11 M11 - Presupuestos (V1.1)]] · [[Plan 4.12 M12 - Metas de ahorro (V1.1)]] · [[Plan 4.13 M13 - Deudas y préstamos (V1.1)]] · [[Plan 4.14 M14 - Recurrentes (V1.2)]] · [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]] · [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]] · [[Plan 4.5 M5 - Categorías (V1.0)]] · [[Plan 4.6 M6 - Transacciones (V1.0)]] · [[Plan 4.7 M7 - Registrar (V1.0)]] · [[Plan 4.8 M8 - Inicio (V1.0)]] · [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]]

