---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.5 M5 - Categorías (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M5"
modulo: "M5"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.4 M4 - Cuentas (V1.0)]] · → [[Plan 4.6 M6 - Transacciones (V1.0)]]

### 4.5 M5 — Categorías (V1.0)

#### 4.5.1 Contratos

```ts
const CategoryName = z.string().trim().min(1).max(30);
CreateCategoryInput = z.object({ id: z.string().uuid(), kind: z.enum(['expense','income']), parentId: z.string().uuid().nullable(), name: CategoryName, color: PaletteKey.optional(), icon: IconKey });
UpdateCategoryInput = z.object({ name: CategoryName, color: PaletteKey, icon: IconKey, parentId: z.string().uuid().nullable() }).partial().strict();
ReorderCategoriesInput = z.object({ kind: z.enum(['expense','income']), parentId: z.string().uuid().nullable(), ids: z.array(z.string().uuid()) });
RestoreCategoryInput   = z.object({ childIds: z.array(z.string().uuid()).default([]), newName: CategoryName.optional() });
MergeInput             = z.object({ fromId: z.string().uuid(), toId: z.string().uuid() });
CategoryNode = { id, kind, name, color, icon, isSystem, status, children: CategoryNode[] }
ArchiveImpactDto = { children: {id,name}[], budgets: {id}[], recurring: {id,name}[], shortcuts: {id,name}[] }
MergePreviewDto  = { movements: number, budgetEffect: 'moved'|'kept_target'|'none' }
```

Catálogos fijos en `contracts`: `PaletteKey` (12 colores con su valor en claro y oscuro, contraste AA) e `IconKey` (unos 60 íconos de lucide-react, que ya viene con shadcn). Si no se elige color, una subcategoría hereda el del padre (RF-M5-04).

Forma exportada por `catalogs.ts`: `PaletteKey` (`z.enum` de 12 claves), `PALETTE: Record<PaletteKey, { light: '#rrggbb'; dark: '#rrggbb' }>`, `THEME_BACKGROUND = { light: '#ffffff', dark: '#020817' }`, `IconKey` (`z.enum` en kebab-case) e `ICON_KEYS` (arreglo de nombres). Los fondos son los de la web (`--background` en `apps/web/src/index.css`: `0 0% 100%` y `222.2 84% 4.9%`) y el contraste AA (≥ 4,5:1) se mide contra ellos.

#### 4.5.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/categories?kind&status` | Árbol de dos niveles. | — |
| `POST /api/categories` | Idempotente, con tope de 300. El trigger `category_guard` valida la jerarquía. | `NAME_TAKEN 409` · `HIERARCHY_INVALID 422` · `PARENT_ARCHIVED 409` · `LIMIT_REACHED 409` |
| `PATCH /api/categories/:id` | Renombrar, cambiar ícono o color, mover de padre o pasar a principal (EC-M5-03, EC-M5-05). | `SYSTEM_CATEGORY 422` · `NAME_TAKEN 409` · `HIERARCHY_INVALID 422` |
| `PUT /api/categories/order` | Reasigna `sort_order` dentro del mismo tipo y padre. | — |
| `GET /api/categories/:id/archive-impact` → `POST /api/categories/:id/archive` | Archiva el padre y sus hijas. El presupuesto pasa a `finalizing` (M11), las reglas se pausan con aviso (M14) y los atajos se ocultan por filtro (RF-M5-07). | `SYSTEM_CATEGORY 422` |
| `POST /api/categories/:id/restore` | Restaura con las hijas elegidas. Una hija con el padre archivado necesita que se restaure el padre. | `NAME_TAKEN 409` · `PARENT_ARCHIVED 409` |
| `DELETE /api/categories/:id` | Solo sin movimientos (incluidos los que están dentro de la ventana de deshacer) y sin presupuesto ni regla que la use. Sus atajos se borran en cascada (R1). | `CATEGORY_HAS_MOVEMENTS 409` · `CATEGORY_IN_USE 409 {budgets, recurring}` · `SYSTEM_CATEGORY 422` |
| `GET /api/categories/merge-preview?from&to` → `POST /api/categories/merge` | `withUserLock`. Valida mismo tipo, A sin hijas, B activa, ninguna del sistema y A sin cierre pendiente. Mueve a B los movimientos, reglas y atajos de A; resuelve el presupuesto según RF-M5-08 con aviso; elimina A. | `MERGE_INVALID 422 {reason}` · `MERGE_PENDING_CLOSE 409` · `CATEGORY_NOT_FOUND 404` (fusión ya hecha) |

#### 4.5.3 Ciclo de vida y concurrencia
- **Estados** Activa ⇄ Archivada → Eliminada, con actualizaciones condicionadas.
- **Protecciones** (trigger `category_guard` + validaciones del servicio): un solo nivel, el tipo nunca cambia (RF-M5-01), la categoría del sistema solo cambia color e ícono (RF-M5-05) y una categoría con hijas no pasa a ser hija.
- **Totales por categoría:** se calculan con la jerarquía actual al leer, así que fusionar o mover cambia los totales de meses pasados en el Inicio y en la lista (RF-M5-09, RN-11). Los presupuestos decididos guardan `spent_at_decision`, así que sus períodos cerrados no cambian.
- **Fusión:** atómica e irreversible. Repetirla devuelve `CATEGORY_NOT_FOUND`, que el cliente trata como ya hecha.
- **Definición del seed:** `packages/db/seed/preset-categories.ts` exporta `PRESET_CATEGORIES: readonly PresetCategory[]`, un árbol en el orden de spec §2.5.1 (gastos, luego ingresos), con `PresetCategory = { kind: 'expense' | 'income'; name: string; icon: IconKey; color: PaletteKey; seedOrder: number; systemKey?: 'debts' | 'debts_interest'; children?: PresetCategory[] }`. `seedOrder` empieza en 0 y cuenta por tipo entre las raíces y por padre entre las hijas. Las hijas usan el color de su padre. Las del sistema son "Deudas y préstamos" (`debts`) con su hija "Intereses" (`debts_interest`), repetidas en gasto y en ingreso. `IconKey` y `PaletteKey` vienen de `@finanzas/contracts`, que `@finanzas/db` declara como dependencia.
- **Seed:** al crear el usuario se crean las precargadas (con `seed_order`) y las del sistema. Al terminar el paso 3 del Onboarding se borran las desmarcadas, que no tienen movimientos.

#### 4.5.4 UI y estado
- **`/categorias`:** pestañas Gastos e Ingresos. `<CategoryTree>` (padres desplegables, reordenables con arrastre y con botones Subir/Bajar), distintivo "del sistema" y enlace a las archivadas.
- **Formularios y diálogos:** `<CategoryForm>` (`<IconGallery>`, `<ColorPalette>`, selector de padre); `<ArchiveCategoryDialog>`, que lista el impacto; `<RestoreCategoryDialog>`, que elige las hijas; `<MergeDialog>`, que muestra la previsualización.
- **Estado:** `['categories', kind]`. Archivar, fusionar o mover invalida `['categories']`, `['transactions']`, `['dashboard']` y `['budgets']`.

---

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M14 - Recurrentes]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]] · [[Spec 2.5 M5 - Categorías (V1.0)]]

