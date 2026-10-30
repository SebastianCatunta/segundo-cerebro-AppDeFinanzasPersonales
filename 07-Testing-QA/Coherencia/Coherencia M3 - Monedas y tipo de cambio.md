---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M3 - Monedas y tipo de cambio"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M3"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M2 - Navegación y estructura]] · → [[Coherencia M4 - Cuentas]]

### M3 — Monedas y tipo de cambio

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M3-01 | BOB y USD DEBEN estar siempre activas. Toda moneda usa 2 decimales, y las tasas de cambio también se guardan… | coincide | `apps/api/test/http/currencies-deactivate.test.ts`, `apps/api/test/http/currencies.test.ts` (+2) |  |
| RF-M3-02 | El código de una moneda DEBE tener 3 letras y ser único para el usuario. Las monedas agregadas DEBEN tener… | coincide | `apps/api/test/http/currencies.test.ts`, `packages/contracts/test/common.test.ts` (+2) |  |
| RF-M3-03 | La referencia por defecto DEBE ser la mediana del paralelo, tal como la publica paralelo.bo. El valor manual… | coincide | `apps/api/test/http/fx-settings.test.ts`, `apps/api/test/integration/rates-service.test.ts` (+2) |  |
| RF-M3-04 | El sistema DEBE actualizar las tasas automáticas: | coincide | `apps/api/test/http/rates.test.ts`, `apps/api/test/integration/fx-jobs.test.ts` (+1) |  |
| RF-M3-05 | El sistema DEBE mostrar junto a toda tasa "actualizado hace X" y su fuente. NO muestra avisos de… | coincide | `apps/api/test/http/rates.test.ts`, `apps/api/test/integration/rates-service.test.ts` (+1) |  |
| RF-M3-06 | Todo movimiento, esté o no en la moneda base, DEBE guardar al guardarse la tasa de su moneda frente al… | coincide | `apps/api/test/integration/rates-service.test.ts`, `apps/api/test/integration/transactions-create.test.ts` (+1) |  |
| RF-M3-07 | En una transferencia entre monedas distintas, el sistema DEBE precargar el campo "Tipo de cambio usado": | coincide | `apps/api/test/integration/recurring-generate-job.test.ts`, `apps/api/test/integration/transactions-transfer.test.ts` (+1) |  |
| RF-M3-08 | En esa transferencia, el sistema DEBE calcular el monto que llega a partir del monto que sale y la tasa. Si… | coincide | `apps/api/test/integration/transactions-transfer.test.ts`, `packages/domain/test/fx-convert.test.ts` |  |
| RF-M3-09 | La tasa declarada en una transferencia DEBE ser la tasa histórica de ese movimiento. | coincide | `apps/api/test/integration/transactions-transfer.test.ts` |  |
| RF-M3-10 | Al editar un movimiento, la tasa guardada DEBE conservarse siempre, aunque cambien su fecha o su cuenta. Solo… | coincide | `apps/api/test/integration/transactions-update.test.ts` |  |
| RF-M3-11 | Cambiar la referencia o la moneda base DEBE recalcular los saldos y totales actuales sin modificar los… | coincide | `apps/api/test/http/fx-settings.test.ts`, `apps/api/test/integration/gherkin-accounts-categories.test.ts` (+1) |  |
| RF-M3-12 | La brecha DEBE calcularse como (paralelo − oficial) ÷ oficial, en % y en Bs, comparando con el oficial (TCO)… | coincide | `apps/api/test/integration/rates-service.test.ts`, `packages/contracts/test/fx.test.ts` (+1) |  |
| RF-M3-13 | El sistema DEBE guardar un historial diario de tasas por moneda: las referencias automáticas del dólar, el… | coincide | `apps/api/test/http/currencies.test.ts`, `apps/api/test/http/fx-settings.test.ts` (+4) |  |
| EC-M3-01 | La fuente no responde. Se usa el último valor guardado y la app sigue funcionando. | coincide | `apps/api/test/integration/fx-jobs.test.ts` |  |
| EC-M3-02 | La fuente no responde y no hay ningún valor guardado (usuario nuevo). | coincide | `apps/api/test/integration/rates-service.test.ts`, `apps/api/test/integration/transactions-create.test.ts` (+1) |  |
| EC-M3-03 | Se registra un movimiento con fecha de un día sin registro de tasas. Se usa la del día anterior más cercano… | coincide | `packages/domain/test/fx-resolve.test.ts` |  |
| EC-M3-04 | La fuente devuelve un valor inválido (cero, negativo o vacío). Se descarta y se conserva el último valor… | coincide | `apps/api/test/integration/fx-jobs.test.ts`, `apps/api/test/unit/bcb.test.ts` (+1) |  |
| EC-M3-05 | El usuario intenta desactivar una moneda en uso. Se rechaza y se indica qué la usa (cuentas, metas,… | coincide | `apps/api/test/http/currencies-deactivate.test.ts`, `apps/api/test/integration/budgets-create.test.ts` (+2) |  |
| EC-M3-07 | Se agrega una moneda con una tasa menor a Bs 0,01 (por ejemplo, el peso argentino o el chileno). Se rechaza… | coincide | `apps/api/test/http/currencies.test.ts` |  |
| EC-M3-06 | Con el valor manual activo, se transfiere de una cuenta en Bs a una en $. Se precarga el valor manual, no el… | coincide | `packages/domain/test/fx-convert.test.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]]

