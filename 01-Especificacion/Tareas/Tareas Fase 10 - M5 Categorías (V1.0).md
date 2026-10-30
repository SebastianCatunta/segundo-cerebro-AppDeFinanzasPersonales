---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 10 - M5 Categorías (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M5"
fase: "10"
tareas: "9"
modulo: "M5"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 9 - M4 Cuentas (V1.0)]] · → [[Tareas Fase 11 - M6 Transacciones (V1.0)]]

### Fase 10 — M5 Categorías (V1.0)

- [x] **`TASK-109`: Contratos de M5**
  - **Dependencias:** Requiere TASK-024
  - **Trazabilidad SDD:** plan §4.5.1; RF-M5-01, RF-M5-02, RF-M5-04
  - **Archivos en Alcance:**
    - `packages/contracts/src/categories.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/categories.test.ts`
  - **Especificación de Implementación:** `CreateCategoryInput`, `UpdateCategoryInput` (estricto y sin `kind`), `ReorderCategoriesInput`, `RestoreCategoryInput`, `MergeInput`, `CategoryNode`, `ArchiveImpactDto` y `MergePreviewDto`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M5-02`: un nombre de 31 caracteres es inválido.
    - `RF-M5-01`: `UpdateCategoryInput` rechaza `kind`.
    - `RF-M5-04`: `color` es opcional al crear e `icon` es obligatorio.

- [x] **`TASK-110`: Repositorio de categorías**
  - **Dependencias:** Requiere TASK-099
  - **Trazabilidad SDD:** plan §3.5, plan §4.5.2; RF-M5-03, RN-09
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/category.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/factories/category.factory.ts`
    - `apps/api/test/integration/category-repository.test.ts`
  - **Especificación de Implementación:** `tree(kind, status)` (dos niveles, en orden), `get`, `insert`, `update`, `setOrder`, `count`, `hasMovements` (incluye las eliminadas que siguen en la ventana de deshacer), `usage(id)` (presupuestos, reglas y atajos) y `idsWithChildren(id)`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M5-03`: `idsWithChildren` devuelve el padre y sus hijas.
    - `hasMovements` cuenta una transacción eliminada que todavía puede deshacerse.
    - `RN-09`: un usuario no ve las categorías de otro.

- [x] **`TASK-111`: `CategoriesService`: crear, editar, mover y reordenar**
  - **Dependencias:** Requiere TASK-037, TASK-109, TASK-110
  - **Trazabilidad SDD:** plan §4.5.2 (`POST`, `PATCH`, `PUT /order`), plan §4.5.3; RF-M5-01, RF-M5-02, RF-M5-04, RF-M5-05, EC-M5-01, EC-M5-03, EC-M5-05, RNF-28
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/categories.service.ts`
    - `apps/api/test/integration/categories-crud.test.ts`
  - **Especificación de Implementación:** `create` es idempotente con un tope de 300; una subcategoría sin color hereda el del padre. `update` renombra, cambia el ícono o el color, mueve a otro padre del mismo tipo o pasa a principal. Traduce los errores del trigger a `HIERARCHY_INVALID`, `PARENT_ARCHIVED`, `NAME_TAKEN` y `SYSTEM_CATEGORY`.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M5-01`: "comida" con "Comida" existente da `NAME_TAKEN`.
    - `RF-M5-04`: una hija sin color hereda el del padre.
    - `RF-M5-05`: renombrar la categoría del sistema da `SYSTEM_CATEGORY`; cambiarle el color, no.
    - `EC-M5-05`: pasar a principal con un nombre en uso da `NAME_TAKEN`.
    - `EC-M5-03`: mover una hija cambia el total del padre anterior desde ese momento.
    - `RNF-28`: la categoría 301 da `LIMIT_REACHED`.

- [x] **`TASK-112`: Archivar y restaurar categorías**
  - **Dependencias:** Requiere TASK-111
  - **Trazabilidad SDD:** plan §4.5.2 (`archive-impact`, `archive`, `restore`); RF-M5-06, RF-M5-07, EC-M5-04, EC-M5-06
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/categories.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/category.repository.ts`
    - `apps/api/test/integration/categories-archive.test.ts`
  - **Especificación de Implementación:** `archiveImpact` lista las hijas, los presupuestos, las reglas y los atajos afectados. `archive` archiva el padre y sus hijas (los atajos se ocultan al leer; los efectos sobre presupuestos y reglas se agregan en TASK-203 y TASK-232). `restore(childIds, newName?)` restaura las hijas elegidas; una hija con el padre archivado exige restaurar el padre (`PARENT_ARCHIVED`).
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M5-07`: el impacto lista las hijas y los atajos afectados.
    - `RF-M5-06`: una archivada no aparece en el árbol de activas y conserva sus movimientos.
    - `EC-M5-04`: restaurar con un nombre en uso da `NAME_TAKEN`.
    - `EC-M5-06`: restaurar una hija con el padre archivado da `PARENT_ARCHIVED`.

- [x] **`TASK-113`: Eliminar categorías**
  - **Dependencias:** Requiere TASK-111
  - **Trazabilidad SDD:** plan §4.5.2 (`DELETE /api/categories/:id`), plan §3.8; EC-M5-07, RN-08
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/categories.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/category.repository.ts`
    - `apps/api/test/integration/categories-delete.test.ts`
  - **Especificación de Implementación:** Solo procede sin movimientos (incluidos los que están en la ventana de deshacer) y sin presupuesto ni regla que la use; sus atajos caen en cascada.
  - **Criterios de Verificación (Tests & DoD):**
    - `RN-08`: con movimientos, da `CATEGORY_HAS_MOVEMENTS`.
    - `EC-M5-07`: usada por un presupuesto o una regla (insertados en la prueba), da `CATEGORY_IN_USE {budgets, recurring}`.
    - Sin uso, se elimina con sus atajos.

- [x] **`TASK-114`: Fusionar categorías**
  - **Dependencias:** Requiere TASK-112
  - **Trazabilidad SDD:** plan §4.5.2 (`merge-preview`, `merge`), plan §4.5.3 (fusión); RF-M5-08, RF-M5-09, EC-M5-02, RN-11
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/categories.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/category.repository.ts`
    - `apps/api/test/integration/categories-merge.test.ts`
  - **Especificación de Implementación:** Con `withUserLock`, valida que sean del mismo tipo, que A no tenga hijas, que B esté activa y que ninguna sea del sistema (si no, `MERGE_INVALID {reason}`). Mueve a B los movimientos, las reglas y los atajos de A y elimina A. Repetir la fusión da `CATEGORY_NOT_FOUND`. La resolución de presupuestos y `MERGE_PENDING_CLOSE` se agregan en TASK-203.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Fusionar duplicados": "Taxis" (12) en "Taxi/Apps" (40) deja 52 y A deja de existir.
    - `EC-M5-02`: fusionar una categoría con hijas da `MERGE_INVALID`.
    - `RF-M5-09` / `RN-11`: el gasto por categoría de un mes pasado cambia tras la fusión.
    - Repetir la fusión da `CATEGORY_NOT_FOUND`.

- [x] **`TASK-115`: Rutas HTTP de categorías**
  - **Dependencias:** Requiere TASK-113, TASK-114
  - **Trazabilidad SDD:** plan §4.5.2 (tabla de endpoints); RF-M5-05, RNF-14
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/categories.routes.ts`
    - `apps/api/src/presentation/controllers/categories.controller.ts`
    - `apps/api/src/presentation/presenters/categories.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/categories.test.ts`
    - `apps/api/test/http/categories.isolation.test.ts`
  - **Especificación de Implementación:** Monta todos los endpoints de plan §4.5.2.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Categoría del sistema protegida": `archive` sobre "Deudas y préstamos" da `SYSTEM_CATEGORY`, y un UPDATE directo por SQL también falla.
    - `RNF-14`: el usuario B recibe 404 en cada endpoint con un recurso de A.

- [x] **`TASK-116`: Web: árbol de categorías**
  - **Dependencias:** Requiere TASK-073, TASK-115
  - **Trazabilidad SDD:** plan §4.5.4 (`/categorias`); RF-M5-01, RF-M5-05, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/categories/api.ts`
    - `apps/web/src/features/categories/hooks/use-categories.ts`
    - `apps/web/src/features/categories/components/category-tree.tsx`
    - `apps/web/src/features/categories/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/categories.json`
    - `e2e/m5-categories.spec.ts`
  - **Especificación de Implementación:** Pestañas Gastos e Ingresos; padres desplegables; reordenar arrastrando y con Subir y Bajar; distintivo "del sistema"; enlace a las archivadas.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Categoría del sistema protegida" (UI): "Deudas y préstamos" no ofrece Archivar.
    - `RNF-06`: reordenar con el teclado persiste.

- [x] **`TASK-117`: Web: formulario de categoría, archivar, restaurar y fusionar**
  - **Dependencias:** Requiere TASK-116
  - **Trazabilidad SDD:** plan §4.5.4 (formularios y diálogos); RF-M5-04, RF-M5-07, RF-M5-08, EC-M5-02, EC-M5-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/categories/components/category-form.tsx`
    - `apps/web/src/features/categories/components/icon-gallery.tsx`
    - `apps/web/src/features/categories/components/color-palette.tsx`
    - `apps/web/src/features/categories/components/archive-category-dialog.tsx`
    - `apps/web/src/features/categories/components/restore-category-dialog.tsx`
    - `apps/web/src/features/categories/components/merge-dialog.tsx`
    - `apps/web/src/features/categories/routes.tsx`
    - `apps/web/src/locales/es-BO/categories.json`
    - `e2e/m5-category-dialogs.spec.ts`
  - **Especificación de Implementación:** `CategoryForm` (con borrador) con `IconGallery`, `ColorPalette` y el selector de padre. El diálogo de archivar lista el impacto. El de restaurar permite elegir las hijas. El de fusionar muestra la vista previa. Archivar, fusionar o mover invalida `['categories']`, `['transactions']`, `['dashboard']` y `['budgets']`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M5-07`: archivar un padre lista sus hijas antes de confirmar.
    - `RF-M5-08`: la vista previa muestra cuántos movimientos se moverán.
    - `EC-M5-02`: una categoría con hijas no se ofrece como origen de una fusión.
    - `RF-M5-04`: la paleta tiene 12 colores y es navegable con el teclado.

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]]
- **Requerimientos no funcionales:** [[Spec 3.10 Límites por usuario]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 20 - M11 Presupuestos (V1.1)]] · [[Tareas Fase 23 - M14 Recurrentes (V1.2)]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]] · [[Plan 3.8 Integridad y cascadas]] · [[Plan 4.5 M5 - Categorías (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

