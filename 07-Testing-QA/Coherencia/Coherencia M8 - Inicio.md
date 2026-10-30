---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M8 - Inicio"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M8"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M7 - Registrar]] · → [[Coherencia M9 - Ajustes y personalización]]

### M8 — Inicio

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M8-01 | El mes DEBE ser el mes calendario. El selector va desde el mes del primer movimiento o del primer saldo… | coincide | `apps/api/test/integration/dashboard-cards.test.ts`, `apps/api/test/integration/dashboard-cost.test.ts` (+2) |  |
| RF-M8-02 | Los ingresos y gastos DEBEN excluir los movimientos que indica RN-02 y convertirse con la tasa guardada en… | coincide | `apps/api/test/integration/dashboard-cards.test.ts` |  |
| RF-M8-03 | Balance = ingresos − gastos. Tasa de ahorro = balance ÷ ingresos, en porcentaje entero redondeado con la… | coincide | `apps/api/test/integration/dashboard-cards.test.ts`, `packages/contracts/test/dashboard.test.ts` (+2) |  |
| RF-M8-04 | Cada tarjeta DEBE mostrar su variación contra el mes anterior: | coincide | `apps/api/test/integration/dashboard-cards.test.ts`, `packages/domain/test/dashboard.test.ts` (+1) |  |
| RF-M8-05 | "Gasto por categoría" DEBE mostrar barras horizontales con las 5 categorías principales de mayor gasto… | coincide | `apps/api/test/http/dashboard.test.ts`, `e2e/m8-dashboard-blocks.spec.ts` |  |
| RF-M8-06 | "Ritmo del gasto" DEBE comparar el gasto acumulado día a día del mes elegido (hasta hoy, si es el actual)… | coincide | `apps/api/test/http/dashboard.test.ts`, `e2e/m8-dashboard-blocks.spec.ts` |  |
| RF-M8-07 | "Saldos por cuenta" DEBE mostrar el total neto en moneda base y en la otra moneda (glosario) y las 5 primeras… | coincide | `apps/api/test/http/dashboard.test.ts`, `e2e/m8-dashboard-blocks.spec.ts` |  |
| RF-M8-08 | "Presupuesto del mes" (V1.1) DEBE mostrar una barra por presupuesto activo, con su período visible. En un mes… | coincide | `apps/api/test/http/dashboard-budgets.test.ts`, `e2e/m8-dashboard-budgets.spec.ts` |  |
| RF-M8-09 | "Próximos pagos y deudas" (V1.1) DEBE listar los vencimientos de los próximos 7 días: deudas (en ambas… | coincide | `apps/api/test/http/dashboard-upcoming-recurring.test.ts`, `apps/api/test/http/dashboard-upcoming.test.ts` (+2) |  |
| RF-M8-10 | Cada bloque DEBE llevar a su módulo. Los bloques 3 a 8 se reordenan y ocultan en Ajustes. | coincide | `apps/api/test/http/dashboard-budgets.test.ts`, `apps/api/test/http/dashboard.test.ts` (+4) |  |
| RF-M8-11 | El Inicio DEBE reflejar todo cambio de datos al volver a él. | coincide | `e2e/m8-dashboard-cards.spec.ts` |  |
| EC-M8-01 | Usuario sin cuentas. El Inicio invita a crear la primera cuenta. | coincide | `e2e/m8-dashboard-cards.spec.ts` |  |
| EC-M8-02 | Mes sin movimientos. Las tarjetas muestran 0, la tasa de ahorro se oculta y los gráficos muestran su estado… | coincide | `apps/api/test/integration/dashboard-cards.test.ts`, `e2e/m8-dashboard-cards.spec.ts` |  |
| EC-M8-03 | Mes actual el día 31 contra un mes anterior de 30 días. Se compara con el mes anterior completo. | coincide | `packages/domain/test/dashboard.test.ts` |  |
| EC-M8-04 | No hay ninguna tasa. Los saldos en otra moneda no se convierten y se indica "Sin tipo de cambio". | coincide | `apps/api/test/http/dashboard.test.ts`, `e2e/m8-dashboard-blocks.spec.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

