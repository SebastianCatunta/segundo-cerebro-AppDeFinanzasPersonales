---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 4 - Base del API"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "4"
tareas: "9"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 3 - Dominio transversal]] · → [[Tareas Fase 5 - Base de la web y harness E2E]]

### Fase 4 — Base del API

- [x] **`TASK-030`: Variables de entorno validadas**
  - **Dependencias:** Requiere TASK-007
  - **Trazabilidad SDD:** plan §2 (`config/env.ts`), plan §1.4 (*fakes*), plan §3.9 (secretos); constitución §4
  - **Archivos en Alcance:**
    - `apps/api/src/infrastructure/config/env.ts`
    - `apps/api/test/unit/env.test.ts`
  - **Especificación de Implementación:** Schema Zod de `NODE_ENV`, `PORT`, `DATABASE_URL`, `AUTH_SECRET`, `HMAC_SECRET`, `JOBS_SECRET`, `RESEND_API_KEY`, `RELEASE`, `WEB_ORIGIN` e `INTEGRATIONS` (`real` | `fake`).
  - **Criterios de Verificación (Tests & DoD):**
    - Si falta una variable, el error la nombra sin mostrar ningún valor.
    - `INTEGRATIONS=fake` con `NODE_ENV=production` falla.
    - `RELEASE` solo admite `1.0`, `1.1` o `1.2`.

- [x] **`TASK-031`: `AppError` y puertos de la capa de aplicación**
  - **Dependencias:** Requiere TASK-022, TASK-030
  - **Trazabilidad SDD:** plan §1.4 (reglas de diseño), plan §4.0 (`UnitOfWork`, `Clock`), ADR-09, ADR-19
  - **Archivos en Alcance:**
    - `apps/api/src/application/errors.ts`
    - `apps/api/src/application/ports/clock.ts`
    - `apps/api/src/application/ports/id-generator.ts`
    - `apps/api/src/application/ports/unit-of-work.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/application/ports/rates-gateway.ts`
    - `apps/api/src/application/ports/email-gateway.ts`
    - `apps/api/src/application/ports/auth-gateway.ts`
    - `apps/api/test/unit/errors.test.ts`
  - **Especificación de Implementación:** `AppError(code, data?)` toma su estado de `ErrorCode`. Interfaces: `Clock` (`now`, `todayFor`), `IdGenerator`, `UnitOfWork.run(fn, { userLock?, readOnly? })` y `Repositories` (se completa en cada módulo), además de `RatesGateway`, `EmailGateway` y `AuthGateway`. Ningún import de framework.
  - **Criterios de Verificación (Tests & DoD):**
    - `AppError` expone `code`, `status` y `data`.
    - Comando: `pnpm depcruise`

- [x] **`TASK-032`: Cliente Prisma con la extensión de aislamiento por usuario**
  - **Dependencias:** Requiere TASK-020, TASK-031
  - **Trazabilidad SDD:** ADR-05, ADR-12, plan §3.9; RN-09, RNF-14
  - **Archivos en Alcance:**
    - `packages/db/src/client.ts`
    - `packages/db/src/index.ts`
    - `packages/db/test/isolation-extension.test.ts`
    - `apps/api/src/infrastructure/persistence/prisma-client.ts`
  - **Especificación de Implementación:** `forUser(prisma, userId)` agrega `where: { userId }` a todo `find*`, `update*`, `delete*` y `count`, y verifica `data.userId === userId` en todo `create`. Quedan exentos los modelos globales: `market_rate`, `job_run`, `email_outbox`, `login_throttle` y `email_send_log`. El API crea un único cliente a partir del `env`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RN-09`: `findMany` con la extensión devuelve solo las filas del usuario.
    - `RNF-14`: crear con otro `userId` lanza un error, y actualizar un id ajeno afecta 0 filas.

- [x] **`TASK-033`: `UnitOfWork` con transacción y bloqueo por usuario, más el harness de integración**
  - **Dependencias:** Requiere TASK-032
  - **Trazabilidad SDD:** plan §4.0, plan §1.4 (transacciones solo en aplicación), plan §5.1 (datos de prueba); RNF-10
  - **Archivos en Alcance:**
    - `apps/api/src/infrastructure/persistence/unit-of-work.ts`
    - `apps/api/vitest.config.ts`
    - `apps/api/test/integration/setup/global-setup.ts`
    - `apps/api/test/integration/setup/db.ts`
    - `apps/api/test/factories/user.factory.ts`
    - `apps/api/test/integration/unit-of-work.test.ts`
  - **Especificación de Implementación:** `run(fn, opts)` abre la transacción. Con `userLock`, toma `pg_advisory_xact_lock(hashtext('user:' || id))`. Con `readOnly`, usa `SET TRANSACTION READ ONLY`. Los repositorios quedan ligados a la transacción y al usuario. El *global setup* migra la base de test, y `vitest.config.ts` lo registra como `globalSetup` del proyecto `integration`. `user.factory` crea un usuario confirmado con sus filas iniciales por SQL; desde TASK-053 usa `user-bootstrap`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-10`: dos `run` concurrentes con el mismo `userLock` se serializan, y con usuarios distintos corren en paralelo.
    - Un error dentro de `fn` revierte todo, y `readOnly` rechaza las escrituras.

- [x] **`TASK-034`: Aplicación Express, middlewares base y `/api/health`**
  - **Dependencias:** Requiere TASK-031
  - **Trazabilidad SDD:** plan §1.4 (presentación), plan §3.9 (CSRF y logs), plan §4.2.2 (health), ADR-02, ADR-09; RNF-17
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/presentation/middlewares/require-json.ts`
    - `apps/api/src/presentation/middlewares/check-origin.ts`
    - `apps/api/src/presentation/middlewares/validate.ts`
    - `apps/api/src/presentation/middlewares/error-handler.ts`
    - `apps/api/src/presentation/routes/health.routes.ts`
    - `apps/api/test/http/app.test.ts`
    - `packages/contracts/src/errors.ts`
    - `packages/contracts/test/errors.test.ts`
  - **Especificación de Implementación:** Agrega al catálogo de `packages/contracts` `UNSUPPORTED_MEDIA_TYPE` (415) y `ORIGIN_NOT_ALLOWED` (403) (plan §4.0; la tabla de su test pasa a 81 códigos). `createApp(deps)` monta el parser JSON, `requireJson` (mutaciones), `checkOrigin` (contra `WEB_ORIGIN`), un `traceId` por petición, un log de ruta, código y duración sin cuerpos, y el `errorHandler` (`AppError` → problem+json; cualquier otro error → `INTERNAL_ERROR` 500 con `traceId`). `validate(schema)` responde `VALIDATION_ERROR` con detalles seguros.
  - **Criterios de Verificación (Tests & DoD):**
    - `GET /api/health` responde 204 sin sesión.
    - Una mutación sin JSON responde 415 con `UNSUPPORTED_MEDIA_TYPE`, y un `Origin` ajeno, 403 con `ORIGIN_NOT_ALLOWED`; una mutación sin `Origin` no se rechaza. Un cuerpo JSON mal formado responde `VALIDATION_ERROR` 400.
    - `RNF-17`: un error inesperado devuelve solo `INTERNAL_ERROR` y `traceId`, sin *stack*.
    - El log de una petición no contiene su cuerpo.

- [x] **`TASK-035`: Middleware `releaseGate`**
  - **Dependencias:** Requiere TASK-023, TASK-034
  - **Trazabilidad SDD:** ADR-18, plan §4.2.2; RF-M2-03
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/middlewares/release-gate.ts`
    - `apps/api/test/http/release-gate.test.ts`
  - **Especificación de Implementación:** `releaseGate(module)` responde `RELEASE_NOT_AVAILABLE 404` si el módulo no está liberado según `RELEASE` (TASK-023).
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-03`: con `RELEASE=1.0`, una ruta de M11 responde 404 `RELEASE_NOT_AVAILABLE`; con `1.1` pasa.

- [x] **`TASK-036`: Raíz de composición y arranque del API**
  - **Dependencias:** Requiere TASK-033, TASK-034, TASK-035
  - **Trazabilidad SDD:** plan §1.4 (composición), ADR-19
  - **Archivos en Alcance:**
    - `apps/api/src/composition/container.ts`
    - `apps/api/src/main.ts`
    - `apps/api/test/http/bootstrap.test.ts`
  - **Especificación de Implementación:** `buildContainer(env)` crea Prisma, `UnitOfWork`, `Clock` del sistema, `IdGenerator` (uuidv7) y las integraciones según `INTEGRATIONS`. Expone `createApp(container)`. `main.ts` valida el `env`, arma el contenedor y escucha en `PORT`.
  - **Criterios de Verificación (Tests & DoD):**
    - Con `INTEGRATIONS=fake`, el contenedor arma la app y `/api/health` responde 204.
    - Comando: `pnpm --filter api build`

- [x] **`TASK-037`: Límites por usuario (`assertLimit`)**
  - **Dependencias:** Requiere TASK-031
  - **Trazabilidad SDD:** plan §4.0 (`assertLimit`); RNF-28
  - **Archivos en Alcance:**
    - `apps/api/src/application/shared/limits.ts`
    - `apps/api/test/unit/limits.test.ts`
  - **Especificación de Implementación:** Constante `LIMITS` (cuentas 50, categorías 300, metas 50, deudas 200, presupuestos 100, reglas recurrentes 100, atajos 12) y `assertLimit(currentCount, entity)`, que lanza `LIMIT_REACHED {entity, max}`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-28`: con 49 cuentas pasa; con 50 lanza `LIMIT_REACHED`. Lo mismo para cada entidad.

- [x] **`TASK-038`: Tick de jobs y endpoint interno `/internal/jobs/tick`**
  - **Dependencias:** Requiere TASK-036
  - **Trazabilidad SDD:** ADR-01, plan §4.0 (tick de jobs y lease), plan §3.7 (`job_run`), ADR-18; RNF-13
  - **Archivos en Alcance:**
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma/migrations/0011_job_run_lease/migration.sql`
    - `apps/api/src/application/ports/job-runs.ts`
    - `apps/api/src/infrastructure/persistence/job-runs.ts`
    - `apps/api/src/application/jobs/tick.ts`
    - `apps/api/src/presentation/internal/jobs.controller.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/tick.test.ts`
  - **Especificación de Implementación:** La migración `0011_job_run_lease` agrega `locked_until timestamptz` a `job_run`, y `schema.prisma` suma `lockedUntil` al modelo `JobRun`. El puerto `JobRuns` (`tryAcquire(job, now): Promise<boolean>` y `finish(job, now, error?)`) lo implementa la infraestructura con el *lease* de plan §4.0: `INSERT … ON CONFLICT DO NOTHING` y un `UPDATE` condicionado a `locked_until IS NULL OR locked_until < now`, con 5 minutos de vigencia. No usa *advisory locks* de sesión. Registro de jobs con el orden fijo de plan §4.0. Un job sin lease se salta. Al terminar, con éxito o con error, se libera el lease y se registran el fin y el error en `job_run`. El tick deja de iniciar jobs al pasar los 25 s. Sin el encabezado `x-jobs-secret` correcto, responde 404. Los jobs de módulos no liberados no corren. Expone `registerJob(name, run)` para los módulos.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-13`: un job que falla registra `last_error`, libera su lease y no detiene los siguientes.
    - Los jobs corren en el orden del plan.
    - Un job con un lease vigente se salta, y uno con el lease vencido se toma.
    - Al terminar con éxito, `locked_until` queda en NULL y `last_finished_at` registrado.
    - Sin secreto, la respuesta es 404.

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M2 - Navegación y estructura]]
- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]] · [[ADR-02 - Sesión entre dominios (proxy de Vercel)]] · [[ADR-05 - Aislamiento por usuario]] · [[ADR-09 - Errores problem+json]] · [[ADR-12 - Datos de mercado globales]] · [[ADR-18 - Entregas con RELEASE]] · [[ADR-19 - Backend en capas]]
- **Requerimientos no funcionales:** [[Spec 3.10 Límites por usuario]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]] · [[Tareas Fase 1 - Esquema de datos]] · [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]]
- **Spec / Plan / Constitución:** [[Constitución 4. Seguridad]] · [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]] · [[Plan 2. Estructura del Proyecto (Árbol de Directorios)]] · [[Plan 3.7 Avisos e infraestructura (M15)]] · [[Plan 3.9 Seguridad a nivel de datos]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 5.1 Estrategia]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - EmailOutbox]] · [[Entidad - EmailSendLog]] · [[Entidad - JobRun]] · [[Entidad - LoginThrottle]] · [[Entidad - MarketRate]]

