---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 14 - M9 Ajustes y personalización (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M9"
fase: "14"
tareas: "6"
modulo: "M9"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 13 - M8 Inicio (V1.0)]] · → [[Tareas Fase 15 - M10 Onboarding (V1.0)]]

### Fase 14 — M9 Ajustes y personalización (V1.0)

- [x] **`TASK-149`: Ajustes: cuenta por defecto y categorías favoritas**
  - **Dependencias:** Requiere TASK-069, TASK-104, TASK-112
  - **Trazabilidad SDD:** plan §4.9.2 (`PATCH /api/settings`); RF-M7-03, RF-M7-04, EC-M9-02
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/settings.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/favorite-category.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user-settings.repository.ts`
    - `apps/api/src/presentation/controllers/settings.controller.ts`
    - `apps/api/test/http/settings-register.test.ts`
  - **Especificación de Implementación:** `defaultAccountId` debe ser una cuenta activa (si no, `ACCOUNT_ARCHIVED`). `favoriteCategories` reemplaza las favoritas del tipo dentro de una transacción: hasta 8, activas y del tipo indicado (si no, `CATEGORY_ARCHIVED` o `VALIDATION_ERROR`).
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M7-03`: la cuenta por defecto se guarda y `register/context` la devuelve.
    - `EC-M9-02`: una cuenta archivada como cuenta por defecto da `ACCOUNT_ARCHIVED`.
    - `RF-M7-04`: guardar 3 favoritas las pone primeras en la grilla, en su orden.

- [x] **`TASK-150`: Restablecer ajustes por sección**
  - **Dependencias:** Requiere TASK-087, TASK-149
  - **Trazabilidad SDD:** plan §4.9.2 (`POST /api/settings/reset`); RF-M9-05
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/settings.service.ts`
    - `apps/api/src/presentation/routes/settings.routes.ts`
    - `apps/api/src/presentation/controllers/settings.controller.ts`
    - `apps/api/test/http/settings-reset.test.ts`
  - **Especificación de Implementación:** `general` vuelve a los formatos, la semana y el tema por defecto. `currencies` solo pone la referencia en la mediana y desactiva el valor manual (con su evento). `register` deja la cuenta por defecto en NULL, borra las favoritas y apaga la nota siempre visible. `dashboard` restaura los bloques. `reminders` restaura las preferencias de avisos por defecto.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M9-05`: después de cada sección, las cuentas, los movimientos, las categorías, los atajos, las monedas y la moneda base no cambian.
    - `RF-M9-05`: `currencies` desactiva el valor manual y deja `parallel_median`.

- [x] **`TASK-151`: Web: Ajustes y sección General**
  - **Dependencias:** Requiere TASK-070, TASK-150
  - **Trazabilidad SDD:** plan §4.9.3, plan §4.9.4 (rutas, restablecer); RF-M9-01, RF-M9-02, RF-M9-03, RF-M9-05, EC-M9-01
  - **Archivos en Alcance:**
    - `apps/web/src/features/settings/components/settings-hub.tsx`
    - `apps/web/src/features/settings/components/general-settings.tsx`
    - `apps/web/src/features/settings/components/reset-section-button.tsx`
    - `apps/web/src/features/settings/hooks/use-update-settings.ts`
    - `apps/web/src/features/settings/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/settings.json`
    - `e2e/m9-settings-general.spec.ts`
  - **Especificación de Implementación:** `/ajustes` con sus secciones. `/ajustes/general` con los formatos de número y de fecha, el primer día de la semana y el tema. Cada cambio se guarda 300 ms después, con actualización optimista y vuelta atrás si hay error, sin botón "Guardar". Botón "Restablecer valores por defecto" por sección, con confirmación.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Ajustes sincronizados" (`RF-M9-01`): el tema oscuro elegido en un contexto se ve en otro al recargar.
    - Escenario "Formato de números" (E2E): con "Bs 1,234.56", escribir "35.50" en Registrar guarda 35,50.
    - `RF-M9-03`: con la fecha en AAAA-MM-DD, la lista de movimientos usa ese formato.
    - `RF-M9-05`: restablecer General vuelve a "Bs 1.234,56".

- [x] **`TASK-152`: Web: Ajustes de Registrar**
  - **Dependencias:** Requiere TASK-140, TASK-151
  - **Trazabilidad SDD:** plan §4.9.4 (`/ajustes/registrar`); RF-M7-03, RF-M7-04, RF-M7-10, RF-M7-13, EC-M9-02, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/settings/components/register-settings.tsx`
    - `apps/web/src/features/settings/components/favorites-picker.tsx`
    - `apps/web/src/features/settings/components/shortcuts-manager.tsx`
    - `apps/web/src/features/settings/routes.tsx`
    - `apps/web/src/locales/es-BO/settings.json`
    - `apps/api/src/composition/container.ts`
    - `e2e/m9-settings-register.spec.ts`
  - **Especificación de Implementación:** Cuenta por defecto (activas, incluidas las dedicadas a metas), `FavoritesPicker` con hasta 8 por tipo, atajos (editar, reordenar con Subir y Bajar, eliminar) y "Mostrar la nota siempre".
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M7-04`: las favoritas elegidas aparecen primero en la grilla de Registrar.
    - `EC-M9-02`: después de archivar la cuenta por defecto, Registrar preselecciona según RF-M7-03.
    - `RF-M7-10`: reordenar los atajos con el teclado se refleja en Registrar.
    - `RF-M7-13`: activar la nota la muestra en el primer nivel.

- [x] **`TASK-153`: Web: Ajustes del Inicio**
  - **Dependencias:** Requiere TASK-148, TASK-151
  - **Trazabilidad SDD:** plan §4.9.4 (`/ajustes/inicio`); RF-M8-10, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/settings/components/blocks-order-list.tsx`
    - `apps/web/src/features/settings/routes.tsx`
    - `apps/web/src/locales/es-BO/settings.json`
    - `packages/contracts/src/dashboard.ts`
    - `apps/web/src/features/dashboard/api.ts`
    - `apps/web/src/features/dashboard/components/dashboard-blocks.tsx`
    - `apps/web/src/features/dashboard/components/pace-chart.tsx`
    - `apps/web/src/features/dashboard/components/category-bars.tsx`
    - `apps/web/src/features/dashboard/components/balances-block.tsx`
    - `apps/web/src/features/dashboard/components/recent-block.tsx`
    - `e2e/m9-settings-dashboard.spec.ts`
  - **Especificación de Implementación:** `BlocksOrderList` con los bloques 3 a 8, interruptores de visibilidad y botones Subir y Bajar. Los bloques no liberados no se muestran.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M8-10`: ocultar "Ritmo del gasto" lo quita del Inicio, y moverlo arriba cambia el orden.

- [x] **`TASK-154`: Web: Ajustes de monedas**
  - **Dependencias:** Requiere TASK-095, TASK-151
  - **Trazabilidad SDD:** plan §4.3.4 (`/ajustes/monedas`), plan §4.9.4; RF-M3-11, RF-M3-03
  - **Archivos en Alcance:**
    - `apps/web/src/features/settings/components/currency-settings.tsx`
    - `apps/web/src/features/settings/components/base-currency-select.tsx`
    - `apps/web/src/features/settings/routes.tsx`
    - `apps/web/src/locales/es-BO/settings.json`
    - `packages/contracts/src/fx.ts`
    - `apps/api/src/application/services/currencies.service.ts`
    - `apps/api/src/presentation/presenters/currencies.presenter.ts`
    - `packages/contracts/src/dashboard.ts`
    - `apps/web/src/features/dashboard/components/recent-block.tsx`
    - `apps/web/src/locales/es-BO/dashboard.json`
    - `e2e/m9-settings-currencies.spec.ts`
  - **Especificación de Implementación:** `BaseCurrencySelect` con las monedas activas, más los componentes del panel de Tipo de cambio (referencia, valor manual y monedas).
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-11`: cambiar la base a USD reexpresa los totales de Cuentas y del Inicio sin cambiar los movimientos registrados.
    - Restablecer la sección vuelve a la mediana del paralelo y desactiva el valor manual.

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M3 - Monedas y tipo de cambio]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]]
- **Fases de tareas:** [[Tareas Fase 10 - M5 Categorías (V1.0)]] · [[Tareas Fase 12 - M7 Registrar (V1.0)]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]] · [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]]

