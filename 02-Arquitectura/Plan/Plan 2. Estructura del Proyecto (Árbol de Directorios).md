---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 2. Estructura del Proyecto (Árbol de Directorios)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan - Plan de diseño técnico]] · ← [[Plan 1. Visión Arquitectónica y Flujo del Sistema]] · → [[Plan 3. Esquema de Datos y Persistencia Global]]

## 2. Estructura del Proyecto (Árbol de Directorios)

```
/
├─ README.md                              # qué es, despliegues, cómo correrlo, CI/CD, SDD, puesta en marcha
├─ docs/
│  ├─ constitution.md
│  └─ execution-protocol.md               # pipeline de tareas con agentes (constitución §8)
├─ .claude/                               # settings.json (hooks), agents/ (test-author, implementer,
│                                         # sdd-auditor), skills/implement-task/
├─ .githooks/pre-push                     # control antes de subir (tools/sdd/pre-push.mjs)
├─ tools/sdd/                             # scripts del pipeline: preflight, gate, check, close, state…
├─ 001-appFinanzas-mvp/
│  ├─ spec.md
│  ├─ plan.md
│  └─ tasks.md
├─ apps/
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ main.ts                          # arranque: valida env, arma el contenedor, levanta Express
│  │  │  ├─ composition/
│  │  │  │  └─ container.ts                  # raíz de composición: une puertos con implementaciones
│  │  │  ├─ presentation/                    # CAPA 1 · HTTP
│  │  │  │  ├─ app.ts                        # middlewares globales y montaje de rutas
│  │  │  │  ├─ middlewares/                  # requireSession, trackActivity, requireJson, checkOrigin,
│  │  │  │  │                                # releaseGate, validate(schema), errorHandler (problem+json)
│  │  │  │  ├─ routes/                       # <modulo>.routes.ts (auth, me, settings, onboarding, fx, accounts,
│  │  │  │  │                                # categories, transactions, register, dashboard, budgets, goals,
│  │  │  │  │                                # debts, recurring, notifications)
│  │  │  │  ├─ controllers/                  # <modulo>.controller.ts: valida, arma el contexto, llama al servicio
│  │  │  │  ├─ presenters/                   # <modulo>.presenter.ts: entidad → DTO (Decimal → string)
│  │  │  │  └─ internal/jobs.controller.ts   # POST /internal/jobs/tick
│  │  │  ├─ application/                     # CAPA 2 · casos de uso
│  │  │  │  ├─ services/                     # <modulo>.service.ts (+ export.service.ts)
│  │  │  │  ├─ shared/                       # balance-guard.ts, ledger-hooks.ts, notification-emitter.ts,
│  │  │  │  │                                # currency-usage.ts, email-links.ts, login-throttle.ts
│  │  │  │  ├─ jobs/                         # tick.ts, fx.ts, outbox.ts, recurring.ts, budgets.ts,
│  │  │  │  │                                # notifications.ts, maintenance.ts
│  │  │  │  ├─ ports/                        # unit-of-work.ts, repositories.ts, rates-gateway.ts,
│  │  │  │  │                                # email-gateway.ts, auth-gateway.ts, clock.ts, id-generator.ts,
│  │  │  │  │                                # job-runs.ts, readiness.ts
│  │  │  │  └─ errors.ts                     # AppError + catálogo de códigos (ADR-09)
│  │  │  ├─ domain/                          # CAPA 3 · reexporta packages/domain + tipos de entidad
│  │  │  └─ infrastructure/                  # CAPA 4 · detalles técnicos
│  │  │     ├─ config/env.ts                 # variables validadas con Zod (INTEGRATIONS=fake prohibido en producción)
│  │  │     ├─ persistence/
│  │  │     │  ├─ prisma-client.ts           # cliente + extensión de aislamiento (ADR-05)
│  │  │     │  ├─ unit-of-work.ts            # transacción, withUserLock, repositorios ligados a tx y userId
│  │  │     │  ├─ job-runs.ts                # lease de los jobs en job_run (implementa ports/job-runs.ts)
│  │  │     │  ├─ readiness.ts               # SELECT 1 de /api/health/ready (implementa ports/readiness.ts)
│  │  │     │  └─ repositories/              # <entidad>.repository.ts (implementan ports/repositories.ts)
│  │  │     ├─ auth/better-auth.ts           # implementa AuthGateway (ADR-08)
│  │  │     ├─ integrations/                 # paralelo-bo.ts, bcb.ts, resend.ts y sus .fake.ts (CI)
│  │  │     └─ export/csv-zip.ts             # archiver + CSV neutralizado
│  │  ├─ test/
│  │  │  ├─ unit/                            # aplicación con repositorios en memoria y Clock falso
│  │  │  ├─ integration/                     # infraestructura + aislamiento + concurrencia (Postgres en Docker)
│  │  │  ├─ http/                            # contratos HTTP con supertest
│  │  │  └─ factories/
│  │  └─ package.json
│  └─ web/
│     ├─ src/
│     │  ├─ main.tsx · App.tsx
│     │  ├─ app/
│     │  │  ├─ router.tsx                 # rutas, guardas (RequireSession, RequireOnboardingDone, ReleaseGate)
│     │  │  ├─ layout/                    # AppShell, BottomTabBar, Sidebar, Header, MoreMenu
│     │  │  └─ providers/                 # QueryClient, i18n, tema
│     │  ├─ features/
│     │  │  ├─ auth/ · profile/ · navigation/ · fx/ · accounts/ · categories/ · transactions/
│     │  │  ├─ register/ · dashboard/ · settings/ · onboarding/ · budgets/ · goals/
│     │  │  └─ debts/ · recurring/ · notifications/
│     │  │      # cada feature: components/ · hooks/ (TanStack Query) · api.ts · routes.tsx
│     │  ├─ components/ui/                # shadcn/ui
│     │  ├─ lib/
│     │  │  ├─ api-client.ts              # fetch tipado, problem+json, X-Background, SESSION_EXPIRED
│     │  │  ├─ drafts.ts                  # useDraft
│     │  │  ├─ ui-store.ts                # store mínimo (pestañas, bloqueo, sesión vencida)
│     │  │  ├─ online.ts                  # detección sin conexión + onlineManager
│     │  │  └─ search-params.ts           # useValidatedSearch
│     │  └─ locales/es-BO/*.json          # textos (i18next)
│     └─ package.json
├─ packages/
│  ├─ contracts/src/                      # schemas Zod + tipos por módulo, errores, releases.ts
│  ├─ domain/src/                         # money · fx · format · balance · budget · goals · debts
│  │                                      # recurrence · dashboard · dates (todo puro, con tests)
│  ├─ db/
│  │  ├─ prisma/schema.prisma
│  │  ├─ prisma/migrations/               # SQL generado + SQL manual (ADR-10)
│  │  ├─ seed/                            # catálogos (íconos, paleta, categorías precargadas)
│  │  ├─ scripts/fx-backfill.ts           # carga única del histórico (ADR-06)
│  │  └─ src/client.ts                    # PrismaClient + extensión de aislamiento
│  └─ config/                             # tsconfig base, eslint, vitest base
├─ e2e/                                   # Playwright (escenarios Gherkin, accesibilidad, rendimiento)
├─ .github/workflows/                     # ci.yml · qa-e2e.yml · deploy.yml · fx-backfill.yml (1.5)
├─ render.yaml                            # Blueprint del API en Render (autoDeploy: false)
├─ vercel.json                            # rewrites /api y SPA; despliegue por Git desactivado
├─ .dependency-cruiser.cjs                # reglas de capas del backend (1.4)
├─ commitlint.config.cjs                  # Conventional Commits (§7)
├─ docker-compose.yml                     # Postgres para desarrollo y tests
├─ pnpm-workspace.yaml
└─ package.json
```

---

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-05 - Aislamiento por usuario]] · [[ADR-06 - Fuentes de tasas de cambio]] · [[ADR-08 - Autenticación sobre Better Auth]] · [[ADR-09 - Errores problem+json]] · [[ADR-10 - Esquema Prisma más SQL]]
- **Spec / Plan / Constitución:** [[Constitución 8. Ejecución de tareas con agentes]]

