---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 5.4 Definición de terminado de cada módulo"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 5. Matriz de Verificación y Estrategia de Testing]] · ← [[Plan 5.3 Requerimientos no funcionales → verificación]] · → [[Plan 5.5 Matriz de trazabilidad (spec → plan)]]

### 5.4 Definición de terminado de cada módulo
1. Todos los RF y EC del módulo tienen su test unitario o de integración, con el id en el nombre del test (`it('RF-M4-04 …')`).
2. Hay un test de aislamiento por endpoint.
3. Los escenarios Gherkin del módulo están automatizados en Playwright.
4. lint, typecheck, reglas de capas (dependency-cruiser) y todos los tests en verde en CI, y `qa-e2e` en verde antes de llegar a `main`.
5. Los textos están en `locales/es-BO` y no hay violaciones de axe.

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]]

