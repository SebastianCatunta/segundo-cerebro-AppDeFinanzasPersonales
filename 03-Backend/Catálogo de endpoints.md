---
tipo: "indice"
tags:
  - "backend/api"
actualizado: "2026-10-30"
---

# Catálogo de endpoints del API

Todos los endpoints montados en `apps/api/src/presentation/app.ts`, extraídos de las rutas (114 en total). Ver [[Flujo - Petición HTTP en el API]].

| Método | Ruta | Módulo | Sesión | Nota |
|---|---|---|---|---|
| `GET` | `/api/accounts` | [[M4 - Cuentas\|M4]] | ✅ | [[API accounts]] |
| `POST` | `/api/accounts` | [[M4 - Cuentas\|M4]] | ✅ | [[API accounts]] |
| `PUT` | `/api/accounts/order` | [[M4 - Cuentas\|M4]] | ✅ | [[API accounts]] |
| `PATCH` | `/api/accounts/:id` | [[M4 - Cuentas\|M4]] | ✅ | [[API accounts]] |
| `DELETE` | `/api/accounts/:id` | [[M4 - Cuentas\|M4]] | ✅ | [[API accounts]] |
| `POST` | `/api/accounts/:id/adjust` | [[M4 - Cuentas\|M4]] | ✅ | [[API accounts]] |
| `POST` | `/api/accounts/:id/archive` | [[M4 - Cuentas\|M4]] | ✅ | [[API accounts]] |
| `POST` | `/api/accounts/:id/restore` | [[M4 - Cuentas\|M4]] | ✅ | [[API accounts]] |
| `GET` | `/api/accounts/:id/balance-series` | [[M4 - Cuentas\|M4]] | ✅ | [[API accounts]] |
| `POST` | `/api/auth/sign-up` | [[M1 - Acceso y cuenta\|M1]] | — | [[API auth]] |
| `POST` | `/api/auth/sign-in` | [[M1 - Acceso y cuenta\|M1]] | — | [[API auth]] |
| `POST` | `/api/auth/confirmation/resend` | [[M1 - Acceso y cuenta\|M1]] | — | [[API auth]] |
| `POST` | `/api/auth/confirm` | [[M1 - Acceso y cuenta\|M1]] | — | [[API auth]] |
| `POST` | `/api/auth/confirmation/status` | [[M1 - Acceso y cuenta\|M1]] | — | [[API auth]] |
| `POST` | `/api/auth/password/forgot` | [[M1 - Acceso y cuenta\|M1]] | — | [[API auth]] |
| `POST` | `/api/auth/password/reset` | [[M1 - Acceso y cuenta\|M1]] | — | [[API auth]] |
| `POST` | `/api/auth/password/change` | [[M1 - Acceso y cuenta\|M1]] | ✅ | [[API auth]] |
| `POST` | `/api/auth/sign-out` | [[M1 - Acceso y cuenta\|M1]] | ✅ | [[API auth]] |
| `POST` | `/api/auth/sign-out-all` | [[M1 - Acceso y cuenta\|M1]] | ✅ | [[API auth]] |
| `GET` | `/api/budgets` | [[M11 - Presupuestos\|M11]] | — | [[API budgets]] |
| `POST` | `/api/budgets` | [[M11 - Presupuestos\|M11]] | — | [[API budgets]] |
| `GET` | `/api/budgets/:id` | [[M11 - Presupuestos\|M11]] | — | [[API budgets]] |
| `PATCH` | `/api/budgets/:id` | [[M11 - Presupuestos\|M11]] | — | [[API budgets]] |
| `DELETE` | `/api/budgets/:id` | [[M11 - Presupuestos\|M11]] | — | [[API budgets]] |
| `POST` | `/api/budgets/:id/pause` | [[M11 - Presupuestos\|M11]] | — | [[API budgets]] |
| `POST` | `/api/budgets/:id/resume` | [[M11 - Presupuestos\|M11]] | — | [[API budgets]] |
| `POST` | `/api/budgets/:id/reset-carryover` | [[M11 - Presupuestos\|M11]] | — | [[API budgets]] |
| `POST` | `/api/budgets/:id/periods/:periodId/decision` | [[M11 - Presupuestos\|M11]] | — | [[API budgets]] |
| `GET` | `/api/categories` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `POST` | `/api/categories` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `PUT` | `/api/categories/order` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `GET` | `/api/categories/merge-preview` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `POST` | `/api/categories/merge` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `PATCH` | `/api/categories/:id` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `DELETE` | `/api/categories/:id` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `GET` | `/api/categories/:id/archive-impact` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `POST` | `/api/categories/:id/archive` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `POST` | `/api/categories/:id/restore` | [[M5 - Categorías\|M5]] | ✅ | [[API categories]] |
| `GET` | `/api/currencies` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API currencies]] |
| `POST` | `/api/currencies` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API currencies]] |
| `PATCH` | `/api/currencies/:code` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API currencies]] |
| `POST` | `/api/currencies/:code/deactivate` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API currencies]] |
| `POST` | `/api/currencies/:code/activate` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API currencies]] |
| `GET` | `/api/dashboard` | [[M8 - Inicio (dashboard)\|M8]] | ✅ | [[API dashboard]] |
| `GET` | `/api/debts` | [[M13 - Deudas y préstamos\|M13]] | — | [[API debts]] |
| `POST` | `/api/debts` | [[M13 - Deudas y préstamos\|M13]] | — | [[API debts]] |
| `PATCH` | `/api/debts/:id` | [[M13 - Deudas y préstamos\|M13]] | — | [[API debts]] |
| `POST` | `/api/debts/:id/payments` | [[M13 - Deudas y préstamos\|M13]] | — | [[API debts]] |
| `DELETE` | `/api/debts/:id/payments/last` | [[M13 - Deudas y préstamos\|M13]] | — | [[API debts]] |
| `POST` | `/api/debts/:id/forgive` | [[M13 - Deudas y préstamos\|M13]] | — | [[API debts]] |
| `DELETE` | `/api/debts/:id` | [[M13 - Deudas y préstamos\|M13]] | — | [[API debts]] |
| `GET` | `/api/rates/current` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API fx]] |
| `GET` | `/api/rates/history` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API fx]] |
| `PATCH` | `/api/fx-settings` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API fx]] |
| `PUT` | `/api/fx/manual` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API fx]] |
| `DELETE` | `/api/fx/manual` | [[M3 - Monedas y tipo de cambio\|M3]] | ✅ | [[API fx]] |
| `GET` | `/api/goals` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `POST` | `/api/goals` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `GET` | `/api/goals/:id` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `PATCH` | `/api/goals/:id` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `DELETE` | `/api/goals/:id` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `POST` | `/api/goals/:id/earmarks` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `POST` | `/api/goals/:id/earmarks/release` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `POST` | `/api/goals/:id/dedicate` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `POST` | `/api/goals/:id/use-and-close` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `POST` | `/api/goals/:id/archive` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `POST` | `/api/goals/:id/restore` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `POST` | `/api/goals/:id/celebrated` | [[M12 - Metas de ahorro\|M12]] | — | [[API goals]] |
| `GET` | `/api/health` | [[M2 - Navegación y estructura\|M2]] | — | [[API health]] |
| `GET` | `/api/health/ready` | [[M2 - Navegación y estructura\|M2]] | — | [[API health]] |
| `GET` | `/api/me` | [[M1 - Acceso y cuenta\|M1]] | ✅ | [[API me]] |
| `PATCH` | `/api/me` | [[M1 - Acceso y cuenta\|M1]] | ✅ | [[API me]] |
| `GET` | `/api/me/export` | [[M1 - Acceso y cuenta\|M1]] | ✅ | [[API me]] |
| `POST` | `/api/me/delete` | [[M1 - Acceso y cuenta\|M1]] | ✅ | [[API me]] |
| `GET` | `/api/notifications` | [[M15 - Recordatorios y avisos\|M15]] | — | [[API notifications]] |
| `GET` | `/api/notifications/unread-count` | [[M15 - Recordatorios y avisos\|M15]] | — | [[API notifications]] |
| `POST` | `/api/notifications/read-all` | [[M15 - Recordatorios y avisos\|M15]] | — | [[API notifications]] |
| `POST` | `/api/notifications/:id/read` | [[M15 - Recordatorios y avisos\|M15]] | — | [[API notifications]] |
| `DELETE` | `/api/notifications/:id` | [[M15 - Recordatorios y avisos\|M15]] | — | [[API notifications]] |
| `GET` | `/api/notification-preferences` | [[M15 - Recordatorios y avisos\|M15]] | — | [[API notifications]] |
| `PATCH` | `/api/notification-preferences` | [[M15 - Recordatorios y avisos\|M15]] | — | [[API notifications]] |
| `GET` | `/api/onboarding` | [[M10 - Onboarding\|M10]] | ✅ | [[API onboarding]] |
| `POST` | `/api/onboarding/step1` | [[M10 - Onboarding\|M10]] | ✅ | [[API onboarding]] |
| `POST` | `/api/onboarding/step2` | [[M10 - Onboarding\|M10]] | ✅ | [[API onboarding]] |
| `POST` | `/api/onboarding/step3` | [[M10 - Onboarding\|M10]] | ✅ | [[API onboarding]] |
| `POST` | `/api/onboarding/skip` | [[M10 - Onboarding\|M10]] | ✅ | [[API onboarding]] |
| `POST` | `/api/onboarding/skip-all` | [[M10 - Onboarding\|M10]] | ✅ | [[API onboarding]] |
| `GET` | `/api/recurring` | [[M14 - Recurrentes\|M14]] | — | [[API recurring]] |
| `POST` | `/api/recurring` | [[M14 - Recurrentes\|M14]] | — | [[API recurring]] |
| `POST` | `/api/recurring/occurrences/:id/confirm` | [[M14 - Recurrentes\|M14]] | — | [[API recurring]] |
| `POST` | `/api/recurring/occurrences/:id/skip` | [[M14 - Recurrentes\|M14]] | — | [[API recurring]] |
| `PATCH` | `/api/recurring/:id` | [[M14 - Recurrentes\|M14]] | — | [[API recurring]] |
| `DELETE` | `/api/recurring/:id` | [[M14 - Recurrentes\|M14]] | — | [[API recurring]] |
| `POST` | `/api/recurring/:id/pause` | [[M14 - Recurrentes\|M14]] | — | [[API recurring]] |
| `GET` | `/api/recurring/:id/skipped` | [[M14 - Recurrentes\|M14]] | — | [[API recurring]] |
| `POST` | `/api/recurring/:id/resume` | [[M14 - Recurrentes\|M14]] | — | [[API recurring]] |
| `GET` | `/api/register/context` | [[M7 - Registrar\|M7]] | ✅ | [[API register]] |
| `GET` | `/api/settings` | [[M9 - Ajustes y personalización\|M9]] | ✅ | [[API settings]] |
| `PATCH` | `/api/settings` | [[M9 - Ajustes y personalización\|M9]] | ✅ | [[API settings]] |
| `POST` | `/api/settings/reset` | [[M9 - Ajustes y personalización\|M9]] | ✅ | [[API settings]] |
| `GET` | `/api/shortcuts` | [[M7 - Registrar\|M7]] | ✅ | [[API shortcuts]] |
| `POST` | `/api/shortcuts` | [[M7 - Registrar\|M7]] | ✅ | [[API shortcuts]] |
| `PUT` | `/api/shortcuts/order` | [[M7 - Registrar\|M7]] | ✅ | [[API shortcuts]] |
| `PATCH` | `/api/shortcuts/:id` | [[M7 - Registrar\|M7]] | ✅ | [[API shortcuts]] |
| `DELETE` | `/api/shortcuts/:id` | [[M7 - Registrar\|M7]] | ✅ | [[API shortcuts]] |
| `GET` | `/api/transactions` | [[M6 - Transacciones\|M6]] | ✅ | [[API transactions]] |
| `GET` | `/api/transactions/summary` | [[M6 - Transacciones\|M6]] | ✅ | [[API transactions]] |
| `POST` | `/api/transactions` | [[M6 - Transacciones\|M6]] | ✅ | [[API transactions]] |
| `POST` | `/api/transactions/undo` | [[M6 - Transacciones\|M6]] | ✅ | [[API transactions]] |
| `POST` | `/api/transactions/batch-delete` | [[M6 - Transacciones\|M6]] | ✅ | [[API transactions]] |
| `POST` | `/api/transactions/batch-recategorize` | [[M6 - Transacciones\|M6]] | ✅ | [[API transactions]] |
| `GET` | `/api/transactions/:id` | [[M6 - Transacciones\|M6]] | ✅ | [[API transactions]] |
| `PATCH` | `/api/transactions/:id` | [[M6 - Transacciones\|M6]] | ✅ | [[API transactions]] |
| `DELETE` | `/api/transactions/:id` | [[M6 - Transacciones\|M6]] | ✅ | [[API transactions]] |
