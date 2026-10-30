---
tipo: "backend"
tags:
  - "backend/composicion"
actualizado: "2026-10-30"
---

# Raíz de composición (`composition/container.ts`)

↑ [[API - Visión general]]

Es el único archivo que conoce **todas** las capas (unas 1.000 líneas). `buildContainer(env)`:

1. Crea el contador de consultas, el cliente Prisma y el [[API - Unit of Work y aislamiento|UnitOfWork]] con su `buildRepositories`.
2. Crea `JobRuns` y `createJobs({ jobRuns, clock, release })` ([[Job - tick]]).
3. Crea los servicios compartidos: `RatesService`, `NotificationEmitter`, `GoalMilestones`, `LedgerHooks` y `RecurringGenerator`.
4. **Registra cada job** con `jobs.registerJob(name, run, scope?)`: `fx.*`, `notifications.scheduled`, `budgets.*`, `recurring.*`, `outbox.send` y `maintenance`.
5. Crea las integraciones reales o *fake* según `INTEGRATIONS` ([[Integración - paralelo.bo]], [[Integración - BCB]], [[Integración - Resend]]) y el `AuthGateway` de Better Auth.
6. Crea los servicios de cada módulo (auth, me, settings, fx, currencies, accounts, transactions, shortcuts, register, dashboard, categories, budgets, goals, debts, recurring, onboarding, notifications).
7. Devuelve el `Container`, y `createApp(container)` arma el `AppDeps` de `presentation/app.ts`.

Ejemplo de inyección: `createTransactionsService({ uow, rates: ratesService, ledgerHooks })`. El controlador de transacciones recibe ese servicio. La presentación nunca ve a Prisma.

Ver [[ADR-19 - Backend en capas]] y [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]].
