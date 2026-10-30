---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 17 - Cierre de V1.0: rendimiento, accesibilidad y despliegue"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "17"
tareas: "13"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 16 - Exportación de datos (M1, V1.0)]] · → [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]]

### Fase 17 — Cierre de V1.0: rendimiento, accesibilidad y despliegue

- [x] **`TASK-166`: Seed de E2E y rendimiento (`seed:e2e`)**
  - **Dependencias:** Requiere TASK-053, TASK-121
  - **Trazabilidad SDD:** plan §1.5 (`qa-e2e`: `seed:e2e`), plan §5.1 (rendimiento); RNF-03
  - **Archivos en Alcance:**
    - `packages/db/seed/e2e.ts`
    - `packages/db/package.json`
    - `pnpm-lock.yaml`
    - `packages/db/test/seed-e2e.test.ts`
  - **Especificación de Implementación:** Crea usuarios de prueba conocidos, tasas fijas en `market_rate` para 13 meses y, para el usuario de rendimiento, 5.000 movimientos repartidos en 12 meses y varias cuentas y categorías. Es determinista e idempotente.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-03`: el usuario de rendimiento tiene exactamente 5.000 transacciones.
    - Correrlo dos veces no duplica nada.

- [x] **`TASK-167`: Pruebas de rendimiento del API**
  - **Dependencias:** Requiere TASK-146, TASK-166
  - **Trazabilidad SDD:** plan §5.3 (RNF-02, RNF-03), plan §4.8.2 (objetivo p95); RNF-02, RNF-03
  - **Archivos en Alcance:**
    - `apps/api/test/integration/performance.test.ts`
  - **Especificación de Implementación:** Mide, contra Postgres y con el seed de 5.000 movimientos, el p95 de 200 `POST /api/transactions` y de 50 `GET /api/dashboard`, y revisa con `EXPLAIN ANALYZE` los planes de las consultas del Inicio.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-02`: el p95 del endpoint de guardar es menor que 300 ms.
    - `RNF-03`: el p95 del Inicio es menor que 1,2 s y ninguna consulta hace *seq scan* sobre `ledger_transaction` ni `ledger_entry`.

- [x] **`TASK-248`: Web: división de código por ruta y presupuesto de bundle**
  - **Dependencias:** Requiere TASK-142, TASK-148, TASK-162, TASK-165
  - **Trazabilidad SDD:** plan §5.3 (RNF-01, RNF-03), plan §4.7.4 (rendimiento); RNF-01, RNF-03
  - **Archivos en Alcance:**
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/features/accounts/routes.tsx`
    - `apps/web/src/features/auth/routes.tsx`
    - `apps/web/src/features/categories/routes.tsx`
    - `apps/web/src/features/dashboard/routes.tsx`
    - `apps/web/src/features/fx/routes.tsx`
    - `apps/web/src/features/onboarding/routes.tsx`
    - `apps/web/src/features/profile/routes.tsx`
    - `apps/web/src/features/register/routes.tsx`
    - `apps/web/src/features/settings/routes.tsx`
    - `apps/web/src/features/transactions/routes.tsx`
    - `apps/web/vite.config.ts`
    - `apps/web/src/features/categories/components/icon-gallery.tsx`
    - `apps/web/src/features/register/api.ts`
    - `apps/web/src/features/register/components/date-chips.tsx`
    - `apps/web/src/features/transactions/components/transaction-detail.tsx`
    - `apps/web/src/features/transactions/detail-data.ts`
    - `apps/web/test/bundle-budget.test.ts`
  - **Especificación de Implementación:** Hoy la web compila un solo archivo de JavaScript (2,1 MB, unos 617 KB en gzip), así que cualquier pantalla descarga todo. Pasa la pantalla de cada ruta a carga diferida con la propiedad `lazy` del router, de modo que el JavaScript de cada pantalla (y su espacio de nombres de i18n) se descargue solo al entrar en ella. Las librerías pesadas de una sola pantalla (gráficos del Inicio, arrastrar y soltar de Categorías) deben quedar fuera del paquete de entrada y de `/registrar`. Ajusta `vite.config.ts` solo si hace falta para separar bloques estables (por ejemplo, las librerías compartidas). No cambia la apariencia ni el comportamiento de ninguna pantalla. Tres cambios más sacan peso del camino de `/registrar`: (1) `iconFor` deja de importar el objeto `icons` de `lucide-react` (1.700 íconos, unos 165 KB en gzip) y usa solo los íconos del catálogo `IconKey`; (2) el esquema `TransactionDetailData` pasa a `transactions/detail-data.ts`, un archivo de datos sin componentes, para que `register/api.ts` y las guardas de la app no arrastren la pantalla de detalle al paquete de entrada (`transaction-detail.tsx` lo vuelve a exportar para no tocar a quienes ya lo importan); (3) el calendario del selector de fecha de Registrar (`react-day-picker` y `date-fns`) se carga de forma diferida al abrir el selector.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-01`: la prueba compila la web y comprueba que el JavaScript que descarga `/registrar` (paquete de entrada más los bloques que esa ruta importa) pesa 300 KB gzip o menos.
    - `RNF-03`: los gráficos del Inicio y el arrastrar y soltar de Categorías no están en el paquete de entrada ni en los bloques de `/registrar`.
    - Las pruebas de la web y los E2E existentes siguen pasando.

- [x] **`TASK-168`: Pruebas de rendimiento E2E**
  - **Dependencias:** Requiere TASK-142, TASK-148, TASK-166, TASK-248
  - **Trazabilidad SDD:** plan §5.3 (RNF-01, RNF-03), plan §4.7.4 (rendimiento); RNF-01, RNF-03
  - **Archivos en Alcance:**
    - `e2e/perf.spec.ts`
    - `e2e/support/network-profiles.ts`
    - `apps/web/src/app/guards.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/features/dashboard/routes.tsx`
    - `apps/web/src/features/dashboard/hooks/use-dashboard.ts`
    - `apps/web/src/features/dashboard/components/dashboard-blocks.tsx`
    - `apps/web/src/features/dashboard/components/pace-chart.tsx`
    - `apps/web/index.html`
  - **Especificación de Implementación:** Con Chromium, red 4G simulada y CPU ×4: cronometra el flujo de Registrar desde abrir la app hasta guardar, mide la carga del Inicio con 5.000 movimientos y suma el JavaScript (gzip) que descarga la ruta `/registrar`. La primera medición del Inicio tardó de 7 a 10 s, y `GET /api/dashboard` solo 0,4 s: el tiempo se va en la cascada de descargas y peticiones (sesión, bloque de la ruta, gráfico y datos, uno detrás de otro). Reduce esa cascada sin cambiar lo que muestra el Inicio: pide los datos del mes actual en cuanto la sesión confirma el Onboarding terminado (igual que Registrar con su contexto, plan §4.7.4), precarga el bloque de la ruta, y carga el gráfico de ritmo de forma diferida para que las tarjetas aparezcan sin esperar a `recharts`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-01`: el flujo completo tarda menos de 10 s.
    - `RNF-03`: el Inicio carga en menos de 2 s.
    - El JavaScript de `/registrar` pesa 300 KB gzip o menos.

- [x] **`TASK-169`: Accesibilidad, teclado y compatibilidad de V1.0**
  - **Dependencias:** Requiere TASK-154, TASK-162, TASK-165
  - **Trazabilidad SDD:** plan §5.3 (RNF-05, RNF-06), plan §5.4 (definición de terminado, punto 5); RNF-05, RNF-06, RF-M7-12
  - **Archivos en Alcance:**
    - `e2e/a11y-v1-0.spec.ts`
    - `e2e/keyboard-v1-0.spec.ts`
    - `apps/web/src/index.css`
    - `apps/web/src/components/ui/tabs.tsx`
    - `apps/web/src/features/fx/components/rate-history-chart.tsx`
    - `apps/web/src/features/transactions/components/transaction-row.tsx`
  - **Especificación de Implementación:** Recorre todas las pantallas de V1.0 en tema claro y oscuro con axe, en los 6 proyectos de navegador y tamaño. Hace los flujos de Registrar y Movimientos solo con el teclado y verifica las alternativas a los gestos (casillas en el lote, Subir y Bajar). La primera corrida de axe encontró 11 violaciones reales que esta tarea corrige: los tokens `--destructive`, `--destructive-foreground` y `--muted-foreground` no llegaban a 4,5:1 (los valores nuevos están en `docs/design-direction.md`); los gatillos del selector de rango de Tipo de cambio apuntan con `aria-controls` a un contenido que no existe; y la fila seleccionada de Movimientos y la pestaña de ingresos de Categorías heredan el contraste bajo de `--muted-foreground`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-06`: ninguna violación seria o crítica de axe en ninguna pantalla de V1.0.
    - `RF-M7-12`: se registra un gasto solo con el teclado.
    - `RNF-05`: las pruebas pasan en Chromium, WebKit y Firefox a 360 px y a 1280 px.

- [x] **`TASK-170`: Barrido de aislamiento y de secretos en logs (V1.0)**
  - **Dependencias:** Requiere TASK-164
  - **Trazabilidad SDD:** plan §5.1 (aislamiento), plan §5.3 (RNF-14, RNF-17), plan §3.9 (logs); RNF-14, RNF-17
  - **Archivos en Alcance:**
    - `apps/api/test/http/isolation-sweep.test.ts`
    - `apps/api/test/http/logs-secrets.test.ts`
  - **Especificación de Implementación:** Recorre todas las rutas montadas de `/api`. Las que tienen `:id` se prueban con un recurso de A desde la sesión de B, y se verifica que toda ruta privada exige sesión. Además, captura los logs del registro, el inicio de sesión, la recuperación y la eliminación.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-14`: toda ruta con un recurso ajeno responde 404, y la prueba falla si aparece una ruta nueva sin cubrir.
    - `RNF-17`: los logs no contienen contraseñas, tokens de enlaces ni cookies.

- [x] **`TASK-171`: Despliegues en Render y Vercel y chequeo de la base de datos**
  - **Dependencias:** Requiere TASK-036
  - **Trazabilidad SDD:** plan §1.5 (configuración versionada, puesta en marcha), plan §1.2 (cómo se conectan las tres partes), plan §4.2.2 (`/api/health/ready`), ADR-02, ADR-19, ADR-20
  - **Archivos en Alcance:**
    - `render.yaml`
    - `vercel.json`
    - `.gitignore`
    - `packages/db/package.json`
    - `pnpm-lock.yaml`
    - `apps/api/src/application/ports/readiness.ts`
    - `apps/api/src/infrastructure/persistence/readiness.ts`
    - `apps/api/src/infrastructure/persistence/prisma-client.ts`
    - `apps/api/src/presentation/routes/health.routes.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/readiness.test.ts`
  - **Especificación de Implementación:**
    - **`render.yaml`:** el servicio `finanzas-api` con lo que dice plan §1.5:
      - plan gratis y `autoDeploy: false`;
      - el `buildCommand` con `--prod=false` y `pnpm --filter @finanzas/db generate`;
      - `startCommand` y `healthCheckPath: /api/health`;
      - `NODE_ENV=production` y `NODE_VERSION=22`;
      - las demás variables con `sync: false`.
    - **`vercel.json`:**
      - `git.deploymentEnabled: false`;
      - `installCommand`, `buildCommand` y `outputDirectory: apps/web/dist`;
      - los rewrites en orden: primero `/api/:path*` hacia la URL del API en Render y después la SPA hacia `/index.html`.
    - **`.gitignore`:** ignora `.vercel/`.
    - **`packages/db/package.json`:** agrega `"exports": { ".": "./src/index.ts" }`, y `prisma-client.ts` pasa a importar `@finanzas/db` en lugar de `@finanzas/db/src/index.js`.
    - **`GET /api/health/ready`** (plan §4.2.2): el puerto `ReadinessProbe` (`check(): Promise<boolean>`) lo implementa la infraestructura con `SELECT 1` y un límite de 2 s. `health.routes.ts` lo recibe por las dependencias de `createApp` y responde 204 o 503 sin cuerpo. El contenedor lo arma con el cliente Prisma. `GET /api/health` no cambia.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-171`: con la base de test, `GET /api/health/ready` responde 204.
    - `TASK-171`: con una base inalcanzable, responde 503 sin cuerpo y sin detalles internos, en menos de 3 s.
    - `TASK-171`: `GET /api/health` sigue respondiendo 204 sin tocar la base.
    - `render.yaml` y `vercel.json` coinciden uno por uno con plan §1.5, y ningún secreto tiene valor en los archivos.
    - Comando: `pnpm --filter api build`
  - **Pasos manuales** (los hace quien implementa la tarea; el pipeline no puede crear cuentas ni cargar secretos):
    1. **Neon:** crear el proyecto `finanzas` y usar su rama `main`. Copiar la URL con pooler (será `DATABASE_URL`) y la directa (será `DATABASE_URL_DIRECT`). Nunca van al repositorio.
    2. **Resend:** crear la cuenta y una API key (`RESEND_API_KEY`). `env.ts` la exige desde el primer arranque.
    3. **Secretos de la app:** generar `AUTH_SECRET`, `HMAC_SECRET` y `JOBS_SECRET` con `openssl rand -base64 32`, uno por cada uno.
    4. **Vercel:** `pnpm dlx vercel login` y, en la raíz del repo, `pnpm dlx vercel link`. De `.vercel/project.json` salen `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`. Crear un token en Account Settings → Tokens (`VERCEL_TOKEN`) y anotar la URL de producción (`WEB_URL`).
    5. **Render**, cuando `render.yaml` ya esté en `main`:
       - New → Blueprint → el repo, rama `main`.
       - Cargar las variables `sync: false`: `DATABASE_URL` con pooler, los tres secretos, `RESEND_API_KEY`, `RELEASE=1.0`, `WEB_ORIGIN` = `WEB_URL` e `INTEGRATIONS=real`.
       - Anotar la URL pública del servicio (`API_URL`). Si no coincide con el rewrite de `vercel.json`, corregirlo en un commit `fix`.
       - Copiar el Deploy Hook (Settings → Deploy Hook), crear una API key (Account Settings → API Keys) y anotar el ID del servicio (`srv-…`).

- [x] **`TASK-172`: Workflow de QA efímero `qa-e2e.yml`**
  - **Dependencias:** Requiere TASK-010, TASK-166, TASK-169
  - **Trazabilidad SDD:** plan §1.5 (`qa-e2e.yml`), ADR-20; constitución §7
  - **Archivos en Alcance:**
    - `.github/workflows/qa-e2e.yml`
  - **Especificación de Implementación:** Disparadores `push` a `qa` y `pull_request` hacia `main`. Postgres como *service*, migraciones, `seed:e2e`, API con `INTEGRATIONS=fake`, web en `vite preview`, Playwright en la matriz de 6 proyectos en paralelo, axe, rendimiento y el subconjunto `@release-1.0`. Publica el reporte, las trazas y los videos de los fallos. Nombre del check: `qa-e2e`.
  - **Criterios de Verificación (Tests & DoD):**
    - El workflow cubre cada paso de plan §1.5 y publica los artefactos de los fallos.
  - **Pasos manuales:**
    1. En GitHub → Settings → Branches, agregar `qa-e2e` a los checks obligatorios de `main` (plan §1.5, protección de ramas). Hasta esta tarea, `main` solo exige `ci`.

- [x] **`TASK-173`: Workflow de despliegue `deploy.yml` y pruebas HTTP en CI**
  - **Dependencias:** Requiere TASK-171
  - **Trazabilidad SDD:** plan §1.5 (`deploy.yml`, secretos, vuelta atrás, puesta en marcha), plan §1.2 (pruebas de humo de los tres enlaces), plan §5.1 (contratos HTTP en CI), ADR-20; constitución §4, §7
  - **Archivos en Alcance:**
    - `.github/workflows/deploy.yml`
    - `apps/api/package.json`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:**
    - **Disparadores y concurrencia:** `deploy.yml` corre en cada `push` a `main` y con `workflow_dispatch`, con `concurrency: production` sin cancelar.
    - **Job 1:** `uses: ./.github/workflows/ci.yml`.
    - **Job 2, `deploy`** (`needs` el job 1, *environment* `production`). Sigue plan §1.5 al pie de la letra:
      - checkout, `pnpm/action-setup`, `setup-node` con `.nvmrc` y `pnpm install --frozen-lockfile`;
      - `prisma migrate deploy`, con `DATABASE_URL` y `DATABASE_URL_DIRECT` iguales al secreto `DATABASE_URL_DIRECT`;
      - el Deploy Hook de Render, siguiendo **ese** deploy por su ID cada 15 s hasta `live`. Falla ante `build_failed`, `update_failed`, `pre_deploy_failed`, `canceled`, `deactivated` o a los 15 minutos;
      - `vercel pull --yes --environment=production`, `vercel build --prod` y `vercel deploy --prebuilt --prod`, con `--token`;
      - las 4 pruebas de humo de plan §1.5, con `vars.API_URL` y `vars.WEB_URL`.
    - **Secretos:** los valores derivados que no son secretos de GitHub usan `::add-mask::`.
    - **Pruebas HTTP en CI:** el `test:unit` del API pasa a correr `--project unit --project http`, así CI y el `pre-push` corren los contratos HTTP de `apps/api/test/http/`.
  - **Criterios de Verificación (Tests & DoD):**
    - El orden de los pasos y las condiciones de fallo coinciden con plan §1.5. Si un paso falla, no corre el siguiente.
    - Las 4 pruebas de humo verifican los enlaces API, API → BD, web y web → API → BD.
    - Comando: `pnpm --filter api test:unit`
  - **Pasos manuales:**
    1. **GitHub → Settings → Environments → `production`:**
       - en «Deployment branches», solo `main`;
       - los secretos `DATABASE_URL_DIRECT`, `RENDER_DEPLOY_HOOK_URL`, `RENDER_API_KEY`, `RENDER_SERVICE_ID`, `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`;
       - las variables `WEB_URL` y `API_URL`.
    2. **GitHub → Settings → Branches:** `develop`, `qa` y `main` exigen PR y el check `ci`.
    3. **Primer despliegue:**
       - promover por PR `develop` → `qa` → `main` y mirar Actions → `deploy`;
       - si falló porque todavía no estaban los datos de Render (paso 5 de TASK-171), cargarlos y correr de nuevo con «Run workflow» (`workflow_dispatch`).
    4. **cron-job.org:** crear una tarea cada minuto, `POST $API_URL/internal/jobs/tick`, con los encabezados `x-jobs-secret: <JOBS_SECRET>` y `Content-Type: application/json` y el cuerpo `{}`.
    5. **Verificar:**
       - abrir en el navegador `$API_URL/api/health/ready`, `$WEB_URL/` y `$WEB_URL/api/health/ready`;
       - pasar las URLs reales al README en un commit `docs(readme)`.

- [x] **`TASK-174`: Workflow manual `fx-backfill.yml`**
  - **Dependencias:** Requiere TASK-091, TASK-173
  - **Trazabilidad SDD:** plan §1.5 (`fx-backfill.yml`), ADR-06
  - **Archivos en Alcance:**
    - `.github/workflows/fx-backfill.yml`
  - **Especificación de Implementación:** `workflow_dispatch` en el *environment* `production`. Corre una vez `packages/db/scripts/fx-backfill.ts` con `DATABASE_URL_DIRECT`.
  - **Criterios de Verificación (Tests & DoD):**
    - Solo se dispara a mano y usa los secretos del *environment* `production`.
  - **Pasos manuales:**
    1. Cuando la tarea esté en `main`, correrlo **una sola vez** desde Actions → `fx-backfill` → «Run workflow», y revisar en el log que haya cargado el histórico.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M15 - Recordatorios y avisos]] · [[M7 - Registrar]]
- **Decisiones (ADR):** [[ADR-02 - Sesión entre dominios (proxy de Vercel)]] · [[ADR-06 - Fuentes de tasas de cambio]] · [[ADR-19 - Backend en capas]] · [[ADR-20 - CI-CD con GitHub Actions]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]] · [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 12 - M7 Registrar (V1.0)]] · [[Tareas Fase 13 - M8 Inicio (V1.0)]] · [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]] · [[Tareas Fase 15 - M10 Onboarding (V1.0)]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]]
- **Spec / Plan / Constitución:** [[Constitución 4. Seguridad]] · [[Constitución 7. Git Flow]] · [[Plan 1.2 Despliegue y flujo principal]] · [[Plan 1.5 Integración y despliegue continuos (ADR-20)]] · [[Plan 3.9 Seguridad a nivel de datos]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 4.7 M7 - Registrar (V1.0)]] · [[Plan 4.8 M8 - Inicio (V1.0)]] · [[Plan 5.1 Estrategia]] · [[Plan 5.3 Requerimientos no funcionales → verificación]] · [[Plan 5.4 Definición de terminado de cada módulo]]
- **Entidades:** [[Entidad - LedgerEntry]] · [[Entidad - LedgerTransaction]] · [[Entidad - MarketRate]]

