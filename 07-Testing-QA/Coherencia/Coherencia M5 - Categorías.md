---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M5 - Categorías"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M5"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M4 - Cuentas]] · → [[Coherencia M6 - Transacciones]]

### M5 — Categorías

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M5-01 | Gastos e ingresos DEBEN tener categorías separadas. El tipo de una categoría nunca cambia. | coincide | `apps/api/test/integration/categories-crud.test.ts`, `packages/contracts/test/categories.test.ts` (+1) |  |
| RF-M5-02 | El nombre DEBE tener de 1 a 30 caracteres y ser único dentro del mismo tipo y el mismo padre, sin distinguir… | coincide | `apps/api/test/integration/categories-crud.test.ts`, `packages/contracts/test/categories.test.ts` (+1) |  |
| RF-M5-03 | Un movimiento PUEDE asignarse a una categoría padre o a una subcategoría. El total de un padre incluye el de… | coincide | `apps/api/test/http/dashboard.test.ts`, `apps/api/test/integration/category-repository.test.ts` (+1) |  |
| RF-M5-04 | El ícono DEBE elegirse de una galería fija (unos 60) y el color de una paleta de 12 colores con contraste AA… | coincide | `apps/api/test/integration/categories-crud.test.ts`, `apps/api/test/integration/onboarding-step3.test.ts` (+3) |  |
| RF-M5-05 | La categoría del sistema "Deudas y préstamos" (gasto e ingreso) y su subcategoría "Intereses" DEBEN estar… | coincide | `apps/api/test/integration/categories-crud.test.ts`, `apps/api/test/integration/gherkin-accounts-categories.test.ts` (+6) |  |
| RF-M5-06 | Una categoría archivada NO DEBE ofrecerse al registrar y DEBE conservar su historia. | coincide | `apps/api/test/integration/categories-archive.test.ts` |  |
| RF-M5-07 | Antes de archivar una categoría en uso, el sistema DEBE listar lo afectado y aplicar: | coincide | `apps/api/test/integration/categories-archive.test.ts`, `apps/api/test/integration/categories-budgets.test.ts` (+1) |  |
| RF-M5-08 | La fusión de A en B DEBE cumplir: | coincide | `apps/api/test/integration/categories-budgets.test.ts`, `apps/api/test/integration/gherkin-accounts-categories.test.ts` (+1) |  |
| RF-M5-09 | Fusionar categorías o mover una subcategoría a otro padre DEBE cambiar el gasto por categoría de los meses… | coincide | `apps/api/test/http/dashboard.test.ts` |  |
| EC-M5-01 | Se crea "comida" existiendo "Comida" en gastos. Se rechaza por duplicado. | coincide | `apps/api/test/integration/categories-crud.test.ts`, `packages/db/test/schema-category.test.ts` |  |
| EC-M5-02 | Se intenta fusionar una categoría con subcategorías. Se pide fusionar o mover primero las subcategorías. | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `e2e/gherkin-accounts-categories.spec.ts` |  |
| EC-M5-03 | Se mueve una subcategoría con presupuesto a otro padre. El gasto del presupuesto del padre anterior deja de… | coincide | `apps/api/test/integration/categories-budgets.test.ts`, `apps/api/test/integration/categories-crud.test.ts` |  |
| EC-M5-04 | Al restaurar una categoría, su nombre ya está en uso en el mismo nivel. Se pide renombrarla. | coincide | `apps/api/test/integration/categories-archive.test.ts` |  |
| EC-M5-05 | Se convierte una subcategoría en principal y ya existe una principal con ese nombre. Se pide renombrarla… | coincide | `apps/api/test/integration/categories-crud.test.ts` |  |
| EC-M5-06 | Se restaura una subcategoría cuyo padre está archivado. Se pide restaurar el padre o elegir otro padre activo. | coincide | `apps/api/test/integration/categories-archive.test.ts` |  |
| EC-M5-07 | Se intenta eliminar una categoría sin movimientos que usa un presupuesto o una regla recurrente. Se rechaza y… | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]]

