---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M12 - Metas de ahorro"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M12"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M11 - Presupuestos]] · → [[Coherencia M13 - Deudas y préstamos]]

### M12 — Metas de ahorro

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M12-01 | El nombre DEBE tener de 1 a 40 caracteres, el objetivo DEBE ser mayor que 0 y la fecha objetivo, si existe,… | coincide | `apps/api/test/integration/goal-milestones.test.ts`, `apps/api/test/integration/goals-crud.test.ts` (+3) |  |
| RF-M12-02 | El progreso DEBE ser el saldo de su cuenta dedicada (si tiene, con mínimo 0) más sus apartados en otras… | coincide | `apps/api/test/integration/goals-crud.test.ts`, `packages/domain/test/goals.test.ts` (+1) |  |
| RF-M12-03 | Una meta DEBE tener como máximo una cuenta dedicada, que no puede ser una tarjeta. Una cuenta dedicada… | coincide | `apps/api/test/integration/goals-earmarks.test.ts`, `packages/db/test/schema-goals-debts.test.ts` (+1) |  |
| RF-M12-04 | Una cuenta normal que no sea tarjeta PUEDE tener apartados de varias metas. Solo se aparta dentro del saldo… | coincide | `apps/api/test/integration/goal-repositories.test.ts`, `apps/api/test/integration/goals-earmarks.test.ts` |  |
| RF-M12-05 | El sistema DEBE pedir confirmación antes de guardar toda operación que deje el saldo de una cuenta por debajo… | coincide | `apps/api/test/integration/balance-guard-earmarks.test.ts`, `apps/api/test/integration/earmark-protection.test.ts` (+3) |  |
| RF-M12-06 | Aporte mensual sugerido = (objetivo − progreso) ÷ meses calendario restantes, incluido el actual. Además: | coincide | `apps/api/test/integration/goals-crud.test.ts`, `packages/domain/test/goals.test.ts` (+1) |  |
| RF-M12-07 | El detalle DEBE mostrar el progreso por cuenta, la historia de apartados y retiros con su origen (manual,… | coincide | `apps/api/test/integration/goal-repositories.test.ts`, `apps/api/test/integration/goals-crud.test.ts` (+1) |  |
| RF-M12-08 | El total neto de Cuentas NO DEBE cambiar por los apartados. El desglose suma la línea "Apartado para metas":… | coincide | `apps/api/test/integration/accounts-goals.test.ts`, `e2e/i18n-direct-load.spec.ts` |  |
| RF-M12-09 | "Usar y cerrar" DEBE liberar todos los apartados, convertir la cuenta dedicada en normal y archivar la meta… | coincide | `apps/api/test/integration/goals-lifecycle.test.ts`, `e2e/m12-goal-dialogs.spec.ts` |  |
| EC-M12-01 | Se intenta apartar más que el saldo libre. Se rechaza indicando el saldo libre. | coincide | `apps/api/test/http/goals.test.ts`, `apps/api/test/integration/goals-earmarks.test.ts` (+1) |  |
| EC-M12-02 | Se intenta archivar una cuenta con apartados. Se rechaza indicando qué metas debe liberar primero. | coincide | `apps/api/test/integration/accounts-goals.test.ts` |  |
| EC-M12-03 | Una meta en USD con apartados en BOB baja del 100 % porque el dólar subió. Pasa a En curso. | coincide | `packages/domain/test/goals.test.ts` |  |
| EC-M12-04 | La cuenta dedicada queda en negativo (un banco con sobregiro). Aporta 0 a la meta, nunca un valor negativo. | coincide | `packages/domain/test/goals.test.ts` |  |
| EC-M12-05 | Un recurrente automático tocaría dinero apartado. No se registra y pasa a pendiente (M14). | coincide | `apps/api/test/integration/recurring-generate-job.test.ts` |  |
| EC-M12-06 | Se dedica a una meta una cuenta que ya tiene apartados de otras metas. Se rechaza: primero hay que liberar… | coincide | `apps/api/test/http/goals.test.ts`, `apps/api/test/integration/goals-earmarks.test.ts` |  |
| EC-M12-07 | Se registra un ajuste negativo en un banco y su saldo quedaría por debajo de lo apartado. Se pide la… | coincide | `apps/api/test/integration/balance-guard-earmarks.test.ts`, `apps/api/test/integration/earmark-protection.test.ts` (+1) |  |
| EC-M12-08 | Se intenta dedicar una tarjeta a una meta. La opción no está disponible. | coincide | `apps/api/test/integration/goals-earmarks.test.ts`, `e2e/m12-goal-dialogs.spec.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]]

