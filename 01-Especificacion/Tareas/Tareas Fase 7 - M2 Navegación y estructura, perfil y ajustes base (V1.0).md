---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M2"
fase: "7"
tareas: "9"
modulo: "M2"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · → [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]]

### Fase 7 — M2 Navegación y estructura, perfil y ajustes base (V1.0)

- [x] **`TASK-068`: Contratos de ajustes (M9)**
  - **Dependencias:** Requiere TASK-021
  - **Trazabilidad SDD:** plan §4.9.1, plan §4.2.1; RF-M9-01, RF-M2-09, RF-M8-10
  - **Archivos en Alcance:**
    - `packages/contracts/src/settings.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/settings.test.ts`
  - **Especificación de Implementación:** `UpdateSettingsInput` (parcial y estricto), `ResetSettingsInput`, `SettingsDto` y `DEFAULT_DASHBOARD_BLOCKS` (bloques 3 a 8 de spec §2.8.1).
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M8-10`: `dashboardBlocks` exige exactamente 6 bloques con claves válidas.
    - `favoriteCategories` admite como máximo 8 ids.
    - `RF-M2-09`: `{ sidebarCollapsed: true }` es una entrada válida; un campo desconocido no.

- [x] **`TASK-069`: Servicio y rutas de ajustes generales**
  - **Dependencias:** Requiere TASK-059, TASK-068
  - **Trazabilidad SDD:** plan §4.9.2 (`GET` y `PATCH /api/settings`), plan §4.2.2, plan §4.9.3; RF-M9-01, RF-M2-09, EC-M9-01, RNF-08
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/settings.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user-settings.repository.ts`
    - `apps/api/src/presentation/routes/settings.routes.ts`
    - `apps/api/src/presentation/controllers/settings.controller.ts`
    - `apps/api/src/presentation/presenters/settings.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/settings.test.ts`
  - **Especificación de Implementación:** `GET /api/settings` y `PATCH /api/settings` con `numberFormat`, `dateFormat`, `weekStart`, `theme`, `sidebarCollapsed`, `alwaysShowNote` y `dashboardBlocks`. `defaultAccountId` y `favoriteCategories` se agregan en TASK-149. Gana la última escritura.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M9-01`: un cambio guardado se lee igual desde otra sesión del mismo usuario.
    - `RF-M2-09`: `sidebarCollapsed` se guarda en la cuenta.
    - `EC-M9-01` / `RNF-08`: con dos `PATCH` seguidos gana el último.
    - Hay un test de aislamiento entre usuarios.

- [x] **`TASK-070`: Web: `useSettings`, `useFormatters` y tema desde el servidor**
  - **Dependencias:** Requiere TASK-029, TASK-045, TASK-069
  - **Trazabilidad SDD:** plan §4.9.1 (`packages/domain/format`), plan §4.9.3, plan §4.9.4 (estado); RF-M9-01, RF-M9-02, RF-M9-03
  - **Archivos en Alcance:**
    - `apps/web/src/features/settings/api.ts`
    - `apps/web/src/features/settings/hooks/use-settings.ts`
    - `apps/web/src/lib/formatters.ts`
    - `apps/web/src/app/providers/theme.tsx`
    - `packages/domain/src/index.ts`
    - `apps/web/test/formatters.test.ts`
  - **Especificación de Implementación:** `useSettings()` usa la clave `['settings']`. `useFormatters()` expone `money`, `date` y `relativeDay` según los ajustes, y todas las pantallas lo usan para mostrar montos y fechas. `ThemeProvider` aplica el tema del servidor y actualiza la copia en localStorage. `buildFormatters(settings)` es puro. `packages/domain/src/index.ts` reexporta `formatDate`, `relativeDay`, `weekDays` y los tipos `DateFormat`, `WeekStart` y `WeekDay` de `format.ts` (TASK-029); `relativeDay` recibe el `dateFormat` del usuario.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M9-02` / `RF-M9-03`: `buildFormatters` respeta cada formato de número y de fecha.
    - `RF-M9-01`: el tema del servidor reemplaza al de localStorage al cargar.

- [x] **`TASK-071`: Web: guardas de rutas**
  - **Dependencias:** Requiere TASK-065
  - **Trazabilidad SDD:** plan §4.2.4 (guardas), ADR-18; RF-M2-03, RF-M1-04
  - **Archivos en Alcance:**
    - `apps/web/src/app/guards.tsx`
    - `apps/web/src/app/router.tsx`
    - `e2e/m2-guards.spec.ts`
  - **Especificación de Implementación:** `RequireSession` (sin sesión lleva a `/entrar`), `RequireOnboardingDone` (lleva a `/bienvenida` mientras el Onboarding no termine) y `ReleaseGate(module)` (un módulo no liberado muestra la página 404), según `me.release` y `isReleased`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-04`: sin sesión, una ruta privada lleva a `/entrar`.
    - `RF-M2-03` (`@release-1.0`): `/presupuestos` muestra la página 404 con `RELEASE=1.0`.

- [x] **`TASK-072`: Web: AppShell, cabecera, barra inferior y barra lateral**
  - **Dependencias:** Requiere TASK-070, TASK-071
  - **Trazabilidad SDD:** plan §4.2.3 (disposición), plan §4.2.4 (árbol); RF-M2-01, RF-M2-02, RF-M2-03, RF-M2-09, RF-M7-01, EC-M2-03, RNF-05, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/app/layout/app-shell.tsx`
    - `apps/web/src/app/layout/header.tsx`
    - `apps/web/src/app/layout/bottom-tab-bar.tsx`
    - `apps/web/src/app/layout/sidebar.tsx`
    - `apps/web/src/app/layout/nav-items.ts`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/navigation.json`
    - `e2e/playwright.config.ts`
    - `e2e/m2-navigation.spec.ts`
  - **Especificación de Implementación:** `BottomTabBar` (`lg:hidden`) con Inicio · Movimientos · Registrar · Cuentas · Más, y `Sidebar` (`hidden lg:flex`) con todos los módulos liberados, en el orden de spec §2.2.1. Las dos están siempre montadas. La barra lateral se contrae a solo íconos, con *tooltips* y foco por teclado, y guarda `sidebarCollapsed` en el servidor. La cabecera muestra el título y deja un espacio para la ficha del dólar. `playwright.config.ts` excluye los casos `@release-1.0` (`grepInvert`) cuando `RELEASE` no es `1.0`; solo corren con `e2e:release-1.0` (plan §5.1).
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Registrar en el centro de la barra en el celular" (360 px): las 5 pestañas en orden y Registrar en el centro (`RF-M2-01`, `RF-M7-01`).
    - Escenario «Sin "Más" en escritorio» (1280 px) (`RF-M2-02`).
    - `RF-M2-09`: contraer la barra en un contexto se refleja en otro contexto del mismo usuario.
    - `EC-M2-03`: cambiar el tamaño de 360 a 1280 px no pierde el estado.
    - `RNF-06`: sin violaciones de axe.

- [x] **`TASK-073`: Web: menú "Más", memoria por pestaña y botón Atrás**
  - **Dependencias:** Requiere TASK-044, TASK-072
  - **Trazabilidad SDD:** plan §4.2.3 (memoria por módulo, botón Atrás), plan §4.2.4; RF-M2-04, RF-M2-05, RF-M2-06, RF-M2-12
  - **Archivos en Alcance:**
    - `apps/web/src/app/layout/more-menu.tsx`
    - `apps/web/src/app/layout/bottom-tab-bar.tsx`
    - `apps/web/src/app/layout/sidebar.tsx`
    - `apps/web/src/lib/use-back-to-close.ts`
    - `apps/web/src/app/router.tsx`
    - `e2e/m2-more-menu.spec.ts`
  - **Especificación de Implementación:** `/mas` con las secciones PLANIFICAR, ORGANIZAR y CUENTA, que se ocultan si no tienen módulos liberados. Cada pestaña guarda y restaura su URL y su *scroll*. Tocar la pestaña activa lleva a la raíz del módulo, y "Más" recuerda el último módulo abierto desde él. `useBackToClose` cierra los diálogos con el botón Atrás.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-12` (`@release-1.0`): con `RELEASE=1.0`, PLANIFICAR no aparece.
    - `RF-M2-04`: al cambiar de pestaña y volver, se restauran la URL y la posición.
    - `RF-M2-05`: tocar la pestaña activa lleva a su raíz.
    - `RF-M2-06`: el botón Atrás vuelve de un módulo abierto desde "Más" a `/mas`. Todavía no hay pantallas con diálogos: la prueba de que Atrás cierra un diálogo con `useBackToClose` sin salir de la pantalla la agrega la primera tarea que monte un diálogo (plan §4.2.3).

- [x] **`TASK-074`: Web: pantalla de perfil**
  - **Dependencias:** Requiere TASK-043, TASK-061, TASK-073
  - **Trazabilidad SDD:** plan §4.1.4 (`/perfil`); RF-M1-07, RF-M1-10, RF-M1-11, RF-M1-13, EC-M1-05
  - **Archivos en Alcance:**
    - `apps/web/src/features/profile/api.ts`
    - `apps/web/src/features/profile/components/profile-form.tsx`
    - `apps/web/src/features/profile/components/change-password-form.tsx`
    - `apps/web/src/features/profile/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/profile.json`
    - `e2e/m1-profile.spec.ts`
  - **Especificación de Implementación:** Nombre y zona horaria editables (con borrador `profile`), idioma fijo "Español (Bolivia)", correo en solo lectura con la explicación de cómo cambiarlo, cambio de contraseña, "Cerrar sesión" y "Cerrar sesión en todos los dispositivos".
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-13`: el correo no es editable y se ve su explicación.
    - `EC-M1-05`: tras cambiar la contraseña en un contexto, el otro pierde la sesión en su siguiente acción.
    - `RF-M1-07`: "Cerrar sesión en todos los dispositivos" cierra el otro contexto.
    - `RF-M1-11`: el cambio de zona horaria se guarda.

- [x] **`TASK-075`: Web: bloqueo sin conexión y diálogo de sesión vencida**
  - **Dependencias:** Requiere TASK-041, TASK-074
  - **Trazabilidad SDD:** plan §4.2.3 (estados de la app); RF-M2-07, RF-M2-08, RF-M2-10, EC-M2-01, RNF-23
  - **Archivos en Alcance:**
    - `apps/web/src/app/layout/offline-overlay.tsx`
    - `apps/web/src/app/layout/session-expired-dialog.tsx`
    - `apps/web/src/app/layout/app-shell.tsx`
    - `apps/web/src/locales/es-BO/navigation.json`
    - `e2e/m2-offline-session.spec.ts`
  - **Especificación de Implementación:** `OfflineOverlay` tapa toda la app sin desmontarla. `SessionExpiredDialog` muestra el inicio de sesión encima de la pantalla: con el mismo usuario se cierra y se reintentan las consultas; con otro usuario se borran los borradores y la caché y se navega a `/`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-07` / `RNF-23`: con `context.setOffline(true)` aparece el bloqueo, y al reconectar desaparece solo.
    - `RF-M2-10`: el borrador del perfil sigue ahí al reconectar.
    - `RF-M2-08`: con la sesión vencida, iniciar sesión con el mismo usuario vuelve a la misma pantalla con el borrador.
    - `EC-M2-01`: si entra otro usuario, el borrador anterior se descarta.

- [x] **`TASK-076`: Web: eliminar la cuenta**
  - **Dependencias:** Requiere TASK-062, TASK-074
  - **Trazabilidad SDD:** plan §4.1.4 (`/perfil/eliminar`); RF-M1-15, EC-M1-08
  - **Archivos en Alcance:**
    - `apps/web/src/features/profile/components/delete-account.tsx`
    - `apps/web/src/features/profile/routes.tsx`
    - `apps/web/src/locales/es-BO/profile.json`
    - `e2e/m1-delete-account.spec.ts`
  - **Especificación de Implementación:** Una pantalla explica qué se borra y pide la contraseña y la palabra ELIMINAR. El botón "Exportar antes" se agrega en TASK-165. Al terminar, se cierra la sesión y se navega a `/entrar`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Eliminar la cuenta": con la contraseña y "ELIMINAR", la sesión se cierra y el correo `account_deleted` aparece en el buzón de prueba.
    - `EC-M1-08`: con una palabra distinta, se muestra el motivo y no se elimina nada.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-18 - Entregas con RELEASE]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.8 Disponibilidad y tolerancia a fallos]]
- **Fases de tareas:** [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]] · [[Tareas Fase 16 - Exportación de datos (M1, V1.0)]] · [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 3 - Dominio transversal]] · [[Tareas Fase 5 - Base de la web y harness E2E]]
- **Spec / Plan / Constitución:** [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]] · [[Plan 5.1 Estrategia]] · [[Spec 2.2 M2 - Navegación y estructura (V1.0)]] · [[Spec 2.8 M8 - Inicio (dashboard) (V1.0)]]

