---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 0 - Cimientos, configuración e infraestructura base"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "0"
tareas: "10"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · → [[Tareas Fase 1 - Esquema de datos]]

### Fase 0 — Cimientos, configuración e infraestructura base

- [x] **`TASK-001`: Crear el monorepo pnpm y la configuración raíz**
  - **Dependencias:** Ninguna
  - **Trazabilidad SDD:** plan §2, plan §1.5 (configuración versionada); constitución §2
  - **Archivos en Alcance:**
    - `package.json`
    - `pnpm-workspace.yaml`
    - `pnpm-lock.yaml`
    - `.gitignore`
    - `.editorconfig`
    - `.prettierrc.json`
    - `.npmrc`
    - `.nvmrc`
  - **Especificación de Implementación:** Workspaces `apps/*`, `packages/*` y `e2e`. Node 22 LTS y `packageManager` pnpm. Scripts raíz: `lint`, `typecheck`, `test:unit`, `test:integration`, `depcruise`, `build`, `format` y `prepare` (`git config core.hooksPath .githooks`). `.gitignore` excluye `node_modules`, `dist`, `coverage`, `.env*` (salvo `.env.example`), `playwright-report` y `test-results`.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `pnpm install --frozen-lockfile`
    - Los scripts raíz existen aunque todavía no haya paquetes que los implementen (`pnpm -r` sin paquetes no falla).

- [x] **`TASK-002`: Configuración compartida de TypeScript, ESLint y Vitest**
  - **Dependencias:** Requiere TASK-001
  - **Trazabilidad SDD:** plan §2 (`packages/config`), plan §5.1 (calidad en CI); constitución §3, §5
  - **Archivos en Alcance:**
    - `packages/config/package.json`
    - `packages/config/tsconfig.base.json`
    - `packages/config/eslint.config.js`
    - `packages/config/vitest.base.ts`
    - `eslint.config.js`
    - `tsconfig.json`
    - `package.json`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:** `tsconfig.base.json` con `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` y `verbatimModuleSyntax`. ESLint en formato *flat* con typescript-eslint (type-checked) y estas reglas: prohíbe `it.only`, `describe.only`, `test.only` y `.skip`; prohíbe `parseFloat` y `Number.parseFloat` en `packages/domain`, `packages/contracts` y `apps/api/src` (constitución §3). `vitest.base.ts` con `passWithNoTests` y reporte por defecto. ESLint, typescript-eslint, TypeScript y Vitest se instalan como dependencias de desarrollo de la raíz, y los scripts raíz `lint` y `typecheck` pasan a usarlos.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `pnpm lint`
    - Comando: `pnpm typecheck`

- [x] **`TASK-003`: Configurar commitlint con Conventional Commits**
  - **Dependencias:** Requiere TASK-001
  - **Trazabilidad SDD:** plan §1.3 (librerías de desarrollo), plan §1.5; constitución §7
  - **Archivos en Alcance:**
    - `commitlint.config.cjs`
    - `package.json`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:** `@commitlint/cli` + `@commitlint/config-conventional`. Tipos permitidos: `feat`, `fix`, `docs`, `test`, `chore`, `build`, `ci`, `refactor`, `perf`.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `echo "feat(db): TASK-003 prueba" | pnpm exec commitlint`
    - Un mensaje sin tipo es rechazado por commitlint.

- [x] **`TASK-004`: Docker Compose de Postgres y variables de ejemplo**
  - **Dependencias:** Requiere TASK-001
  - **Trazabilidad SDD:** plan §2 (`docker-compose.yml`), plan §1.4 (tests por capa), plan §3.9 (secretos)
  - **Archivos en Alcance:**
    - `docker-compose.yml`
    - `docker/postgres/init.sql`
    - `.env.example`
  - **Especificación de Implementación:** Servicio `db` con `postgres:16`, puerto 5432, volumen y *healthcheck*. `init.sql` crea las bases `finanzas_dev` y `finanzas_test`. `.env.example` lista todas las variables del API y de los tests (`DATABASE_URL`, `DATABASE_URL_DIRECT`, `TEST_DATABASE_URL`, `AUTH_SECRET`, `HMAC_SECRET`, `JOBS_SECRET`, `RESEND_API_KEY`, `RELEASE`, `WEB_ORIGIN`, `INTEGRATIONS`, `PORT`) sin valores reales.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `docker compose config -q`

- [x] **`TASK-005`: Paquete `packages/db` con Prisma y harness de pruebas de esquema**
  - **Dependencias:** Requiere TASK-002, TASK-004
  - **Trazabilidad SDD:** plan §2 (`packages/db`), ADR-10
  - **Archivos en Alcance:**
    - `packages/db/package.json`
    - `packages/db/tsconfig.json`
    - `packages/db/prisma/schema.prisma`
    - `packages/db/vitest.config.ts`
    - `packages/db/test/global-setup.ts`
    - `packages/db/test/helpers.ts`
    - `packages/db/.env`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:** Paquete `@finanzas/db`. `schema.prisma` con el *generator* del cliente y el *datasource* PostgreSQL (`DATABASE_URL` y `directUrl = DATABASE_URL_DIRECT`). Scripts `generate`, `migrate:dev`, `migrate:deploy` y `test:integration`. El *global setup* aplica las migraciones sobre `TEST_DATABASE_URL`. `helpers.ts` expone un cliente SQL crudo y la creación de un usuario mínimo por test. Su `tsconfig.json` cubre todos los archivos TypeScript del paquete, también los que agregarán tareas posteriores (`src/`, `test/`, `seed/`, `scripts/` y los `*.config.ts`), sin listar archivos sueltos. `packages/db/.env` (ignorado por git) define `DATABASE_URL` y `DATABASE_URL_DIRECT` con URLs ficticias de desarrollo para que `prisma validate` corra sin entorno externo.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `pnpm --filter @finanzas/db exec prisma validate`

- [x] **`TASK-006`: Andamiaje de `packages/contracts` y `packages/domain`**
  - **Dependencias:** Requiere TASK-002
  - **Trazabilidad SDD:** plan §1.1 (capas Contratos y Dominio), plan §2
  - **Archivos en Alcance:**
    - `packages/contracts/package.json`
    - `packages/contracts/tsconfig.json`
    - `packages/contracts/vitest.config.ts`
    - `packages/contracts/src/index.ts`
    - `packages/domain/package.json`
    - `packages/domain/tsconfig.json`
    - `packages/domain/vitest.config.ts`
    - `packages/domain/src/index.ts`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:** `@finanzas/contracts` depende de `zod` y `decimal.js`. `@finanzas/domain` depende solo de `decimal.js`, `date-fns` y `@date-fns/tz`. Los dos se compilan y se consumen como ESM. El `tsconfig.json` de cada uno cubre todos sus archivos TypeScript, también los que agregarán tareas posteriores (`src/`, `test/` y los `*.config.ts`), sin listar archivos sueltos.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `pnpm --filter @finanzas/contracts typecheck`
    - Comando: `pnpm --filter @finanzas/domain typecheck`

- [x] **`TASK-007`: Andamiaje de `apps/api`**
  - **Dependencias:** Requiere TASK-006
  - **Trazabilidad SDD:** plan §1.4 (capas del backend), plan §2 (`apps/api`), ADR-19
  - **Archivos en Alcance:**
    - `apps/api/package.json`
    - `apps/api/tsconfig.json`
    - `apps/api/vitest.config.ts`
    - `apps/api/src/domain/index.ts`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:** Paquete `api` que declara desde el inicio **todas** las dependencias del API (plan §1.3), para que ninguna tarea posterior tenga que modificar su `package.json`: Express, Zod, `@finanzas/db` (Prisma), `@finanzas/contracts`, `@finanzas/domain`, Better Auth, decimal.js, `uuidv7` y `archiver`; de desarrollo, Vitest, `supertest` y los tipos de Express, supertest y archiver. `vitest.config.ts` define los proyectos `unit`, `integration` y `http`. `src/domain/index.ts` reexporta `@finanzas/domain`. Scripts `build`, `start`, `dev`, `typecheck`, `test:unit` y `test:integration`. Su `tsconfig.json` cubre todos los archivos TypeScript del paquete, también los que agregarán tareas posteriores (`src/`, `test/` y los `*.config.ts`), sin listar archivos sueltos.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `pnpm --filter api typecheck`
    - `package.json` declara todas las librerías del API de plan §1.3.

- [x] **`TASK-008`: Andamiaje de `apps/web` con Vite, React, Tailwind y shadcn/ui**
  - **Dependencias:** Requiere TASK-006
  - **Trazabilidad SDD:** plan §1.1 (capa Cliente), plan §2 (`apps/web`); constitución §2; RNF-07
  - **Archivos en Alcance:**
    - `apps/web/package.json`
    - `apps/web/tsconfig.json`
    - `apps/web/vite.config.ts`
    - `apps/web/vitest.config.ts`
    - `apps/web/eslint.config.js`
    - `apps/web/index.html`
    - `apps/web/tailwind.config.ts`
    - `apps/web/postcss.config.js`
    - `apps/web/components.json`
    - `apps/web/src/main.tsx`
    - `apps/web/src/App.tsx`
    - `apps/web/src/index.css`
    - `apps/web/src/lib/utils.ts`
    - `apps/web/src/components/ui/button.tsx`
    - `apps/web/src/components/ui/input.tsx`
    - `apps/web/src/components/ui/label.tsx`
    - `apps/web/src/components/ui/card.tsx`
    - `apps/web/src/components/ui/badge.tsx`
    - `apps/web/src/components/ui/separator.tsx`
    - `apps/web/src/components/ui/skeleton.tsx`
    - `apps/web/src/components/ui/progress.tsx`
    - `apps/web/src/components/ui/dialog.tsx`
    - `apps/web/src/components/ui/alert-dialog.tsx`
    - `apps/web/src/components/ui/sheet.tsx`
    - `apps/web/src/components/ui/dropdown-menu.tsx`
    - `apps/web/src/components/ui/select.tsx`
    - `apps/web/src/components/ui/switch.tsx`
    - `apps/web/src/components/ui/checkbox.tsx`
    - `apps/web/src/components/ui/tooltip.tsx`
    - `apps/web/src/components/ui/tabs.tsx`
    - `apps/web/src/components/ui/popover.tsx`
    - `apps/web/src/components/ui/calendar.tsx`
    - `apps/web/src/components/ui/sonner.tsx`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:** React + Vite + TypeScript. Declara desde el inicio **todas** las dependencias de la web (plan §1.3), para que ninguna tarea posterior tenga que modificar su `package.json`: React, react-router, TanStack Query, react-hook-form + `@hookform/resolvers`, Zod, recharts, i18next + react-i18next, lucide-react, `@dnd-kit/core` y `@dnd-kit/sortable`, decimal.js, `uuidv7`, `@finanzas/contracts` y `@finanzas/domain`; de desarrollo, Vitest y `eslint-plugin-i18next`. Tailwind con tema claro y oscuro por clase y los tokens de color de shadcn/ui. Incluye `lib/utils.ts` (`cn`) y los componentes base de shadcn/ui que usan las pantallas del plan, generados con su CLI junto con sus dependencias (primitivos de Radix y, para el calendario, react-day-picker). Proxy de desarrollo `/api` → `http://localhost:3000`. ESLint de la web con `no-literal-string` en JSX. Vitest en entorno `node` para la lógica sin DOM. Su `tsconfig.json` cubre todos los archivos TypeScript del paquete, también los que agregarán tareas posteriores (`src/`, `test/` y los `*.config.ts`, con `.ts` y `.tsx`), sin listar archivos sueltos.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `pnpm --filter web build`
    - Comando: `pnpm --filter web lint`
    - `package.json` declara todas las librerías de la web de plan §1.3, y existen los 20 componentes base de shadcn/ui del alcance.

- [x] **`TASK-009`: Reglas de capas del backend con dependency-cruiser**
  - **Dependencias:** Requiere TASK-007
  - **Trazabilidad SDD:** plan §1.4 (cumplimiento automático), ADR-19
  - **Archivos en Alcance:**
    - `.dependency-cruiser.cjs`
    - `package.json`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:** Reglas con los nombres exactos del plan: `presentation-not-to-infrastructure`, `application-not-to-presentation`, `application-not-to-infrastructure`, `application-no-framework` (sin `express`, `@prisma/client` ni `better-auth`), `domain-pure` e `infrastructure-not-to-presentation`, más `no-circular`. Script raíz `depcruise` sobre `apps/api/src`. Fijar `dependency-cruiser` en `17.3.10`: la 18.x solo admite Node `^22||^24||>=26` y aborta en Node 23 o 25, mientras que la 17.3.10 admite `^20.12||^22||>=24`. Los patrones de ruta se escriben como literales de cadena: el punto del regex se escapa con doble barra (`\\.`), porque `\.` dentro de una cadena falla `no-useless-escape` en el lint raíz.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `pnpm depcruise`
    - Las seis reglas del plan existen con severidad `error`.

- [x] **`TASK-010`: Workflow de integración continua `ci.yml`**
  - **Dependencias:** Requiere TASK-003, TASK-005, TASK-009
  - **Trazabilidad SDD:** plan §1.5 (workflows, protección de ramas), ADR-20; constitución §5, §7
  - **Archivos en Alcance:**
    - `.github/workflows/ci.yml`
  - **Especificación de Implementación:** Disparadores `push` a cualquier rama, `pull_request` hacia `develop`, `qa` y `main`, y `workflow_call`. Los 8 pasos del plan en orden: instalación con caché, commitlint de los commits del PR, lint, typecheck, dependency-cruiser, unitarios, integración con Postgres 16 como *service* (`prisma migrate deploy` + Vitest) y build de `api` y `web`. Nombre del check: `ci`.
  - **Criterios de Verificación (Tests & DoD):**
    - El workflow contiene los 8 pasos en el orden de plan §1.5, `workflow_call` y Postgres 16 como *service*.
    - Ningún secreto aparece en texto plano.

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-10 - Esquema Prisma más SQL]] · [[ADR-19 - Backend en capas]] · [[ADR-20 - CI-CD con GitHub Actions]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]]
- **Spec / Plan / Constitución:** [[Constitución 2. Stack tecnológico]] · [[Constitución 3. Datos y dinero]] · [[Constitución 5. Calidad]] · [[Constitución 7. Git Flow]] · [[Plan 1.1 Capas]] · [[Plan 1.3 Registro de decisiones (ADR)]] · [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]] · [[Plan 1.5 Integración y despliegue continuos (ADR-20)]] · [[Plan 2. Estructura del Proyecto (Árbol de Directorios)]] · [[Plan 3.9 Seguridad a nivel de datos]] · [[Plan 5.1 Estrategia]]

