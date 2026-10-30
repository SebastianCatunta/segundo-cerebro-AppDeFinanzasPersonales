---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 11 - M6 Transacciones (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M6"
fase: "11"
tareas: "18"
modulo: "M6"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 10 - M5 Categorías (V1.0)]] · → [[Tareas Fase 12 - M7 Registrar (V1.0)]]

### Fase 11 — M6 Transacciones (V1.0)

- [x] **`TASK-118`: Contratos de M6**
  - **Dependencias:** Requiere TASK-077
  - **Trazabilidad SDD:** plan §4.6.1; RF-M6-01, RF-M6-03, RF-M6-04, RF-M6-06
  - **Archivos en Alcance:**
    - `packages/contracts/src/transactions.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/transactions.test.ts`
  - **Especificación de Implementación:** `CreateTransactionInput` (unión discriminada por tipo, con `earmarkWithdrawals` y `manualUsdRate` opcionales), `UpdateTransactionInput`, `ListQuery`, `BatchDeleteInput`, `BatchRecategorizeInput`, `UndoInput` y `TransactionDto`, como plan §4.6.1.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M6-04`: una transferencia con el mismo origen y destino es inválida.
    - `RF-M6-06`: `UpdateTransactionInput` rechaza `kind`.
    - `RF-M6-01` / `RF-M6-03`: los límites de monto y nota.
    - `ListQuery.limit` va de 1 a 100.

- [x] **`TASK-119`: Repositorio del libro contable: lista, búsqueda, totales y detalle**
  - **Dependencias:** Requiere TASK-099, TASK-110
  - **Trazabilidad SDD:** plan §4.6.2 (`GET /api/transactions`, `summary`, `:id`); RF-M6-02, RF-M6-11, RF-M6-12, RN-02, RN-05, RF-M5-03
  - **Archivos en Alcance:**
    - `apps/api/src/infrastructure/persistence/repositories/ledger.repository.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/test/integration/ledger-list.test.ts`
  - **Especificación de Implementación:** `list(filters, cursor)` pagina por `(date, created_at, id)` de forma descendente. `q` busca por nota (`unaccent(lower())`) o, si es un monto, por monto exacto en la moneda original. `categoryId` incluye las hijas. Devuelve `dayNets` de la página. `summary(filters, base)` devuelve ingresos, gastos y neto en la base, con las tasas guardadas y sin lo que excluye RN-02. `get(id)` trae la comisión y el origen.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M6-02`: dentro de un día, ordena del más reciente al más antiguo.
    - `RN-02` / `RF-M6-12`: `summary` y `dayNets` excluyen transferencias, ajustes y "Deudas y préstamos" salvo "Intereses".
    - "35" encuentra 35,00 pero no 135; "cafe" encuentra "Café".
    - `RF-M5-03`: filtrar por un padre incluye sus hijas.

- [x] **`TASK-120`: `LedgerHooks` y registro de deshacer**
  - **Dependencias:** Requiere TASK-099
  - **Trazabilidad SDD:** plan §4.0 (`LedgerHooks.afterChange`), ADR-07, plan §3.5 (`undo_action`)
  - **Archivos en Alcance:**
    - `apps/api/src/application/shared/ledger-hooks.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/undo-action.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/ledger-hooks-undo.test.ts`
  - **Especificación de Implementación:** `LedgerHooks.register(handler)` y `afterChange(tx, userId, { dates, categoryIds, accountIds })`, que llama a cada *handler* en la misma transacción (V1.0 no tiene *handlers*). El repositorio `undo_action` ofrece `create(kind, payload)` (vence a los 12 s) y `consume(id)` con un `UPDATE … WHERE consumed_at IS NULL AND expires_at > now() RETURNING`.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-120`: un *handler* registrado recibe el cambio; si lanza un error, la transacción se revierte.
    - `consume` solo funciona una vez y dentro de los 12 s.

- [x] **`TASK-121`: `TransactionsService.create`: gastos e ingresos**
  - **Dependencias:** Requiere TASK-085, TASK-100, TASK-118, TASK-120
  - **Trazabilidad SDD:** plan §4.6.2 (`POST /api/transactions`), plan §4.3.3 (sin ninguna tasa), ADR-11; RF-M6-01, RF-M6-14, RF-M3-06, RN-03, RN-04, RN-07, RN-12, EC-M3-02, RF-M4-03, RF-M4-04
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/transactions.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user-settings.repository.ts`
    - `apps/api/test/factories/transaction.factory.ts`
    - `apps/api/test/integration/transactions-create.test.ts`
  - **Especificación de Implementación:** Valida la cuenta activa (`ACCOUNT_ARCHIVED`), la categoría activa y del mismo tipo (`CATEGORY_ARCHIVED`, `CATEGORY_KIND_MISMATCH`) y la fecha ≤ hoy en la zona del usuario (`FUTURE_DATE`). Toma las tasas con `RatesService.ratesForMovement`: si la cuenta no es BOB y no hay tasa, `RATE_REQUIRED`; con `manualUsdRate`, activa el valor manual en la misma transacción. Crea la transacción y su asiento (la moneda es la de la cuenta) con `BalanceGuard`, `LedgerHooks.afterChange` y un `undo_action(create)`. Es idempotente según ADR-11.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M6-14` (escenario "Doble toque no duplica"): dos POST con el mismo id dejan 1 fila; la primera respuesta es 201 y la segunda, 200.
    - Escenario "Sin ninguna tasa disponible" (`EC-M3-02`): da `RATE_REQUIRED`; al reenviar con `manualUsdRate`, esa tasa queda en el gasto y el valor manual queda activo.
    - Escenario "Movimiento anterior al saldo inicial no altera el saldo" (`RF-M4-03`, `RN-12`).
    - Escenario "Bloqueo de negativo en efectivo" (`RF-M4-04`): 35 sobre 30 da `NEGATIVE_BALANCE` y no se guarda nada.
    - `RN-07`: la fecha de mañana en la zona del usuario da `FUTURE_DATE`.
    - `RF-M3-06`: un gasto en BOB guarda `rate_usd_bob`.

- [x] **`TASK-122`: `TransactionsService.create`: transferencias y comisión**
  - **Dependencias:** Requiere TASK-121
  - **Trazabilidad SDD:** plan §4.6.2, plan §4.6.1 (convención de la tasa declarada), plan §4.6.3 (comisión); RF-M6-04, RF-M6-05, RF-M3-07, RF-M3-08, RF-M3-09, EC-M6-08, RN-02
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/transactions.service.ts`
    - `apps/api/src/application/services/rates.service.ts`
    - `packages/domain/src/index.ts`
    - `apps/api/test/integration/transactions-transfer.test.ts`
  - **Especificación de Implementación:** El origen y el destino deben ser cuentas activas y distintas. Entre monedas distintas: si no llega `declaredRate`, se usa la precarga de RF-M3-07; `amountIn` se calcula, o, si llega, manda y la tasa se recalcula. La comisión es una `ledger_transaction(kind = expense, origin = fee)` en "Servicios › Comisiones bancarias"; si esa categoría no existe o está archivada y no llega `fee.categoryId`, da `FEE_CATEGORY_REQUIRED`. El monto y la comisión pasan juntos por `BalanceGuard`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Transferencia con comisión": el Banco baja 505, el Efectivo sube 500, se crea un gasto de 5 en "Comisiones bancarias" y la transferencia no cuenta como ingreso ni gasto.
    - Escenario "Pago de tarjeta no es gasto": la tarjeta queda en "Debes Bs 0,00" y los gastos del mes no cambian.
    - `RF-M3-09`: la tasa declarada queda como tasa histórica (`rate_usd_bob`) en BOB↔USD.
    - `EC-M6-08`: sin "Comisiones bancarias" da `FEE_CATEGORY_REQUIRED`.
    - `RF-M6-05`: la comisión puede ser mayor que el monto.

- [x] **`TASK-123`: `TransactionsService.update`: editar movimientos**
  - **Dependencias:** Requiere TASK-122
  - **Trazabilidad SDD:** plan §4.6.1 (`UpdateTransactionInput`), plan §4.6.2 (`PATCH /api/transactions/:id`); RF-M6-04, RF-M6-05, RF-M6-06, RF-M6-07, RF-M6-08, RF-M6-09, RF-M3-10, EC-M6-01, EC-M6-02, EC-M6-04, EC-M6-07, RNF-08, RNF-09, RNF-24
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/transactions.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/ledger.repository.ts`
    - `packages/contracts/src/transactions.ts`
    - `apps/api/test/integration/transactions-update.test.ts`
    - `packages/contracts/test/transactions.test.ts`
  - **Especificación de Implementación:** `LedgerRepository` gana `updateTransaction`, que reescribe en su lugar la cabecera y los asientos de un movimiento del usuario que no esté eliminado (sin copias ni historial) y devuelve `false` si no hubo coincidencia. `UpdateTransactionInput` suma `fromAccountId` y `toAccountId` (plan §4.6.1): en una transferencia, cada uno cambia a una cuenta activa de la misma moneda que la que reemplaza y distinta de la otra (`VALIDATION_ERROR` con `SAME_ACCOUNT` o `CURRENCY_MISMATCH`, `ACCOUNT_ARCHIVED`); `accountId` en una transferencia, o `fromAccountId`/`toAccountId` en otro tipo, da `VALIDATION_ERROR`. La comisión acompaña la fecha y el origen, y su monto no se edita (RF-M6-05). Gana la última edición. La tasa guardada se conserva aunque cambien la fecha o la cuenta, y solo cambia si llega `rateUsdBob` o `rateCurBob`. Pasar a una cuenta de otra moneda exige `amountInNewCurrency` y no puede superar el máximo (`AMOUNT_OUT_OF_RANGE`). En los vinculados (`origin` ≠ `manual`/`recurring`), el monto, la cuenta y la fecha están bloqueados (`LINKED_FIELD_LOCKED {originType, originId}`). Recalcula los asientos con `BalanceGuard` y los *hooks*. No guarda historial de ediciones.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M6-04` / `RF-M3-10`: cambiar la fecha de un gasto en $ conserva su tasa.
    - `EC-M6-02` / `RNF-09`: editar un movimiento eliminado da `NOT_FOUND`.
    - `EC-M6-07`: una conversión mayor que 999.999.999,99 da `AMOUNT_OUT_OF_RANGE`.
    - `RF-M6-09`: editar el monto de un vinculado da `LINKED_FIELD_LOCKED`; su nota sí se puede editar.
    - `RF-M6-08`: bajar un ingreso que deja el efectivo en negativo da `NEGATIVE_BALANCE`.
    - `EC-M6-01` / `RNF-08`: con dos PATCH seguidos gana el último.
    - `RNF-24`: no existe ninguna tabla ni columna de historial de ediciones.
    - `RF-M6-07` / `RF-M6-04`: cambiar el origen o el destino de una transferencia a otra cuenta de la misma moneda mueve el asiento (y la comisión, si cambia el origen); a otra moneda o a la otra cuenta de la transferencia da `VALIDATION_ERROR`.
    - `RF-M6-05`: cambiar la fecha de una transferencia cambia la de su comisión, y su monto se conserva.

- [x] **`TASK-124`: Eliminar y deshacer movimientos**
  - **Dependencias:** Requiere TASK-123
  - **Trazabilidad SDD:** plan §4.6.2 (`DELETE`, `undo`), plan §4.6.3; RF-M6-08, RF-M7-07, EC-M6-03, EC-M6-05, EC-M4-01
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/transactions.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/ledger.repository.ts`
    - `apps/api/test/integration/transactions-delete-undo.test.ts`
  - **Especificación de Implementación:** `LedgerRepository` gana `softDelete(ids)` y `restore(ids)`, que ponen o quitan `deleted_at` en los movimientos del usuario que estén en el estado contrario y devuelven los ids que cambiaron, y una forma de leer con `get` un movimiento eliminado, para el `undo`. `delete` pone `deleted_at` en la transacción y su comisión, pasa por `BalanceGuard` y los *hooks* y crea un `undo_action(delete)`. Un vinculado de deuda o de meta da `LINKED_DELETE_FORBIDDEN`. `undo(token)` consume el token y revierte según el tipo: `delete` → restaura; `create` → elimina; `recategorize` → restaura las categorías. Pasa por `BalanceGuard`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Eliminar y deshacer": el saldo sube 35 al eliminar y el `undo` antes de 10 s lo restaura.
    - Un `undo` a los 13 s da `UNDO_EXPIRED`.
    - `EC-M6-05`: eliminar una transferencia elimina también su comisión, y un solo `undo` restaura las dos.
    - `EC-M6-03`: un `undo` que dejaría el efectivo en negativo da `NEGATIVE_BALANCE`.
    - `RF-M7-07`: el `undo` de una creación elimina el movimiento con las mismas validaciones.

- [x] **`TASK-125`: Acciones en lote: eliminar y recategorizar**
  - **Dependencias:** Requiere TASK-124
  - **Trazabilidad SDD:** plan §4.6.2 (`batch-delete`, `batch-recategorize`); RF-M6-13
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/transactions.service.ts`
    - `apps/api/test/integration/transactions-batch.test.ts`
  - **Especificación de Implementación:** Por cada id: al eliminar, omite los vinculados; al recategorizar, omite las transferencias, los ajustes y los de la categoría del sistema; en los dos casos, omite los que violarían el bloqueo de negativos (`BalanceGuard` en modo `batch`). Responde con la cantidad procesada y la omitida, y crea un único `undo_action`. Mezclar gastos e ingresos al recategorizar da `MIXED_KINDS`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M6-13`: de 5 seleccionados, con 1 vinculado y 1 que violaría un negativo, se eliminan 3 y se informan 2 omitidos.
    - Un solo `undo` revierte el lote completo.
    - `MIXED_KINDS` al recategorizar gastos e ingresos juntos.

- [x] **`TASK-126`: Servicio de lista y totales de movimientos**
  - **Dependencias:** Requiere TASK-119, TASK-121
  - **Trazabilidad SDD:** plan §4.6.2 (`GET /api/transactions`, `summary`); RF-M6-11, RF-M6-12, RF-M3-11, RN-04, RN-05, RNF-19
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/transactions.service.ts`
    - `apps/api/test/integration/transactions-list.test.ts`
  - **Especificación de Implementación:** `list(ctx, query)` y `summary(ctx, query)` en la moneda base, usando las tasas guardadas en cada movimiento y, para una moneda no guardada, el historial en su fecha. Marca `beforeInitialBalance`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "La historia no se reescribe al cambiar la base" (`RF-M3-11`, `RNF-19`): un gasto de $ 10 al 10,00 vale Bs 100,00 antes y después de pasar a USD y volver, aunque el dólar suba a 11,00.
    - `RF-M6-11`: los pendientes no aparecen (no existen en `ledger_transaction`).
    - `RF-M6-12`: los totales excluyen lo de RN-02.

- [x] **`TASK-127`: Rutas HTTP de movimientos**
  - **Dependencias:** Requiere TASK-125, TASK-126
  - **Trazabilidad SDD:** plan §4.6.2 (tabla de endpoints), ADR-11; RNF-14, RNF-11
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/transactions.routes.ts`
    - `apps/api/src/presentation/controllers/transactions.controller.ts`
    - `apps/api/src/presentation/presenters/transactions.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/src/application/services/transactions.service.ts`
    - `apps/api/test/http/transactions.test.ts`
    - `apps/api/test/http/transactions.isolation.test.ts`
  - **Especificación de Implementación:** `TransactionsService` gana `get(ctx, id)` (`NOT_FOUND` si no es del usuario), y `create`, `update`, `get` y `list` devuelven cada movimiento con lo que pide `TransactionDto`: el monto en la base, `beforeInitialBalance` y la categoría con su nombre (y su comisión en el detalle). Monta todos los endpoints de plan §4.6.2. `POST` responde 201 con `{ transaction, undoToken }`, o 200 con el existente si el id se repite con los mismos datos.
  - **Criterios de Verificación (Tests & DoD):**
    - Cada endpoint responde con sus estados y errores.
    - `RNF-11`: un reintento con el mismo id responde 200 sin crear una fila.
    - `RNF-14`: el usuario B recibe 404 en cada endpoint con un movimiento de A, también como `accountId` o `categoryId` de una creación.

- [x] **`TASK-128`: Job `maintenance`: purga de movimientos eliminados y de deshacer vencidos**
  - **Dependencias:** Requiere TASK-063, TASK-124
  - **Trazabilidad SDD:** plan §4.6.3 (eliminado definitivo), ADR-07; EC-M6-06
  - **Archivos en Alcance:**
    - `apps/api/src/application/jobs/maintenance.ts`
    - `apps/api/src/application/ports/maintenance-store.ts`
    - `apps/api/src/infrastructure/persistence/maintenance-store.ts`
    - `apps/api/test/integration/maintenance-ledger.test.ts`
  - **Especificación de Implementación:** `MaintenanceStore` gana un método para cada purga. Borra de verdad las transacciones con `deleted_at` de hace más de 1 minuto (sus asientos caen en cascada) y los `undo_action` vencidos.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M6-06`: una eliminada de hace 61 s se borra; una de hace 5 s, no.
    - Los `undo_action` vencidos desaparecen.

- [x] **`TASK-129`: Web: lista de movimientos**
  - **Dependencias:** Requiere TASK-073, TASK-127
  - **Trazabilidad SDD:** plan §4.6.4 (`/movimientos`), ADR-16; RF-M6-02, RF-M6-10, RF-M6-12, RF-M4-03, RF-M9-03, RF-M2-04
  - **Archivos en Alcance:**
    - `apps/web/src/features/transactions/api.ts`
    - `apps/web/src/features/transactions/hooks/use-transactions.ts`
    - `apps/web/src/features/transactions/components/month-selector.tsx`
    - `apps/web/src/features/transactions/components/filters-bar.tsx`
    - `apps/web/src/features/transactions/components/totals-bar.tsx`
    - `apps/web/src/features/transactions/components/day-groups.tsx`
    - `apps/web/src/features/transactions/components/transaction-row.tsx`
    - `apps/web/src/features/transactions/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/transactions.json`
    - `e2e/m6-transactions-list.spec.ts`
  - **Especificación de Implementación:** Mes y filtros en la URL. Totales del filtro. Grupos por día con su neto y fecha relativa. Filas con los distintivos "anterior al saldo inicial" y "De recurrente: X". *Scroll* infinito con `useInfiniteQuery`. Búsqueda por nota o monto.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M6-12`: el neto del día excluye las transferencias.
    - `RF-M4-03`: un movimiento anterior al saldo inicial muestra su distintivo.
    - `RF-M2-04`: volver a Movimientos conserva el mes y los filtros.
    - Buscar "35" filtra la lista.

- [x] **`TASK-130`: Web: selección y acciones en lote**
  - **Dependencias:** Requiere TASK-129
  - **Trazabilidad SDD:** plan §4.6.4 (`BatchToolbar`); RF-M6-13, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/transactions/components/batch-toolbar.tsx`
    - `apps/web/src/features/transactions/components/transaction-row.tsx`
    - `apps/web/src/features/transactions/components/day-groups.tsx`
    - `apps/web/src/locales/es-BO/transactions.json`
    - `e2e/m6-batch.spec.ts`
  - **Especificación de Implementación:** Pulsación larga en el celular y casillas en el escritorio, con la tecla espacio para seleccionar. Solo se seleccionan los movimientos ya cargados. Eliminar o recategorizar muestra cuántos quedaron fuera y ofrece un solo "Deshacer".
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M6-13`: eliminar 3 seleccionados con 1 vinculado informa "1 quedó fuera".
    - `RNF-06`: la selección funciona solo con el teclado.

- [x] **`TASK-131`: Web: detalle y edición de un movimiento**
  - **Dependencias:** Requiere TASK-129
  - **Trazabilidad SDD:** plan §4.6.4 (`/movimientos/:id`); RF-M6-07, RF-M6-09, RF-M3-10, EC-M6-02, EC-M6-07
  - **Archivos en Alcance:**
    - `apps/web/src/features/transactions/components/transaction-detail.tsx`
    - `apps/web/src/features/transactions/components/transaction-edit-form.tsx`
    - `apps/web/src/features/transactions/components/currency-change-confirm.tsx`
    - `apps/web/src/features/transactions/routes.tsx`
    - `apps/web/src/locales/es-BO/transactions.json`
    - `e2e/m6-transaction-edit.spec.ts`
  - **Especificación de Implementación:** Detalle con "Ir a…" en los vinculados. Edición con el borrador `transaction-edit:{id}`; la tasa se edita a mano. Al pasar a una cuenta de otra moneda, `CurrencyChangeConfirm` precarga el monto convertido con la tasa guardada. En los vinculados, el monto, la cuenta y la fecha se muestran bloqueados.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M6-07`: pasar un gasto de Bs a una cuenta en $ precarga el monto convertido.
    - `EC-M6-02`: editar algo eliminado en otro contexto muestra "Este movimiento ya no existe".
    - `RF-M3-10`: cambiar la fecha no cambia la tasa mostrada.

- [x] **`TASK-132`: Web: aviso global de "Deshacer" y eliminación**
  - **Dependencias:** Requiere TASK-131
  - **Trazabilidad SDD:** plan §4.6.4 (global, optimismo), plan §4.6.3; RF-M7-07, EC-M6-06
  - **Archivos en Alcance:**
    - `apps/web/src/app/layout/undo-toast.tsx`
    - `apps/web/src/app/layout/app-shell.tsx`
    - `apps/web/src/features/transactions/hooks/use-delete-transaction.ts`
    - `apps/web/src/features/transactions/components/transaction-detail.tsx`
    - `apps/web/src/locales/es-BO/transactions.json`
    - `e2e/m6-delete-undo.spec.ts`
  - **Especificación de Implementación:** `UndoToast` con 10 s de cuenta regresiva, que vive en `ui-store`. Eliminar es optimista: la fila desaparece al instante y vuelve si hay error. Al cambiar de pantalla en Movimientos, el aviso se oculta y la eliminación queda definitiva.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Eliminar y deshacer" (E2E): el saldo sube Bs 35,00 al instante, se ve "Movimiento eliminado · Deshacer" y, al tocarlo, el gasto vuelve.
    - `EC-M6-06`: cambiar de pantalla oculta el "Deshacer".

- [x] **`TASK-133`: Web: movimientos en el detalle de una cuenta**
  - **Dependencias:** Requiere TASK-108, TASK-129
  - **Trazabilidad SDD:** plan §4.4.4 (`MovementsByDay`, filtro compartido); spec §2.4.1 (consultar)
  - **Archivos en Alcance:**
    - `apps/web/src/features/accounts/components/movements-by-day.tsx`
    - `apps/web/src/features/accounts/routes.tsx`
    - `e2e/m4-account-movements.spec.ts`
  - **Especificación de Implementación:** Reutiliza `DayGroups` de M6 con `accountId` y el mismo `?from&to` que el gráfico del saldo.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-133`: cambiar el rango de fechas actualiza el gráfico y la lista a la vez.

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-07 - Deshacer con token]] · [[ADR-11 - Idempotencia con UUID v7]] · [[ADR-16 - Navegación con React Router]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.6 Exactitud monetaria]] · [[Spec 3.9 Auditoría y retención]]
- **Fases de tareas:** [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]] · [[Plan 4.4 M4 - Cuentas (V1.0)]] · [[Plan 4.6 M6 - Transacciones (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]] · [[Spec 2.4 M4 - Cuentas (V1.0)]]
- **Entidades:** [[Entidad - LedgerTransaction]] · [[Entidad - UndoAction]]

