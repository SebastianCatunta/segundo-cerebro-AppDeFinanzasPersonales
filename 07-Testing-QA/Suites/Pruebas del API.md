---
tipo: "testing"
fuente: "apps/api/test"
tags:
  - "testing/api"
actualizado: "2026-10-30"
---

# Pruebas del API (Vitest)

Carpeta `apps/api/test/`: unitarias, contratos HTTP con supertest e integración contra Postgres real (aislamiento entre usuarios, concurrencia, jobs, zonas horarias, rendimiento). Las *factories* de `test/factories` crean datos de prueba. El nombre de cada caso lleva el ID que verifica (`RF-M4-04 …`, `TASK-038 …`).

## Unitarias (`test/unit`)

| Archivo | Primer describe | Casos | Módulo |
|---|---|---|---|
| `bcb.test.ts` | BCB fetchOfficial | 16 | — |
| `csv-zip.test.ts` | createZipStream | 7 | — |
| `email-templates.test.ts` | email templates | 7 | — |
| `env.test.ts` | env | 12 | — |
| `errors.test.ts` | AppError | 5 | — |
| `limits.test.ts` | LIMITS | 6 | — |
| `paralelo-bo.test.ts` | paralelo.bo fetchParallel | 20 | — |
| `sdd-coherence.test.ts` | TASK-271 SDD coherence — email kinds | 31 | — |

## HTTP (`test/http`)

| Archivo | Primer describe | Casos | Módulo |
|---|---|---|---|
| `app.test.ts` | GET /api/health | 16 | — |
| `auth.test.ts` | POST /api/auth/sign-up | 57 | [[M1 - Acceso y cuenta\|M1]] |
| `bootstrap.test.ts` | buildContainer y createApp | 3 | — |
| `budgets.isolation.test.ts` | aislamiento de presupuestos entre usuarios | 5 | [[M11 - Presupuestos\|M11]] |
| `budgets.test.ts` | release gate and session | 30 | [[M11 - Presupuestos\|M11]] |
| `currencies-deactivate.test.ts` | POST /api/currencies/:code/deactivate | 15 | [[M3 - Monedas y tipo de cambio\|M3]] |
| `currencies.test.ts` | POST /api/currencies | 24 | [[M3 - Monedas y tipo de cambio\|M3]] |
| `dashboard-budgets.test.ts` | GET /api/dashboard bloque de presupuestos | 6 | [[M8 - Inicio (dashboard)\|M8]] |
| `dashboard-upcoming-recurring.test.ts` | GET /api/dashboard recurrentes en Próximos pagos y deudas | 6 | [[M8 - Inicio (dashboard)\|M8]] |
| `dashboard-upcoming.test.ts` | GET /api/dashboard bloque de próximos pagos y deudas | 6 | [[M8 - Inicio (dashboard)\|M8]] |
| `dashboard.test.ts` | GET /api/dashboard | 12 | [[M8 - Inicio (dashboard)\|M8]] |
| `debts.isolation.test.ts` | aislamiento de deudas entre usuarios | 4 | [[M13 - Deudas y préstamos\|M13]] |
| `debts.test.ts` | release gate and session | 38 | [[M13 - Deudas y préstamos\|M13]] |
| `fx-settings.test.ts` | PATCH /api/fx-settings | 18 | [[M3 - Monedas y tipo de cambio\|M3]] |
| `goals.isolation.test.ts` | aislamiento de metas entre usuarios | 5 | [[M12 - Metas de ahorro\|M12]] |
| `goals.test.ts` | release gate and session | 26 | [[M12 - Metas de ahorro\|M12]] |
| `isolation-sweep.test.ts` | RNF-14 cobertura: ninguna ruta montada queda sin cubrir | 12 | — |
| `logs-secrets.test.ts` | RNF-17 los logs no contienen contraseñas, tokens de enlaces ni cookies | 12 | — |
| `me-delete.test.ts` | POST /api/me/delete | 7 | [[M1 - Acceso y cuenta\|M1]] |
| `me-export-v1-1.test.ts` | GET /api/me/export con RELEASE=1.1 | 6 | [[M1 - Acceso y cuenta\|M1]] |
| `me-export-v1-2.test.ts` | GET /api/me/export con RELEASE=1.2 | 6 | [[M1 - Acceso y cuenta\|M1]] |
| `me-export.test.ts` | GET /api/me/export | 9 | [[M1 - Acceso y cuenta\|M1]] |
| `me.test.ts` | GET /api/me | 11 | [[M1 - Acceso y cuenta\|M1]] |
| `notification-preferences.test.ts` | release gate and session | 13 | [[M15 - Recordatorios y avisos\|M15]] |
| `notifications.test.ts` | GET /api/notifications | 22 | [[M15 - Recordatorios y avisos\|M15]] |
| `onboarding.test.ts` | TASK-159 rutas del Onboarding: sesión | 33 | [[M10 - Onboarding\|M10]] |
| `rates.test.ts` | GET /api/rates/current | 10 | — |
| `recurring.isolation.test.ts` | aislamiento de recurrentes entre usuarios | 6 | [[M14 - Recurrentes\|M14]] |
| `recurring.test.ts` | release gate and session | 32 | [[M14 - Recurrentes\|M14]] |
| `release-gate.test.ts` | releaseGate | 7 | — |
| `server-timing.test.ts` | Server-Timing en toda respuesta | 16 | — |
| `session-middlewares.test.ts` | requireSession | 21 | — |
| `settings-register.test.ts` | PATCH /api/settings: cuenta por defecto | 14 | [[M9 - Ajustes y personalización\|M9]] |
| `settings-reset.test.ts` | POST /api/settings/reset: entrada | 14 | [[M9 - Ajustes y personalización\|M9]] |
| `settings.test.ts` | GET y PATCH /api/settings | 11 | [[M9 - Ajustes y personalización\|M9]] |
| `test-support.test.ts` | INTEGRATIONS=real | 11 | — |

## Integración (`test/integration`)

| Archivo | Primer describe | Casos | Módulo |
|---|---|---|---|
| `account-ledger-repositories.test.ts` | accounts.insert y accounts.get | 27 | [[M4 - Cuentas\|M4]] |
| `accounts-goals.test.ts` | AccountsService: cuentas con apartados y dedicadas | 11 | [[M4 - Cuentas\|M4]] |
| `auth-confirm.test.ts` | confirmation resend: limits | 21 | [[M1 - Acceso y cuenta\|M1]] |
| `auth-gateway.test.ts` | contraseñas | 10 | [[M1 - Acceso y cuenta\|M1]] |
| `auth-password.test.ts` | password forgot | 24 | [[M1 - Acceso y cuenta\|M1]] |
| `auth-signin.test.ts` | sign-in: success and unconfirmed email | 19 | [[M1 - Acceso y cuenta\|M1]] |
| `auth-signup-ticket.test.ts` | signup_ticket repository | 29 | [[M1 - Acceso y cuenta\|M1]] |
| `auth-signup.test.ts` | sign-up: new email | 21 | [[M1 - Acceso y cuenta\|M1]] |
| `balance-guard-earmarks.test.ts` | BalanceGuard: protección de apartados | 10 | — |
| `balance-guard.test.ts` | BalanceGuard: negativos en efectivo y billetera | 12 | — |
| `budget-ledger-hook.test.ts` | umbrales del período en curso | 14 | [[M11 - Presupuestos\|M11]] |
| `budget-repositories.test.ts` | budget repository | 17 | [[M11 - Presupuestos\|M11]] |
| `budgets-close-job.test.ts` | budgets.close | 14 | [[M11 - Presupuestos\|M11]] |
| `budgets-create.test.ts` | BudgetsService: crear, listar y detalle | 19 | [[M11 - Presupuestos\|M11]] |
| `budgets-decision.test.ts` | budgets.decide — sobrante | 20 | [[M11 - Presupuestos\|M11]] |
| `budgets-default-job.test.ts` | budgets.defaultDecision | 8 | [[M11 - Presupuestos\|M11]] |
| `budgets-lifecycle.test.ts` | BudgetsService: editar, pausar, reanudar, reiniciar el arrastre y eliminar | 13 | [[M11 - Presupuestos\|M11]] |
| `catch-up.test.ts` | Jobs.catchUpUser | 13 | — |
| `categories-archive.test.ts` | CategoriesService.archiveImpact | 16 | [[M5 - Categorías\|M5]] |
| `categories-budgets.test.ts` | archivar una categoría con presupuesto | 10 | [[M5 - Categorías\|M5]] |
| `categories-crud.test.ts` | CategoriesService.create | 30 | [[M5 - Categorías\|M5]] |
| `category-repository.test.ts` | categories.insert y categories.get | 24 | — |
| `concurrency-sweep.test.ts` | TASK-246 desactivar una moneda mientras se crea una cuenta en ella | 13 | — |
| `dashboard-cards.test.ts` | TASK-145 DashboardService: tarjetas | 13 | [[M8 - Inicio (dashboard)\|M8]] |
| `dashboard-cost.test.ts` | RNF-03 costo de GET /api/dashboard con el seed de 5.000 movimientos | 15 | [[M8 - Inicio (dashboard)\|M8]] |
| `debt-repositories.test.ts` | debts.insert y debts.get | 23 | [[M13 - Deudas y préstamos\|M13]] |
| `debts-create.test.ts` | DebtsService.create | 20 | [[M13 - Deudas y préstamos\|M13]] |
| `debts-delete-payment.test.ts` | DebtsService.deleteLastPayment: deuda pagada | 12 | [[M13 - Deudas y préstamos\|M13]] |
| `debts-lifecycle.test.ts` | DebtsService.forgive | 24 | [[M13 - Deudas y préstamos\|M13]] |
| `debts-payments.test.ts` | DebtsService.pay: interés y desglose | 26 | [[M13 - Deudas y préstamos\|M13]] |
| `earmark-protection.test.ts` | Protección de apartados en movimientos | 9 | — |
| `email-links.test.ts` | email links: create | 13 | — |
| `fx-jobs.test.ts` | fx.fetchParallel: cuándo consulta | 28 | [[M3 - Monedas y tipo de cambio\|M3]] |
| `fx-repositories.test.ts` | marketRates.upsertIfNewer | 25 | [[M3 - Monedas y tipo de cambio\|M3]] |
| `gherkin-accounts-categories.test.ts` | M3 la historia no se reescribe | 17 | — |
| `goal-milestones.test.ts` | hitos de avance de una meta | 18 | [[M12 - Metas de ahorro\|M12]] |
| `goal-repositories.test.ts` | goal repository | 10 | [[M12 - Metas de ahorro\|M12]] |
| `goals-crud.test.ts` | GoalsService: crear, editar, listar y detalle | 20 | [[M12 - Metas de ahorro\|M12]] |
| `goals-earmarks.test.ts` | GoalsService: apartar, liberar y dedicar | 13 | [[M12 - Metas de ahorro\|M12]] |
| `goals-lifecycle.test.ts` | GoalsService: usar y cerrar, archivar, restaurar, eliminar y celebrar | 11 | [[M12 - Metas de ahorro\|M12]] |
| `jobs-resume.test.ts` | RNF-13 budgets.close se retoma tras una interrupción | 12 | — |
| `ledger-hooks-undo.test.ts` | LedgerHooks | 12 | — |
| `ledger-list.test.ts` | ledger.list orden | 22 | — |
| `login-throttle.test.ts` | login throttle: waits | 18 | — |
| `maintenance-auth.test.ts` | maintenance: descarte de registros sin confirmar | 9 | — |
| `maintenance-notifications.test.ts` | maintenance: retención de avisos | 5 | — |
| `notification-emitter.test.ts` | NotificationEmitter.emit | 14 | [[M15 - Recordatorios y avisos\|M15]] |
| `notifications-debts-job.test.ts` | notifications.scheduled: vencimientos de deudas | 18 | [[M15 - Recordatorios y avisos\|M15]] |
| `notifications-log-day-job.test.ts` | notifications.scheduled: registrar el día, hora y valor por defecto | 15 | [[M15 - Recordatorios y avisos\|M15]] |
| `notifications-payments-job.test.ts` | notifications.scheduled: pagos próximos de recurrentes | 29 | [[M15 - Recordatorios y avisos\|M15]] |
| `onboarding-step1.test.ts` | TASK-156 OnboardingService.get | 20 | [[M10 - Onboarding\|M10]] |
| `onboarding-step2.test.ts` | TASK-157 OnboardingService.step2 | 19 | [[M10 - Onboarding\|M10]] |
| `onboarding-step3.test.ts` | TASK-158 OnboardingService.step3: quitar las desmarcadas | 22 | [[M10 - Onboarding\|M10]] |
| `outbox.test.ts` | enqueue | 8 | — |
| `performance.test.ts` | TASK-167 rendimiento del API con el seed de 5.000 movimientos | 4 | — |
| `rates-service.test.ts` | RatesService.current | 19 | — |
| `read-no-lock.test.ts` | lecturas del UnitOfWork sin bloqueo exclusivo por usuario | 11 | — |
| `readiness.test.ts` | GET /api/health/ready con la base de test | 5 | — |
| `recurring-cascades.test.ts` | Archivar la cuenta de una regla (EC-M14-02) | 11 | [[M14 - Recurrentes\|M14]] |
| `recurring-confirm.test.ts` | RecurringService.confirm | 20 | [[M14 - Recurrentes\|M14]] |
| `recurring-create.test.ts` | RecurringService.create: fecha de inicio y ocurrencia de hoy | 15 | [[M14 - Recurrentes\|M14]] |
| `recurring-expire-job.test.ts` | recurring.expirePending: pendiente vence | 11 | [[M14 - Recurrentes\|M14]] |
| `recurring-generate-job.test.ts` | recurring.generate: automático bloqueado pasa a pendiente | 18 | [[M14 - Recurrentes\|M14]] |
| `recurring-repositories.test.ts` | recurringRules.insert y recurringRules.get | 22 | [[M14 - Recurrentes\|M14]] |
| `recurring-resume.test.ts` | RecurringService.pause | 20 | [[M14 - Recurrentes\|M14]] |
| `recurring-update-delete.test.ts` | RecurringService.update | 8 | [[M14 - Recurrentes\|M14]] |
| `request-cost.test.ts` | RNF-29 presupuesto de consultas por petición con el seed de 5.000 movimientos | 20 | — |
| `session-cost.test.ts` | costo de la sesión de una petición autenticada | 16 | — |
| `tick.test.ts` | JobRuns.tryAcquire | 24 | — |
| `timezones.test.ts` | RNF-20 la fecha de un movimiento en la zona del usuario | 38 | — |
| `transactions-create.test.ts` | TransactionsService.create: gastos e ingresos | 25 | [[M6 - Transacciones\|M6]] |
| `transactions-delete-undo.test.ts` | TASK-124 Eliminar y deshacer | 31 | [[M6 - Transacciones\|M6]] |
| `transactions-transfer.test.ts` | RF-M6-05 Transferencia con comision | 29 | [[M6 - Transacciones\|M6]] |
| `transactions-update.test.ts` | TASK-123 editar un gasto o un ingreso | 48 | [[M6 - Transacciones\|M6]] |
| `unit-of-work.test.ts` | UnitOfWork.run | 20 | — |
| `user-bootstrap.test.ts` | user bootstrap: currencies and settings | 11 | — |

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.7 Tiempo]]
- **Fases de tareas:** [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 13 - M8 Inicio (V1.0)]] · [[Tareas Fase 15 - M10 Onboarding (V1.0)]] · [[Tareas Fase 17 - Cierre de V1.0 rendimiento, accesibilidad y despliegue]] · [[Tareas Fase 25 - Final integración E2E y validación de RNF]] · [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]] · [[Tareas Fase 4 - Base del API]]

