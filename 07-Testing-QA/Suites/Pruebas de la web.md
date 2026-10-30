---
tipo: "testing"
fuente: "apps/web/test"
tags:
  - "testing/web"
actualizado: "2026-10-30"
---

# Pruebas unitarias de la web

Carpeta `apps/web/test/` (Vitest): cliente HTTP, borradores, formateadores, errores i18n, sesión, precarga de pestañas, presupuesto de tamaño del bundle y assets de marca.

| Archivo | Primer describe | Casos | Módulo |
|---|---|---|---|
| `api-client.test.ts` | call: request | 15 | — |
| `brand-assets.test.ts` | TASK-269 archivos de la marca | 4 | — |
| `bundle-budget.test.ts` | TASK-248 bundle budget | 13 | — |
| `confirmation-watch.test.ts` | useConfirmationWatch | 15 | — |
| `drafts.test.ts` | drafts save/load | 17 | — |
| `formatters.test.ts` | buildFormatters money | 16 | — |
| `i18n-errors.test.ts` | errors.json (es-BO) | 8 | — |
| `last-session-hint.test.ts` | TASK-258 pista de la última sesión | 18 | — |
| `online.test.ts` | online: normal → sin conexión | 20 | — |
| `prefetch-routes.test.ts` | TASK-259 las fábricas de consulta de cada lista | 16 | — |
| `route-parents.test.ts` | parentOf: pantallas que cuelgan de otra | 0 | — |
| `search-params.test.ts` | parseSearch y serializeSearch | 9 | — |
| `ui-store.test.ts` | ui-store tabMemory | 11 | — |

---
## 🔗 Relacionado

- **Fases de tareas:** [[Tareas Fase 17 - Cierre de V1.0 rendimiento, accesibilidad y despliegue]] · [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]

