// Datos curados a mano: módulos, ADR, colores y descripciones de archivos no-md.

export const FOLDERS = {
  inicio: '00-Inicio',
  spec: '01-Especificacion',
  arq: '02-Arquitectura',
  back: '03-Backend',
  front: '04-Frontend',
  datos: '05-Datos',
  feat: '06-Features',
  test: '07-Testing-QA',
  devops: '08-DevOps',
  ia: '09-Proceso-IA',
};

export const COLORS = [
  ['00-Inicio', '#F5C542', 'Índices y mapas (MOC)'],
  ['01-Especificacion', '#4A90E2', 'Constitución, spec, plan por módulo y tareas'],
  ['02-Arquitectura', '#9B59B6', 'Arquitectura, paquetes compartidos y flujos'],
  ['03-Backend', '#27AE60', 'API Express en capas'],
  ['04-Frontend', '#E67E22', 'SPA React y dirección de diseño'],
  ['05-Datos', '#16A085', 'Prisma, entidades y migraciones'],
  ['06-Features', '#E74C3C', 'Módulos M1 a M15 (hubs)'],
  ['07-Testing-QA', '#FF6FB5', 'Pruebas, coherencia y QA'],
  ['08-DevOps', '#A0522D', 'CI/CD, despliegue y configuración'],
  ['09-Proceso-IA', '#A3E635', 'Pipeline SDD con agentes de Claude'],
];

export const MODULES = [
  {
    id: 'M1', name: 'Acceso y cuenta', release: 'V1.0', phases: [6, 16],
    routes: ['auth', 'me'], web: ['auth', 'profile'],
    models: ['AuthUser', 'AuthSession', 'AuthAccount', 'AuthVerification', 'EmailLink', 'SignupTicket', 'LoginThrottle', 'EmailOutbox', 'EmailSendLog'],
    jobs: ['outbox', 'maintenance'], shared: ['email-links', 'login-throttle', 'user-bootstrap'],
    domain: [], contracts: ['auth'], integrations: ['Resend'],
    summary: 'Registro con confirmación por correo, inicio de sesión con espera progresiva ante fallos, recuperación y cambio de contraseña, cierre de sesión (una o todas), perfil, exportación de datos en ZIP de CSV y borrado de la cuenta. La autenticación usa la API de servidor de Better Auth detrás de endpoints propios (ADR-08). Los correos de cuenta (5 tipos) salen por una bandeja de salida (outbox) hacia Resend. En la Fase 27 se quitó el correo de intentos fallidos y se agregó el ticket de registro, que deja continuar sola a la app que espera en "Revisa tu correo".',
  },
  {
    id: 'M2', name: 'Navegación y estructura', release: 'V1.0', phases: [7],
    routes: ['health', 'me'], web: [],
    models: [], jobs: [], shared: [], domain: [], contracts: ['releases'], integrations: [],
    summary: 'Estructura de la SPA: barra de pestañas inferior en móvil y barra lateral en escritorio, menú "Más", cabecera con botón "Volver", guardas de sesión y de Onboarding, rutas por entrega (RELEASE, ADR-18), memoria de cada pestaña, borradores en sessionStorage, overlay sin conexión y diálogo de sesión expirada. Incluye la marca (logo) y el health check.',
  },
  {
    id: 'M3', name: 'Monedas y tipo de cambio', release: 'V1.0', phases: [8],
    routes: ['fx', 'currencies'], web: ['fx'],
    models: ['MarketRate', 'Currency', 'UserFxEvent'],
    jobs: ['fx'], shared: ['currency-usage'], domain: ['fx'], contracts: ['fx'], integrations: ['paralelo.bo', 'BCB'],
    summary: 'Bolivianos y dólares con el tipo de cambio paralelo (paralelo.bo, compra/venta/mediana), el oficial del BCB (TCO) o un valor manual. Historial de tasas, monedas adicionales con tasa propia, brecha paralelo-oficial y la tasa guardada en cada movimiento: la historia no se reescribe (constitución §3, ADR-06).',
  },
  {
    id: 'M4', name: 'Cuentas', release: 'V1.0', phases: [9],
    routes: ['accounts'], web: ['accounts'],
    models: ['Account'], jobs: [], shared: ['balance-guard'], domain: ['balance'], contracts: ['accounts'], integrations: [],
    summary: 'Cuentas de efectivo, banco, billetera, tarjeta de crédito, ahorro y otro. Saldo inicial fijo, saldo calculado desde los movimientos (RN-01), ajustes de saldo, archivar y restaurar, orden manual, patrimonio neto con desglose (líquido, ahorro, deuda de tarjeta, apartado) y gráfico de saldo por día.',
  },
  {
    id: 'M5', name: 'Categorías', release: 'V1.0', phases: [10],
    routes: ['categories'], web: ['categories'],
    models: ['Category', 'FavoriteCategory'], jobs: [], shared: [], domain: [], contracts: ['categories', 'catalogs'], integrations: [],
    summary: 'Categorías de gasto e ingreso en dos niveles (categoría y subcategoría), con color e ícono de catálogo, categorías del sistema, orden por arrastre, archivar con vista previa del impacto, restaurar y fusionar categorías.',
  },
  {
    id: 'M6', name: 'Transacciones', release: 'V1.0', phases: [11],
    routes: ['transactions'], web: ['transactions'],
    models: ['LedgerTransaction', 'LedgerEntry', 'UndoAction'], jobs: [], shared: ['ledger-hooks'], domain: ['money'], contracts: ['transactions'], integrations: [],
    summary: 'Libro contable de doble asiento (ledger_transaction + ledger_entry, ADR-04): gastos, ingresos, transferencias con comisión y ajustes. Lista por mes con filtros en la URL, totales, detalle, edición, borrado con "Deshacer" de 10 s (ADR-07), borrado y recategorización en lote.',
  },
  {
    id: 'M7', name: 'Registrar', release: 'V1.0', phases: [12],
    routes: ['register', 'shortcuts'], web: ['register'],
    models: ['Shortcut'], jobs: [], shared: [], domain: [], contracts: ['register'], integrations: [],
    summary: 'La pestaña central y el principio rector del producto: registrar un movimiento en menos de 10 segundos. Monto, tipo, cuenta, grilla de categorías favoritas, chips de fecha, atajos guardados, comisión, transferencias y la lista de "Hoy".',
  },
  {
    id: 'M8', name: 'Inicio (dashboard)', release: 'V1.0', phases: [13],
    routes: ['dashboard'], web: ['dashboard'],
    models: [], jobs: [], shared: [], domain: ['dashboard'], contracts: ['dashboard'], integrations: [],
    summary: 'El dashboard: tarjetas de ingresos, gastos, balance y tasa de ahorro con variación contra el mes anterior, ritmo del gasto, barras por categoría, saldos, presupuestos, próximos vencimientos y recientes. Los bloques se reordenan desde Ajustes.',
  },
  {
    id: 'M9', name: 'Ajustes y personalización', release: 'V1.0', phases: [14],
    routes: ['settings'], web: ['settings'],
    models: ['UserSettings'], jobs: [], shared: [], domain: ['format'], contracts: ['settings'], integrations: [],
    summary: 'Preferencias generales (formato de número y fecha, inicio de semana, tema, zona horaria), monedas, ajustes de Registrar (favoritas, atajos, cuenta por defecto), orden de los bloques del Inicio, recordatorios (V1.2) y restablecer cada sección.',
  },
  {
    id: 'M10', name: 'Onboarding', release: 'V1.0', phases: [15],
    routes: ['onboarding'], web: ['onboarding'],
    models: [], jobs: [], shared: ['user-bootstrap'], domain: [], contracts: ['onboarding'], integrations: [],
    summary: 'Asistente de tres pasos al primer ingreso: moneda base, cuentas y categorías. Cada paso puede omitirse, y también todo el asistente.',
  },
  {
    id: 'M11', name: 'Presupuestos', release: 'V1.1', phases: [20],
    routes: ['budgets'], web: ['budgets'],
    models: ['Budget', 'BudgetPeriod', 'BudgetLateAdjustment', 'BudgetThresholdHit'],
    jobs: ['budgets'], shared: ['budget-ledger-hook'], domain: ['budget'], contracts: ['budgets'], integrations: [],
    summary: 'Presupuestos generales o por categoría con día de inicio propio, umbrales de aviso, ritmo ("X/día"), cierre de período con decisión del excedente o del déficit (arrastrar, enviar a meta, etc.), decisión por defecto a los 7 días, pausa y reanudación, y ajustes tardíos.',
  },
  {
    id: 'M12', name: 'Metas de ahorro', release: 'V1.1', phases: [19],
    routes: ['goals'], web: ['goals'],
    models: ['Goal', 'GoalAllocationEvent'], jobs: [], shared: ['goal-milestones', 'balance-guard'], domain: ['goals'], contracts: ['goals'], integrations: [],
    summary: 'Metas con monto y fecha objetivo, apartados (dinero reservado que sigue en su cuenta) o cuenta dedicada, aporte mensual sugerido, estado derivado (en curso, cumplida, vencida, ADR-13), hitos de avance, celebración, "usar y cerrar", archivar y restaurar.',
  },
  {
    id: 'M13', name: 'Deudas y préstamos', release: 'V1.1', phases: [21],
    routes: ['debts'], web: ['debts'],
    models: ['Debt', 'DebtPayment'], jobs: [], shared: [], domain: ['debts'], contracts: ['debts'], integrations: [],
    summary: 'Deudas que el usuario debe y préstamos que le deben, con interés simple diario como foto (ADR-14), pagos divididos entre interés y capital, eliminar el último pago, condonar, estados derivados (vencida) y avisos de vencimiento.',
  },
  {
    id: 'M14', name: 'Recurrentes', release: 'V1.2', phases: [23],
    routes: ['recurring'], web: ['recurring'],
    models: ['RecurringRule', 'RecurringOccurrence'], jobs: ['recurring'], shared: ['recurring-generator'], domain: ['recurrence'], contracts: ['recurring'], integrations: [],
    summary: 'Reglas recurrentes (diaria, semanal, mensual, anual) automáticas o con confirmación, ocurrencias pendientes que vencen solas, cuotas, pausa y reanudación con fechas omitidas, y "próximos 30 días". El job se pone al día tras una caída sin duplicar (RNF-13).',
  },
  {
    id: 'M15', name: 'Recordatorios y avisos', release: 'V1.1 (bandeja) · V1.2 (completo)', phases: [18, 24],
    routes: ['notifications'], web: ['notifications'],
    models: ['Notification', 'NotificationPreference'], jobs: ['notifications'], shared: ['notification-emitter', 'goal-milestones'], domain: [], contracts: ['notifications'], integrations: [],
    summary: 'Bandeja de avisos dentro de la app (campana, no leídos, marcar como leído, decisiones pendientes) y, en V1.2, recordatorios programados: registrar el día, pagos y deudas por vencer, hitos de metas, con preferencias por tipo. Un mismo evento nunca genera dos avisos (RN-10).',
  },
];

export const ROUTE_MODULE = {
  accounts: 'M4', auth: 'M1', budgets: 'M11', categories: 'M5', currencies: 'M3', dashboard: 'M8', debts: 'M13',
  fx: 'M3', goals: 'M12', health: 'M2', me: 'M1', notifications: 'M15', onboarding: 'M10', recurring: 'M14',
  register: 'M7', settings: 'M9', shortcuts: 'M7', transactions: 'M6',
};

export const ROUTE_SERVICES = {
  fx: ['rates', 'fx-settings'], me: ['me', 'export'], notifications: ['notifications'],
};

export const ADR_TITLES = {
  '01': 'Jobs con cron externo', '02': 'Sesión entre dominios (proxy de Vercel)', '03': 'Dinero como decimal',
  '04': 'Libro contable de doble asiento', '05': 'Aislamiento por usuario', '06': 'Fuentes de tasas de cambio',
  '07': 'Deshacer con token', '08': 'Autenticación sobre Better Auth', '09': 'Errores problem+json',
  '10': 'Esquema Prisma más SQL', '11': 'Idempotencia con UUID v7', '12': 'Datos de mercado globales',
  '13': 'Estados derivados al leer', '14': 'Interés de deudas como foto', '15': 'Nombres de tablas del libro',
  '16': 'Navegación con React Router', '17': 'Estado de cliente mínimo', '18': 'Entregas con RELEASE',
  '19': 'Backend en capas', '20': 'CI-CD con GitHub Actions',
};

// Archivos de configuración no-md: ruta → [carpeta, nombre de nota, explicación]
export const CONFIG_FILES = [
  ['package.json', 'devops', 'Config - package.json raíz', 'Manifiesto raíz del monorepo `finanzas`. Fija pnpm 11 como gestor (`packageManager`), exige Node ≥ 22 y define los scripts globales: `lint`, `typecheck`, `test:unit`, `test:integration`, `depcruise`, `build` y `format`. El script `prepare` apunta los hooks de git a `.githooks/`. Las devDependencies son las herramientas transversales (ESLint, Prettier, TypeScript, Vitest, commitlint, dependency-cruiser).'],
  ['pnpm-workspace.yaml', 'devops', 'Config - pnpm-workspace.yaml', 'Declara los paquetes del workspace (`apps/*`, `packages/*` y `e2e`) y autoriza los scripts de instalación de Prisma y esbuild (`allowBuilds`), que pnpm 11 bloquea por defecto.'],
  ['tsconfig.json', 'devops', 'Config - tsconfig.json raíz', 'TypeScript de la raíz: extiende `packages/config/tsconfig.base.json` y solo verifica los archivos de configuración JS/TS de la raíz (cada paquete tiene su propio tsconfig).'],
  ['.editorconfig', 'devops', 'Config - .editorconfig', 'Formato básico del editor: UTF-8, LF, 2 espacios, línea final y sin espacios sobrantes (salvo en Markdown).'],
  ['.prettierrc.json', 'devops', 'Config - .prettierrc.json', 'Estilo de Prettier: punto y coma, comillas simples, coma final, ancho 100 y LF.'],
  ['.npmrc', 'devops', 'Config - .npmrc', 'Fija el registro público de npm.'],
  ['.nvmrc', 'devops', 'Config - .nvmrc', 'Versión de Node del proyecto: 22. La usan `setup-node` en GitHub Actions y Render (`NODE_VERSION=22`).'],
  ['.gitattributes', 'devops', 'Config - .gitattributes', 'Obliga a que los hooks de `.githooks/` tengan fin de línea LF, porque se ejecutan con `sh` (importante en Windows).'],
  ['.gitignore', 'devops', 'Config - .gitignore', 'Excluye dependencias, compilados, cobertura, todo `.env*` salvo `.env.example`, reportes de Playwright, logs, `.vercel/` y el estado local del pipeline (`.claude/run/`, `.claude/worktrees/`, `settings.local.json`).'],
  ['.env.example', 'devops', 'Config - .env.example', 'Plantilla de variables de entorno (sin valores reales). El archivo `.env` real NO se documenta aquí porque contiene secretos. Ver [[Variables de entorno]].'],
  ['commitlint.config.cjs', 'devops', 'Config - commitlint', 'Conventional Commits (constitución §7) limitado a los tipos `feat, fix, docs, test, chore, build, ci, refactor, perf`. El asunto puede empezar con el ID de la tarea (`feat(db): TASK-003 ...`), por eso `subject-case` está desactivado. Lo corren CI y el hook `pre-push`.'],
  ['eslint.config.js', 'devops', 'Config - ESLint raíz', 'ESLint plano de la raíz: usa `createConfig` de `@finanzas/config/eslint` e ignora `tools/` (scripts del pipeline, probados con `node --test`) y `.claude/worktrees/`.'],
  ['.dependency-cruiser.cjs', 'arq', 'Config - dependency-cruiser', 'Reglas de capas del backend verificadas en CI (`pnpm depcruise`, ADR-19): presentación no depende de infraestructura; aplicación no depende de presentación ni de infraestructura ni importa `express`, `@prisma/client` o `better-auth`; el dominio es puro (solo decimal.js y date-fns); infraestructura no depende de presentación; y no hay dependencias circulares.'],
  ['docker-compose.yml', 'devops', 'Config - docker-compose.yml', 'Postgres 16 local (`finanzas-db`) en el puerto 5432, con volumen persistente, healthcheck y el script `docker/postgres/init.sql` que crea las bases `finanzas_dev` y `finanzas_test`.'],
  ['docker/postgres/init.sql', 'devops', 'Config - docker init.sql', 'Script de arranque del contenedor de Postgres: crea las bases `finanzas_dev` (desarrollo) y `finanzas_test` (pruebas de integración).'],
  ['render.yaml', 'devops', 'Config - render.yaml', 'Blueprint de Render del API (`finanzas-api-va`, región Virginia, plan gratis). `autoDeploy: false`: solo despliega `deploy.yml` mediante el Deploy Hook. Build: corepack + pnpm install + generar Prisma + build del API. Start: `pnpm --filter api start`. Health check en `/api/health`. Las variables secretas van con `sync: false` (se cargan en el panel).'],
  ['vercel.json', 'devops', 'Config - vercel.json', 'Configuración de Vercel para la web: despliegue por Git desactivado (solo `deploy.yml`), build `pnpm --filter web build`, salida `apps/web/dist` y dos rewrites: `/api/*` → API de Render (ADR-02, evita CORS y cookies de terceros) y todo lo demás → `index.html` (SPA).'],
  ['.githooks/pre-push', 'ia', 'Config - hook pre-push', 'Hook de git que delega en `tools/sdd/pre-push.mjs`: commitlint, detección de secretos y trazabilidad de tareas antes de cada push (protocolo §4.2).'],
  ['.claude/settings.json', 'ia', 'Config - .claude settings.json', 'Configuración de Claude Code del proyecto: hook `SessionStart` → `session-brief.mjs` (resumen del estado al abrir sesión), hook `SubagentStop` para `test-author|implementer|sdd-auditor` → `gate.mjs` (gates deterministas, hasta 30 min) y permisos para los scripts de `tools/sdd`.'],
  ['tools/sdd/branch-groups.json', 'ia', 'Config - branch-groups.json', 'Ramas de grupo que juntan tareas de varias fases (protocolo §5.1). Una tarea listada se hace en la rama de su grupo, no en la de su fase.'],
  ['.mcp.json', 'ia', 'Config - .mcp.json', 'Registro de servidores MCP del proyecto para Claude Code. Declara un único servidor, `neon`, que se lanza con `node tools/mcp/neon.mjs` (ver [[Config - neon.mjs]]). Es solo para desarrollo local: la aplicación no lo lee y no se despliega. No contiene ninguna clave. Visión completa en [[MCP de Neon]].'],
  ['tools/mcp/neon.mjs', 'ia', 'Config - neon.mjs', 'Lanzador del MCP de Neon, referenciado desde `.mcp.json`. Como Claude Code no lee `.env`, el script lo carga con `process.loadEnvFile`, toma `NEON_API_KEY` (si falta, avisa por stderr y sale con código 1; stdout queda reservado al protocolo MCP) y conecta con `https://mcp.neon.tech/mcp` a través de `mcp-remote`. Por defecto añade `?readonly=true`; solo `NEON_MCP_READONLY=false` permite escrituras. La clave viaja en una variable de entorno del proceso hijo (`NEON_AUTH_HEADER`), nunca en la línea de comandos ni en el repo. En Windows lanza `npx` mediante `cmd /c`. Ver [[MCP de Neon]].'],
  ['packages/config/package.json', 'arq', 'Config - packages config package.json', 'Paquete `@finanzas/config`: exporta el tsconfig base, la configuración de ESLint y la base de Vitest compartidas.'],
  ['packages/config/tsconfig.base.json', 'arq', 'Config - tsconfig.base.json', 'TypeScript estricto compartido: ES2023, NodeNext, `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `isolatedModules`, etc.'],
  ['packages/config/vitest.base.ts', 'arq', 'Config - vitest.base.ts', 'Base de Vitest compartida: toma `TEST_DATABASE_URL` y `TEST_TIMEOUT_MS` del `.env` raíz si no están en el entorno, permite subir el timeout en PCs lentas y desactiva la caché de módulos (EPERM en Windows con `pnpm -r`).'],
  ['packages/config/eslint.config.js', 'arq', 'Config - eslint compartido', 'Configuración ESLint compartida (`createConfig`): typescript-eslint con información de tipos, prohíbe pruebas `.only`/`.skip` (todo test corre en CI, constitución §5) y prohíbe `parseFloat`/punto flotante en `packages/domain`, `packages/contracts` y `apps/api/src` (constitución §3). La web añade `eslint-plugin-i18next` con `no-literal-string` (RNF-07).'],
  ['apps/web/vite.config.ts', 'front', 'Config - vite.config.ts', 'Configuración de Vite de la web: plugin de React, alias `@` → `src`, y proxy de `/api` al API local en el puerto 3000.'],
  ['apps/web/tailwind.config.ts', 'front', 'Config - tailwind.config.ts', 'Tailwind CSS: modo oscuro por clase, colores como tokens HSL en variables CSS (los de shadcn/ui: primary, secondary, muted, accent, card…), radios derivados de `--radius` y el plugin `tailwindcss-animate`. Los valores de la marca viven en `src/index.css` (ver Dirección de diseño).'],
  ['apps/web/components.json', 'front', 'Config - components.json (shadcn)', 'Configuración de shadcn/ui: estilo default, Tailwind con variables CSS (base slate), íconos lucide y los alias `@/components`, `@/components/ui`, `@/lib`, `@/hooks`.'],
  ['apps/web/index.html', 'front', 'Config - index.html', 'HTML de entrada de la SPA: `lang="es-BO"`, color de tema `#186253` (verde azulado de la marca), favicons (svg, ico, apple-touch) y el montaje de `src/main.tsx` en `#root`.'],
  ['e2e/playwright.config.ts', 'test', 'Config - playwright.config.ts', 'Configuración de Playwright: 6 proyectos (Chromium, WebKit y Firefox × 360 y 1280 px, RNF-05), 2 reintentos en CI, trazas y videos solo en fallos. Levanta dos `webServer`: el API (migrando la base de prueba, `INTEGRATIONS=fake`, `RELEASE` = `E2E_RELEASE` o 1.2) y la web compilada en `vite preview` (puerto 4173). Los casos `@release-1.0` solo corren con `e2e:release-1.0`.'],
];

export const WORKFLOW_DESC = {
  'ci.yml': 'Corre en cada push y PR (y es reutilizable con `workflow_call`). Instala con caché y genera el cliente Prisma, corre commitlint de los commits del PR, lint, typecheck, dependency-cruiser, migraciones sobre Postgres 16, pruebas unitarias y HTTP, integración y el build de `api` y `web`.',
  'deploy.yml': 'Corre en cada push a `main` y a mano. Primero reutiliza `ci.yml`; si pasa, en el Environment `production`: 1) migra Neon con la URL directa, 2) llama al Deploy Hook de Render y espera hasta `live`, 3) `vercel pull/build/deploy --prebuilt --prod`, 4) cuatro pruebas de humo (API vivo, API→BD, web viva, web→API→BD).',
  'qa-e2e.yml': 'Corre en cada push a `qa` y en PR hacia `main`. Levanta un entorno efímero dentro del runner (Postgres como service, migraciones, seed de usuarios y 5.000 movimientos, API con integraciones falsas y web en `vite preview`) y corre Playwright en 3 navegadores × 2 anchos, axe y rendimiento, más el subconjunto `@release-1.0`.',
  'fx-backfill.yml': 'Manual. Ejecuta una sola vez `packages/db/scripts/fx-backfill.ts` contra producción para cargar el historial del tipo de cambio. Es idempotente.',
};
