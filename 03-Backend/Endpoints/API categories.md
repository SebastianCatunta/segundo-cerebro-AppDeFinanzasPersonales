---
tipo: "api"
modulo: "M5"
fuente: "apps/api/src/presentation/routes/categories.routes.ts"
tags:
  - "backend/api"
  - "modulo/M5"
actualizado: "2026-10-30"
---

# API · categories

- **Módulo:** [[M5 - Categorías]]
- **Montaje:** `/api/categories`
- **Archivos:** `presentation/routes/categories.routes.ts`, `presentation/controllers/categories.controller.ts`, `presentation/presenters/categories.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (10)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/categories` | ✅ | — | `list` |
| `POST` | `/api/categories` | ✅ | [[Contrato - categories\|CreateCategoryInput]] | `create` |
| `PUT` | `/api/categories/order` | ✅ | [[Contrato - categories\|ReorderCategoriesInput]] | `reorder` |
| `GET` | `/api/categories/merge-preview` | ✅ | — | `mergePreview` |
| `POST` | `/api/categories/merge` | ✅ | [[Contrato - categories\|MergeInput]] | `merge` |
| `PATCH` | `/api/categories/:id` | ✅ | [[Contrato - categories\|UpdateCategoryInput]] | `update` |
| `DELETE` | `/api/categories/:id` | ✅ | — | `remove` |
| `GET` | `/api/categories/:id/archive-impact` | ✅ | — | `archiveImpact` |
| `POST` | `/api/categories/:id/archive` | ✅ | — | `archive` |
| `POST` | `/api/categories/:id/restore` | ✅ | [[Contrato - categories\|RestoreCategoryInput]] | `restore` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `CategoriesService` (454 líneas)

Archivo `application/services/categories.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `create` | Idempotent by `input.id`: `created` is `false` when the category already existed (ADR-11). |
| `update` |  |
| `reorder` | Reassigns `sortOrder` within the same kind and parent. |
| `archiveImpact` | What archiving the category affects (RF-M5-07). |
| `archive` | Archives the category and its subcategories; the history stays (RF-M5-06). Their active rules are paused with a notice to choose another category (RF-M5-07). |
| `restore` | Restores the category and the chosen subcategories, optionally renaming it (EC-M5-04). |
| `remove` | Deletes the category and its subcategories when none has movements or a budget or rule that uses it (RN-08, EC-M5-07); their shortcuts go with them. |
| `mergePreview` | What merging A into B would move (RF-M5-08). |
| `merge` | Moves the movements, rules, shortcuts and budget of A to B and deletes A (RF-M5-08, RF-M5-09); `budgetEffect` is the warning of what happened to the budget of A. |

**Repositorios que usa (vía UnitOfWork):** `categories`

## Pruebas

- Integración: `apps/api/test/integration/categories-archive.test.ts`
- Integración: `apps/api/test/integration/categories-budgets.test.ts`
- Integración: `apps/api/test/integration/categories-crud.test.ts`

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

