---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 12 - M7 Registrar (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M7"
fase: "12"
tareas: "9"
modulo: "M7"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · → [[Tareas Fase 13 - M8 Inicio (V1.0)]]

### Fase 12 — M7 Registrar (V1.0)

- [x] **`TASK-134`: Contratos de M7**
  - **Dependencias:** Requiere TASK-096, TASK-118
  - **Trazabilidad SDD:** plan §4.7.1; RF-M7-04, RF-M7-07, RF-M7-09
  - **Archivos en Alcance:**
    - `packages/contracts/src/register.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/register.test.ts`
  - **Especificación de Implementación:** `RegisterContextDto`, `ShortcutDto`, `CreateShortcutInput`, `UpdateShortcutInput` y `ReorderShortcutsInput`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M7-09`: el nombre de un atajo va de 1 a 30 caracteres; una transferencia exige destino y no admite categoría; el monto es opcional.
    - `RF-M7-04`: `grid` tiene como máximo 8 categorías por tipo.

- [x] **`TASK-135`: Contexto de Registrar y movimientos de hoy en la respuesta de guardar**
  - **Dependencias:** Requiere TASK-127, TASK-134
  - **Trazabilidad SDD:** plan §4.7.2 (`GET /api/register/context`, `POST /api/transactions`), plan §1.2 (camino crítico); RF-M7-03, RF-M7-04, RF-M7-07, RF-M7-11, RF-M5-06, RF-M4-12, EC-M7-05
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/register.service.ts`
    - `apps/api/src/presentation/routes/register.routes.ts`
    - `apps/api/src/presentation/controllers/register.controller.ts`
    - `apps/api/src/presentation/presenters/register.presenter.ts`
    - `apps/api/src/presentation/controllers/transactions.controller.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/register.test.ts`
  - **Especificación de Implementación:** Una sola consulta compuesta. La grilla toma las favoritas en su orden, después las más usadas en 60 días por categoría exacta (con empate por el uso más reciente) y después las precargadas por `seed_order`, sin archivadas. La última cuenta usada es la del último movimiento creado de ese tipo, si sigue activa; si no hay, la primera activa por `sort_order`. Agrega el último par de transferencia, los atajos visibles, los 3 últimos creados hoy y las cuentas con su saldo libre y sus datos de tarjeta. `POST /api/transactions` incluye además `todayRecent`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M7-04`: con 2 favoritas y 10 categorías usadas, la grilla muestra las 2 favoritas y luego las 6 más usadas; usar una hija no suma al padre.
    - `RF-M5-06`: una categoría archivada nunca aparece en la grilla.
    - `RF-M7-03` / `RF-M4-12` / `EC-M7-05`: sin cuenta por defecto, la última usada; si se archiva, la primera activa.
    - `RF-M7-07`: `todayRecent` trae los 3 últimos creados hoy, aunque su fecha sea pasada.

- [x] **`TASK-136`: Atajos: crear, editar, reordenar y eliminar**
  - **Dependencias:** Requiere TASK-037, TASK-134
  - **Trazabilidad SDD:** plan §4.7.2 (`/api/shortcuts`), plan §4.7.3 (atajo visible ⇄ oculto); RF-M7-09, RF-M7-10, EC-M7-06, RNF-28
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/shortcuts.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/shortcut.repository.ts`
    - `apps/api/src/presentation/routes/shortcuts.routes.ts`
    - `apps/api/src/presentation/controllers/shortcuts.controller.ts`
    - `apps/api/src/presentation/presenters/shortcuts.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/shortcuts.test.ts`
  - **Especificación de Implementación:** CRUD de atajos con un tope de 12 que cuenta también los ocultos. Un atajo está visible si su cuenta (y su destino, o su categoría) están activos.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M7-06` / `RNF-28`: el atajo 13 da `LIMIT_REACHED`, aunque haya atajos ocultos.
    - `RF-M7-10`: editar, reordenar y eliminar funcionan.
    - Un atajo con la categoría archivada no aparece en `register/context`.
    - Hay un test de aislamiento entre usuarios.

- [x] **`TASK-137`: Web: formulario de Registrar para gastos e ingresos**
  - **Dependencias:** Requiere TASK-028, TASK-043, TASK-070, TASK-135
  - **Trazabilidad SDD:** plan §4.7.3 (formulario), plan §4.7.4 (`/registrar`, teclado, rendimiento); RF-M7-01, RF-M7-02, RF-M7-03, RF-M7-04, RF-M7-05, RF-M7-06, RF-M7-08, RF-M7-11, RF-M7-12, RF-M9-04, RNF-01
  - **Archivos en Alcance:**
    - `apps/web/src/features/register/api.ts`
    - `apps/web/src/features/register/hooks/use-register-context.ts`
    - `apps/web/src/features/register/components/register-form.tsx`
    - `apps/web/src/features/register/components/kind-toggle.tsx`
    - `apps/web/src/features/register/components/amount-input.tsx`
    - `apps/web/src/features/register/components/account-chip.tsx`
    - `apps/web/src/features/register/components/category-grid.tsx`
    - `apps/web/src/features/register/components/all-categories-sheet.tsx`
    - `apps/web/src/features/register/components/date-chips.tsx`
    - `apps/web/src/features/register/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/app/guards.tsx`
    - `apps/web/src/locales/es-BO/register.json`
    - `e2e/m7-register-expense.spec.ts`
  - **Especificación de Implementación:** Entra con el tipo Gasto y el foco en el monto (`inputMode="decimal"`), o restaura el borrador `register` con su tipo. El monto se interpreta con `parseAmountInput`. La cuenta viene preseleccionada y su ficha muestra el saldo libre (en tarjetas, el crédito disponible o la deuda). Grilla de 8 categorías y "Ver todas". Fichas Hoy, Ayer y Calendario, sin fechas futuras y respetando el primer día de la semana. "Guardar" se habilita según RF-M7-06; Enter en el monto equivale a guardar. El contexto se precarga en cuanto la sesión está lista, y la pantalla no hace peticiones antes de que el usuario escriba. Al guardar se genera un `id` UUID v7 nuevo.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M7-02`: al entrar, el tipo es Gasto y el foco está en el monto.
    - Escenario "Borrador al cambiar de pestaña": "120" sigue en el monto al volver desde Cuentas (`RF-M7-08`).
    - Escenario "El borrador conserva su tipo": se restaura un ingreso de "500".
    - `RF-M7-05`: el calendario no permite fechas futuras, y `RF-M9-04`: empieza en el día configurado.
    - `RF-M7-12`: el formulario se completa y se guarda solo con Tab y Enter.
    - `RF-M7-06`: "Guardar" está deshabilitado sin categoría.

- [x] **`TASK-138`: Web: transferencias en Registrar**
  - **Dependencias:** Requiere TASK-137
  - **Trazabilidad SDD:** plan §4.7.3, plan §4.6.1 (convención de la tasa declarada); RF-M7-03, RF-M7-06, RF-M3-07, RF-M3-08, RF-M6-04
  - **Archivos en Alcance:**
    - `apps/web/src/features/register/components/transfer-fields.tsx`
    - `apps/web/src/features/register/components/register-form.tsx`
    - `apps/web/src/locales/es-BO/register.json`
    - `e2e/m7-register-transfer.spec.ts`
  - **Especificación de Implementación:** Origen y destino, con el último par usado. Si las monedas difieren: monto que sale, "Tipo de cambio usado" precargado con `transferPrefill` y monto que llega. Editar el monto que llega recalcula la tasa. Con una fecha pasada se precargan los valores de ese día.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Tasa precargada según la dirección" (E2E): con 10,10 y 10,30, de Bs a $ se precarga 10,30 y Bs 1.000,00 dan $ 97,09.
    - `RF-M6-04`: con el mismo origen y destino, "Guardar" está deshabilitado.
    - `RF-M3-08`: editar el monto que llega cambia la tasa mostrada.

- [x] **`TASK-139`: Web: segundo nivel de Registrar (nota, otra fecha, comisión, guardar como atajo)**
  - **Dependencias:** Requiere TASK-136, TASK-138
  - **Trazabilidad SDD:** plan §4.7.4 (`SecondLevel`); RF-M7-10, RF-M7-13, RF-M6-05, EC-M6-08, EC-M7-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/register/components/second-level.tsx`
    - `apps/web/src/features/register/components/fee-field.tsx`
    - `apps/web/src/features/register/components/save-as-shortcut-dialog.tsx`
    - `apps/web/src/features/register/components/register-form.tsx`
    - `apps/web/src/locales/es-BO/register.json`
    - `e2e/m7-register-second-level.spec.ts`
  - **Especificación de Implementación:** Nota (en el primer nivel si `always_show_note`), otra cuenta, otra fecha, comisión (solo en transferencias; si falta la categoría, pide elegir otra) y "Guardar como atajo".
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M7-13`: con "Mostrar la nota siempre", la nota está en el primer nivel.
    - `RF-M7-10`: "Guardar como atajo" crea un atajo que aparece como ficha.
    - `EC-M7-06`: con 12 atajos, informa el límite y ofrece ir a gestionarlos.
    - `EC-M6-08`: sin "Comisiones bancarias", pide elegir otra categoría.

- [x] **`TASK-140`: Web: fichas de atajos**
  - **Dependencias:** Requiere TASK-139
  - **Trazabilidad SDD:** plan §4.7.4 (`ShortcutChips`); RF-M7-09, RF-M2-11
  - **Archivos en Alcance:**
    - `apps/web/src/features/register/components/shortcut-chips.tsx`
    - `apps/web/src/features/register/components/register-form.tsx`
    - `e2e/m7-register-shortcuts.spec.ts`
  - **Especificación de Implementación:** Fichas del tipo actual. Tocar una rellena el formulario sin guardar; sin monto, el foco queda en el monto.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Atajo rellena sin guardar": el formulario queda completo y no hay ningún POST hasta tocar "Guardar".
    - `RF-M7-09`: un atajo sin monto deja el foco en el monto.

- [x] **`TASK-141`: Web: errores y estados vacíos de Registrar**
  - **Dependencias:** Requiere TASK-107, TASK-137
  - **Trazabilidad SDD:** plan §4.7.3 (errores, sin tasa), plan §4.4.3 (sin cuentas activas); EC-M7-01, EC-M7-02, EC-M7-04, EC-M7-07, EC-M7-08, EC-M3-02, EC-M10-03
  - **Archivos en Alcance:**
    - `apps/web/src/features/register/components/ask-rate-dialog.tsx`
    - `apps/web/src/features/register/components/register-form.tsx`
    - `apps/web/src/features/register/components/all-categories-sheet.tsx`
    - `apps/web/src/locales/es-BO/register.json`
    - `e2e/m7-register-errors.spec.ts`
  - **Especificación de Implementación:** `NEGATIVE_BALANCE` muestra el error sin limpiar el formulario. `RATE_REQUIRED` abre `AskRateDialog` ("No pudimos obtener el dólar. ¿A cuánto lo tomamos?") y reenvía con el mismo `id` y `manualUsdRate`. Sin cuentas, muestra `QuickAccountForm`. Sin categorías del tipo, "Ver todas" aparece vacío con "Crear categoría". Un borrador con una cuenta inactiva vacía ese campo y lo marca.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M7-02`: un gasto que deja el efectivo en negativo muestra el error y el formulario conserva sus datos.
    - Escenario "Sin ninguna tasa disponible" (E2E, `EC-M7-04`): con la fuente caída y sin datos, guardar en $ pide la tasa y el valor ingresado queda como manual activo.
    - `EC-M7-01`: sin cuentas, se ve "Crea tu primera cuenta".
    - `EC-M7-07` / `EC-M10-03`: sin categorías de gasto, "Ver todas" ofrece "Crear categoría".
    - `EC-M7-08`: un borrador con una cuenta archivada en otro contexto marca la cuenta para elegir otra.

- [x] **`TASK-142`: Web: después de guardar (limpieza, "Deshacer" y movimientos de hoy)**
  - **Dependencias:** Requiere TASK-132, TASK-141
  - **Trazabilidad SDD:** plan §4.7.3 (formulario guardado), plan §4.2.3 (sin conexión); RF-M7-07, EC-M2-02, RF-M2-07, RNF-23
  - **Archivos en Alcance:**
    - `apps/web/src/features/register/components/today-recent.tsx`
    - `apps/web/src/features/register/components/register-form.tsx`
    - `apps/web/src/locales/es-BO/register.json`
    - `e2e/m7-register-after-save.spec.ts`
  - **Especificación de Implementación:** Al guardar: borra el borrador, genera un `id` nuevo, muestra "Gasto de Bs X guardado · Deshacer" durante 10 s (sigue disponible al cambiar de pestaña hasta cumplirlos), devuelve el foco al monto y actualiza `['register','context']` con la respuesta, sin otra petición. `TodayRecent` muestra los 3 últimos creados hoy.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Registro rápido en menos de 10 segundos" (formulario): el gasto queda en Efectivo con fecha de hoy y el formulario vacío en Registrar.
    - Escenario "Deshacer después de guardar": el gasto se elimina y el saldo se restablece.
    - Escenario "Bloqueo sin conexión conserva el borrador": con "35" escrito, el bloqueo tapa la app y, al reconectar, "35" sigue ahí.
    - `EC-M2-02`: si la conexión se corta durante el guardado, al reconectar hay un solo movimiento.

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.10 Límites por usuario]] · [[Spec 3.8 Disponibilidad y tolerancia a fallos]]
- **Fases de tareas:** [[Tareas Fase 3 - Dominio transversal]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 5 - Base de la web y harness E2E]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 1.2 Despliegue y flujo principal]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 4.4 M4 - Cuentas (V1.0)]] · [[Plan 4.6 M6 - Transacciones (V1.0)]] · [[Plan 4.7 M7 - Registrar (V1.0)]]

