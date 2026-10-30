---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 19 - M12 Metas de ahorro (V1.1)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M12"
fase: "19"
tareas: "13"
modulo: "M12"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]] · → [[Tareas Fase 20 - M11 Presupuestos (V1.1)]]

### Fase 19 — M12 Metas de ahorro (V1.1)

- [x] **`TASK-180`: Contratos de M12**
  - **Dependencias:** Requiere TASK-024, TASK-077
  - **Trazabilidad SDD:** plan §4.12.1; RF-M12-01
  - **Archivos en Alcance:**
    - `packages/contracts/src/goals.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/goals.test.ts`
  - **Especificación de Implementación:** `CreateGoalInput`, `UpdateGoalInput`, `EarmarkInput`, `ReleaseInput`, `DedicateInput` y `GoalDto`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M12-01`: el nombre va de 1 a 40 caracteres y el objetivo es mayor que 0; la moneda es editable y `dedicatedAccountId` no se acepta en `UpdateGoalInput`.

- [x] **`TASK-181`: Dominio `goals`: progreso, estado, sugerido y propuesta de retiro**
  - **Dependencias:** Requiere TASK-080
  - **Trazabilidad SDD:** plan §4.12.1 (`packages/domain/goals`), ADR-13; RF-M12-02, RF-M12-05, RF-M12-06, EC-M12-03, EC-M12-04
  - **Archivos en Alcance:**
    - `packages/domain/src/goals.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/goals.test.ts`
  - **Especificación de Implementación:** `progress(dedicatedBalance, earmarks, rates)`: el saldo de la dedicada con mínimo 0, más los apartados, convertido a la moneda de la meta con la tasa vigente. `status(goal, progress, today)`. `suggestedMonthly` con sus variantes (mensual, "Faltan X este mes", calculadora, "Elige una nueva fecha" u oculto). `earmarkProposal(shortfall, earmarksByGoal)`: primero la meta con la fecha más lejana o sin fecha.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Progreso combinado" (`RF-M12-02`): una dedicada de 850 y apartados de 200 y 150 dan 1.200.
    - `EC-M12-04`: una dedicada en −100 aporta 0.
    - `EC-M12-03`: una meta en USD cumplida pasa a en curso si el dólar sube.
    - `RF-M12-06`: (objetivo − progreso) ÷ meses restantes, incluido el actual; con la fecha en este mes, la variante "Faltan X este mes".
    - `RF-M12-05`: la propuesta toma primero de la meta sin fecha.

- [x] **`TASK-182`: Repositorios de metas y apartados**
  - **Dependencias:** Requiere TASK-099
  - **Trazabilidad SDD:** plan §3.6, plan §4.12.2 (historial); RF-M12-04, RF-M12-07, RN-09
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/goal.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/goal-allocation.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/factories/goal.factory.ts`
    - `apps/api/test/integration/goal-repositories.test.ts`
  - **Especificación de Implementación:** CRUD de metas. Eventos de apartado: `insert`, `earmarkedByAccount(accountId)` (por meta), `earmarkedByGoal(goalId)` y `history(goalId)`, que une los eventos con los asientos de la cuenta dedicada, cada uno con su origen.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M12-04`: `earmarkedByAccount` suma por meta los apartados y los retiros.
    - `RF-M12-07`: el historial incluye los asientos de la dedicada con el origen "cuenta dedicada" y los ajustes con el origen "ajuste".
    - `RN-09`: no se ven las metas de otro usuario.

- [x] **`TASK-183`: `BalanceGuard`: protección de apartados**
  - **Dependencias:** Requiere TASK-100, TASK-181, TASK-182
  - **Trazabilidad SDD:** plan §4.0 (`BalanceGuard`, paso 4), plan §4.12.3 (protección de apartados); RF-M12-05, EC-M12-07, RNF-10
  - **Archivos en Alcance:**
    - `apps/api/src/application/shared/balance-guard.ts`
    - `apps/api/test/integration/balance-guard-earmarks.test.ts`
  - **Especificación de Implementación:** Si una cuenta no dedicada queda con un saldo menor que la suma de sus apartados: en modo `interactive` lanza `EARMARK_CONFIRMATION_REQUIRED {shortfall, proposal}`, salvo que `earmarkWithdrawals` cubra el faltante, y entonces inserta eventos `confirmed_spend` en la misma transacción; en modo `automatic` devuelve `AutoBlocked`; en modo `batch`, `skip`. Las salidas de una cuenta dedicada no piden confirmación.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M12-05`: un banco con 4.800 y 300 apartados, ante un gasto de 4.600, da un faltante de 100 con la propuesta.
    - Con los retiros que cubren 100, se guarda y los apartados quedan en 200.
    - `EC-M12-07`: un ajuste negativo que baja del apartado pide confirmación.
    - `RNF-10`: dos gastos concurrentes evalúan los apartados con el saldo vigente.
    - Una cuenta dedicada no pide confirmación.

- [x] **`TASK-184`: Protección de apartados en movimientos, deshacer y ajustes**
  - **Dependencias:** Requiere TASK-103, TASK-125, TASK-183
  - **Trazabilidad SDD:** plan §4.6.2 (errores `EARMARK_CONFIRMATION_REQUIRED`), plan §4.12.3; RF-M12-05, RF-M6-08, RF-M6-13, EC-M12-07
  - **Archivos en Alcance:**
    - `packages/contracts/src/transactions.ts`
    - `packages/contracts/src/accounts.ts`
    - `apps/api/src/application/services/transactions.service.ts`
    - `apps/api/src/application/services/accounts.service.ts`
    - `apps/api/src/presentation/controllers/transactions.controller.ts`
    - `apps/api/src/presentation/controllers/accounts.controller.ts`
    - `apps/api/test/integration/earmark-protection.test.ts`
  - **Especificación de Implementación:** Crear, editar, eliminar, deshacer y ajustar aceptan `earmarkWithdrawals` opcional (en eliminar, como cuerpo opcional; se agrega a `UndoInput` y `AdjustInput`) y lo pasan a `BalanceGuard` en modo `interactive`. El lote usa el modo `batch`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Gasto que toca dinero apartado" (integración): primero `EARMARK_CONFIRMATION_REQUIRED {shortfall: 100}`; al reenviar con los retiros, los apartados del Banco quedan en 200.
    - `RF-M6-08`: deshacer la eliminación de un gasto que baja del apartado pide confirmación.
    - `RF-M6-13`: el lote omite el movimiento que tocaría un apartado.
    - `EC-M12-07`: el ajuste negativo pide confirmación y, al confirmar, registra el retiro.

- [x] **`TASK-185`: `GoalsService`: crear, editar, listar, detalle e historial**
  - **Dependencias:** Requiere TASK-037, TASK-089, TASK-180, TASK-183
  - **Trazabilidad SDD:** plan §4.12.2 (`GET`, `POST`, `PATCH`); RF-M12-01, RF-M12-02, RF-M12-06, RF-M12-07, RF-M4-05, RNF-28
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/goals.service.ts`
    - `apps/api/src/application/shared/currency-usage.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/goal.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/goal-allocation.repository.ts`
    - `apps/api/test/integration/goals-crud.test.ts`
  - **Especificación de Implementación:** `create` es idempotente, con un tope de 50; si dedica una cuenta, valida lo mismo que `/dedicate`. `update` exige una fecha objetivo ≥ hoy (`TARGET_DATE_IN_PAST`). `list` y `get` calculan el progreso, el estado y el sugerido al leer, y el detalle trae el progreso por cuenta y el historial. Registra en `CurrencyUsage` el uso por metas no archivadas.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M12-01`: una fecha pasada da `TARGET_DATE_IN_PAST`.
    - `RNF-28`: la meta 51 da `LIMIT_REACHED`.
    - `RF-M4-05`: un ajuste en la dedicada aparece en el historial con el origen "ajuste" y cambia el progreso.
    - `EC-M3-05`: desactivar la moneda de una meta da `CURRENCY_IN_USE` con "goals".

- [x] **`TASK-186`: Apartar, liberar y dedicar una cuenta**
  - **Dependencias:** Requiere TASK-185
  - **Trazabilidad SDD:** plan §4.12.2 (`earmarks`, `release`, `dedicate`); RF-M12-03, RF-M12-04, EC-M12-01, EC-M12-06, EC-M12-08
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/goals.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/goal.repository.ts`
    - `apps/api/test/integration/goals-earmarks.test.ts`
  - **Especificación de Implementación:** Apartar, con la cuenta bajo `FOR UPDATE`: el monto debe ser ≤ el saldo libre (si no, `EARMARK_EXCEEDS_FREE {free}`); una tarjeta da `ACCOUNT_NOT_DEDICABLE`. Liberar: el monto debe ser ≤ lo apartado en esa cuenta (si no, `RELEASE_EXCEEDS_EARMARK`). Dedicar: la cuenta no es tarjeta, no está dedicada a otra meta ni tiene apartados de otras metas.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M12-01`: apartar más que el saldo libre da `EARMARK_EXCEEDS_FREE` con el saldo libre.
    - `EC-M12-06`: dedicar una cuenta con apartados de otra meta da `ACCOUNT_HAS_OTHER_EARMARKS`.
    - `EC-M12-08`: dedicar una tarjeta da `ACCOUNT_NOT_DEDICABLE`.
    - `RF-M12-03`: dedicar una cuenta ya dedicada da `ACCOUNT_ALREADY_DEDICATED`.
    - Dos apartados simultáneos no superan el saldo libre.

- [x] **`TASK-187`: Usar y cerrar, archivar, restaurar, eliminar y celebración**
  - **Dependencias:** Requiere TASK-186
  - **Trazabilidad SDD:** plan §4.12.2 (`use-and-close`, `archive`, `restore`, `DELETE`, `celebrated`), plan §4.12.3; RF-M12-09, spec §2.12.2
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/goals.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/goal.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/goal-allocation.repository.ts`
    - `apps/api/test/integration/goals-lifecycle.test.ts`
  - **Especificación de Implementación:** "Usar y cerrar" inserta eventos `use_and_close` que dejan cada apartado en 0, quita la cuenta dedicada y archiva la meta. Archivar o eliminar solo procede con la meta vacía (si no, `GOAL_NOT_EMPTY`). Restaurar no recupera los apartados. `celebrated` marca `celebrated_at` una sola vez.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Usar y cerrar" (`RF-M12-09`): los apartados quedan en 0 y la meta queda archivada con su historia.
    - Archivar una meta con apartados da `GOAL_NOT_EMPTY`.
    - Eliminar una meta vacía borra su historia.
    - `firstAchievement` es verdadero solo hasta marcar `celebrated`.

- [x] **`TASK-188`: Cuentas con apartados y cuentas dedicadas**
  - **Dependencias:** Requiere TASK-135, TASK-186
  - **Trazabilidad SDD:** plan §4.4.2 (archivar, cambio de tipo, eliminar), plan §4.12.3 (total neto); RF-M4-07, RF-M4-10, RF-M7-11, RF-M12-08, EC-M12-02
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/accounts.service.ts`
    - `apps/api/src/presentation/presenters/accounts.presenter.ts`
    - `apps/api/src/application/services/register.service.ts`
    - `apps/api/test/integration/accounts-goals.test.ts`
  - **Especificación de Implementación:** Archivar rechaza una cuenta con apartados (`ACCOUNT_HAS_EARMARKS {goals}`) o dedicada (`ACCOUNT_DEDICATED`). El cambio de tipo rechaza pasar a tarjeta una cuenta dedicada o con apartados. Eliminar rechaza una cuenta dedicada. `AccountDto` trae `earmarked`, `free` y `dedicatedGoal`. El desglose suma "Apartado para metas" (los apartados más el saldo positivo de las dedicadas) sin cambiar el total neto. El contexto de Registrar usa el saldo libre.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M12-02`: archivar una cuenta con apartados da `ACCOUNT_HAS_EARMARKS` con las metas.
    - `RF-M12-08` / `RF-M4-10`: el total neto no cambia al apartar y el desglose muestra "Apartado para metas".
    - `RF-M7-11`: la ficha de Registrar recibe el saldo libre.
    - `RF-M4-07`: pasar a tarjeta una cuenta dedicada da `TYPE_CHANGE_INVALID`.

- [x] **`TASK-189`: Rutas HTTP de metas**
  - **Dependencias:** Requiere TASK-187, TASK-188
  - **Trazabilidad SDD:** plan §4.12.2 (tabla de endpoints), ADR-18; RNF-14, RF-M2-03
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/goals.routes.ts`
    - `apps/api/src/presentation/controllers/goals.controller.ts`
    - `apps/api/src/presentation/presenters/goals.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/goals.test.ts`
    - `apps/api/test/http/goals.isolation.test.ts`
  - **Especificación de Implementación:** Monta los endpoints de plan §4.12.2 detrás de `releaseGate('m12')`.
  - **Criterios de Verificación (Tests & DoD):**
    - Cada endpoint responde con sus estados y errores.
    - `RNF-14`: el usuario B recibe 404 en cada endpoint con una meta de A, también al apartar en una cuenta de A.
    - `RF-M2-03`: con `RELEASE=1.0`, `RELEASE_NOT_AVAILABLE`.

- [x] **`TASK-190`: Web: lista y detalle de metas**
  - **Dependencias:** Requiere TASK-179, TASK-189
  - **Trazabilidad SDD:** plan §4.12.4 (`/metas`, `/metas/:id`); RF-M12-02, RF-M12-06, RF-M12-07, spec §2.12.2 (celebración)
  - **Archivos en Alcance:**
    - `apps/web/src/features/goals/api.ts`
    - `apps/web/src/features/goals/hooks/use-goals.ts`
    - `apps/web/src/features/goals/components/goal-cards.tsx`
    - `apps/web/src/features/goals/components/goal-progress.tsx`
    - `apps/web/src/features/goals/components/progress-by-account.tsx`
    - `apps/web/src/features/goals/components/goal-history.tsx`
    - `apps/web/src/features/goals/components/suggested-box.tsx`
    - `apps/web/src/features/goals/components/celebration.tsx`
    - `apps/web/src/features/goals/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/goals.json`
    - `e2e/m12-goals.spec.ts`
  - **Especificación de Implementación:** Tarjetas con anillo de progreso y estado. Detalle con el progreso, el progreso por cuenta, el historial con su origen, el sugerido y la celebración la primera vez. Una meta inexistente muestra `ResourceNotFound`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Progreso combinado" (E2E): el detalle muestra Bs 1.200,00.
    - `RF-M12-06`: se ve el aporte mensual sugerido.
    - La celebración aparece una sola vez.

- [x] **`TASK-191`: Web: crear meta, apartar, liberar, dedicar y usar y cerrar**
  - **Dependencias:** Requiere TASK-190
  - **Trazabilidad SDD:** plan §4.12.4 (diálogos); RF-M12-01, RF-M12-03, RF-M12-09, EC-M12-01, EC-M12-08
  - **Archivos en Alcance:**
    - `apps/web/src/features/goals/components/goal-form.tsx`
    - `apps/web/src/features/goals/components/earmark-dialog.tsx`
    - `apps/web/src/features/goals/components/release-dialog.tsx`
    - `apps/web/src/features/goals/components/dedicate-dialog.tsx`
    - `apps/web/src/features/goals/components/use-and-close-dialog.tsx`
    - `apps/web/src/features/goals/routes.tsx`
    - `apps/web/src/locales/es-BO/goals.json`
    - `e2e/m12-goal-dialogs.spec.ts`
  - **Especificación de Implementación:** `GoalForm` con borrador. `EarmarkDialog` muestra el saldo libre. `DedicateDialog` no ofrece tarjetas. Toda mutación invalida `['goals']` y `['accounts']`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Usar y cerrar" (E2E): la meta queda Archivada y sus apartados en 0.
    - `EC-M12-01`: apartar más que el saldo libre muestra el saldo libre.
    - `EC-M12-08`: el diálogo de dedicar no lista tarjetas.

- [x] **`TASK-192`: Web: confirmación de apartados y avisos de cuenta dedicada**
  - **Dependencias:** Requiere TASK-142, TASK-184, TASK-191
  - **Trazabilidad SDD:** plan §4.7.3 (errores), plan §4.12.4 (`EarmarkConfirmDialog` compartido); RF-M12-05, RF-M7-14, EC-M7-03, RF-M4-10
  - **Archivos en Alcance:**
    - `apps/web/src/features/goals/components/earmark-confirm-dialog.tsx`
    - `apps/web/src/features/register/components/register-form.tsx`
    - `apps/web/src/features/register/components/account-chip.tsx`
    - `apps/web/src/features/transactions/components/transaction-edit-form.tsx`
    - `apps/web/src/features/transactions/hooks/use-delete-transaction.ts`
    - `apps/web/src/features/accounts/components/adjust-balance-dialog.tsx`
    - `apps/web/src/features/accounts/components/account-header.tsx`
    - `apps/web/src/features/accounts/components/net-worth-summary.tsx`
    - `apps/web/src/locales/es-BO/goals.json`
    - `apps/web/src/features/transactions/components/transaction-detail.tsx`
    - `apps/web/src/app/layout/undo-toast.tsx`
    - `e2e/m12-earmark-confirm.spec.ts`
  - **Especificación de Implementación:** `EarmarkConfirmDialog` muestra "Este gasto usa X apartados" y las metas afectadas, con la propuesta editable; al confirmar, reenvía con el mismo `id` y `earmarkWithdrawals`; al cancelar, no cambia nada. Lo usan Registrar, la edición, la eliminación, deshacer y el ajuste. `AccountChip` muestra "Esto resta a tu meta X" en las dedicadas. El detalle de la cuenta y el desglose muestran Saldo · Apartado para metas · Libre.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Gasto que toca dinero apartado" (E2E): la app pregunta de qué metas tomar Bs 100,00 y, al confirmar, los apartados del Banco quedan en Bs 200,00.
    - `EC-M7-03`: al cancelar, el formulario de Registrar queda intacto.
    - Escenario "Salida de la cuenta dedicada sin confirmación": se guarda sin preguntar, se ve "Esto resta a tu meta Viaje" y el progreso baja (`RF-M7-14`).
    - `RF-M4-10`: el desglose muestra la línea "Apartado para metas".

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M6 - Transacciones]] · [[M7 - Registrar]]
- **Decisiones (ADR):** [[ADR-13 - Estados derivados al leer]] · [[ADR-18 - Entregas con RELEASE]]
- **Requerimientos no funcionales:** [[Spec 3.10 Límites por usuario]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 12 - M7 Registrar (V1.0)]] · [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 3.6 Planificación (M11 a M14)]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.12 M12 - Metas de ahorro (V1.1)]] · [[Plan 4.4 M4 - Cuentas (V1.0)]] · [[Plan 4.6 M6 - Transacciones (V1.0)]] · [[Plan 4.7 M7 - Registrar (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]] · [[Spec 2.12 M12 - Metas de ahorro (V1.1)]]

