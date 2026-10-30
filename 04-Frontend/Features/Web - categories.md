---
tipo: "frontend"
modulo: "M5"
fuente: "apps/web/src/features/categories"
tags:
  - "frontend/feature"
  - "modulo/M5"
actualizado: "2026-10-30"
---

# Web · feature `categories`

Carpeta `apps/web/src/features/categories/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M5 - Categorías]]
- **Textos (i18n):** `locales/es-BO/categories.json` (24 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/categorias` | `CategoriesPage` | ✅ | V1.0 |
| `/categorias/nueva` | `CategoryFormPage` | — | V1.0 |
| `/categorias/archivadas` | `ArchivedCategoriesPage` | — | V1.0 |
| `/categorias/:id/editar` | `CategoryFormPage` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `listCategoriesEndpoint` | `GET` | `/api/categories` |
| `reorderCategoriesEndpoint` | `PUT` | `/api/categories/order` |
| `archiveCategoryEndpoint` | `POST` | `/api/categories/${id}/archive` |

## Hooks (TanStack Query)

- `use-categories.ts` — `CATEGORIES_KEY`, `categoriesQuery`, `useCategories`, `useReorderCategories`, `useArchiveCategory`. Saves the order of the categories of one kind and parent.

## Componentes (7)

| Archivo | Exporta | Descripción |
|---|---|---|
| `archive-category-dialog.tsx` | `ArchiveCategoryDialog` | Lists what archiving affects before confirming (RF-M5-07). |
| `category-form.tsx` | `invalidateAfterCategoryChange`, `CategoryForm` | What a change of categories can alter on other screens (plan §4.5.4). |
| `category-tree.tsx` | `CategoryTree` | Saves the new order of the categories that share a parent (`null` for main ones). |
| `color-palette.tsx` | `ColorPalette` | The 12 colors of the catalog as a radio group, so the arrow keys move between them (RF-M5-04, RNF-06). `null` means no color: a subcategory then takes its parent's. |
| `icon-gallery.tsx` | `iconFor`, `IconGallery` | The lucide icon of each catalog key. Naming the icons one by one keeps the 1,700 icons of lucide-react out of the bundle (RNF-01). |
| `merge-dialog.tsx` | `mergeableSources`, `MergeDialog` | Categories of the tree that can be merged into another: no subcategories, not of the system. |
| `restore-category-dialog.tsx` | `RestoreCategoryDialog` | Restores an archived category with the subcategories the user picks; a name already in use can be changed here (EC-M5-04). A subcategory whose parent is archived gets PARENT_ARCHIVED (EC-M5-06). |

**Backend relacionado:** [[API categories]]

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.2 Compatibilidad y accesibilidad]]
- **Spec / Plan / Constitución:** [[Plan 4.5 M5 - Categorías (V1.0)]]

