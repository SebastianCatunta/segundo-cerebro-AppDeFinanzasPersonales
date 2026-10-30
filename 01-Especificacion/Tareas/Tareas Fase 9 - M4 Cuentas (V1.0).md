---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 9 - M4 Cuentas (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M4"
fase: "9"
tareas: "13"
modulo: "M4"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]] · → [[Tareas Fase 10 - M5 Categorías (V1.0)]]

### Fase 9 — M4 Cuentas (V1.0)

- [x] **`TASK-096`: Contratos de M4**
  - **Dependencias:** Requiere TASK-024, TASK-077
  - **Trazabilidad SDD:** plan §4.4.1; RF-M4-01, RF-M4-02, RF-M4-07, RF-M4-08
  - **Archivos en Alcance:**
    - `packages/contracts/src/accounts.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/accounts.test.ts`
  - **Especificación de Implementación:** `AccountType`, `CreateAccountInput` (la tarjeta usa la forma `{ kind: 'debt' | 'credit', amount }`), `UpdateAccountInput` (estricto y sin saldo inicial), `AdjustInput`, `ArchiveInput`, `RestoreInput`, `ReorderInput`, `AccountDto` y `AccountsSummaryDto`, como plan §4.4.1.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-01`: un nombre de 41 caracteres es inválido.
    - `RF-M4-02`: un saldo inicial de 1.000.000.000,00 es inválido.
    - `RF-M4-07`: `UpdateAccountInput` rechaza `initialBalance` e `initialBalanceDate`.
    - `RF-M4-08`: el día de corte o de pago fuera de 1–31 es inválido.

- [x] **`TASK-097`: Dominio `balance`: reglas de cuentas y tarjetas**
  - **Dependencias:** Requiere TASK-026
  - **Trazabilidad SDD:** plan §4.4.2 (cambio de tipo), plan §4.4.3; RN-01, RN-12, RF-M4-02, RF-M4-07, RF-M4-08
  - **Archivos en Alcance:**
    - `packages/domain/src/balance.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/balance.test.ts`
  - **Especificación de Implementación:** `balanceFrom(initial, initialDate, entries)`, que solo cuenta los asientos con fecha ≥ la del saldo inicial. `validateInitialBalance(type, value)`. `cardView(balance, limit)` → "Debes X" o "A favor X", crédito disponible y límite superado. `validateTypeChange({ from, to, initialBalance, currentBalance, dedicated, hasEarmarks })` devuelve el motivo del rechazo.
  - **Criterios de Verificación (Tests & DoD):**
    - `RN-01` / `RN-12`: un asiento anterior al saldo inicial no suma.
    - `RF-M4-02`: efectivo con −1 se rechaza; banco con −1 se acepta.
    - `RF-M4-08`: con límite 5.000 y deuda 5.200, el crédito disponible es −200 y está superado.
    - `RF-M4-07`: no se puede pasar a efectivo una cuenta con saldo inicial negativo, ni a tarjeta una cuenta dedicada.

- [x] **`TASK-098`: Dominio `balance`: total neto y desglose**
  - **Dependencias:** Requiere TASK-080, TASK-097
  - **Trazabilidad SDD:** plan §4.4.2 (`GET /api/accounts`); RF-M4-10, RN-05, RN-06
  - **Archivos en Alcance:**
    - `packages/domain/src/balance.ts`
    - `packages/domain/test/net-worth.test.ts`
  - **Especificación de Implementación:** `netWorth(accounts, rates)` convierte cada saldo a la base con la tasa vigente, redondea por cuenta y suma. El desglose da Líquido (efectivo, banco, billetera y otro), Ahorro, Deuda en tarjetas (la suma de todas las tarjetas; un saldo a favor la reduce) y Apartado para metas (0 hasta V1.1). También devuelve el equivalente en la otra moneda, o `null` sin tasa. Firma: `netWorth(accounts: { type: AccountType; currencyCode: string; balance: string }[], rates: { baseCurrency: string; otherCurrency: string; bobPerUnit: Record<string, Decimal | null> })`; quien llama pasa solo las cuentas activas, y `bobPerUnit` da los Bs por unidad de cada moneda (BOB = 1), igual que `convert` de `fx.ts`. Devuelve `{ netWorth: { base: string | null; other: string | null }, breakdown: { liquid, savings, cardDebt, earmarked } }` en texto decimal, como `AccountsSummaryDto`. `other` es la suma de cada cuenta convertida y redondeada a la otra moneda (RN-06). Si falta la tasa de alguna moneda necesaria para convertir a la base, `base` y los cuatro campos del desglose son `null`; si falta solo la de la otra moneda, solo `other` es `null`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-10`: una tarjeta con deuda resta del total, y un saldo a favor reduce la deuda en tarjetas.
    - `RN-06`: el total es la suma de las conversiones redondeadas de cada cuenta.
    - Sin tasa, el equivalente es `null`.

- [x] **`TASK-099`: Repositorios de cuentas y del libro contable (base)**
  - **Dependencias:** Requiere TASK-083
  - **Trazabilidad SDD:** plan §3.5, ADR-04, plan §4.4.2 (`balance-series`); RN-01, RN-09, RNF-03
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/account.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/ledger.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/factories/account.factory.ts`
    - `apps/api/test/factories/ledger.factory.ts`
    - `apps/api/test/integration/account-ledger-repositories.test.ts`
  - **Especificación de Implementación:** Cuentas: `insert`, `get`, `list(status)`, `lockForUpdate(ids)` (ordenadas por id), `update`, `setOrder`, `count` y `hasEntries`. Libro: `insertTransaction(tx, header, entries)` con `ON CONFLICT (id) DO NOTHING`, `balances(accountIds)` (un `SUM` agrupado que respeta RN-01 y excluye las eliminadas) y `balanceSeries(accountId, from, to)` (suma acumulada por día).
  - **Criterios de Verificación (Tests & DoD):**
    - `RN-01`: `balances` ignora los asientos anteriores al saldo inicial y las transacciones con `deleted_at`.
    - `balanceSeries` devuelve el saldo de cada día del rango.
    - `RN-09`: no se pueden leer ni bloquear cuentas de otro usuario.

- [x] **`TASK-100`: `BalanceGuard`: bloqueo de saldos negativos**
  - **Dependencias:** Requiere TASK-099
  - **Trazabilidad SDD:** plan §4.0 (`BalanceGuard`), plan §4.4.3; RF-M4-04, EC-M4-01, EC-M4-06, RNF-10
  - **Archivos en Alcance:**
    - `apps/api/src/application/shared/balance-guard.ts`
    - `apps/api/test/integration/balance-guard.test.ts`
  - **Especificación de Implementación:** `apply(tx, userId, deltas, { mode })` bloquea las cuentas con `FOR UPDATE` (ordenadas por id), calcula el saldo vigente más los deltas y, si un efectivo o una billetera quedaría en negativo, lanza `NEGATIVE_BALANCE {accountId, resultingBalance}` (en modo `batch` devuelve `skip`). Los saldos de días pasados no se validan. La protección de apartados se agrega en TASK-183.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-04`: efectivo con 30 y un delta de −35 da `NEGATIVE_BALANCE` con `resultingBalance` "-5.00".
    - `EC-M4-06`: un banco puede quedar en negativo.
    - `RNF-10`: dos aplicaciones concurrentes de −20 sobre 30 dan un éxito y un error.
    - `EC-M4-01`: quitar un ingreso que deja el efectivo en −50 se rechaza.

- [x] **`TASK-101`: `AccountsService`: crear, listar y resumen**
  - **Dependencias:** Requiere TASK-037, TASK-085, TASK-089, TASK-096, TASK-098, TASK-100
  - **Trazabilidad SDD:** plan §4.4.2 (`GET` y `POST /api/accounts`), ADR-11; RF-M4-01, RF-M4-02, RF-M4-09, RF-M4-10, RNF-28, RN-05
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/accounts.service.ts`
    - `apps/api/src/application/shared/currency-usage.ts`
    - `packages/domain/src/index.ts`
    - `apps/api/test/integration/accounts-create-list.test.ts`
  - **Especificación de Implementación:** `create` es idempotente (ADR-11), usa `withUserLock`, `assertLimit(50)` y `FOR SHARE` sobre la moneda (que debe estar activa), y guarda la deuda de la tarjeta como negativa. `list(status)` trae los saldos, sus equivalentes y los datos de tarjeta. `summary` da el total neto y el desglose con la tasa vigente. Registra en `CurrencyUsage` el uso por cuentas activas.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-01`: un nombre repetido entre las activas da `NAME_TAKEN`.
    - `RNF-28`: la cuenta 51 da `LIMIT_REACHED`.
    - Repetir el mismo `id` devuelve la cuenta existente; con datos distintos, `IDEMPOTENCY_CONFLICT`.
    - Escenario "Valor manual con prioridad" (totales): con el manual en 10,00 y el paralelo en 10,40, el total de una cuenta en $ se convierte con 10,00.
    - `RF-M4-09`: las archivadas no suman en el total.
    - `EC-M3-05`: desactivar una moneda usada por una cuenta activa da `CURRENCY_IN_USE` con "accounts".

- [x] **`TASK-102`: `AccountsService`: editar y reordenar**
  - **Dependencias:** Requiere TASK-101
  - **Trazabilidad SDD:** plan §4.4.2 (`PATCH /api/accounts/:id`, `PUT /api/accounts/order`); RF-M4-06, RF-M4-07, RF-M4-11, EC-M4-02, RNF-08
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/accounts.service.ts`
    - `apps/api/test/integration/accounts-update.test.ts`
  - **Especificación de Implementación:** Edita el nombre, el color, el ícono y los campos de tarjeta. El cambio de tipo sigue `validateTypeChange` y, al dejar de ser tarjeta, borra sus campos. La moneda solo cambia si la cuenta no tiene asientos (si los tiene, `CURRENCY_LOCKED`). `reorder(ids)` exige exactamente las cuentas del usuario.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-06`: cambiar la moneda con movimientos da `CURRENCY_LOCKED`.
    - `RF-M4-07`: un cambio de tipo inválido da `TYPE_CHANGE_INVALID {reason}`, y de tarjeta a banco se borran el corte, el pago y el límite.
    - `RF-M4-11`: el orden se guarda y `list` lo respeta.
    - `EC-M4-02`: enviar el saldo inicial da `VALIDATION_ERROR`.

- [x] **`TASK-103`: Ajustar el saldo de una cuenta**
  - **Dependencias:** Requiere TASK-101
  - **Trazabilidad SDD:** plan §4.4.2 (`POST /api/accounts/:id/adjust`); RF-M4-05, EC-M4-08, RN-02, RN-01
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/accounts.service.ts`
    - `apps/api/test/integration/accounts-adjust.test.ts`
  - **Especificación de Implementación:** Con la cuenta bajo `FOR UPDATE`, delta = saldo real − saldo actual. Si el delta es 0, devuelve `{ created: false }`. Si no, crea `ledger_transaction(kind = adjustment, date = hoy)` con un asiento, pasando por `BalanceGuard`, con las tasas de RN-04 y una nota opcional. En una tarjeta, el usuario indica su deuda real.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Ajuste de saldo": con un saldo de 1.200 y un real de 1.250, se crea un ajuste de +50 y los ingresos del mes no cambian (`RN-02`).
    - `EC-M4-08`: con el mismo saldo no se crea nada.
    - Un ajuste que deja el efectivo en negativo da `NEGATIVE_BALANCE`.

- [x] **`TASK-104`: Archivar, restaurar y eliminar cuentas**
  - **Dependencias:** Requiere TASK-102
  - **Trazabilidad SDD:** plan §4.4.2 (`archive`, `restore`, `DELETE`), plan §4.7.3 (cuenta por defecto archivada); RF-M4-09, RF-M4-12, RF-M4-13, EC-M4-04, EC-M4-05, EC-M4-07, EC-M7-05
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/accounts.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/account.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user-settings.repository.ts`
    - `apps/api/test/integration/accounts-lifecycle.test.ts`
  - **Especificación de Implementación:** Archivar es un `UPDATE … WHERE status = 'active'`; con un saldo distinto de 0 exige `confirmNonZero` (si no, `ARCHIVE_CONFIRMATION_REQUIRED {balance}`) y pone `default_account_id = NULL` si era la cuenta por defecto. Restaurar exige un nombre libre (`NAME_TAKEN`; acepta `newName`) y la moneda activa (`CURRENCY_INACTIVE`). Eliminar solo procede sin asientos, incluidos los que están dentro de la ventana de deshacer (si no, `ACCOUNT_HAS_MOVEMENTS`), quita la cuenta por defecto y borra sus atajos. Las reglas de apartados, cuenta dedicada y recurrentes se agregan en TASK-188 y TASK-232.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-12` / `EC-M7-05`: archivar la cuenta por defecto deja `default_account_id` en NULL.
    - `EC-M4-04`: restaurar con un nombre en uso da `NAME_TAKEN`; con `newName`, restaura.
    - `EC-M4-07`: restaurar con la moneda inactiva da `CURRENCY_INACTIVE`.
    - `RF-M4-13`: eliminar una cuenta sin movimientos borra sus atajos.
    - `RF-M4-09`: una archivada no aparece en `list('active')` y conserva su historia.

- [x] **`TASK-105`: Rutas HTTP de cuentas**
  - **Dependencias:** Requiere TASK-103, TASK-104
  - **Trazabilidad SDD:** plan §4.4.2 (tabla de endpoints); RN-09, RNF-14
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/accounts.routes.ts`
    - `apps/api/src/presentation/controllers/accounts.controller.ts`
    - `apps/api/src/presentation/presenters/accounts.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/accounts.test.ts`
    - `apps/api/test/http/accounts.isolation.test.ts`
  - **Especificación de Implementación:** Monta todos los endpoints de plan §4.4.2, incluido `GET /api/accounts/:id/balance-series?from&to`. Los montos viajan como texto.
  - **Criterios de Verificación (Tests & DoD):**
    - Cada endpoint responde con sus estados y errores.
    - `RNF-14`: el usuario B recibe 404 al leer, editar, ajustar, archivar o eliminar una cuenta de A.

- [x] **`TASK-106`: Web: lista de cuentas y total neto**
  - **Dependencias:** Requiere TASK-073, TASK-105
  - **Trazabilidad SDD:** plan §4.4.4 (`/cuentas`); RF-M4-08, RF-M4-10, RF-M4-11, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/accounts/api.ts`
    - `apps/web/src/features/accounts/hooks/use-accounts.ts`
    - `apps/web/src/features/accounts/components/net-worth-summary.tsx`
    - `apps/web/src/features/accounts/components/account-groups.tsx`
    - `apps/web/src/features/accounts/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/accounts.json`
    - `e2e/m4-accounts-list.spec.ts`
  - **Especificación de Implementación:** Total neto en la base y en la otra moneda, el desglose, y las cuentas agrupadas por tipo y ordenadas por `sort_order`, reordenables con @dnd-kit y con botones Subir y Bajar. Enlace a `/cuentas?archivadas=1`. Las tarjetas muestran "Debes X" o "A favor X".
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-11`: reordenar con los botones Subir y Bajar, solo con teclado, persiste al recargar (`RNF-06`).
    - `RF-M4-10`: se ven el total neto y su desglose.
    - `RF-M4-08`: una tarjeta muestra "Debes".

- [x] **`TASK-107`: Web: formulario de cuenta y formulario rápido**
  - **Dependencias:** Requiere TASK-043, TASK-106
  - **Trazabilidad SDD:** plan §4.4.4 (formularios), plan §4.4.3 (sin cuentas activas); RF-M4-01, RF-M4-02, RF-M4-07, RF-M4-08, EC-M4-05, EC-M7-01
  - **Archivos en Alcance:**
    - `apps/web/src/features/accounts/components/account-form.tsx`
    - `apps/web/src/features/accounts/components/card-fields.tsx`
    - `apps/web/src/features/accounts/components/quick-account-form.tsx`
    - `apps/web/src/features/accounts/routes.tsx`
    - `apps/web/src/locales/es-BO/accounts.json`
    - `e2e/m4-account-form.spec.ts`
  - **Especificación de Implementación:** `AccountForm` para crear y editar, con borrador. Tipo, nombre, moneda, saldo inicial y su fecha (no editables después), color e ícono del catálogo, y el subformulario de tarjeta (deuda actual o saldo a favor, corte, pago y límite). `QuickAccountForm` pide nombre, tipo, moneda y saldo, y se reutiliza en Registrar y en el Inicio.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-02`: un efectivo con saldo negativo muestra el error.
    - `RF-M4-01`: un nombre repetido muestra el error de duplicado.
    - `RF-M4-07`: al editar, el saldo inicial no es editable y se ofrece "Ajustar saldo" (`EC-M4-02`).
    - `RF-M4-08`: una tarjeta se crea con deuda actual.

- [x] **`TASK-108`: Web: detalle de cuenta, ajustar saldo y acciones**
  - **Dependencias:** Requiere TASK-107
  - **Trazabilidad SDD:** plan §4.4.4 (`/cuentas/:id`); RF-M4-05, RF-M4-08, RF-M4-09, EC-M4-04, EC-M4-08
  - **Archivos en Alcance:**
    - `apps/web/src/features/accounts/components/account-header.tsx`
    - `apps/web/src/features/accounts/components/balance-chart.tsx`
    - `apps/web/src/features/accounts/components/adjust-balance-dialog.tsx`
    - `apps/web/src/features/accounts/components/account-actions.tsx`
    - `apps/web/src/features/accounts/routes.tsx`
    - `apps/web/src/locales/es-BO/accounts.json`
    - `e2e/m4-account-detail.spec.ts`
  - **Especificación de Implementación:** Cabecera con el saldo y su equivalente; en las tarjetas, el límite, el crédito disponible y el aviso de límite superado. Gráfico del saldo con `?from&to` (por defecto, el mes actual). Acciones Ajustar, Editar, Archivar (con confirmación si el saldo no es 0), Restaurar (pide renombrar si hace falta) y Eliminar. La lista de movimientos del detalle se agrega en TASK-133.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M4-05`: ajustar a un saldo distinto muestra el nuevo saldo.
    - `EC-M4-08`: con el mismo saldo se ve "El saldo ya coincide".
    - `EC-M4-04`: restaurar con un nombre en uso pide un nombre nuevo.
    - `RF-M4-08`: una tarjeta muestra el crédito disponible.

---
## 🔗 Relacionado

- **Módulos:** [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M7 - Registrar]]
- **Decisiones (ADR):** [[ADR-04 - Libro contable de doble asiento]] · [[ADR-11 - Idempotencia con UUID v7]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.10 Límites por usuario]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]] · [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 23 - M14 Recurrentes (V1.2)]] · [[Tareas Fase 3 - Dominio transversal]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 5 - Base de la web y harness E2E]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.4 M4 - Cuentas (V1.0)]] · [[Plan 4.7 M7 - Registrar (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

