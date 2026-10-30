---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 27 - Pulido transversal: rendimiento, correos, navegación y marca"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "27"
tareas: "21"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 26 - Correcciones de QA]]

### Fase 27 — Pulido transversal: rendimiento, correos, navegación y marca

- [x] **`TASK-254`: Medición de cada petición: `Server-Timing`, conteo de consultas y latencia simulada**
  - **Dependencias:** Ninguna
  - **Trazabilidad SDD:** plan §4.0 (Costo de una petición), plan §5.3 (RNF-29); RNF-03, RNF-29
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/query-counter.ts`
    - `apps/api/src/infrastructure/persistence/query-counter.ts`
    - `apps/api/src/infrastructure/persistence/unit-of-work.ts`
    - `apps/api/src/infrastructure/persistence/prisma-client.ts`
    - `packages/db/src/client.ts`
    - `apps/api/src/infrastructure/config/env.ts`
    - `apps/api/src/presentation/middlewares/server-timing.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/server-timing.test.ts`
    - `apps/api/test/unit/env.test.ts`
    - `apps/api/test/http/logs-secrets.test.ts`
  - **Especificación de Implementación:** Sin medir no se puede arreglar la lentitud ni comprobar que se arregló. El puerto `QueryCounter` (`begin()`, `record(ms)`, `read()`) lo implementa la infraestructura con `AsyncLocalStorage`, por la regla de capas (ADR-19): la presentación no importa la infraestructura. Cuenta las operaciones de Prisma de cada petición (las crudas y las de modelo) y suma 2 por cada transacción interactiva, por su `BEGIN` y su `COMMIT`; el `UnitOfWork` lo hace en `run`. Si el evento `query` de Prisma no conserva el contexto de la petición, se cuenta con una extensión de cliente (`$allOperations`). El *middleware* `serverTiming` abre el contador al empezar y, al responder, agrega `Server-Timing: total;dur=…, db;dur=…, queries;desc="N"` (solo números, ningún detalle interno, RNF-17); `requestLog` agrega `durationMs` y `queries` a su línea. Para que las pruebas reproduzcan la distancia a Neon sin salir de la máquina, `env.ts` agrega `DB_LATENCY_MS` (entero, 0 por defecto): retrasa cada operación de Prisma ese tiempo y se rechaza con un valor distinto de 0 cuando `NODE_ENV=production`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-29`: toda respuesta, también las de error, lleva `Server-Timing` con `total`, `db` y `queries`.
    - `RNF-29`: con un contador simulado que registra 7 operaciones, `queries` vale 7 y `db` suma sus duraciones.
    - `RNF-29`: dos peticiones simultáneas no mezclan sus conteos.
    - `RNF-17`: la cabecera no contiene SQL, nombres de tablas ni rutas internas, y `requestLog` no registra parámetros.
    - `RNF-17`: la línea de `requestLog` de cada petición lleva exactamente `traceId`, `method`, `path`, `status`, `durationMs` y `queries` (número); la prueba existente de `logs-secrets.test.ts` se actualiza con esa clave.
    - `RNF-29`: con `DB_LATENCY_MS=25`, una petición de 4 operaciones tarda al menos 100 ms en la base; con `NODE_ENV=production`, `parseEnv` rechaza `DB_LATENCY_MS` distinto de 0.

- [x] **`TASK-255`: Sesión en una sola consulta**
  - **Dependencias:** Requiere TASK-254
  - **Trazabilidad SDD:** plan §4.0 (Sesión en una consulta); RF-M1-07, EC-M1-05, EC-M1-06, RNF-29
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/middlewares/require-session.ts`
    - `apps/api/src/presentation/middlewares/track-activity.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/session-middlewares.test.ts`
    - `apps/api/test/integration/session-cost.test.ts`
  - **Especificación de Implementación:** Hoy cada petición autenticada consulta la sesión varias veces antes de llegar a su controlador: `getSession` de Better Auth, `findActivity` en `requireSession` y `findActivity` otra vez en `trackActivity`. `SessionActivityReader` agrega `findByToken(token)`, que con una sola sentencia (`auth_session` unida con `auth_user`) devuelve `{ sessionId, userId, expiresAt, lastActivityAt, timezone }` o `null`. `requireSession` la usa, valida el vencimiento y los 30 días de inactividad, y deja `lastActivityAt` en `req.auth`; `trackActivity` ya no consulta, solo renueva con `touch` pasados 5 minutos y sin `X-Background`. Sin caché: revocar una sesión surte efecto en la siguiente petición. `AuthGateway.getSession` se queda para los demás flujos.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-29`: una petición autenticada ejecuta 1 consulta de sesión (contador de TASK-254) y ninguna más antes de su controlador.
    - `EC-M1-05`: tras cambiar la contraseña en A, la petición siguiente de B recibe `SESSION_EXPIRED`.
    - `EC-M1-06`: tras eliminar la cuenta en A, la petición siguiente de B recibe `SESSION_EXPIRED`.
    - `RF-M1-07`: con 31 días de inactividad, la sesión se rechaza; una petición con `X-Background` no renueva la actividad.

- [x] **`TASK-256`: Lecturas sin bloqueo exclusivo por usuario**
  - **Dependencias:** Requiere TASK-254
  - **Trazabilidad SDD:** plan §4.0 (Lecturas sin bloqueo por usuario), plan §1.1; RNF-10, RNF-14, RNF-29
  - **Archivos en Alcance:**
    - `apps/api/src/infrastructure/persistence/unit-of-work.ts`
    - `apps/api/src/application/ports/unit-of-work.ts`
    - `apps/api/test/integration/unit-of-work.test.ts`
    - `apps/api/test/integration/read-no-lock.test.ts`
  - **Especificación de Implementación:** Hoy las lecturas del API piden `userLock` junto con `readOnly`, y el `advisory lock` es exclusivo: dos lecturas del mismo usuario, por ejemplo las cuentas y el resumen del Inicio, hacen cola aunque corran en `Promise.all`. El bloqueo solo hace falta para escribir (RNF-10). Con `readOnly: true`, `run` sigue acotando los repositorios al usuario (`forUser`, RNF-14) pero ya no toma el `advisory lock`, y abre la transacción en `REPEATABLE READ` antes del `SET TRANSACTION READ ONLY`, para que todas sus sentencias vean una sola foto de la base. Sin `readOnly`, nada cambia. Se documenta en el puerto.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-10`: una lectura del usuario termina mientras una escritura del mismo usuario retiene el bloqueo (sin esperar a que la escritura termine).
    - `RNF-10`: dos escrituras del mismo usuario siguen haciendo cola.
    - `RNF-29`: una lectura de dos sentencias no ve las filas que otra transacción confirma entre ambas.
    - `RNF-14`: una lectura sigue acotada a su usuario y no puede escribir.
    - Comando: `pnpm --filter api exec vitest run test/integration/balance-guard.test.ts test/integration/unit-of-work.test.ts test/integration/concurrency-sweep.test.ts`

- [x] **`TASK-257`: Inicio con pocas consultas**
  - **Dependencias:** Requiere TASK-220, TASK-255, TASK-256
  - **Trazabilidad SDD:** plan §4.0 (Un endpoint, pocas transacciones), plan §4.8.2; RNF-03, RNF-29, RF-M8-01
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/dashboard.service.ts`
    - `apps/api/src/application/services/accounts.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/dashboard.repository.ts`
    - `apps/api/src/application/services/transactions.service.ts`
    - `apps/api/src/application/services/rates.service.ts`
    - `apps/api/src/infrastructure/persistence/repositories/goal-allocation.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/market-rate.repository.ts`
    - `apps/api/test/integration/dashboard-cost.test.ts`
  - **Especificación de Implementación:** Hoy `GET /api/dashboard` abre una transacción para `cards`, otra para leer los ajustes y la base, y otra por cada bloque que usa la base (presupuestos, próximos pagos, cuentas, resumen y movimientos recientes); además, las cuentas activas se calculan más de una vez (`list` para los bloques y otra vez dentro de `summary`). Cambios, sin alterar el `DashboardDto`: (1) `view` lee los ajustes y la base una vez y se las pasa a `cards`; (2) `DashboardRepository` devuelve los totales y el primer mes en una sola sentencia; (3) `AccountsService.listWithSummary(ctx)` arma la lista y el resumen desde una sola lectura (`snapshotOf`); (4) los bloques que leen la base (presupuestos, próximos pagos, gastos de los gráficos, cuentas y resumen, movimientos recientes) son independientes: cada uno abre una sola transacción de lectura y corren en paralelo con `Promise.all`, posible porque las lecturas ya no se bloquean entre sí (TASK-256). (5) Cada transacción de solo lectura cuesta 3 consultas fijas (`BEGIN`, `SET`, `COMMIT`) más sus sentencias, y reordenar el Inicio llega a unas 54: para cumplir las 35 hay que bajar las sentencias en origen, en la lectura de cada pieza: `latestRates` en una sola sentencia en vez de una por moneda y una variante de las tasas de varias monedas en una sola transacción (`rates.service.ts`, `market-rate.repository.ts`); los apartados de varias cuentas en lote (`goal-allocation.repository.ts`); y que `transactions.service.ts` lea las cuentas y categorías de los movimientos recientes en lote o reutilice la base ya leída. Los resultados de esas lecturas no cambian.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-03`: con el usuario de 5.000 movimientos del seed y todos los bloques visibles, `GET /api/dashboard` ejecuta 35 consultas o menos (contador de TASK-254).
    - `RNF-03`: con `DB_LATENCY_MS=25`, ese mismo `GET /api/dashboard` responde en menos de 700 ms.
    - `RF-M8-01`: la respuesta es idéntica a la de antes con los mismos datos (tarjetas, variaciones y bloques).
    - Con los bloques "Por categoría" y "Ritmo" ocultos, no se lee ningún gasto.
    - Comando: `pnpm --filter api exec vitest run test/http/dashboard.test.ts test/integration/dashboard-cards.test.ts`

- [x] **`TASK-258`: Web: pedir los datos a la vez que la sesión y mostrar esqueletos**
  - **Dependencias:** Ninguna
  - **Trazabilidad SDD:** plan §4.0 (Web), plan §4.8.4; RNF-03, RNF-29, RF-M1-04
  - **Archivos en Alcance:**
    - `apps/web/src/lib/last-session-hint.ts`
    - `apps/web/src/app/guards.tsx`
    - `apps/web/src/features/auth/hooks/use-me.ts`
    - `apps/web/src/components/page-skeleton.tsx`
    - `apps/web/src/features/dashboard/routes.tsx`
    - `apps/web/src/locales/es-BO/navigation.json`
    - `apps/web/src/features/profile/routes.tsx`
    - `apps/web/test/last-session-hint.test.ts`
    - `e2e/m2-startup-parallel.spec.ts`
  - **Especificación de Implementación:** Hoy el Inicio espera a `/api/me` para saber la zona horaria y recién entonces pide el dashboard y las cuentas: son dos viajes en cadena sobre una conexión que ya es lenta, y mientras tanto la pantalla queda en blanco (`return null`). `last-session-hint.ts` guarda en `localStorage`, dentro de `try/catch`, solo `{ timezone, onboardingCompleted }` del último `/api/me` exitoso (nunca el correo, el nombre ni el id), y lo borra al cerrar sesión o ante un `401`. `warmUpSession`, si hay pista con el Onboarding terminado, lanza el prefetch del Inicio y de las cuentas a la vez que `/api/me`, con el mes de la zona de la pista; si `/api/me` responde otra zona, repite el prefetch con la correcta. Sin pista (primer ingreso), el flujo es el de hoy. `PageSkeleton` (`role="status"`, nombre accesible, `motion-safe:animate-pulse`) reemplaza a `null` en `RequireSession`, `RequireOnboardingDone` y `DashboardPage` mientras llegan los datos.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-03`: con `/api/me` demorado 1 s y una pista guardada, la petición a `/api/dashboard` sale antes de que `/api/me` responda.
    - `RNF-03`: con una pista de otra zona horaria, el Inicio termina mostrando los datos del mes de la zona real.
    - `RF-M1-04`: sin sesión, `/` va a `/entrar` y no muestra datos ni esqueleto de datos.
    - La pista no contiene el correo, el nombre ni el id, y una lectura con `localStorage` bloqueado no rompe la app.
    - `RNF-06`: el esqueleto es anunciado como "Cargando" y axe no reporta violaciones serias en él.

- [x] **`TASK-259`: Web: precargar los datos de cada pestaña al elegirla**
  - **Dependencias:** Requiere TASK-258
  - **Trazabilidad SDD:** plan §4.0 (Web), plan §4.2.4; RNF-29, RF-M2-03, RF-M2-04
  - **Archivos en Alcance:**
    - `apps/web/src/app/prefetch-routes.ts`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/app/layout/bottom-tab-bar.tsx`
    - `apps/web/src/app/layout/sidebar.tsx`
    - `apps/web/src/features/transactions/hooks/use-transactions.ts`
    - `apps/web/src/features/accounts/hooks/use-accounts.ts`
    - `apps/web/src/features/budgets/hooks/use-budgets.ts`
    - `apps/web/src/features/goals/hooks/use-goals.ts`
    - `apps/web/src/features/debts/hooks/use-debts.ts`
    - `apps/web/src/features/recurring/hooks/use-recurring.ts`
    - `apps/web/src/features/categories/hooks/use-categories.ts`
    - `apps/web/test/prefetch-routes.test.ts`
    - `apps/web/test/bundle-budget.test.ts`
    - `e2e/m2-tab-prefetch.spec.ts`
  - **Especificación de Implementación:** Al abrir una pestaña por primera vez la web baja primero el código de su pantalla (`lazy`) y solo después, al montarla, pide sus datos: dos esperas seguidas. Cada hook de lista exporta su fábrica `…Query(…)` (como `dashboardQuery`) con la misma clave y parámetros que usa la pantalla. `prefetch-routes.ts` asocia cada ruta principal (Movimientos, Cuentas, Presupuestos, Metas, Deudas, Recurrentes y Categorías) con el prefetch de su consulta principal, con `staleTime` de 10 s, y solo lo lanza si la entrega del usuario incluye su módulo (`isReleased` sobre `['me']`), para no pedir lo que el API responde 404. El `loader` de cada ruta lo ejecuta mientras baja el código (sin bloquear la ruta ni mostrar errores, como `warmUpSession`), y `useTabLink` lo ejecuta además en `onPointerEnter`, `onFocus` y `onTouchStart`, como máximo una vez cada 10 s por ruta.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-29`: al abrir Movimientos por primera vez, la petición de sus datos sale sin esperar a que termine de bajar el código de la pantalla.
    - `RNF-29`: apuntar con el ratón a la pestaña Cuentas ya pide sus datos; apuntar de nuevo antes de 10 s no repite la petición.
    - `RF-M2-03`: con `RELEASE=1.0`, abrir o apuntar a Metas, Deudas, Presupuestos o Recurrentes no dispara ninguna petición.
    - `RF-M2-04`: la pestaña sigue restaurando su URL y su posición al volver a ella.
    - Un error del prefetch no muestra nada y la pantalla repite la petición al montarse.

- [x] **`TASK-260`: Cercanía de la base de datos: regiones y *pooler***
  - **Dependencias:** Requiere TASK-254
  - **Trazabilidad SDD:** plan §4.0 (Despliegue), plan §1.5; RNF-03, RNF-29
  - **Archivos en Alcance:**
    - `render.yaml`
    - `vercel.json`
    - `README.md`
    - `docs/latencia-despliegue.md`
  - **Especificación de Implementación:** Lo que más pesa en la lentitud es el viaje entre el API (Render) y la base (Neon): con regiones distintas, cada una de las decenas de consultas de una petición paga 50 a 150 ms. Neon está en `aws-us-east-1` (Virginia) y Render estaba en Oregón; el servicio nuevo `finanzas-api-va` (`https://finanzas-api-va.onrender.com`) se creó a mano en Virginia, y el viejo `finanzas-api-u3vu` queda para apagar. `render.yaml` fija `region: virginia` y `name: finanzas-api-va`, sin tocar otra clave. `vercel.json` apunta el *rewrite* de `/api/:path*` a la URL nueva y la tabla de despliegue del `README.md` la cita. `docs/latencia-despliegue.md` registra la región de Neon y la de Render, el motivo, la URL nueva, los parámetros de `DATABASE_URL` (host `-pooler`, `pgbouncer=true`, `connection_limit=5`) y que los tiempos `db` de `GET /api/health/ready` no se midieron antes ni después, por decisión de la persona responsable; cómo medirlos queda explicado.
  - **Criterios de Verificación (Tests & DoD):**
    - `render.yaml` define `region: virginia` y `name: finanzas-api-va`, y no cambia ninguna otra clave.
    - `vercel.json` y `README.md` ya no citan `finanzas-api-u3vu` y sí `finanzas-api-va`.
    - `docs/latencia-despliegue.md` tiene las dos regiones, los parámetros de `DATABASE_URL` y dice que los tiempos `db` no se midieron.
    - Comando: `grep -q "region: virginia" render.yaml && grep -q "finanzas-api-va" vercel.json && ! grep -q "u3vu" vercel.json README.md`
  - **Pasos manuales:**
    1. **Medir antes:** abrir la web en producción con las herramientas del navegador (Network), ir a `https://<WEB_URL>/api/health/ready` y anotar `db` de la cabecera `Server-Timing`, tres veces. En la misma región debería ser de unos pocos milisegundos; decenas de ms o más indican regiones distintas.
    2. **Ver las regiones:** Neon → el proyecto → Settings (región, por ejemplo `aws-us-east-2`) y Render → `finanzas-api` → Settings → Region.
    3. **Si difieren, mover Render a la región de Neon**, que es lo más fácil porque no guarda datos (Neon, al contrario, exige crear un proyecto nuevo y restaurar la base). Elegir, si hay opción, la más cercana a Bolivia (Virginia u Ohio). Render no cambia de región un servicio existente: crear uno nuevo con New → Blueprint (con `region` ya puesto en `render.yaml`), cargar las variables `sync: false`, y actualizar `API_URL`, el *rewrite* de `vercel.json`, y `RENDER_DEPLOY_HOOK_URL` y `RENDER_SERVICE_ID` del Environment `production` de GitHub. Después, apagar el servicio viejo.
    4. **Revisar `DATABASE_URL`** en Render: debe usar el host con `-pooler` y terminar en `?sslmode=require&pgbouncer=true&connection_limit=5`. Corregirla y reiniciar si falta algo.
    5. **Medir después** con el paso 1 y anotar ambos tiempos en `docs/latencia-despliegue.md`. Meta: `db` por debajo de 10 ms.
    6. **Mantener despiertos los servicios:** en cron-job.org, confirmar que el tick sigue llamando cada minuto a `/internal/jobs/tick`. En el plan gratis, Render duerme el API tras 15 minutos sin tráfico y Neon suspende la base tras 5.

- [x] **`TASK-261`: Verificación de rendimiento: costo por petición y tiempo de cada pestaña**
  - **Dependencias:** Requiere TASK-255, TASK-256, TASK-257, TASK-259
  - **Trazabilidad SDD:** plan §4.0 (Costo de una petición), plan §5.3 (RNF-03, RNF-29); RNF-03, RNF-29
  - **Archivos en Alcance:**
    - `apps/api/test/integration/request-cost.test.ts`
    - `e2e/perf-tabs.spec.ts`
  - **Especificación de Implementación:** Tarea de verificación: solo pruebas, que deben pasar. En el API, con el seed `seed:e2e` (usuario de 5.000 movimientos) y `RELEASE=1.2`, lee la cabecera `Server-Timing` y compara `queries` con el presupuesto del plan §4.0: `GET /api/me` ≤ 8, `GET /api/dashboard` ≤ 35 y ≤ 12 en cada lista (`/api/accounts`, `/api/transactions`, `/api/categories`, `/api/budgets`, `/api/goals`, `/api/debts`, las reglas recurrentes y `/api/rates/current`). Repite las listas con `DB_LATENCY_MS=25` y exige menos de 400 ms cada una. En E2E (Chromium, perfil 4G y CPU ×4 de `support/network-profiles.ts`), con la sesión ya abierta, mide el tiempo de cada pestaña desde que se toca hasta que muestra su contenido principal. Si una pestaña o un endpoint supera su presupuesto, el pipeline se detiene y se decide si se corrige en una tarea nueva.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-29`: ningún endpoint de lectura supera su presupuesto de consultas, salvo la deuda conocida de `GET /api/accounts` (tope 21) y `GET /api/transactions` (tope 32), que la prueba fija en lo medido (plan §4.0, «Deuda conocida»).
    - `RNF-29`: con 25 ms de latencia simulada por consulta, cada lista responde en menos de 400 ms (salvo Cuentas, menos de 900 ms, y Movimientos, menos de 1200 ms, por la deuda conocida).
    - `RNF-29`: Movimientos, Cuentas, Presupuestos, Metas, Deudas, Recurrentes, Categorías y Tipo de cambio muestran su contenido en menos de 2 s en 4G.
    - `RNF-03`: el Inicio sigue por debajo de 2 s con 5.000 movimientos.
    - Comando: `pnpm --filter api exec vitest run test/integration/request-cost.test.ts`

- [x] **`TASK-262`: Quitar el correo de intentos fallidos (código)**
  - **Dependencias:** Ninguna
  - **Trazabilidad SDD:** plan §4.1.2 (`sign-in`), plan §3.2 (enum `email_kind`); RF-M1-08, RF-M1-16, RNF-25
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/auth.service.ts`
    - `apps/api/src/application/shared/login-throttle.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/application/ports/email-gateway.ts`
    - `apps/api/src/infrastructure/persistence/repositories/login-throttle.repository.ts`
    - `apps/api/src/infrastructure/integrations/email-templates.ts`
    - `apps/api/test/integration/auth-signin.test.ts`
    - `apps/api/test/integration/login-throttle.test.ts`
    - `apps/api/test/unit/email-templates.test.ts`
  - **Especificación de Implementación:** La spec v1.5 elimina el correo de aviso por intentos fallidos; la espera progresiva se mantiene tal cual (5 fallos → 1 min, 10 → 15 min, `LOGIN_LOCKED`, mismo trato para correos sin cuenta). En `auth.service.ts`, el registro de un fallo solo llama a `recordFailure` y ya no encola nada. Se eliminan `shouldAlert` de `LoginThrottle`, `claimAlert` del puerto y del repositorio, `login_alert` del tipo `EmailKind`, de `EMAIL_KINDS` (quedan 5) y de `emailTemplates` (5 claves). La columna `last_alert_sent_at` y el valor del enum se quedan en la base hasta TASK-263, para que el código nuevo y el viejo convivan durante el despliegue.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Espera progresiva tras intentos fallidos": tras 5 fallos, `LOGIN_LOCKED` con unos 60 s y ninguna fila en la bandeja de salida (`RF-M1-08`).
    - `RF-M1-08`: 5 fallos dan 60 s de espera, 10 dan 15 min, el contador se reinicia con un éxito o tras 1 h, y un correo sin cuenta recibe la misma espera (`EC-M1-12`).
    - `RF-M1-16`: hay exactamente una plantilla por cada uno de los 5 tipos de correo.
    - `RNF-25`: existen las plantillas de cambio de contraseña y de eliminación de la cuenta, y ninguna de intentos fallidos.
  - **Pasos manuales:**
    1. **Resend: no hay nada que cambiar en el panel.** Las plantillas viven en el código (`email-templates.ts`), y Resend solo recibe `from`, `to`, `subject`, `text` y `html`; el proyecto no usa plantillas, *webhooks* ni audiencias de Resend, y el dominio y el remitente (`EMAIL_FROM`) ya están configurados.
    2. Después de desplegar, en Resend → Emails, el asunto «Intentos fallidos de inicio de sesión» deja de aparecer. Si todavía sale, el despliegue no llegó a Render.

- [x] **`TASK-263`: Migración: quitar `login_alert` y `last_alert_sent_at` de la base**
  - **Dependencias:** Requiere TASK-262
  - **Trazabilidad SDD:** plan §3.2 (enum `email_kind`), plan §3.3 (`login_throttle`); RF-M1-16
  - **Archivos en Alcance:**
    - `packages/db/prisma/migrations/0012_remove_login_alert/migration.sql`
    - `packages/db/prisma/schema.prisma`
    - `packages/db/test/schema-auth.test.ts`
    - `packages/db/test/schema-base.test.ts`
    - `packages/db/test/isolation-extension.test.ts`
    - `apps/api/test/integration/login-throttle.test.ts`
  - **Especificación de Implementación:** Postgres no permite quitar un valor de un enum, así que la migración, en una sola transacción: (1) borra de `email_outbox` y de `email_send_log` las filas con `kind = 'login_alert'`; (2) renombra `email_kind` a `email_kind_old`, crea `email_kind` con los 5 valores, convierte las columnas `kind` de ambas tablas con `USING kind::text::email_kind` y borra el tipo viejo; (3) quita `login_throttle.last_alert_sent_at`. `schema.prisma` pierde `loginAlert` y `lastAlertSentAt`. Se revisan los índices y los CHECK que usen `kind`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-16`: `email_kind` tiene exactamente los 5 correos de la cuenta.
    - `RF-M1-16`: `email_outbox.kind` y `email_send_log.kind` siguen tipadas como `email_kind`.
    - Migrar una base con una fila `login_alert` pendiente en `email_outbox` la borra y no falla.
    - `login_throttle` ya no tiene `last_alert_sent_at`.
    - Comando: `pnpm --filter @finanzas/db exec vitest run test/schema-auth.test.ts test/schema-base.test.ts`
  - **Pasos manuales:**
    1. **No desplegar esta tarea junto con TASK-262.** El despliegue corre la migración antes de reiniciar el API, y durante unos minutos el código viejo (que todavía guarda `last_alert_sent_at` y encola `login_alert`) trabajaría contra un esquema sin ellos: un intento fallido de inicio de sesión respondería 500. Hacerlo en dos pasos: abrir un PR parcial hasta TASK-262, esperar a que el despliegue termine (`GET /api/health/ready` = 204) y recién entonces fusionar esta tarea.
    2. **Respaldo antes de migrar producción:** en Neon → Branches → Create branch desde `main`, para poder volver atrás.
    3. **Comprobar:** en Neon → SQL Editor, `SELECT unnest(enum_range(NULL::email_kind));` debe dar los 5 valores.

- [x] **`TASK-264`: Confirmación del correo (1/3): tabla `signup_ticket` y contratos**
  - **Dependencias:** Requiere TASK-263
  - **Trazabilidad SDD:** plan §3.3 (`signup_ticket`), plan §4.1.1, plan §4.1.2; RF-M1-18, EC-M1-14, RNF-26
  - **Archivos en Alcance:**
    - `packages/db/prisma/migrations/0013_signup_ticket/migration.sql`
    - `packages/db/prisma/schema.prisma`
    - `packages/db/test/schema-auth.test.ts`
    - `packages/contracts/src/auth.ts`
    - `packages/contracts/test/auth.test.ts`
  - **Especificación de Implementación:** Para que la app que espera en "Revisa tu correo" se entere de la confirmación aunque el enlace se abra en otro dispositivo, el registro le entrega un *ticket* secreto en una cookie, y la API lo reconoce más tarde. La migración crea `signup_ticket` tal como está en plan §3.3 (`token_hash` clave primaria, `user_id` único con `ON DELETE CASCADE`, `expires_at`, `confirmed_at`), siguiendo el patrón de `email_link` para el acceso desde los repositorios. `schema.prisma` agrega su modelo. En `packages/contracts/src/auth.ts`: `ConfirmDto = { status: 'confirmed' }` (hoy `confirm` responde `{ next: 'onboarding' }`) y `ConfirmationStatusDto`, una unión discriminada por `status`: `{ status: 'pending' }` o `{ status: 'confirmed', next: 'onboarding' }`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-18`: `signup_ticket` existe con `token_hash` como clave primaria y `user_id` único; al eliminar el usuario, su ticket se borra (cascada, `RNF-16`).
    - `RF-M1-18`: un segundo ticket para el mismo usuario se rechaza (`UNIQUE`), y `confirmed_at` admite nulo.
    - `RF-M1-18`: `ConfirmationStatusDto` acepta `pending` y `confirmed` con `next: 'onboarding'`, y rechaza `confirmed` sin `next`.
    - Comando: `pnpm --filter @finanzas/db exec vitest run test/schema-auth.test.ts`

- [x] **`TASK-265`: Confirmación del correo (2/3): el enlace solo confirma y el ticket abre la sesión**
  - **Dependencias:** Requiere TASK-264
  - **Trazabilidad SDD:** plan §4.1.2 (`sign-up`, `confirm`, `confirmation/status`, `password/reset`), plan §3.9; RF-M1-18, RF-M1-04, EC-M1-09, EC-M1-10, EC-M1-11, EC-M1-14, RNF-15
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/auth.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/signup-ticket.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/src/presentation/controllers/auth.controller.ts`
    - `apps/api/src/presentation/routes/auth.routes.ts`
    - `apps/api/src/infrastructure/persistence/maintenance-store.ts`
    - `apps/api/src/application/jobs/maintenance.ts`
    - `apps/api/src/application/ports/maintenance-store.ts`
    - `apps/api/test/integration/auth-signup.test.ts`
    - `apps/api/test/integration/auth-confirm.test.ts`
    - `apps/api/test/integration/auth-signup-ticket.test.ts`
    - `apps/api/test/integration/auth-signin.test.ts`
    - `apps/api/test/integration/auth-password.test.ts`
    - `apps/api/test/integration/maintenance-auth.test.ts`
    - `apps/api/test/http/auth.test.ts`
    - `apps/api/test/http/isolation-sweep.test.ts`
    - `apps/api/test/http/dashboard.test.ts`
    - `apps/api/test/http/logs-secrets.test.ts`
    - `apps/api/test/http/me.test.ts`
    - `apps/api/test/http/me-delete.test.ts`
    - `apps/api/test/http/me-export.test.ts`
    - `apps/api/test/http/me-export-v1-1.test.ts`
    - `apps/api/test/http/me-export-v1-2.test.ts`
    - `apps/api/test/http/onboarding.test.ts`
    - `apps/api/test/http/settings.test.ts`
    - `apps/api/test/http/settings-register.test.ts`
  - **Especificación de Implementación:** El repositorio `SignupTickets` ofrece `issue(userId, tokenHash, expiresAt)` (reemplaza el ticket del usuario), `markConfirmed(userId)`, `claim(tokenHash)` (`DELETE … WHERE token_hash = $1 AND confirmed_at IS NOT NULL AND expires_at > now() RETURNING user_id`), `deleteForUser(userId)` y `purgeExpired(now)`. Cambios: (1) `signUp` genera siempre un valor aleatorio de 32 bytes, también cuando el correo ya está activo, y el controlador lo entrega en la cookie `__Secure-signup-ticket` (`HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=86400`); solo cuando el resultado es una cuenta Sin confirmar, nueva o reemplazada, se guarda su SHA-256 con `issue` (RF-M1-03, RNF-15: la respuesta y el tiempo no cambian). (2) `confirm(token)` consume el enlace, marca el correo verificado y llama `markConfirmed`; ya no crea la sesión ni recibe la sesión actual, y responde `{ status: 'confirmed' }`. (3) Nuevo `confirmationStatus(ticket, currentSessionId?)` y `POST /api/auth/confirmation/status`, sin sesión y sin cuerpo: sin cookie o con un ticket que `claim` no devuelve → `{ status: 'pending' }`; con uno devuelto, cierra la sesión que el navegador traiga (EC-M1-11), crea la sesión, borra la cookie del ticket y responde `{ status: 'confirmed', next: 'onboarding' }`. (4) `resetPassword` llama `deleteForUser` (EC-M1-14). (5) `maintenance` agrega `purgeExpired` a sus purgas.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "La pestaña de registro continúa sola al confirmar el correo": con el ticket del registro, `confirmation/status` responde `pending` antes de abrir el enlace y, después, `confirmed` con la cookie de sesión y `next: 'onboarding'` (`RF-M1-18`).
    - `RF-M1-18`: `confirm` deja el correo verificado, no crea ninguna fila en `auth_session` ni envía una cookie de sesión.
    - `RF-M1-18`: el ticket sirve una sola vez; la segunda llamada responde `pending`.
    - `RNF-15`: registrarse con un correo nuevo, uno Sin confirmar y uno Activo responde lo mismo y fija la cookie en los tres casos; con el ticket del correo Activo, `confirmation/status` responde `pending` siempre.
    - `EC-M1-14`: recuperar la contraseña de una cuenta Sin confirmar (`EC-M1-10`) o registrarse de nuevo con su correo (`EC-M1-09`) invalida el ticket anterior: aunque se abra el enlace nuevo, el ticket viejo responde `pending`.
    - `EC-M1-11`: si el navegador del ticket tiene la sesión de otro usuario, `confirmation/status` la cierra y abre la del usuario confirmado.
    - `RF-M1-18`: un ticket vencido (más de 24 h) responde `pending` y `maintenance` lo borra.
    - `RF-M1-04`: una cuenta sin confirmar sigue sin sesión ni acceso a datos, con o sin ticket.

- [x] **`TASK-266`: Confirmación del correo (3/3): la app que espera continúa sola al Onboarding**
  - **Dependencias:** Requiere TASK-265
  - **Trazabilidad SDD:** plan §4.1.4 (Confirmación desde otro dispositivo); RF-M1-18, EC-M1-11, EC-M1-13, RF-M1-05
  - **Archivos en Alcance:**
    - `apps/web/src/features/auth/api.ts`
    - `apps/web/src/features/auth/hooks/use-confirmation-watch.ts`
    - `apps/web/src/features/auth/components/check-email.tsx`
    - `apps/web/src/features/auth/components/confirm-link.tsx`
    - `apps/web/src/locales/es-BO/auth.json`
    - `apps/web/test/confirmation-watch.test.ts`
    - `e2e/m1-sign-up.spec.ts`
    - `e2e/m1-sign-up-confirm-sync.spec.ts`
    - `e2e/m10-onboarding-step1.spec.ts`
    - `e2e/m10-onboarding-step2.spec.ts`
    - `e2e/m10-onboarding-step3.spec.ts`
    - `e2e/a11y-v1-0.spec.ts`
  - **Especificación de Implementación:** `api.ts` agrega `confirmationStatusEndpoint` y ajusta la salida de `confirmEndpoint` a `ConfirmDto`. `useConfirmationWatch({ onConfirmed })` llama a `confirmation/status` cada 3 s mientras `document.visibilityState` es `visible` (cada 10 s pasados 5 minutos), también al recuperar el foco y al volverse visible, y se detiene al confirmar, al desmontarse y a las 24 h; ignora los errores de red. Se escribe con un reloj y un `fetch` inyectables, para probarlo sin navegador. `CheckEmail` lo usa: al confirmarse, invalida `['me']` y navega a `/bienvenida` con `replace`. `ConfirmLink` solo llama a `confirm`: al terminar muestra "Correo confirmado" con "Vuelve a la app donde creaste tu cuenta: continúa sola. Si ya la cerraste, inicia sesión" y un enlace a `/entrar` (textos en `auth.json`); ya no navega a `/bienvenida`. `LINK_ALREADY_USED` sigue llevando a `/entrar` (EC-M1-02) y el enlace inválido sigue ofreciendo el reenvío.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "La pestaña de registro continúa sola al confirmar el correo" (E2E, dos contextos de navegador): con el enlace abierto en el segundo contexto, que muestra "Correo confirmado" y no tiene sesión, la pestaña de `/revisa-tu-correo` del primero llega sola a `/bienvenida` con la sesión iniciada (`RF-M1-18`).
    - `RF-M1-18`: con las dos pestañas en el mismo navegador, ocurre lo mismo.
    - `EC-M1-13`: con la app del registro cerrada, abrir el enlace muestra "Correo confirmado", no inicia sesión por sí solo, y "Iniciar sesión" lleva a `/entrar`, donde las credenciales llevan a `/bienvenida`.
    - `EC-M1-11`: confirmar con la sesión de otro usuario abierta en el navegador que espera cierra esa sesión y deja la del confirmado.
    - `RF-M1-18`: con un reloj simulado, el sondeo pregunta cada 3 s con la pestaña visible, no pregunta oculta, pregunta de inmediato al volver el foco, pasa a 10 s tras 5 minutos y se detiene al confirmar.

- [x] **`TASK-267`: Botón "Volver" en la cabecera de las pantallas internas**
  - **Dependencias:** Ninguna
  - **Trazabilidad SDD:** plan §4.2.4 (Volver); RF-M2-13, RF-M2-06, RF-M2-10, EC-M2-04, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/app/layout/route-parents.ts`
    - `apps/web/src/app/layout/back-button.tsx`
    - `apps/web/src/app/layout/header.tsx`
    - `apps/web/src/app/layout/bottom-tab-bar.tsx`
    - `apps/web/src/lib/use-is-desktop.ts`
    - `apps/web/src/locales/es-BO/navigation.json`
    - `apps/web/test/route-parents.test.ts`
    - `e2e/m2-back-button.spec.ts`
  - **Especificación de Implementación:** Hoy, para salir de una pantalla interna hay que tocar la pestaña. `parentOf(pathname, { desktop })` (función pura en `route-parents.ts`) devuelve la pantalla de la que cuelga una ruta, o `null` en las raíces, según la tabla del plan §4.2.4. `use-is-desktop.ts` saca de `bottom-tab-bar.tsx` el *hook* `useIsDesktop` (1024 px) para que lo usen también la cabecera y la barra. `<BackButton>` aparece en `<Header>`, antes del título, cuando `parentOf` no es `null`: hace `navigate(-1)` si la entrada anterior del historial es de la app (`history.state.idx > 0`) y `navigate(padre)` si no. Mide 44 px y lleva `aria-label`. No toca los borradores (RF-M2-10) ni el recuerdo de cada pestaña (RF-M2-04).
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Volver desde una pantalla interna": del detalle de una cuenta, abierto desde la lista, "Volver" lleva a Cuentas y la lista conserva su posición (`RF-M2-13`).
    - `EC-M2-04`: abriendo `/cuentas/<id>` por enlace directo, "Volver" lleva a `/cuentas` y no sale de la app.
    - `RF-M2-13`: no hay "Volver" en `/`, `/movimientos`, `/registrar`, `/cuentas` ni `/mas`.
    - `RF-M2-13`: en 360 px, `/presupuestos` y `/recurrentes` tienen "Volver" hacia `/mas`; en 1280 px no lo tienen.
    - `RF-M2-10`: volver desde un formulario con datos sin guardar conserva el borrador.
    - `RF-M2-06`: el botón Atrás del navegador sigue funcionando en todas las pantallas.
    - `RNF-06`: el botón mide al menos 44 px, tiene nombre accesible y axe no reporta violaciones serias.

- [x] **`TASK-268`: Retirar los "Volver a…" propios de cada pantalla**
  - **Dependencias:** Requiere TASK-267
  - **Trazabilidad SDD:** plan §4.2.4 (Volver); RF-M2-13
  - **Archivos en Alcance:**
    - `apps/web/src/features/accounts/routes.tsx`
    - `apps/web/src/features/budgets/routes.tsx`
    - `apps/web/src/features/categories/routes.tsx`
    - `apps/web/src/features/debts/routes.tsx`
    - `apps/web/src/features/goals/routes.tsx`
    - `apps/web/src/features/transactions/routes.tsx`
    - `apps/web/src/locales/es-BO/accounts.json`
    - `apps/web/src/locales/es-BO/budgets.json`
    - `apps/web/src/locales/es-BO/categories.json`
    - `apps/web/src/locales/es-BO/debts.json`
    - `apps/web/src/locales/es-BO/goals.json`
    - `apps/web/src/locales/es-BO/transactions.json`
    - `e2e/m2-back-button.spec.ts`
  - **Especificación de Implementación:** Con el botón de la cabecera, los enlaces "Volver a tus cuentas", "Volver a presupuestos", "Volver a las categorías", "Volver a deudas", "Volver a metas" y "Volver" del detalle de un movimiento quedan repetidos y con otro estilo. Se quitan de las seis pantallas y se borran sus claves de `es-BO`. `goneBack` ("Volver a Movimientos") de un movimiento que ya no existe se queda, porque esa pantalla no es una pantalla interna.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-13`: el detalle de una cuenta, un presupuesto, una meta, una deuda, una categoría y un movimiento tiene un solo control "Volver", el de la cabecera.
    - Un movimiento eliminado desde otro dispositivo sigue ofreciendo "Volver a Movimientos".
    - Comando: `pnpm --filter web typecheck`

- [x] **`TASK-269`: Marca (1/2): pedir el diseño de los logos, confirmar su disposición y poner el ícono de la pestaña**
  - **Dependencias:** Ninguna
  - **Trazabilidad SDD:** plan §4.2.4 (Marca); RF-M2-14
  - **Archivos en Alcance:**
    - `apps/web/index.html`
    - `apps/web/public/favicon.svg`
    - `apps/web/public/favicon.ico`
    - `apps/web/public/apple-touch-icon.png`
    - `apps/web/public/logo.svg`
    - `apps/web/test/brand-assets.test.ts`
  - **Especificación de Implementación:** El pipeline no inventa ni genera un logo: **el primer subagente que corra en esta tarea responde `NEEDS_CLARIFICATION:` y no escribe nada**, y el orquestador le pide al usuario dos cosas. (1) **El diseño:** `favicon.svg` (cuadrado, legible a 16×16), `favicon.ico` (16, 32 y 48 px), `apple-touch-icon.png` (180×180) y `logo.svg` para dentro de la app (solo la marca, sin texto, que funcione en tema claro y oscuro, con `currentColor` o con dos variantes); opcionalmente una versión con el nombre. (2) **Confirmar o ajustar esta disposición propuesta:** a) la pestaña del navegador muestra el ícono y el título "Finanzas"; b) las pantallas de acceso (registro, entrar, revisa tu correo, confirmar, olvidé mi contraseña, restablecer) y el Onboarding muestran el logo centrado, de 48 px, sobre el título; c) la cabecera de cada pantalla con barra, en celular y escritorio, lo muestra de 24 px a la izquierda del título (después de "Volver", si lo hay); d) la barra lateral de escritorio no lleva logo propio, para no repetirlo junto al de la cabecera; e) en tema oscuro se usa la misma marca, con el color del texto. Con los archivos y la respuesta, se copian a `apps/web/public/` y `index.html` enlaza `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`, `<link rel="icon" href="/favicon.ico" sizes="any">`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` y `<meta name="theme-color">` con el color de marca. La disposición confirmada se registra en `docs/design-direction.md`, sección "Marca", en un commit `docs:` aparte, antes de TASK-270.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-14`: `index.html` enlaza el ícono SVG, el ICO y el `apple-touch-icon`, y los tres archivos existen en `public/`.
    - `apple-touch-icon.png` es un PNG de 180×180 y `favicon.ico` incluye 16, 32 y 48 px.
    - `logo.svg` y `favicon.svg` son SVG válidos con `viewBox`, pesan 10 KB o menos, y no contienen `<script>`, `<foreignObject>` ni referencias externas.
    - El `<title>` de la página sigue siendo "Finanzas".
  - **Pasos manuales:**
    1. **Diseñar los logos** (Figma, Canva, Inkscape o un encargo), con el color de marca de `docs/design-direction.md` (verde azulado profundo). Conviene un isotipo simple, que se lea en 16 px.
    2. **Exportar los archivos** con las medidas y los nombres pedidos arriba.
    3. **Cuando el pipeline pregunte**, indicar dónde están los archivos y confirmar o ajustar la disposición (a a e).
    4. **Registrar la disposición confirmada** en `docs/design-direction.md`, sección "Marca", con un commit `docs:` aparte.

- [x] **`TASK-270`: Marca (2/2): el logo en las pantallas de acceso, el Onboarding y la cabecera**
  - **Dependencias:** Requiere TASK-267, TASK-269
  - **Trazabilidad SDD:** plan §4.2.4 (Marca); RF-M2-14, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/components/brand-mark.tsx`
    - `apps/web/src/app/layout/header.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/features/onboarding/routes.tsx`
    - `apps/web/src/locales/es-BO/navigation.json`
    - `e2e/m2-brand.spec.ts`
  - **Especificación de Implementación:** Sigue la disposición confirmada en TASK-269 (sección "Marca" de `docs/design-direction.md`); si difiere de la propuesta, manda lo confirmado. `<BrandMark size="header" | "public">` muestra `/logo.svg` con `width` y `height` fijos, para que no mueva el diseño al cargar, y el texto alternativo "Finanzas" (en `navigation.json`). `<Header>` lo muestra de 24 px antes del título, después de `<BackButton>`. `PublicLayout` (en `router.tsx`) lo muestra de 48 px, centrado, sobre las pantallas de acceso, y `OnboardingPage` también. Con dos variantes de color, se alternan con las clases de tema.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "El logo acompaña a la app": el `<link rel="icon">` apunta a un archivo que responde 200, y el logo con su texto alternativo está en `/entrar`, `/registro` y en la cabecera de Inicio, Movimientos, Cuentas y Más (`RF-M2-14`).
    - `RF-M2-14`: en la cabecera, el logo queda a la izquierda del título, en 360 px y en 1280 px, y "Volver", si existe, queda a la izquierda del logo.
    - `RNF-06`: axe no reporta violaciones serias en la pantalla de acceso ni en la cabecera, en los dos temas.
    - Cargar la pantalla no desplaza el título (el logo reserva su espacio).

- [x] **`TASK-271`: Coherencia de la documentación SDD con el código: comprobaciones automáticas**
  - **Dependencias:** Requiere TASK-261, TASK-263, TASK-266, TASK-268, TASK-270
  - **Trazabilidad SDD:** plan §5.5 (matriz de trazabilidad), constitución §6; RF-M1-08, RF-M1-16
  - **Archivos en Alcance:**
    - `apps/api/test/unit/sdd-coherence.test.ts`
  - **Especificación de Implementación:** Tarea de verificación: una sola prueba que lee `docs/constitution.md`, `spec.md`, `plan.md` y `tasks.md` (con `node:fs`, aceptando fin de línea CRLF) y los compara con el código. Un caso por comprobación; cuando falla, lista cada diferencia. (1) Los tipos de correo de `RF-M1-16`, el enum `email_kind` de plan §3.2, `EMAIL_KINDS` y el tipo `EmailKind` son los mismos. (2) Cada fila de las tablas de endpoints de plan §4.x.2 es una ruta registrada en `presentation/routes` y `app.ts`, y cada ruta registrada está en el plan. (3) Cada código del catálogo de errores de `packages/contracts` está en el plan y al revés. (4) Cada `CREATE TABLE` del plan §3 corresponde a un modelo de `schema.prisma` (por su `@@map`) y al revés. (5) Cada RF, EC y RNF de la spec tiene su fila en la matriz de plan §5.5, y cada escenario Gherkin su fila en plan §5.2. (6) Cada variable de `env.ts` está en `.env.example`, y las de `render.yaml` con `sync: false` están en `env.ts`. (7) Cada ID que citan las tareas de `tasks.md` existe en la spec. (8) La versión de la spec y del plan que cita cada encabezado es la del documento citado. (9) El mapa de fases de `tasks.md` cubre exactamente las tareas de cada fase.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-16`: los tipos de correo de la spec, del plan, del enum y de las plantillas coinciden, y ninguno es de intentos fallidos.
    - `RF-M1-08`: la spec y el plan no mencionan ningún correo de aviso por intentos fallidos, y la espera progresiva sigue en los dos.
    - Cada una de las comprobaciones (2) a (9) pasa, o la prueba lista las diferencias que quedan.
  - **Pasos manuales:**
    1. Si la prueba lista diferencias, decidir en cada una si cambia el documento (en un commit `docs:` aparte, constitución §6) o el código (en una tarea nueva), y volver a correr la tarea.

- [x] **`TASK-272`: Coherencia de la documentación SDD con el código: informe de revisión**
  - **Dependencias:** Requiere TASK-271
  - **Trazabilidad SDD:** constitución §6, plan §5.5 (matriz de trazabilidad)
  - **Archivos en Alcance:**
    - `001-appFinanzas-mvp/coherencia.md`
  - **Especificación de Implementación:** Lo que una prueba no puede comparar es lo que dice cada requisito frente a lo que hace el código. El informe recorre la spec módulo por módulo (M1 a M15 y los RNF) y marca cada RF, EC y RNF como `coincide`, `difiere` o `no verificable`, con el archivo o la prueba que lo demuestra. Las diferencias van en una tabla: documento, sección, lo que dice, lo que hace el código y la corrección propuesta (cambiar el documento o el código). Lista también las tareas cerradas cuyo texto quedó obsoleto por esta fase (TASK-048, TASK-052, TASK-054, TASK-055, TASK-056, TASK-057, TASK-063 y TASK-065, por el correo de intentos fallidos y por la confirmación del correo), con la nota "reemplazada por TASK-262, TASK-263, TASK-265 o TASK-266". No modifica la spec, el plan ni `tasks.md`: eso se hace en commits `docs:` aparte, con lo que la persona apruebe del informe.
  - **Criterios de Verificación (Tests & DoD):**
    - El informe tiene una fila por cada RF, EC y RNF de la spec v1.5.
    - Cada diferencia trae su corrección propuesta y dice si cambia el documento o el código.
    - Lista los IDs de tareas cerradas con texto obsoleto por la Fase 27.
  - **Pasos manuales:**
    1. Revisar el informe y marcar qué diferencias se corrigen. Los cambios de documento van en commits `docs:` aparte, y los cambios de código, en tareas nuevas.

- [x] **`TASK-273`: Confirmación del correo con otra sesión abierta: descartar los borradores de esa sesión**
  - **Dependencias:** Requiere TASK-266, TASK-272
  - **Trazabilidad SDD:** plan §4.1.4 (Confirmación desde otro dispositivo), `coherencia.md` D-01; EC-M1-11, EC-M2-01
  - **Archivos en Alcance:**
    - `apps/web/src/features/auth/components/check-email.tsx`
    - `e2e/m1-sign-up-confirm-sync.spec.ts`
  - **Especificación de Implementación:** EC-M1-11 dice que al confirmar el correo de A en un navegador con la sesión de B abierta "se cierra la sesión de B, su borrador se descarta y se inicia la de A". El servidor ya cierra la sesión de B y abre la de A, pero `CheckEmail.onConfirmed` solo invalida `['me']` y navega a `/bienvenida`, así que los borradores de B (`draft:{idDeB}:…`) siguen guardados y reaparecen cuando B vuelve a entrar. En `onConfirmed`, antes de invalidar, se lee el `MeDto` anterior de la caché (`ME_QUERY_KEY`); si existe y su `id` no es el de la persona que acaba de confirmar, se llama a `clearAllDrafts(previous.id)` y se limpia la caché (`queryClient.clear()`), igual que el diálogo de sesión vencida (EC-M2-01, `session-expired-dialog.tsx`). Si no había sesión o es la misma persona, el comportamiento no cambia.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M1-11`: el E2E existente se amplía: B deja un borrador guardado antes de que se confirme el correo de A; después de que la app continúa sola a `/bienvenida`, no queda ninguna clave `draft:{idDeB}:` en el almacenamiento del navegador, y al volver a entrar como B el formulario está vacío.
    - `RF-M1-18`: sin otra sesión abierta, la confirmación sigue llevando a `/bienvenida` sin cambios.

- [x] **`TASK-274`: RNF-19 citado en las pruebas: la historia no cambia con la tasa ni con la configuración**
  - **Dependencias:** Requiere TASK-272
  - **Trazabilidad SDD:** plan §5.3 (RNF-18 / RNF-19), `coherencia.md` D-03; RNF-19, RN-05, RN-11
  - **Archivos en Alcance:**
    - `packages/domain/test/fx-convert.test.ts`
    - `apps/api/test/integration/dashboard-cards.test.ts`
  - **Especificación de Implementación:** Tarea de verificación. RNF-19 es el único RF, EC o RNF que ninguna prueba cita, aunque el comportamiento se cumple (cada asiento guarda su tasa; ingresos y gastos se convierten con la tasa guardada). Se cita `RNF-19` en los nombres de las pruebas de RN-05 que ya lo demuestran, sin cambiar lo que comprueban, y se agrega un caso de integración en `dashboard-cards.test.ts`: con movimientos en USD de un mes ya pasado, registrar una tasa personalizada nueva y cambiar la moneda base o la zona horaria no altera los montos convertidos de esos movimientos ni el resultado del período (plan §5.3).
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-19`: al menos una prueba unitaria y una de integración lo citan y pasan.
    - `RNF-19`: cambiar la tasa de referencia después de registrar un movimiento no altera su monto convertido ni el total del período.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M8 - Inicio (dashboard)]]
- **Decisiones (ADR):** [[ADR-19 - Backend en capas]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.6 Exactitud monetaria]] · [[Spec 3.9 Auditoría y retención]]
- **Fases de tareas:** [[Tareas Fase 22 - Cierre de V1.1 Inicio, exportación y regresión]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]]
- **Spec / Plan / Constitución:** [[Constitución 6. Desarrollo guiado por especificaciones (SDD)]] · [[Plan 1.1 Capas]] · [[Plan 1.5 Integración y despliegue continuos (ADR-20)]] · [[Plan 3. Esquema de Datos y Persistencia Global]] · [[Plan 3.2 Tipos enumerados]] · [[Plan 3.3 Cuenta de usuario y seguridad (M1)]] · [[Plan 3.9 Seguridad a nivel de datos]] · [[Plan 4. Diseño Técnico por Módulo]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 4.8 M8 - Inicio (V1.0)]] · [[Plan 5.2 Criterios de aceptación (Gherkin) → pruebas]] · [[Plan 5.3 Requerimientos no funcionales → verificación]] · [[Plan 5.5 Matriz de trazabilidad (spec → plan)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - AuthSession]] · [[Entidad - AuthUser]] · [[Entidad - EmailLink]] · [[Entidad - EmailOutbox]] · [[Entidad - EmailSendLog]] · [[Entidad - LoginThrottle]] · [[Entidad - SignupTicket]]

