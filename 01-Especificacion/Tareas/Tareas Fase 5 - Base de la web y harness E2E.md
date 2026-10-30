---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 5 - Base de la web y harness E2E"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "5"
tareas: "9"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 4 - Base del API]] · → [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]]

### Fase 5 — Base de la web y harness E2E

- [x] **`TASK-039`: i18n y textos de errores**
  - **Dependencias:** Requiere TASK-008, TASK-022
  - **Trazabilidad SDD:** plan §1.3 (librerías de interfaz), ADR-09, plan §5.3 (RNF-07); RNF-07, RNF-17
  - **Archivos en Alcance:**
    - `apps/web/src/app/providers/i18n.ts`
    - `apps/web/src/locales/es-BO/common.json`
    - `apps/web/src/locales/es-BO/errors.json`
    - `apps/web/src/lib/i18n-errors.ts`
    - `apps/web/vitest.config.ts`
    - `apps/web/test/i18n-errors.test.ts`
  - **Especificación de Implementación:** i18next con un único idioma, es-BO, y espacios de nombres por *feature*. `errors.json` tiene un texto por cada `ErrorCode`. `messageForError(apiError)` usa `data` como parámetros y, ante un código desconocido, un texto genérico. El `include` de `apps/web/vitest.config.ts` suma `test/**/*.test.ts`, para que corran las pruebas que esta fase pone en `apps/web/test/`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-07`: cada código de `ErrorCode` tiene su texto en `errors.json`.
    - `RNF-17`: un código desconocido muestra el texto genérico, sin detalles.

- [x] **`TASK-040`: Store mínimo de la interfaz (`ui-store`)**
  - **Dependencias:** Requiere TASK-008
  - **Trazabilidad SDD:** ADR-17, plan §4.2.3, plan §4.2.4; RF-M2-04, RF-M2-05
  - **Archivos en Alcance:**
    - `apps/web/src/lib/ui-store.ts`
    - `apps/web/test/ui-store.test.ts`
  - **Especificación de Implementación:** Store con `useSyncExternalStore` y estos estados: `offline`, `sessionExpired`, `tabMemory` (`{ [moduleKey]: { url, scrollY } }`, persistido en sessionStorage, que se inyecta) y `undo` (`{ token, label, expiresAt }`). Hook `useUiStore(selector)`. `createUiStore({ storage })` devuelve `{ getState, subscribe, setTabMemory(moduleKey, { url, scrollY }), setOffline(value), openSessionExpired(), closeSessionExpired(), showUndo({ token, label, expiresAt }), clearUndo() }`, y `uiStore` es la instancia sobre `sessionStorage`. `moduleKey` es el `ModuleKey` de `@finanzas/contracts`. `rootFor(moduleKey)` es una exportación suelta que devuelve la raíz del módulo, aunque `tabMemory` guarde una ruta de detalle: M8 `/`, M6 `/movimientos`, M7 `/registrar`, M4 `/cuentas`, M5 `/categorias`, M3 `/tipo-de-cambio`, M11 `/presupuestos`, M12 `/metas`, M13 `/deudas` y M14 `/recurrentes`. M1, M2, M9, M10 y M15 devuelven `/` hasta que sus tareas definan su raíz.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-04`: `tabMemory` sobrevive a recrear el store sobre el mismo storage.
    - `RF-M2-05`: `rootFor(moduleKey)` devuelve la raíz del módulo.

- [x] **`TASK-041`: Detección sin conexión (`online`)**
  - **Dependencias:** Requiere TASK-040
  - **Trazabilidad SDD:** plan §4.2.3 (normal ↔ sin conexión); RF-M2-07, EC-M2-02, RNF-23
  - **Archivos en Alcance:**
    - `apps/web/src/lib/online.ts`
    - `apps/web/test/online.test.ts`
  - **Especificación de Implementación:** `setOffline()` pausa TanStack Query (`onlineManager.setOnline(false)`), marca `offline` y consulta `GET /api/health` cada 5 s. Con un 204 o el evento `online`, reactiva todo, invalida las consultas y reenvía una vez, con el mismo `id`, la mutación que estaba en vuelo. `createOnline({ queryClient, store, fetch, events, healthIntervalMs = 5000 })` recibe el `QueryClient`, el `UiStore` de TASK-040, el `fetch` para `GET /api/health` y el `EventTarget` del que escucha `online`. Devuelve `{ setOffline(), trackInFlight(id, send), dispose() }`. `trackInFlight` registra la mutación en curso: si se llama a `setOffline()` mientras dura, al volver la conexión ejecuta `send()` exactamente una vez, y la promesa que devolvió se resuelve o se rechaza con ese reenvío. `queryClient` es opcional en la fábrica, y el objeto devuelto también expone `attach(queryClient)`: sin un `QueryClient` no se invalida nada. `online` es la instancia sobre los objetos reales (`window`, `fetch` global y `uiStore`), creada sin `QueryClient`; TASK-045 llama a `online.attach(queryClient)`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-07`: con temporizadores falsos, un 204 de health vuelve a `online` e invalida las consultas.
    - `EC-M2-02`: la mutación en vuelo se reenvía una sola vez y con el mismo `id`.

- [x] **`TASK-042`: Cliente HTTP tipado (`api-client`)**
  - **Dependencias:** Requiere TASK-039, TASK-041
  - **Trazabilidad SDD:** plan §4.0 (cliente fetch tipado), ADR-09, ADR-11; RF-M1-07, RF-M2-07, RF-M2-08
  - **Archivos en Alcance:**
    - `apps/web/src/lib/api-client.ts`
    - `apps/web/test/api-client.test.ts`
  - **Especificación de Implementación:** `call(endpoint, input, { background?, signal? })` con `fetch` inyectable. Valida la salida con el schema del endpoint. Un problem+json lanza `ApiError { code, status, data, traceId }`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-07`: con `background: true` envía `X-Background: 1`.
    - `RF-M2-08`: `SESSION_EXPIRED` abre el diálogo de sesión vencida sin navegar.
    - `RF-M2-07`: un `TypeError` de red marca la app sin conexión.
    - Una respuesta que no cumple el schema de salida lanza un error.

- [x] **`TASK-043`: Borradores de formularios (`useDraft`)**
  - **Dependencias:** Requiere TASK-008
  - **Trazabilidad SDD:** ADR-17, plan §4.2.3 (borradores); RF-M2-10, RF-M2-11, EC-M2-01, RF-M7-08
  - **Archivos en Alcance:**
    - `apps/web/src/lib/drafts.ts`
    - `apps/web/test/drafts.test.ts`
  - **Especificación de Implementación:** Funciones puras `saveDraft`, `loadDraft`, `clearDraft` y `clearAllDrafts(userId)` sobre un storage inyectable, con la clave `draft:{userId}:{formKey}`. Al restaurar, valida con el schema y aplica `validateRefs`. El hook `useDraft(formKey, form, opts)` guarda 300 ms después del último cambio y expone `clear` y `restoredWithIssues`. `createDrafts({ storage })` devuelve `{ save(userId, formKey, value), load(userId, formKey, { schema, validateRefs? }), clear(userId, formKey), clearAll(userId) }`; `saveDraft`, `loadDraft`, `clearDraft` y `clearAllDrafts` son esas funciones sobre `sessionStorage`. `load` devuelve `{ value, issues } | null`: los campos que `validateRefs` marca con `'reselect'` se quitan de `value` y quedan en `issues`, y un borrador que no cumple el schema se borra del storage y da `null`. `clearAll(userId)` borra todas las claves `draft:{userId}:*` de ese usuario (el anterior en EC-M2-01), así que un nuevo inicio de sesión del mismo usuario conserva las suyas (RF-M7-08). `useDraft` recibe `userId` en `opts`, y `restoredWithIssues` es `true` si `issues` tiene al menos un campo. Las formas cortas del plan (`drafts.clear('register')`, `drafts.clearAll()`) son el `clear` del hook y `clearAllDrafts` con el usuario anterior. La web no tiene jsdom ni testing-library, así que en esta tarea el hook solo se comprueba como exportación.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-10`: lo guardado se restaura igual, y un borrador inválido se descarta.
    - `RF-M2-11`: una cuenta que ya no está activa se vacía y se marca para elegir otra.
    - `EC-M2-01`: `clearAllDrafts` borra los borradores del usuario anterior.
    - `RF-M7-08`: el borrador sobrevive a un nuevo inicio de sesión del mismo usuario.

- [x] **`TASK-044`: Parámetros de búsqueda validados (`useValidatedSearch`)**
  - **Dependencias:** Requiere TASK-008
  - **Trazabilidad SDD:** ADR-16; RF-M2-04, RF-M2-06
  - **Archivos en Alcance:**
    - `apps/web/src/lib/search-params.ts`
    - `apps/web/test/search-params.test.ts`
  - **Especificación de Implementación:** `parseSearch(schema, URLSearchParams)` y `serializeSearch(values)` puros, y el hook `useValidatedSearch(schema)` sobre React Router. Un parámetro inválido cae a su valor por defecto.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-06`: parsear y serializar es estable (ida y vuelta), así el botón Atrás restaura el mismo estado.
    - Un mes con formato inválido cae al valor por defecto sin lanzar errores.

- [x] **`TASK-045`: Proveedores de la app y router base**
  - **Dependencias:** Requiere TASK-039, TASK-042
  - **Trazabilidad SDD:** plan §2 (`app/providers`, `app/router.tsx`), ADR-16, plan §4.9.3 (primer pintado del tema)
  - **Archivos en Alcance:**
    - `apps/web/src/app/providers/query-client.ts`
    - `apps/web/src/app/providers/theme.tsx`
    - `apps/web/src/app/providers/index.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/main.tsx`
    - `apps/web/src/App.tsx`
  - **Especificación de Implementación:** `QueryClient` con `refetchOnWindowFocus` y reintentos que no repiten las mutaciones; al crearlo se llama a `online.attach(queryClient)` (TASK-041). `ThemeProvider` aplica la copia del tema en localStorage antes del primer render (el valor del servidor prevalece después, TASK-070). React Router con una ruta raíz y la página 404.
  - **Criterios de Verificación (Tests & DoD):**
    - Comando: `pnpm --filter web build`
    - Comando: `pnpm --filter web lint`

- [x] **`TASK-046`: Harness E2E con Playwright**
  - **Dependencias:** Requiere TASK-036, TASK-045
  - **Trazabilidad SDD:** plan §5.1 (E2E), plan §1.5 (entorno efímero); RNF-05, RNF-06
  - **Archivos en Alcance:**
    - `e2e/package.json`
    - `e2e/tsconfig.json`
    - `e2e/playwright.config.ts`
    - `e2e/fixtures/base.ts`
    - `e2e/support/axe.ts`
    - `e2e/smoke.spec.ts`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:** Proyectos `chromium-360`, `chromium-1280`, `webkit-360`, `webkit-1280`, `firefox-360` y `firefox-1280`. `webServer` levanta el API con `INTEGRATIONS=fake` y `RELEASE=${E2E_RELEASE:-1.2}` sobre la base de test migrada, y la web con `vite build` + `vite preview` (proxy `/api`). Helper de axe que falla ante violaciones serias o críticas. `e2e/tsconfig.json` cubre todos los `.ts` de `e2e/`, también las *specs* y *fixtures* que agregarán tareas posteriores. Script `e2e:release-1.0` que corre las pruebas etiquetadas `@release-1.0` con `E2E_RELEASE=1.0`.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-046`: la prueba de humo comprueba que `/api/health` responde 204 y que la web carga sin violaciones de axe.
    - Comando: `pnpm --filter e2e exec playwright test smoke.spec.ts --project=chromium-1280`

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-09 - Errores problem+json]] · [[ADR-11 - Idempotencia con UUID v7]] · [[ADR-16 - Navegación con React Router]] · [[ADR-17 - Estado de cliente mínimo]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.8 Disponibilidad y tolerancia a fallos]]
- **Fases de tareas:** [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]] · [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 1.3 Registro de decisiones (ADR)]] · [[Plan 1.5 Integración y despliegue continuos (ADR-20)]] · [[Plan 2. Estructura del Proyecto (Árbol de Directorios)]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]] · [[Plan 5.1 Estrategia]] · [[Plan 5.3 Requerimientos no funcionales → verificación]]

