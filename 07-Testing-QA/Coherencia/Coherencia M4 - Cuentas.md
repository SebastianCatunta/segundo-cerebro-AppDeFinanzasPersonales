---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M4 - Cuentas"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M4"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M3 - Monedas y tipo de cambio]] · → [[Coherencia M5 - Categorías]]

### M4 — Cuentas

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M4-01 | El nombre DEBE tener de 1 a 40 caracteres y ser único entre las cuentas activas, sin distinguir mayúsculas. | coincide | `apps/api/test/integration/onboarding-step2.test.ts`, `packages/contracts/test/accounts.test.ts` (+3) |  |
| RF-M4-02 | El saldo inicial DEBE cumplir según el tipo: | coincide | `apps/api/test/integration/onboarding-step2.test.ts`, `packages/contracts/test/accounts.test.ts` (+3) |  |
| RF-M4-03 | El saldo DEBE calcularse según RN-01. Un movimiento con fecha anterior a la del saldo inicial se permite,… | coincide | `apps/api/test/integration/transactions-create.test.ts` |  |
| RF-M4-04 | En efectivo y billetera, el sistema DEBE rechazar toda acción que deje el saldo actual en negativo, y… | coincide | `apps/api/test/integration/balance-guard.test.ts`, `apps/api/test/integration/transactions-create.test.ts` |  |
| RF-M4-05 | Un ajuste NO cuenta como ingreso ni como gasto. Se puede editar y eliminar. Si la diferencia es 0, no se… | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `apps/api/test/integration/goals-crud.test.ts` (+1) |  |
| RF-M4-06 | La moneda de una cuenta solo DEBE poder cambiarse si no tiene movimientos. | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts` |  |
| RF-M4-07 | El saldo inicial y su fecha NO DEBEN editarse después de crear la cuenta: cualquier diferencia se corrige con… | coincide | `apps/api/test/integration/accounts-goals.test.ts`, `packages/contracts/test/accounts.test.ts` (+2) |  |
| RF-M4-08 | En una tarjeta: | coincide | `apps/api/test/http/dashboard-upcoming.test.ts`, `apps/api/test/integration/notifications-payments-job.test.ts` (+2) |  |
| RF-M4-09 | Una cuenta archivada NO DEBE aparecer en los selectores ni sumar en los saldos y totales actuales, y DEBE… | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `e2e/gherkin-accounts-categories.spec.ts` |  |
| RF-M4-10 | El total neto DEBE ser la suma de las cuentas activas (la deuda de tarjetas resta), en moneda base y su… | coincide | `apps/api/test/integration/accounts-goals.test.ts`, `packages/domain/test/net-worth.test.ts` (+2) |  |
| RF-M4-11 | Las cuentas DEBEN poder reordenarse. La lista agrupa por tipo y respeta ese orden. | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `e2e/gherkin-accounts-categories.spec.ts` |  |
| RF-M4-12 | Si se archiva la cuenta por defecto o la última usada en Registrar, Registrar DEBE pasar a la cuenta que… | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts` |  |
| RF-M4-13 | Al eliminar una cuenta sin movimientos, el sistema DEBE quitarla como cuenta por defecto y eliminar sus… | coincide | `apps/api/test/integration/recurring-cascades.test.ts`, `packages/contracts/test/errors.test.ts` (+1) |  |
| EC-M4-01 | Se elimina un ingreso del efectivo y el saldo quedaría en −50. Se rechaza: "El efectivo quedaría en Bs… | coincide | `apps/api/test/integration/balance-guard.test.ts`, `apps/api/test/integration/transactions-delete-undo.test.ts` |  |
| EC-M4-02 | El usuario quiere corregir el saldo inicial de una cuenta. No es editable; se ofrece "Ajustar saldo". | coincide | `packages/db/test/schema-account.test.ts` |  |
| EC-M4-03 | Un recurrente automático dejaría el efectivo en negativo. No se registra y pasa a pendiente (M14). | coincide | `apps/api/test/integration/recurring-generate-job.test.ts` |  |
| EC-M4-04 | Se restaura una cuenta cuyo nombre está en uso. Se pide un nombre nuevo antes de restaurarla. | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `e2e/gherkin-accounts-categories.spec.ts` |  |
| EC-M4-05 | La única cuenta activa se archiva. Registrar y el Inicio invitan a crear una cuenta. | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `e2e/gherkin-accounts-categories.spec.ts` |  |
| EC-M4-06 | Un banco queda con saldo negativo. Se permite (sobregiro). | coincide | `apps/api/test/integration/balance-guard.test.ts` |  |
| EC-M4-07 | Se restaura una cuenta cuya moneda está inactiva. Se pide reactivar la moneda primero. | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `e2e/gherkin-accounts-categories.spec.ts` |  |
| EC-M4-08 | Se ajusta el saldo al mismo valor que ya tiene. No se crea ningún ajuste y se informa "El saldo ya coincide". | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `e2e/gherkin-accounts-categories.spec.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

