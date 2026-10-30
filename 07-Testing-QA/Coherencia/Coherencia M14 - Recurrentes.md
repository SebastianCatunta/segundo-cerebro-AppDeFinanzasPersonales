---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M14 - Recurrentes"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M14"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M13 - Deudas y préstamos]] · → [[Coherencia M15 - Recordatorios y avisos]]

### M14 — Recurrentes

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M14-01 | Las frecuencias DEBEN ser diaria, semanal, mensual con día fijo y anual. Una regla semanal tiene un solo día… | coincide | `packages/contracts/test/recurring.test.ts`, `packages/domain/test/recurrence.test.ts` (+1) |  |
| RF-M14-02 | Si el día elegido no existe en un mes, la ocurrencia DEBE caer el último día del mes. El 29 de febrero pasa… | coincide | `packages/domain/test/dates.test.ts`, `packages/domain/test/recurrence.test.ts` |  |
| RF-M14-03 | La fecha de inicio DEBE ser hoy o futura. El sistema NUNCA genera ocurrencias con fecha anterior a la fecha… | coincide | `apps/api/test/integration/recurring-create.test.ts`, `packages/contracts/test/recurring.test.ts` (+1) |  |
| RF-M14-04 | Las ocurrencias DEBEN ejecutarse a las 00:00 en la zona horaria del usuario. Si ese día no existe la 00:00… | coincide | `apps/api/test/integration/recurring-generate-job.test.ts`, `apps/api/test/integration/timezones.test.ts` |  |
| RF-M14-05 | Una ocurrencia automática DEBE quedar como pendiente si dejaría una cuenta en negativo (M4) o si tocaría… | coincide | `apps/api/test/integration/recurring-generate-job.test.ts` |  |
| RF-M14-06 | En una transferencia recurrente entre monedas distintas, el modo automático DEBE usar la precarga de RF-M3-07… | coincide | `apps/api/test/integration/recurring-confirm.test.ts`, `apps/api/test/integration/recurring-generate-job.test.ts` |  |
| RF-M14-07 | Un pendiente sin decisión DEBE pasar a Omitido a los 30 días de generado, con un aviso. Esto vale también… | coincide | `apps/api/test/integration/recurring-expire-job.test.ts` |  |
| RF-M14-08 | Un pendiente se confirma con su fecha original o con otra, sin fechas futuras. Puede ser anterior al saldo… | coincide | `apps/api/test/integration/recurring-confirm.test.ts`, `e2e/m14-recurring.spec.ts` |  |
| RF-M14-09 | Al reanudar una regla, el sistema DEBE preguntar qué ocurrencias saltadas registrar. Se registran con su… | coincide | `apps/api/test/integration/recurring-resume.test.ts`, `packages/domain/test/recurrence.test.ts` (+1) |  |
| RF-M14-10 | Editar una regla DEBE afectar solo a las ocurrencias futuras. Los pendientes y los movimientos ya creados no… | coincide | `apps/api/test/integration/recurring-update-delete.test.ts` |  |
| RF-M14-11 | Eliminar una regla DEBE conservar los movimientos creados y borrar sus pendientes. | coincide | `apps/api/test/integration/recurring-update-delete.test.ts`, `packages/db/test/schema-integrity.test.ts` |  |
| RF-M14-12 | NUNCA DEBE existir más de una ocurrencia de la misma regla para la misma fecha. Si el sistema estuvo caído,… | coincide | `apps/api/test/integration/jobs-resume.test.ts`, `apps/api/test/integration/recurring-generate-job.test.ts` (+2) |  |
| RF-M14-13 | La pantalla DEBE mostrar: | coincide | `apps/api/test/integration/recurring-create.test.ts`, `packages/domain/test/recurrence.test.ts` (+1) |  |
| RF-M14-14 | El monto DEBE ser obligatorio en modo automático y opcional en modo confirmación. Una regla sin monto se… | coincide | `apps/api/test/integration/recurring-create.test.ts`, `packages/contracts/test/recurring.test.ts` (+3) |  |
| RF-M14-15 | Cada regla DEBE tener un nombre de 1 a 40 caracteres, que se usa en la etiqueta "De recurrente: X", en la… | coincide | `packages/contracts/test/recurring.test.ts`, `packages/db/test/schema-recurring-notifications.test.ts` |  |
| EC-M14-01 | Una regla mensual con el día 31 en noviembre. La ocurrencia cae el 30 de noviembre. | coincide | `packages/domain/test/recurrence.test.ts` |  |
| EC-M14-02 | Se archiva la cuenta de la regla. La regla se pausa con un aviso para elegir otra cuenta. | coincide | `apps/api/test/integration/recurring-cascades.test.ts` |  |
| EC-M14-03 | El sistema estuvo caído 2 días. Al volver, crea las ocurrencias de esos días una sola vez. | coincide | `apps/api/test/integration/recurring-generate-job.test.ts` |  |
| EC-M14-04 | Se elimina una regla con un pendiente. El pendiente desaparece. | coincide | `apps/api/test/integration/recurring-update-delete.test.ts` |  |
| EC-M14-05 | Se reanuda una regla de "12 veces" que generó 11 ocurrencias antes de la pausa, y el usuario quiere registrar… | coincide | `apps/api/test/integration/recurring-resume.test.ts`, `packages/domain/test/recurrence.test.ts` |  |
| EC-M14-06 | Se reanuda una regla cuya fecha de fin pasó durante la pausa. Queda Finalizada y solo ofrece registrar las… | coincide | `apps/api/test/integration/recurring-resume.test.ts`, `packages/domain/test/recurrence.test.ts` |  |
| EC-M14-07 | Se crea a las 15:00 una regla que empieza hoy. La ocurrencia de hoy se crea al guardar. | coincide | `apps/api/test/integration/recurring-create.test.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]]

