---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M11 - Presupuestos"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M11"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M10 - Onboarding]] · → [[Coherencia M12 - Metas de ahorro]]

### M11 — Presupuestos

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M11-01 | DEBE existir como máximo un presupuesto activo o pausado por categoría o subcategoría de gasto, más uno… | coincide | `apps/api/test/integration/budgets-create.test.ts`, `packages/db/test/schema-budgets.test.ts` (+1) |  |
| RF-M11-02 | Los presupuestos se anidan. Un gasto cuenta en el presupuesto de su subcategoría, en el de su padre y en el… | coincide | `apps/api/test/integration/budget-repositories.test.ts`, `apps/api/test/integration/budgets-create.test.ts` |  |
| RF-M11-03 | El gasto de un presupuesto DEBE sumar los gastos de su alcance dentro del período, excluyendo lo que indica… | coincide | `apps/api/test/integration/budget-repositories.test.ts` |  |
| RF-M11-04 | El período DEBE empezar el día elegido, que va de 1 a 28. | coincide | `packages/contracts/test/budgets.test.ts`, `packages/db/test/schema-budgets.test.ts` (+1) |  |
| RF-M11-05 | Disponible = monto del período + arrastre (positivo o negativo). Un período puede empezar ya superado: se… | coincide | `apps/api/test/integration/budgets-decision.test.ts`, `packages/domain/test/budget-math.test.ts` (+1) |  |
| RF-M11-06 | El monto, la acción por defecto y los umbrales DEBEN aplicarse al período actual al editarlos. Los períodos… | coincide | `apps/api/test/integration/budgets-lifecycle.test.ts` |  |
| RF-M11-07 | Un cambio del día de inicio DEBE aplicarse desde el próximo período: el período en curso se alarga hasta el… | coincide | `apps/api/test/integration/budgets-close-job.test.ts`, `apps/api/test/integration/budgets-lifecycle.test.ts` (+3) |  |
| RF-M11-08 | En el cierre, sobrante o exceso = disponible − gastado. El sobrante DEBE repartirse entre arrastrar, enviar a… | coincide | `apps/api/test/integration/budgets-decision.test.ts`, `packages/contracts/test/budgets.test.ts` (+2) |  |
| RF-M11-09 | "Enviar a meta" DEBE: | coincide | `apps/api/test/integration/budgets-decision.test.ts`, `e2e/m11-close-decision.spec.ts` |  |
| RF-M11-10 | Si en 7 días no hay decisión, el sistema DEBE aplicar la acción por defecto del presupuesto. Ante un exceso,… | coincide | `apps/api/test/integration/budgets-close-job.test.ts`, `apps/api/test/integration/budgets-default-job.test.ts` (+2) |  |
| RF-M11-11 | Los movimientos tardíos (cargados, editados o eliminados con fecha de un período ya cerrado, sin límite de… | coincide | `apps/api/test/integration/budget-ledger-hook.test.ts` |  |
| RF-M11-12 | "Reiniciar arrastre" DEBE poner el acumulado en 0, con una confirmación que muestra el monto. | coincide | `apps/api/test/integration/budgets-lifecycle.test.ts`, `e2e/m11-budgets.spec.ts` |  |
| RF-M11-13 | Los umbrales (de 0 a 3, entre 1 % y 150 %) DEBEN medirse sobre el monto del período, no sobre el disponible: | coincide | `apps/api/test/integration/budget-ledger-hook.test.ts`, `apps/api/test/integration/budgets-close-job.test.ts` (+4) |  |
| RF-M11-14 | Un presupuesto superado DEBE seguir contando gastos y mostrarse como superado. | coincide | `packages/domain/test/budget-math.test.ts`, `e2e/m11-budgets.spec.ts` |  |
| EC-M11-01 | El arrastre negativo supera el monto del período. El período empieza superado y la barra lo muestra. | coincide | `packages/domain/test/budget-math.test.ts`, `e2e/m11-budgets.spec.ts` |  |
| EC-M11-02 | En el cierre se envía a una meta más que el saldo libre de la cuenta elegida. Se rechaza y se pide otra… | coincide | `apps/api/test/integration/budgets-decision.test.ts` |  |
| EC-M11-03 | Se elimina o se archiva la meta elegida mientras el cierre está pendiente. Esa opción desaparece de la… | coincide | `apps/api/test/integration/budgets-decision.test.ts`, `e2e/m11-close-decision.spec.ts` |  |
| EC-M11-04 | Se archiva la categoría con una decisión de cierre pendiente. La decisión sigue disponible hasta los 7 días. | coincide | `apps/api/test/integration/categories-budgets.test.ts` |  |
| EC-M11-05 | Se elimina un gasto de un período cerrado cuya decisión incluyó arrastrar. El arrastre del período en curso… | coincide | `apps/api/test/integration/budget-ledger-hook.test.ts` |  |
| EC-M11-06 | Se intenta crear un segundo presupuesto para la misma categoría. Se rechaza y se ofrece editar el existente. | coincide | `apps/api/test/http/budgets.test.ts`, `apps/api/test/integration/budgets-create.test.ts` (+1) |  |
| EC-M11-07 | Se cambia el día de inicio de 1 a 15 durante el período del 1 al 31 de octubre. Ese período se alarga hasta… | coincide | `packages/domain/test/budget-periods.test.ts` |  |
| EC-M11-08 | Se reanuda a mitad de período un presupuesto pausado. El período que contiene hoy cuenta el gasto desde su… | coincide | `apps/api/test/integration/budgets-lifecycle.test.ts` |  |
| EC-M11-09 | Se archiva la categoría de un presupuesto. Al cerrar su último período, la decisión ofrece descartar o enviar… | coincide | `apps/api/test/integration/budgets-close-job.test.ts`, `apps/api/test/integration/budgets-decision.test.ts` (+1) |  |

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]]

