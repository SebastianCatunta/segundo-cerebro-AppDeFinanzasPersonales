---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 23 - M14 Recurrentes (V1.2)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M14"
fase: "23"
tareas: "14"
modulo: "M14"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 22 - Cierre de V1.1 Inicio, exportación y regresión]] · → [[Tareas Fase 24 - M15 Recordatorios y avisos completos (V1.2)]]

### Fase 23 — M14 Recurrentes (V1.2)

- [x] **`TASK-223`: Contratos de M14**
  - **Dependencias:** Requiere TASK-118
  - **Trazabilidad SDD:** plan §4.14.1; RF-M14-01, RF-M14-03, RF-M14-14, RF-M14-15
  - **Archivos en Alcance:**
    - `packages/contracts/src/recurring.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/recurring.test.ts`
  - **Especificación de Implementación:** `CreateRuleInput` (frecuencia y fin como uniones discriminadas), `UpdateRuleInput`, `ConfirmOccurrenceInput`, `ResumeInput` y `RecurringOverviewDto`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M14-14`: una regla automática sin monto da `AMOUNT_REQUIRED_FOR_AUTO`; con confirmación, es válida.
    - `RF-M14-01`: una regla semanal exige un único `weekday`.
    - `RF-M14-15`: el nombre va de 1 a 40 caracteres.
    - El fin por cantidad va de 1 a 999.

- [x] **`TASK-224`: Dominio `recurrence`: fechas, saltadas y fin**
  - **Dependencias:** Requiere TASK-027
  - **Trazabilidad SDD:** plan §4.14.1 (`packages/domain/recurrence`); RF-M14-01, RF-M14-02, RF-M14-09, RF-M14-13, EC-M14-01, EC-M14-05, EC-M14-06
  - **Archivos en Alcance:**
    - `packages/domain/src/recurrence.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/recurrence.test.ts`
  - **Especificación de Implementación:** `nextDates(rule, fromDate, n)` (si el día no existe en el mes, cae el último día; el 29 de febrero pasa al 28; usa `addMonths` y `clampDay` de `dates.ts`, TASK-027), `skippedDates(rule, pausedAt, today)` (respeta el fin), `isFinished(rule, generatedCount, date)` y `installment(rule, generatedCount)` para "Cuota X de N".
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M14-01`: una regla mensual con el día 31 cae el 30 en noviembre.
    - `RF-M14-02`: una regla anual del 29/02 cae el 28/02 en 2027.
    - `EC-M14-05`: con 12 veces y 11 generadas, de 2 saltadas solo se puede registrar 1.
    - `EC-M14-06`: si el fin pasó durante la pausa, solo se devuelven las fechas hasta el fin.
    - `RF-M14-13`: `installment` da "Cuota 3 de 12".

- [x] **`TASK-225`: Repositorios de reglas y ocurrencias**
  - **Dependencias:** Requiere TASK-099
  - **Trazabilidad SDD:** plan §3.6 (`recurring_rule`, `recurring_occurrence`); RF-M14-12, RN-09
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/recurring-rule.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/recurring-occurrence.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/factories/recurring.factory.ts`
    - `apps/api/test/integration/recurring-repositories.test.ts`
  - **Especificación de Implementación:** CRUD de reglas con `lockForUpdate`. Ocurrencias: `insertIfAbsent(ruleId, date)` con `ON CONFLICT (rule_id, scheduled_date) DO NOTHING RETURNING`, `pending()`, `decideIf(id, expectedStatus, newStatus)` y `expiredPending(before)`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M14-12`: insertar dos veces la misma regla y fecha devuelve una sola fila.
    - `decideIf` solo cambia una ocurrencia que está en el estado esperado.
    - `RN-09`: no se ven las reglas de otro usuario.

- [x] **`TASK-226`: Generación de ocurrencias y job `recurring.generate`**
  - **Dependencias:** Requiere TASK-064, TASK-122, TASK-176, TASK-183, TASK-224, TASK-225
  - **Trazabilidad SDD:** plan §4.14.3 (job `recurring.generate`); RF-M14-04, RF-M14-05, RF-M14-06, RF-M14-12, RF-M6-10, EC-M4-03, EC-M12-05, EC-M14-03, RNF-13, RNF-20
  - **Archivos en Alcance:**
    - `apps/api/src/application/shared/recurring-generator.ts`
    - `apps/api/src/application/jobs/recurring.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/recurring-generate-job.test.ts`
  - **Especificación de Implementación:** `generateDue(tx, userId, rule, today)` genera todas las fechas faltantes desde `last_generated_date`. Para cada una: `insertIfAbsent`; en modo automático, crea la transacción (`origin = recurring`, `recurring_label`) con `BalanceGuard` en modo `automatic` (si queda bloqueada, la ocurrencia pasa a `pending` con aviso), y una transferencia entre monedas usa la precarga de RF-M3-07 de ese día; en modo confirmación, `pending` + aviso `recurring_pending:{occurrenceId}`. Incrementa `generated_count` y finaliza la regla al llegar a N o al pasar la fecha de fin. Las fechas se comparan como fechas locales, nunca como instantes.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Automático bloqueado pasa a pendiente" (`RF-M14-05`, `EC-M4-03`): un efectivo con 30 y una regla de 50 dejan un pendiente y ningún gasto.
    - `EC-M12-05`: una ocurrencia automática que tocaría un apartado queda pendiente.
    - `EC-M14-03`: tras 2 días caído, crea las ocurrencias de esos días una sola vez (`RF-M14-12`, `RNF-13`).
    - `RF-M14-04` / `RNF-20`: un cambio de zona horaria o de horario de verano no repite ni pierde fechas.
    - `RF-M6-10`: el movimiento lleva el nombre de la regla en `recurring_label`.

- [x] **`TASK-227`: `RecurringService`: crear y vista general**
  - **Dependencias:** Requiere TASK-037, TASK-089, TASK-223, TASK-226
  - **Trazabilidad SDD:** plan §4.14.2 (`GET`, `POST /api/recurring`); RF-M14-03, RF-M14-13, RF-M14-14, EC-M14-07, RNF-28
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/recurring.service.ts`
    - `apps/api/src/application/shared/currency-usage.ts`
    - `apps/api/test/integration/recurring-create.test.ts`
  - **Especificación de Implementación:** `create` es idempotente, con un tope de 100 y la fecha de inicio ≥ hoy (si no, `START_DATE_IN_PAST`). Si empieza hoy, genera la ocurrencia de hoy en la misma transacción. `overview` trae las reglas con su próxima fecha, las 3 siguientes y "Cuota X de N", los pendientes y los vencimientos de 30 días. Registra en `CurrencyUsage` el uso por reglas no eliminadas.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M14-07` / `RF-M14-03`: una regla creada a las 15:00 que empieza hoy crea la ocurrencia de hoy al guardar.
    - `RF-M14-03`: un inicio pasado da `START_DATE_IN_PAST`.
    - `RF-M14-13`: la vista general trae la próxima fecha, las 3 siguientes y la cuota.
    - `RF-M14-14`: una regla sin monto se muestra como "monto por definir".
    - `RNF-28`: la regla 101 da `LIMIT_REACHED`.

- [x] **`TASK-228`: Confirmar y omitir pendientes**
  - **Dependencias:** Requiere TASK-227
  - **Trazabilidad SDD:** plan §4.14.2 (`confirm`, `skip`); RF-M14-06, RF-M14-08, EC-M15-01, RNF-11
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/recurring.service.ts`
    - `apps/api/test/integration/recurring-confirm.test.ts`
  - **Especificación de Implementación:** `confirm`: `UPDATE … WHERE status = 'pending' RETURNING` (si no, `ALREADY_DECIDED`) y crea la transacción (`origin = recurring`, con la fecha original u otra ≤ hoy, que puede ser anterior al saldo inicial). Si la cuenta o la categoría están archivadas, exige elegir otra. Una regla sin monto exige `amount`. Pasa la ocurrencia a `registered` y resuelve el aviso. `skip` la pasa a `skipped` y resuelve el aviso.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M14-08`: confirmar con una fecha futura da `FUTURE_DATE`, y con la cuenta archivada sin otra cuenta, `ACCOUNT_ARCHIVED`.
    - `EC-M15-01`: confirmar desde Recurrentes deja el aviso resuelto.
    - `RNF-11`: dos confirmaciones simultáneas registran un solo movimiento.
    - `RF-M14-06`: al confirmar una transferencia entre monedas, se puede ajustar la tasa.

- [x] **`TASK-229`: Job `recurring.expirePending`**
  - **Dependencias:** Requiere TASK-228
  - **Trazabilidad SDD:** plan §4.14.3 (job `recurring.expirePending`); RF-M14-07, RNF-13
  - **Archivos en Alcance:**
    - `apps/api/src/application/jobs/recurring.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/recurring-expire-job.test.ts`
  - **Especificación de Implementación:** Un pendiente con `pending_since` de hace más de 30 días pasa a `omitted`, con el aviso `recurring_omitted:{occurrenceId}` (tipo `recurring_pending`) y el aviso original resuelto. Las ocurrencias siguientes se siguen generando aunque haya pendientes. El job recorre a los usuarios con pendientes vencidos (también los de reglas pausadas o terminadas), no solo a los que tienen reglas activas, y `container.ts` lo registra en `jobs.registerJob` con su `forUser`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Pendiente vence" (`RF-M14-07`): con un reloj 30 días después, el pendiente pasa a Omitido y se genera un aviso.
    - `RNF-13`: los pendientes recuperados tras una caída cuentan los 30 días desde `pending_since`.

- [x] **`TASK-230`: Pausar, ver las saltadas y reanudar reglas**
  - **Dependencias:** Requiere TASK-228
  - **Trazabilidad SDD:** plan §4.14.2 (`pause`, `skipped`, `resume`); RF-M14-09, EC-M14-05, EC-M14-06
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/recurring.service.ts`
    - `apps/api/test/integration/recurring-resume.test.ts`
  - **Especificación de Implementación:** `pause` (si no está activa, `INVALID_STATE`). `skipped` devuelve las fechas saltadas (respetando N y la fecha de fin). `resume({ registerDates })` registra en orden las fechas elegidas, con su fecha y la tasa de esa fecha; las que bloquearían un negativo o un apartado quedan como pendientes; una fecha que no estaba saltada da `DATE_NOT_SKIPPED`. Al llegar a N o si el fin ya pasó, la regla queda Finalizada.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Reanudar con ocurrencias saltadas": una regla semanal pausada 3 semanas devuelve 3 fechas saltadas.
    - `EC-M14-05`: de 2 elegidas, solo se registra 1 y la regla queda Finalizada.
    - `EC-M14-06`: si el fin pasó durante la pausa, queda Finalizada y solo ofrece las fechas hasta el fin.
    - `RF-M14-09`: una saltada que bloquearía el efectivo queda pendiente.

- [x] **`TASK-231`: Editar y eliminar reglas**
  - **Dependencias:** Requiere TASK-228
  - **Trazabilidad SDD:** plan §4.14.2 (`PATCH`, `DELETE`), plan §3.8 (regla eliminada); RF-M14-10, RF-M14-11, EC-M14-04
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/recurring.service.ts`
    - `apps/api/test/integration/recurring-update-delete.test.ts`
  - **Especificación de Implementación:** Editar afecta solo a las fechas futuras; extender el fin de una regla Finalizada la vuelve a Activa. Eliminar borra sus pendientes en cascada, resuelve sus avisos y conserva los movimientos con `recurring_label`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M14-10`: cambiar el monto no cambia los pendientes ni los movimientos ya creados.
    - `RF-M14-11` / `EC-M14-04`: al eliminar una regla con un pendiente, el pendiente desaparece y el movimiento conserva "De recurrente: X".
    - Extender el fin de una regla finalizada la reactiva.

- [x] **`TASK-232`: Recurrentes al archivar o eliminar cuentas y categorías**
  - **Dependencias:** Requiere TASK-104, TASK-112, TASK-227
  - **Trazabilidad SDD:** plan §4.4.2 (archivar: pausar reglas con aviso), plan §4.5.2 (archivar), plan §4.14.3 (activa ⇄ pausada), plan §4.15.1 (`recurring_pending`); EC-M14-02, RF-M4-13, RF-M5-07, RF-M15-02
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/accounts.service.ts`
    - `apps/api/src/application/services/categories.service.ts`
    - `apps/api/src/composition/container.ts`
    - `packages/contracts/src/errors.ts`
    - `apps/web/src/locales/es-BO/errors.json`
    - `apps/api/test/integration/recurring-cascades.test.ts`
    - `packages/contracts/test/errors.test.ts`
  - **Especificación de Implementación:** Archivar una cuenta o una categoría pausa sus reglas activas y emite un aviso (tipo `recurring_pending`, clave `rule:{id}:paused:{fecha}`) para elegir otra cuenta o categoría. Eliminar una cuenta que usa una regla recurrente se rechaza con `ACCOUNT_IN_USE 409 {recurring}` (código nuevo del catálogo, con su texto en `errors.json`), como `CATEGORY_IN_USE`.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M14-02`: archivar la cuenta de una regla la deja pausada, con un aviso.
    - Escenario "Archivar una categoría con presupuesto y recurrente" (parte de recurrentes, `RF-M5-07`): "Netflix" queda pausado con un aviso para elegir otra categoría.
    - `RF-M4-13`: eliminar una cuenta sin movimientos que usa una regla da `ACCOUNT_IN_USE {recurring}` y no borra nada.

- [x] **`TASK-233`: Rutas HTTP de recurrentes**
  - **Dependencias:** Requiere TASK-229, TASK-230, TASK-231, TASK-232
  - **Trazabilidad SDD:** plan §4.14.2 (tabla de endpoints), ADR-18; RNF-14, RF-M2-03
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/recurring.routes.ts`
    - `apps/api/src/presentation/controllers/recurring.controller.ts`
    - `apps/api/src/application/services/recurring.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/recurring-occurrence.repository.ts`
    - `apps/api/src/presentation/presenters/recurring.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/recurring.test.ts`
    - `apps/api/test/http/recurring.isolation.test.ts`
    - `apps/api/test/http/isolation-sweep.test.ts`
  - **Especificación de Implementación:** Monta los endpoints de plan §4.14.2 detrás de `releaseGate('m14')`.
  - **Criterios de Verificación (Tests & DoD):**
    - Cada endpoint responde con sus estados y errores.
    - `RNF-14`: el usuario B recibe 404 con una regla o una ocurrencia de A.
    - `RF-M2-03`: con `RELEASE=1.1`, `RELEASE_NOT_AVAILABLE`.

- [x] **`TASK-234`: Web: pantalla de Recurrentes**
  - **Dependencias:** Requiere TASK-192, TASK-233
  - **Trazabilidad SDD:** plan §4.14.4 (`/recurrentes`); RF-M14-08, RF-M14-13, RF-M14-14
  - **Archivos en Alcance:**
    - `apps/web/src/features/recurring/api.ts`
    - `apps/web/src/features/recurring/hooks/use-recurring.ts`
    - `apps/web/src/features/recurring/components/rules-list.tsx`
    - `apps/web/src/features/recurring/components/pending-list.tsx`
    - `apps/web/src/features/recurring/components/confirm-pending-dialog.tsx`
    - `apps/web/src/features/recurring/components/upcoming-30.tsx`
    - `apps/web/src/features/recurring/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/recurring.json`
    - `e2e/m14-recurring.spec.ts`
  - **Especificación de Implementación:** Las reglas con su próxima fecha, las 3 siguientes y "Cuota X de N"; "Pendientes de confirmar", con Confirmar (permite ajustar el monto, la fecha y la tasa, y elegir otra cuenta o categoría si estaba archivada) y Omitir; "Próximos vencimientos" de 30 días. Confirmar invalida `['transactions']`, `['accounts']` y `['dashboard']`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Automático bloqueado pasa a pendiente" (E2E): el pendiente se ve en "Pendientes de confirmar".
    - `RF-M14-08`: confirmar con otra fecha registra el movimiento en esa fecha.
    - `RF-M14-14`: una regla sin monto muestra "monto por definir" y pide el monto al confirmar.

- [x] **`TASK-235`: Web: formulario de regla y diálogo de reanudar**
  - **Dependencias:** Requiere TASK-234
  - **Trazabilidad SDD:** plan §4.14.4 (diálogos); RF-M14-01, RF-M14-03, RF-M14-09, RF-M14-14
  - **Archivos en Alcance:**
    - `apps/web/src/features/recurring/components/rule-form.tsx`
    - `apps/web/src/features/recurring/components/resume-dialog.tsx`
    - `apps/web/src/features/recurring/routes.tsx`
    - `apps/web/src/locales/es-BO/recurring.json`
    - `e2e/m14-rule-form.spec.ts`
  - **Especificación de Implementación:** `RuleForm` (con borrador): tipo, nombre, monto (opcional solo en confirmación), cuenta o par, categoría, nota, frecuencia, inicio (hoy o futuro), fin y modo. `ResumeDialog` muestra casillas para las fechas saltadas.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Reanudar con ocurrencias saltadas" (E2E): la app pregunta por las 3 ocurrencias saltadas.
    - `RF-M14-14`: en modo automático, el monto es obligatorio.
    - `RF-M14-03`: el calendario de inicio no permite fechas pasadas.

- [x] **`TASK-236`: Web y API: pendientes en la bandeja y recurrentes en el Inicio**
  - **Dependencias:** Requiere TASK-220, TASK-234
  - **Trazabilidad SDD:** plan §4.15.4 (botones de decisión inline), plan §4.8.1 (`upcoming`); RF-M8-09, RF-M15-03, EC-M15-01
  - **Archivos en Alcance:**
    - `apps/web/src/features/notifications/components/notification-item.tsx`
    - `apps/api/src/application/services/dashboard.service.ts`
    - `apps/api/src/infrastructure/persistence/repositories/dashboard.repository.ts`
    - `apps/api/test/http/dashboard-upcoming-recurring.test.ts`
    - `apps/web/src/features/dashboard/components/upcoming-block.tsx`
    - `e2e/m14-inbox-pending.spec.ts`
  - **Especificación de Implementación:** Un aviso de pendiente tiene los botones Confirmar y Omitir en la bandeja, que llaman a los mismos endpoints. "Próximos pagos y deudas" incluye los recurrentes de gasto y transferencia de los próximos 7 días con `RELEASE` = 1.2.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M8-09`: un recurrente que vence en 3 días aparece en el Inicio con `RELEASE=1.2`, y no con 1.1.
    - `EC-M15-01`: confirmar desde la bandeja deja el aviso Resuelto y el pendiente desaparece de Recurrentes.

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M8 - Inicio (dashboard)]]
- **Decisiones (ADR):** [[ADR-18 - Entregas con RELEASE]]
- **Requerimientos no funcionales:** [[Spec 3.10 Límites por usuario]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.7 Tiempo]]
- **Fases de tareas:** [[Tareas Fase 10 - M5 Categorías (V1.0)]] · [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]] · [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]] · [[Tareas Fase 3 - Dominio transversal]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 3.6 Planificación (M11 a M14)]] · [[Plan 3.8 Integridad y cascadas]] · [[Plan 4.14 M14 - Recurrentes (V1.2)]] · [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]] · [[Plan 4.4 M4 - Cuentas (V1.0)]] · [[Plan 4.5 M5 - Categorías (V1.0)]] · [[Plan 4.8 M8 - Inicio (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - RecurringOccurrence]] · [[Entidad - RecurringRule]]

