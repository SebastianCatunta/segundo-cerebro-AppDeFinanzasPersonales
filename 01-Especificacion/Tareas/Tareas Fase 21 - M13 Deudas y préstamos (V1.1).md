---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 21 - M13 Deudas y préstamos (V1.1)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M13"
fase: "21"
tareas: "11"
modulo: "M13"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 20 - M11 Presupuestos (V1.1)]] · → [[Tareas Fase 22 - Cierre de V1.1 Inicio, exportación y regresión]]

### Fase 21 — M13 Deudas y préstamos (V1.1)

- [x] **`TASK-208`: Contratos de M13**
  - **Dependencias:** Requiere TASK-077
  - **Trazabilidad SDD:** plan §4.13.1; RF-M13-01, RF-M13-03, RF-M13-10
  - **Archivos en Alcance:**
    - `packages/contracts/src/debts.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/debts.test.ts`
  - **Especificación de Implementación:** `CreateDebtInput`, `UpdateDebtInput`, `PaymentInput`, `DeleteDebtInput`, `DebtDto` y `DebtsSummaryDto`, como plan §4.13.1.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M13-01`: la persona va de 1 a 40 caracteres y el interés, de 0,01 a 100 con hasta 4 decimales.
    - `RF-M13-03`: `UpdateDebtInput` rechaza la tasa y el período.
    - `RF-M13-10`: `UpdateDebtInput` no acepta la dirección ni la moneda.

- [x] **`TASK-209`: Dominio `debts`: interés, desglose y validación de pagos**
  - **Dependencias:** Requiere TASK-026, TASK-027
  - **Trazabilidad SDD:** plan §4.13.1 (`packages/domain/debts`), ADR-14; RF-M13-02, RF-M13-05, RF-M13-06, EC-M13-01, EC-M13-02, RNF-18
  - **Archivos en Alcance:**
    - `packages/domain/src/debts.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/debts.test.ts`
  - **Especificación de Implementación:** `dailyRate(rate, period)` es la tasa ÷ 100 ÷ 30 (mensual) o ÷ 365 (anual). `accrue(capital, interestUnpaid, dailyRate, from, to)` acumula con 10 decimales y no acumula con capital 0. `proposeSplit(amount, interestAccrued, capital)` toma primero el interés. `validatePayment(...)`. `deriveStatus(debt, today)`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Desglose precargado" (`RF-M13-05`): con un interés de 42,30 y un pago de 500, propone 42,30 y 457,70.
    - `RF-M13-02`: Bs 2.000 al 2 % mensual durante 30 días acumulan 40,00.
    - `EC-M13-02`: con capital 0 no se acumula más interés.
    - `EC-M13-01` / `RF-M13-06`: un pago mayor que el saldo pendiente es inválido.
    - `RNF-18`: 365 acumulaciones diarias no acumulan error de redondeo.

- [x] **`TASK-210`: Repositorios de deudas y pagos**
  - **Dependencias:** Requiere TASK-099
  - **Trazabilidad SDD:** plan §3.6, plan §4.13.2 (vista por persona); RF-M13-13, EC-M13-06, RN-09
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/debt.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/debt-payment.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/factories/debt.factory.ts`
    - `apps/api/test/integration/debt-repositories.test.ts`
  - **Especificación de Implementación:** CRUD de deudas con `lockForUpdate`, `person_key = lower(unaccent(person))`, la lista de personas para el autocompletado y los pagos, con `last(debtId)` según el mayor `created_at`.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M13-06`: "José" y "jose" comparten `person_key`.
    - `last` devuelve el pago creado más recientemente.
    - `RN-09`: no se ven las deudas de otro usuario.

- [x] **`TASK-211`: `DebtsService`: crear, listar y resumen**
  - **Dependencias:** Requiere TASK-037, TASK-089, TASK-122, TASK-183, TASK-208, TASK-209, TASK-210
  - **Trazabilidad SDD:** plan §4.13.2 (`GET`, `POST`), plan §4.13.3; RF-M13-01, RF-M13-02, RF-M13-08, RF-M13-09, RF-M13-13, EC-M13-06, EC-M13-08, RNF-28
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/debts.service.ts`
    - `apps/api/src/application/shared/currency-usage.ts`
    - `apps/api/test/integration/debts-create.test.ts`
  - **Especificación de Implementación:** `create` es idempotente, con un tope de 200: `capital_outstanding = principal` y `accrued_through = start_date`. El movimiento inicial opcional va en la categoría del sistema (ingreso si "Debo", gasto si "Me deben"), con `origin = debt_initial`, la tasa declarada si la cuenta tiene otra moneda (precargada según RF-M3-07) y `BalanceGuard`. `list(view)` calcula el interés al día sin escribir. `summary` da "Debes X · Te deben Y" en la base con la referencia vigente, y la vista por persona agrupa por `person_key`. Registra en `CurrencyUsage` el uso por deudas activas o vencidas.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M13-08`: una deuda creada hoy con inicio el 1 de enero tiene interés desde el 1 de enero.
    - `RF-M13-08`: el movimiento inicial no cuenta como ingreso en el Inicio.
    - `RF-M13-09`: con la cuenta en otra moneda, se guarda la tasa declarada y el monto convertido sin residuo.
    - `EC-M13-06`: la misma persona en "Debo" y "Me deben" muestra el neto.
    - `RNF-28`: la deuda 201 da `LIMIT_REACHED`.

- [x] **`TASK-212`: Registrar pagos de deudas**
  - **Dependencias:** Requiere TASK-211
  - **Trazabilidad SDD:** plan §4.13.2 (`payments`), plan §4.13.3 (llevar el interés a hoy, pago); RF-M13-04, RF-M13-05, RF-M13-06, RF-M13-07, RF-M13-08, RF-M13-09, EC-M13-01, EC-M13-03, EC-M13-04, RNF-11
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/debts.service.ts`
    - `apps/api/test/integration/debts-payments.test.ts`
  - **Especificación de Implementación:** Con la deuda bajo `FOR UPDATE`: lleva el interés a hoy, valida el pago y su fecha (entre el inicio y hoy) y, si tiene cuenta, crea las transacciones vinculadas (capital en "Deudas y préstamos" e interés en "Intereses"; gastos si "Debo", ingresos si "Me deben") con `BalanceGuard`. Después resta del capital y del interés, y pasa la deuda a `paid` si los dos quedan en 0. Una deuda pagada o condonada da `DEBT_CLOSED`. Es idempotente por el `id` del pago.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Interés sobre el capital pendiente" (`RF-M13-04`): después de pagar 1.000 de capital, el interés corre sobre 1.000 y lo acumulado antes no cambia.
    - Escenario "Desglose precargado" (integración): 42,30 cuentan como gasto en "Intereses" (`RF-M13-08`).
    - `EC-M13-01`: un pago mayor que el saldo pendiente da `PAYMENT_EXCEEDS_BALANCE {pending}`.
    - `EC-M13-03`: un pago que deja el efectivo en negativo da `NEGATIVE_BALANCE`.
    - `EC-M13-04`: un pago desde una cuenta con apartados pide confirmación.
    - `RF-M13-07`: una fecha anterior al inicio da `SPLIT_INVALID`.
    - `RNF-11`: dos pagos con el mismo id registran uno.

- [x] **`TASK-213`: Eliminar el último pago**
  - **Dependencias:** Requiere TASK-212
  - **Trazabilidad SDD:** plan §4.13.2 (`DELETE payments/last`), plan §4.13.3 (eliminar el último pago); RF-M13-04, EC-M13-05, EC-M13-07
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/debts.service.ts`
    - `apps/api/test/integration/debts-delete-payment.test.ts`
  - **Especificación de Implementación:** Lleva el interés a hoy y después restablece el capital y el interés que cubría el pago. Borra sus transacciones vinculadas con `BalanceGuard`, borra el pago y, si la deuda estaba `paid`, vuelve a `active`. Una deuda condonada da `DEBT_FORGIVEN`.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M13-07`: eliminar el último pago de una deuda Pagada la devuelve a Activa (o Vencida), y el interés corre sobre el capital restablecido desde ese momento.
    - `RF-M13-04`: lo ya acumulado no se recalcula.
    - `EC-M13-05`: la operación siempre actúa sobre el último pago; con una deuda condonada, `DEBT_FORGIVEN`.

- [x] **`TASK-214`: Editar, condonar y eliminar deudas**
  - **Dependencias:** Requiere TASK-213
  - **Trazabilidad SDD:** plan §4.13.2 (`PATCH`, `forgive`, `DELETE`); RF-M13-10, RF-M13-11, RF-M13-12
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/debts.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/ledger.repository.ts`
    - `apps/api/test/integration/debts-lifecycle.test.ts`
  - **Especificación de Implementación:** En una deuda activa se editan la persona, la nota y la fecha límite (extenderla la saca de vencida), y el monto original si queda ≥ al capital pagado (`PRINCIPAL_BELOW_PAID`). En una pagada o condonada, solo la persona y la nota (`FIELD_LOCKED`). Condonar fija `forgiven_amount` con el saldo pendiente, sin movimientos. Eliminar, si hay movimientos, exige `movements`: `delete` los borra con `BalanceGuard` y `keep` los convierte en movimientos normales.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Condonar" (`RF-M13-12`): la deuda queda Condonada y no se crea ningún movimiento.
    - `RF-M13-11`: sin elegir, `MOVEMENTS_CHOICE_REQUIRED {count}`, con el movimiento inicial incluido en la cuenta.
    - `RF-M13-11`: `keep` deja los movimientos con `origin = manual`.
    - `RF-M13-10`: bajar el monto por debajo de lo pagado da `PRINCIPAL_BELOW_PAID`.

- [x] **`TASK-215`: Job `notifications.scheduled`: vencimientos de deudas**
  - **Dependencias:** Requiere TASK-064, TASK-176, TASK-211
  - **Trazabilidad SDD:** plan §4.13.3 (avisos de vencimiento), plan §4.15.3 (generación programada); RF-M13-14, RF-M15-09, RNF-12, RNF-20
  - **Archivos en Alcance:**
    - `apps/api/src/application/jobs/notifications.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/notifications-debts-job.test.ts`
  - **Especificación de Implementación:** Para los usuarios cuya hora local ya pasó las 08:00, crea los avisos de hoy de las deudas activas en ambas direcciones: tres días antes, el día del vencimiento y el día siguiente si quedó vencida, con la clave `debt:{id}:due:{dueDate}:{d-3|d0|d+1}`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Aviso de vencimiento de deuda": con un reloj en el 17/10 a las 08:00, llega "Vence en 3 días: debes Bs 1.200,00 a Juan".
    - `RF-M13-14`: después del día siguiente no hay más avisos.
    - `RNF-12`: correr el job dos veces deja un solo aviso.
    - `RF-M15-09`: a las 07:59 locales no se genera nada.

- [x] **`TASK-216`: Rutas HTTP de deudas**
  - **Dependencias:** Requiere TASK-214, TASK-215
  - **Trazabilidad SDD:** plan §4.13.2 (tabla de endpoints), ADR-18; RNF-14, RF-M2-03
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/debts.routes.ts`
    - `apps/api/src/presentation/controllers/debts.controller.ts`
    - `apps/api/src/presentation/presenters/debts.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/debts.test.ts`
    - `apps/api/test/http/debts.isolation.test.ts`
    - `apps/api/test/http/isolation-sweep.test.ts`
  - **Especificación de Implementación:** Monta los endpoints de plan §4.13.2 detrás de `releaseGate('m13')`.
  - **Criterios de Verificación (Tests & DoD):**
    - Cada endpoint responde con sus estados y errores.
    - `RNF-14`: el usuario B recibe 404 con una deuda de A.
    - `RF-M2-03`: con `RELEASE=1.0`, `RELEASE_NOT_AVAILABLE`.

- [x] **`TASK-217`: Web: lista y detalle de deudas**
  - **Dependencias:** Requiere TASK-179, TASK-216
  - **Trazabilidad SDD:** plan §4.13.4 (`/deudas`, `/deudas/:id`); RF-M13-06, RF-M13-11, RF-M13-12, RF-M13-13, EC-M13-05
  - **Archivos en Alcance:**
    - `apps/web/src/features/debts/api.ts`
    - `apps/web/src/features/debts/hooks/use-debts.ts`
    - `apps/web/src/features/debts/components/debts-summary.tsx`
    - `apps/web/src/features/debts/components/view-toggle.tsx`
    - `apps/web/src/features/debts/components/debt-list.tsx`
    - `apps/web/src/features/debts/components/debt-header.tsx`
    - `apps/web/src/features/debts/components/payments-list.tsx`
    - `apps/web/src/features/debts/components/delete-debt-dialog.tsx`
    - `apps/web/src/features/debts/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/debts.json`
    - `e2e/m13-debts.spec.ts`
  - **Especificación de Implementación:** Resumen "Debes X · Te deben Y", vista por deuda o por persona, y la lista con el saldo pendiente. Detalle con el capital, el interés acumulado y el pendiente por separado; los pagos, con "Eliminar último pago" solo en el último; Condonar y Eliminar con las dos opciones.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Condonar" (E2E): la deuda pasa a Condonada.
    - `EC-M13-05`: solo el último pago ofrece "Eliminar".
    - `RF-M13-11`: eliminar una deuda con movimientos ofrece las dos opciones con N.
    - `RF-M13-13`: la vista por persona muestra el neto.

- [x] **`TASK-218`: Web: formularios de deuda y de pago**
  - **Dependencias:** Requiere TASK-192, TASK-217
  - **Trazabilidad SDD:** plan §4.13.4 (formularios), plan §4.6.4 (vinculados); RF-M13-01, RF-M13-05, RF-M13-09, RF-M6-09, EC-M13-04
  - **Archivos en Alcance:**
    - `apps/web/src/features/debts/components/debt-form.tsx`
    - `apps/web/src/features/debts/components/payment-form.tsx`
    - `apps/web/src/features/debts/routes.tsx`
    - `apps/web/src/locales/es-BO/debts.json`
    - `e2e/m13-debt-forms.spec.ts`
  - **Especificación de Implementación:** `DebtForm` con el autocompletado de personas, el interés opcional y el movimiento inicial opcional (con la tasa si la cuenta es de otra moneda). `PaymentForm` con el desglose precargado y editable, la cuenta opcional, la tasa si hace falta y `EarmarkConfirmDialog` cuando corresponde. Las mutaciones invalidan `['transactions']`, `['accounts']` y `['dashboard']`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Desglose precargado" (E2E): se proponen 42,30 y 457,70.
    - Escenario "Vinculado solo se edita en su origen" (`RF-M6-09`): el movimiento de un pago a Juan de Bs 200,00, abierto desde la lista, no deja editar el monto, la cuenta ni la fecha, y ofrece "Ir a la deuda".
    - `RF-M13-09`: con una cuenta en $, se pide y se precarga el tipo de cambio.

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M13 - Deudas y préstamos]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M6 - Transacciones]]
- **Decisiones (ADR):** [[ADR-14 - Interés de deudas como foto]] · [[ADR-18 - Entregas con RELEASE]]
- **Requerimientos no funcionales:** [[Spec 3.10 Límites por usuario]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.6 Exactitud monetaria]] · [[Spec 3.7 Tiempo]]
- **Fases de tareas:** [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]] · [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]] · [[Tareas Fase 3 - Dominio transversal]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 3.6 Planificación (M11 a M14)]] · [[Plan 4.13 M13 - Deudas y préstamos (V1.1)]] · [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]] · [[Plan 4.6 M6 - Transacciones (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

