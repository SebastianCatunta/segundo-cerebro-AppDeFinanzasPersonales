---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M13 - Deudas y préstamos"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M13"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M12 - Metas de ahorro]] · → [[Coherencia M14 - Recurrentes]]

### M13 — Deudas y préstamos

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M13-01 | La persona DEBE tener de 1 a 40 caracteres, con autocompletado sobre las personas ya usadas. El monto es… | coincide | `apps/api/test/integration/debts-create.test.ts`, `packages/contracts/test/debts.test.ts` (+2) |  |
| RF-M13-02 | El interés simple DEBE acumularse día a día sobre el capital pendiente, desde la fecha de inicio (aunque sea… | coincide | `apps/api/test/integration/debts-create.test.ts`, `packages/domain/test/debts.test.ts` |  |
| RF-M13-03 | La tasa y el período de interés DEBEN quedar fijos al crear la deuda. | coincide | `packages/contracts/test/debts.test.ts` |  |
| RF-M13-04 | El interés ya acumulado NUNCA DEBE recalcularse: ni por pagos con fecha pasada, ni por eliminar un pago, ni… | coincide | `apps/api/test/integration/debts-delete-payment.test.ts`, `apps/api/test/integration/debts-payments.test.ts` |  |
| RF-M13-05 | En cada pago, el desglose DEBE venir precargado (interés primero) y ser editable, cumpliendo: | coincide | `apps/api/test/integration/debts-payments.test.ts`, `packages/db/test/schema-goals-debts.test.ts` (+2) |  |
| RF-M13-06 | Saldo pendiente = capital pendiente + interés acumulado no pagado. Nunca es negativo, y un pago no puede… | coincide | `apps/api/test/integration/debts-payments.test.ts`, `packages/domain/test/debts.test.ts` (+1) |  |
| RF-M13-07 | La fecha de un pago DEBE estar entre la fecha de inicio y hoy. | coincide | `apps/api/test/integration/debts-payments.test.ts` |  |
| RF-M13-08 | La parte de interés de un pago DEBE contar como gasto ("Debo") o como ingreso ("Me deben"). La parte de… | coincide | `apps/api/test/integration/debts-create.test.ts`, `apps/api/test/integration/debts-payments.test.ts` |  |
| RF-M13-09 | Un pago, o el movimiento inicial, en una cuenta de otra moneda DEBE pedir el tipo de cambio usado, precargado… | coincide | `apps/api/test/integration/debts-create.test.ts`, `apps/api/test/integration/debts-payments.test.ts` (+1) |  |
| RF-M13-10 | La edición DEBE cumplir: | coincide | `apps/api/test/integration/debts-lifecycle.test.ts`, `packages/contracts/test/debts.test.ts` |  |
| RF-M13-11 | Al eliminar una deuda con movimientos asociados (el inicial o pagos), el usuario DEBE elegir entre "Eliminar… | coincide | `apps/api/test/integration/debts-lifecycle.test.ts`, `e2e/m13-debts.spec.ts` |  |
| RF-M13-12 | "Condonar saldo" DEBE cerrar la deuda en Condonada, mostrar el monto condonado y no crear movimientos. | coincide | `apps/api/test/integration/debts-lifecycle.test.ts`, `e2e/m13-debts.spec.ts` |  |
| RF-M13-13 | El resumen DEBE mostrar el total que se debe y el total que deben al usuario, en moneda base con la… | coincide | `apps/api/test/integration/debt-repositories.test.ts`, `apps/api/test/integration/debts-create.test.ts` (+1) |  |
| RF-M13-14 | Los avisos de vencimiento (desde la V1.1), en ambas direcciones, DEBEN llegar 3 días antes, el día del… | coincide | `apps/api/test/integration/notifications-debts-job.test.ts` |  |
| EC-M13-01 | Un pago supera el saldo pendiente. Se rechaza indicando el saldo. | coincide | `apps/api/test/integration/debts-payments.test.ts`, `packages/domain/test/debts.test.ts` |  |
| EC-M13-02 | El capital llega a 0 pero queda interés acumulado sin pagar. La deuda sigue Activa (o Vencida) hasta… | coincide | `packages/domain/test/debts.test.ts` |  |
| EC-M13-03 | El pago sale del efectivo y lo dejaría en negativo. Se rechaza (M4). | coincide | `apps/api/test/integration/debts-payments.test.ts` |  |
| EC-M13-04 | El pago sale de una cuenta con apartados. Se aplica la confirmación de M12. | coincide | `apps/api/test/integration/debts-payments.test.ts`, `e2e/m13-debt-forms.spec.ts` |  |
| EC-M13-05 | Se intenta eliminar un pago que no es el último. La acción no está disponible. | coincide | `apps/api/test/integration/debts-delete-payment.test.ts`, `e2e/m13-debts.spec.ts` |  |
| EC-M13-06 | La misma persona aparece en "Debo" y en "Me deben". La vista por persona muestra el neto. | coincide | `apps/api/test/integration/debt-repositories.test.ts`, `apps/api/test/integration/debts-create.test.ts` |  |
| EC-M13-07 | Se elimina el último pago de una deuda Pagada. Vuelve a Activa (o Vencida): el capital se restablece y el… | coincide | `apps/api/test/integration/debts-delete-payment.test.ts` |  |
| EC-M13-08 | Se crea hoy una deuda con interés y fecha de inicio el 1 de enero. El interés se acumula desde el 1 de enero. | coincide | `apps/api/test/integration/debts-create.test.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M4 - Cuentas]]

