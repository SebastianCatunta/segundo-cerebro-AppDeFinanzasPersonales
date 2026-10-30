---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 26 - Correcciones de QA"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "26"
tareas: "5"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 25 - Final integración E2E y validación de RNF]] · → [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]

### Fase 26 — Correcciones de QA

- [x] **`TASK-249`: Web: textos de metas en Cuentas y en la confirmación de apartados**
  - **Dependencias:** Requiere TASK-192, TASK-247
  - **Trazabilidad SDD:** plan §4.12.4 (`<EarmarkConfirmDialog>`), plan §4.4 (Cuentas); RNF-07, RF-M12-05, RF-M12-08, RF-M4-10, EC-M7-03
  - **Archivos en Alcance:**
    - `e2e/i18n-direct-load.spec.ts`
    - `apps/web/src/features/goals/components/earmark-confirm-dialog.tsx`
    - `apps/web/src/features/accounts/components/net-worth-summary.tsx`
    - `apps/web/src/features/accounts/components/account-header.tsx`
  - **Especificación de Implementación:** El texto `goals` solo se registra cuando se carga `features/goals/routes.tsx` o `features/debts/routes.tsx`. Quien entra directo a Registrar, a Cuentas o al detalle de una cuenta, sin pasar antes por Metas, ve las claves sin traducir (`summary.earmarked`, `confirm.title`, `actions.cancel`). Cada componente que usa el texto `goals` fuera de su feature lo registra con `i18n.addResourceBundle(LANGUAGE, 'goals', goals, true, true)`, como ya hacen `close-decision-card.tsx` y `rate-chip.tsx` (RNF-07). Se añade una prueba E2E que carga cada ruta privada de V1.2 de forma directa, con un usuario nuevo que tiene cuenta, meta con apartado, presupuesto y deuda, y falla si el texto visible, un `aria-label`, un `title` o un `placeholder` contiene una clave de i18n sin traducir (por ejemplo `summary.earmarked`).
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-07`: ninguna ruta privada muestra una clave de i18n al cargarla de forma directa.
    - `RF-M4-10`: Cuentas muestra «Apartado para metas»; el detalle de la cuenta muestra «Saldo», «Apartado para metas» y «Libre».
    - `RF-M12-05`: la confirmación de apartados muestra el título, la descripción y los botones traducidos al registrar, editar, eliminar, deshacer y ajustar el saldo.
    - Comando: `pnpm --filter e2e exec playwright test i18n-direct-load.spec.ts m12-earmark-confirm.spec.ts --project=chromium-1280`
    - Comando: `pnpm --filter web exec vitest run test/bundle-budget.test.ts`

- [x] **`TASK-250`: E2E: «sin tasa» no depende de una base sin tipos de cambio (EC-M8-04)**
  - **Dependencias:** Requiere TASK-148, TASK-247
  - **Trazabilidad SDD:** plan §5.1 (datos de prueba: tasas fijas de `seed:e2e`), plan §4.8.4; EC-M8-04
  - **Archivos en Alcance:**
    - `e2e/m8-dashboard-blocks.spec.ts`
  - **Especificación de Implementación:** La prueba «sin tasa, los saldos en otra moneda indican Sin tipo de cambio» pasa en una base vacía y falla en CI, porque `seed:e2e` siembra tasas fijas y nunca falta el tipo de cambio. La prueba arma por sí misma la situación sin tasa, sin depender del estado de la base: una moneda o un día sin tasa sembrada, si la API de la prueba lo permite. Si ninguna forma lo logra sin tocar código de producción, el test-author responde `NEEDS_CLARIFICATION`.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M8-04`: sin tasa, el Inicio indica «Sin tipo de cambio» en la base del CI (migraciones más `seed:e2e`) y en una base vacía.
    - Comando: `pnpm --filter e2e exec playwright test m8-dashboard-blocks.spec.ts --project=chromium-1280`

- [x] **`TASK-251`: E2E: pruebas con carreras de espera (RF-M2-09, RF-M7-10, RF-M1-05)**
  - **Dependencias:** Requiere TASK-072, TASK-152, TASK-065, TASK-247, TASK-253
  - **Trazabilidad SDD:** plan §5.1 (E2E), plan §5.4; RF-M2-09, RF-M7-10, RF-M1-05, EC-M1-01
  - **Archivos en Alcance:**
    - `e2e/m2-navigation.spec.ts`
    - `e2e/m9-settings-register.spec.ts`
    - `e2e/m1-sign-up.spec.ts`
  - **Especificación de Implementación:** Tres pruebas fallan en CI, y una también en local, por esperas mal puestas y no por la app. `RF-M2-09`: la prueba abre el segundo contexto sin esperar a que termine el `PATCH /api/settings` que guarda la barra contraída; la app sí lo guarda (comprobado). `RF-M7-10` (editar y eliminar un atajo): la prueba navega a `/registrar` con el guardado todavía en curso, y `page.goto` termina con `net::ERR_ABORTED`. `RF-M1-05` (reenvío del enlace): agota los 30 s en el CI y pasa al reintentar; se diagnostica con el trace del CI antes de tocarla. En los tres casos se espera la condición o la respuesta de red y no un tiempo fijo. Ningún caso se salta ni se relaja.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-09`, `RF-M7-10`, `RF-M1-05`: cada caso pasa 10 de 10 veces seguidas, sin reintentos.
    - Comando: `pnpm --filter e2e exec playwright test m2-navigation.spec.ts m9-settings-register.spec.ts m1-sign-up.spec.ts --project=chromium-1280 --repeat-each=10 --retries=0`

- [x] **`TASK-252`: Web: las rutas de metas, deudas y recurrentes no existen sin su entrega (RF-M2-03)**
  - **Dependencias:** Requiere TASK-247
  - **Trazabilidad SDD:** plan §4.2 (navegación), plan §4.12.4, plan §4.13.4, plan §4.14.4, ADR-18; RF-M2-03
  - **Archivos en Alcance:**
    - `e2e/release-gating.spec.ts`
    - `apps/web/src/app/router.tsx`
  - **Especificación de Implementación:** Solo las rutas de presupuestos (M11) van detrás de `<ReleaseGate>`. `/metas`, `/deudas` y `/recurrentes` abren su pantalla aunque la entrega no las incluya, y el API responde 404. Cada grupo de rutas (`goalsRoutes` con M12, `debtsRoutes` con M13, `recurringRoutes` con M14) queda envuelto en `<ReleaseGate module="…" notFound={<NotFoundPage />} />`, igual que `budgetsRoutes`. Se amplía `e2e/release-gating.spec.ts` con la URL directa de cada módulo bajo el `RELEASE` que no lo incluye, con el mecanismo que ya usa ese archivo.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-03`: con 1.0, `/metas`, `/presupuestos` y `/deudas` muestran «no existe»; con 1.1, `/recurrentes` también; con 1.2, las cuatro abren su pantalla.
    - Comando: `pnpm --filter e2e exec playwright test release-gating.spec.ts --project=chromium-1280`

- [x] **`TASK-253`: Web: iniciar sesión desde `/entrar` no muestra «Tu sesión venció» (RF-M2-09, EC-M2-01)**
  - **Dependencias:** Requiere TASK-070, TASK-247
  - **Trazabilidad SDD:** plan §4.2.3 (Normal → Sesión vencida), plan §4.9.3; RF-M2-09, EC-M2-01
  - **Archivos en Alcance:**
    - `e2e/m1-sign-in.spec.ts`
    - `apps/web/src/app/providers/theme.tsx`
    - `apps/web/src/features/settings/hooks/use-settings.ts`
  - **Especificación de Implementación:** Al abrir `/entrar` sin sesión, `ThemeProvider` pide `GET /api/settings`; el API responde 401 `SESSION_EXPIRED` y `api-client.ts` abre `<SessionExpiredDialog>`. Tras iniciar sesión, la app navega a `/` sin recargar y el diálogo «Tu sesión venció» tapa la pantalla, aunque nunca hubo sesión. `ThemeProvider` solo consulta los ajustes del servidor cuando hay una sesión (`useMe` con datos); sin sesión usa la copia de `localStorage`, como en el primer pintado (plan §4.9.3). El diálogo sigue abriéndose cuando una sesión que existía vence (plan §4.2.3). Se añade a `e2e/m1-sign-in.spec.ts` un caso que, en un contexto nuevo, inicia sesión desde `/entrar` y comprueba que llega a `/` sin el diálogo «Tu sesión venció» y con el tema guardado en el servidor aplicado.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-09`: tras iniciar sesión desde `/entrar` en un contexto nuevo, no aparece «Tu sesión venció» y la pantalla se puede usar.
    - `EC-M2-01`: con sesión iniciada, el tema guardado en el servidor se aplica tras el inicio de sesión.
    - Comando: `pnpm --filter e2e exec playwright test m1-sign-in.spec.ts m2-offline-session.spec.ts --project=chromium-1280`

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M2 - Navegación y estructura]] · [[M4 - Cuentas]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]]
- **Decisiones (ADR):** [[ADR-18 - Entregas con RELEASE]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]]
- **Fases de tareas:** [[Tareas Fase 13 - M8 Inicio (V1.0)]] · [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]] · [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 4.12 M12 - Metas de ahorro (V1.1)]] · [[Plan 4.13 M13 - Deudas y préstamos (V1.1)]] · [[Plan 4.14 M14 - Recurrentes (V1.2)]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 4.4 M4 - Cuentas (V1.0)]] · [[Plan 4.8 M8 - Inicio (V1.0)]] · [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]] · [[Plan 5.1 Estrategia]] · [[Plan 5.4 Definición de terminado de cada módulo]]

