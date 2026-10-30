---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M6 - Transacciones"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M6"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M5 - Categorías]] · → [[Coherencia M7 - Registrar]]

### M6 — Transacciones

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M6-01 | El monto DEBE estar entre 0,01 y 999.999.999,99, con 2 decimales como máximo. | coincide | `apps/api/test/integration/transactions-create.test.ts`, `packages/contracts/test/common.test.ts` (+2) |  |
| RF-M6-02 | La fecha DEBE ser hoy o anterior (RN-07), sin hora y sin fecha mínima. Dentro de un día, la lista ordena por… | coincide | `apps/api/test/integration/ledger-list.test.ts` |  |
| RF-M6-03 | La nota DEBE ser opcional y de hasta 140 caracteres. | coincide | `packages/contracts/test/common.test.ts`, `packages/contracts/test/transactions.test.ts` (+1) |  |
| RF-M6-04 | El origen y el destino de una transferencia DEBEN ser cuentas activas y distintas. | coincide | `apps/api/test/integration/transactions-transfer.test.ts`, `apps/api/test/integration/transactions-update.test.ts` (+1) |  |
| RF-M6-05 | La comisión de una transferencia DEBE crear un gasto vinculado en la cuenta de origen. Se edita desde la… | coincide | `apps/api/test/integration/transactions-transfer.test.ts`, `apps/api/test/integration/transactions-update.test.ts` (+2) |  |
| RF-M6-06 | El tipo de un movimiento NO DEBE cambiar. | coincide | `apps/api/test/integration/transactions-update.test.ts`, `packages/contracts/test/transactions.test.ts` |  |
| RF-M6-07 | La cuenta PUEDE cambiarse: | coincide | `apps/api/test/integration/transactions-update.test.ts`, `packages/contracts/test/transactions.test.ts` |  |
| RF-M6-08 | Toda edición, eliminación o deshacer DEBE respetar el bloqueo de negativos (M4), la protección de apartados… | coincide | `apps/api/test/integration/earmark-protection.test.ts`, `apps/api/test/integration/transactions-delete-undo.test.ts` (+1) |  |
| RF-M6-09 | En los movimientos vinculados (glosario), el monto, la cuenta y la fecha DEBEN editarse solo desde su origen,… | coincide | `apps/api/test/integration/transactions-delete-undo.test.ts`, `apps/api/test/integration/transactions-update.test.ts` (+1) |  |
| RF-M6-10 | Los movimientos creados por un recurrente DEBEN ser movimientos normales, editables y eliminables, con el… | coincide | `apps/api/test/integration/recurring-generate-job.test.ts`, `apps/api/test/integration/transactions-delete-undo.test.ts` |  |
| RF-M6-11 | Los pendientes NO DEBEN aparecer en la lista de movimientos ni contar en saldos o totales. | coincide | `apps/api/test/integration/ledger-list.test.ts` |  |
| RF-M6-12 | El neto diario y los totales de la lista DEBEN excluir los movimientos que indica RN-02. | coincide | `apps/api/test/integration/ledger-list.test.ts`, `apps/api/test/integration/transactions-transfer.test.ts` |  |
| RF-M6-13 | Las acciones en lote DEBEN omitir los movimientos que violarían el bloqueo de negativos o de apartados. Al… | coincide | `apps/api/test/integration/earmark-protection.test.ts` |  |
| RF-M6-14 | Un doble toque o un reintento NUNCA DEBE crear dos movimientos (RN-10). No existe aviso de posible duplicado. | coincide | `apps/api/test/integration/transactions-create.test.ts` |  |
| EC-M6-01 | El mismo movimiento se edita en dos dispositivos. Gana la última edición guardada. | coincide | `apps/api/test/integration/transactions-update.test.ts` |  |
| EC-M6-02 | Se guarda la edición de un movimiento eliminado en otro dispositivo. Se informa "Este movimiento ya no… | coincide | `apps/api/test/integration/transactions-update.test.ts` |  |
| EC-M6-03 | Se intenta deshacer una eliminación cuyo resultado violaría el bloqueo de negativos. Se rechaza con la… | coincide | `apps/api/test/integration/transactions-delete-undo.test.ts` |  |
| EC-M6-04 | Se cambia la fecha de un gasto en dólares. Conserva su tasa guardada; el usuario puede editarla a mano… | coincide | `apps/api/test/integration/transactions-update.test.ts` |  |
| EC-M6-05 | Se elimina una transferencia con comisión. Se eliminan ambas, con un único "Deshacer". | coincide | `apps/api/test/integration/transactions-delete-undo.test.ts` |  |
| EC-M6-06 | El usuario cambia de pantalla durante los 10 segundos de "Deshacer". La eliminación queda definitiva. | coincide | `e2e/gherkin-register.spec.ts` |  |
| EC-M6-07 | Se pasa un movimiento a una cuenta de otra moneda y el monto convertido superaría 999.999.999,99. Se rechaza… | coincide | `apps/api/test/integration/transactions-update.test.ts`, `packages/contracts/test/transactions.test.ts` |  |
| EC-M6-08 | Se carga una comisión y "Comisiones bancarias" fue eliminada en el Onboarding. Se pide elegir otra categoría… | coincide | `apps/api/test/integration/transactions-transfer.test.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

