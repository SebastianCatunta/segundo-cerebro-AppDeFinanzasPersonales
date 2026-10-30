---
tipo: "frontend"
fuente: "apps/web/src/locales/es-BO"
tags:
  - "frontend/i18n"
actualizado: "2026-10-30"
---

# Web · i18n y locales

Todos los textos visibles viven en `apps/web/src/locales/es-BO/` (español de Bolivia) y se cargan con i18next por *namespace*: cada feature registra el suyo al cargarse. ESLint prohíbe textos literales en JSX (RNF-07). Los errores del API llegan como `code` (problem+json, [[ADR-09 - Errores problem+json]]) y se traducen con `errors.json`.

| Namespace | Claves de primer nivel | Feature |
|---|---|---|
| `accounts` | 16 | [[Web - accounts]] |
| `auth` | 6 | [[Web - auth]] |
| `budgets` | 17 | [[Web - budgets]] |
| `categories` | 24 | [[Web - categories]] |
| `common` | 1 | — |
| `dashboard` | 11 | [[Web - dashboard]] |
| `debts` | 16 | [[Web - debts]] |
| `errors` | 82 | — |
| `fx` | 9 | [[Web - fx]] |
| `goals` | 21 | [[Web - goals]] |
| `navigation` | 11 | — |
| `notifications` | 4 | [[Web - notifications]] |
| `onboarding` | 6 | [[Web - onboarding]] |
| `profile` | 5 | [[Web - profile]] |
| `recurring` | 11 | [[Web - recurring]] |
| `register` | 16 | [[Web - register]] |
| `settings` | 8 | [[Web - settings]] |
| `transactions` | 17 | [[Web - transactions]] |

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]]

