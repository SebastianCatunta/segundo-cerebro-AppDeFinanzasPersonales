---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 20 - M11 Presupuestos (V1.1)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M11"
fase: "20"
tareas: "15"
modulo: "M11"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]] · → [[Tareas Fase 21 - M13 Deudas y préstamos (V1.1)]]

### Fase 20 — M11 Presupuestos (V1.1)

- [x] **`TASK-193`: Contratos de M11**
  - **Dependencias:** Requiere TASK-077
  - **Trazabilidad SDD:** plan §4.11.1; RF-M11-04, RF-M11-07, RF-M11-08, RF-M11-13
  - **Archivos en Alcance:**
    - `packages/contracts/src/budgets.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/budgets.test.ts`
  - **Especificación de Implementación:** `CreateBudgetInput`, `UpdateBudgetInput` (estricto y sin moneda), `DecisionInput` y `BudgetDto`, como plan §4.11.1.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M11-13`: los umbrales [100, 80] se ordenan a [80, 100]; repetidos o más de 3 son inválidos.
    - `RF-M11-04`: `startDay` va de 1 a 28.
    - `RF-M11-07`: `UpdateBudgetInput` rechaza `currencyCode`.
    - `RF-M11-08`: `DecisionInput` exige `carry` y `discard` en un sobrante, y `mode` en un exceso.

- [x] **`TASK-194`: Dominio `budget`: períodos**
  - **Dependencias:** Requiere TASK-027
  - **Trazabilidad SDD:** plan §4.11.1 (`periodFor`); RF-M11-04, RF-M11-07, EC-M11-07
  - **Archivos en Alcance:**
    - `packages/domain/src/budget.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/budget-periods.test.ts`
  - **Especificación de Implementación:** `periodFor(startDay, nextStartDay, date)` devuelve el período mensual que empieza en `startDay`. Con `nextStartDay`, el período en curso se alarga hasta el día anterior al nuevo día de inicio. También `nextPeriod(period, startDay)` y `periodLabel`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M11-04`: con el día de inicio 15, el 03/11 cae en el período 15/10–14/11.
    - `EC-M11-07` / `RF-M11-07`: al cambiar de 1 a 15 durante octubre, el período va del 01/10 al 14/11 y el siguiente empieza el 15/11.

- [x] **`TASK-195`: Dominio `budget`: disponible, reparto, umbrales y ritmo**
  - **Dependencias:** Requiere TASK-026, TASK-194
  - **Trazabilidad SDD:** plan §4.11.1 (`available`, `result`, `validateSplit`, `thresholdsCrossed`, `paceText`); RF-M11-05, RF-M11-08, RF-M11-13, RF-M11-14, EC-M11-01
  - **Archivos en Alcance:**
    - `packages/domain/src/budget.ts`
    - `packages/domain/test/budget-math.test.ts`
  - **Especificación de Implementación:** `available = amount + carryover_in + Σ ajustes tardíos no anulados`; `result = available − spent`; `validateSplit(result, carry, toGoal, discard)` con suma exacta; `thresholdsCrossed(spent, amount, thresholds, alreadyHit, isPeriodStart)` medido sobre el monto, que al crear o empezar un período solo devuelve el más alto; `paceText` ("Puedes gastar X/día durante N días", "Vas X por encima del ritmo" o "Superado por X"); `todayShouldBe`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M11-05` / `EC-M11-01`: un arrastre de −400 sobre un monto de 300 da un disponible de −100, y `paceText` da "Superado por".
    - `RF-M11-08`: un reparto que no suma exacto es inválido.
    - `RF-M11-13`: si un período empieza en el 120 % con umbrales 80 y 100, solo se avisa el 100.
    - `RF-M11-14`: un presupuesto superado sigue sumando el gasto.

- [x] **`TASK-196`: Repositorios de presupuestos y gasto del período**
  - **Dependencias:** Requiere TASK-119
  - **Trazabilidad SDD:** plan §3.6, plan §4.11.2 (gasto del período); RF-M11-02, RF-M11-03, RN-02, RN-09
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget-period.repository.ts`
    - `apps/api/test/factories/budget.factory.ts`
    - `apps/api/test/integration/budget-repositories.test.ts`
  - **Especificación de Implementación:** CRUD de presupuestos, períodos, ajustes tardíos y umbrales. `spent(budget, period)` suma los gastos del alcance (con hijas; el general suma todos los gastos sin lo de RN-02), convertidos a la moneda del presupuesto con las tasas guardadas.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M11-03`: un gasto en $ se convierte con su tasa guardada a un presupuesto en Bs.
    - `RF-M11-02`: un gasto de una subcategoría cuenta en su presupuesto, en el del padre y en el general.
    - `RN-02`: el general no suma las transferencias ni "Deudas y préstamos" (salvo "Intereses").

- [x] **`TASK-197`: `BudgetsService`: crear, listar y detalle**
  - **Dependencias:** Requiere TASK-037, TASK-089, TASK-176, TASK-193, TASK-195, TASK-196
  - **Trazabilidad SDD:** plan §4.11.2 (`GET`, `POST`); RF-M11-01, RF-M11-02, RF-M11-13, RF-M9-06, EC-M11-06, RNF-28
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/budgets.service.ts`
    - `apps/api/src/application/shared/currency-usage.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget.repository.ts`
    - `packages/domain/src/index.ts`
    - `apps/api/test/integration/budgets-create.test.ts`
  - **Especificación de Implementación:** `create` es idempotente, con un tope de 100. La categoría debe ser de gasto y activa; no se puede "Deudas y préstamos", pero sí "Intereses" (`CATEGORY_NOT_BUDGETABLE`). Crea el período en curso y evalúa los umbrales (solo el más alto). `list` y `get` traen el período en curso, el ritmo, el desglose del arrastre, el cierre pendiente, `childrenExceedParent` y, en el detalle, los 12 últimos períodos. Registra en `CurrencyUsage` el uso por presupuestos activos o pausados.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M11-06`: un segundo presupuesto de la misma categoría da `BUDGET_EXISTS {budgetId}`.
    - `RF-M11-01`: "Deudas y préstamos" da `CATEGORY_NOT_BUDGETABLE`; "Intereses" se acepta.
    - `RF-M11-13`: si al crearlo ya está en el 120 %, se crea un solo aviso, el del 100.
    - `RF-M11-02`: si los hijos suman más que el padre, `childrenExceedParent` es verdadero.
    - `RF-M9-06`: cada presupuesto guarda sus propios umbrales y acción.

- [x] **`TASK-198`: Editar, pausar, reanudar, reiniciar el arrastre y eliminar presupuestos**
  - **Dependencias:** Requiere TASK-197
  - **Trazabilidad SDD:** plan §4.11.2 (`PATCH`, `pause`, `resume`, `reset-carryover`, `DELETE`), plan §4.11.3; RF-M11-06, RF-M11-07, RF-M11-12, EC-M11-08
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/budgets.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget-period.repository.ts`
    - `apps/api/test/integration/budgets-lifecycle.test.ts`
  - **Especificación de Implementación:** El monto, la acción y los umbrales se aplican al período en curso. `startDay` se guarda en `next_start_day` y la respuesta trae la fecha de fin del período alargado. Pausar guarda el arrastre en `frozen_carryover` y elimina el período en curso si no tiene decisión. Reanudar crea el período que contiene hoy con ese arrastre. Reiniciar el arrastre pone `carryover_in = 0` y anula los ajustes tardíos. Eliminar borra el presupuesto en cascada y resuelve sus avisos de decisión.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M11-06`: cambiar el monto afecta el período en curso y no los pasados.
    - `RF-M11-07`: cambiar el día de inicio devuelve la fecha de fin alargada.
    - `EC-M11-08`: al reanudar a mitad de período, el gasto cuenta desde el inicio del período, con el arrastre congelado.
    - `RF-M11-12`: reiniciar deja el arrastre en 0.
    - Pausar o reanudar en un estado inválido da `INVALID_STATE`.

- [x] **`TASK-199`: `LedgerHooks` de presupuestos: umbrales y movimientos tardíos**
  - **Dependencias:** Requiere TASK-197
  - **Trazabilidad SDD:** plan §4.11.3 (movimientos tardíos, umbrales); RF-M11-11, RF-M11-13, EC-M11-05, RNF-12
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget-period.repository.ts`
    - `apps/api/src/application/shared/budget-ledger-hook.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/budget-ledger-hook.test.ts`
  - **Especificación de Implementación:** *Handler* registrado en `LedgerHooks`. Umbrales: recalcula el % del período en curso, hace `INSERT … ON CONFLICT DO NOTHING RETURNING` en `budget_threshold_hit` y emite `budget_alert:{periodId}:{threshold}` solo si insertó; un presupuesto pausado no alerta. Tardíos: con la decisión pendiente, no hace nada; si se decidió con arrastre, inserta un `budget_late_adjustment` por la diferencia; en los demás casos, no hace nada.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Umbral avisa una sola vez" (`RF-M11-13`, `RNF-12`).
    - `EC-M11-05`: eliminar un gasto de un período decidido con arrastre sube el arrastre del período en curso por ese monto; con "descartar", no cambia nada.
    - `RF-M11-11`: un tardío con la decisión pendiente cambia el resultado mostrado sin crear ajustes.

- [x] **`TASK-200`: Job `budgets.close`**
  - **Dependencias:** Requiere TASK-064, TASK-199
  - **Trazabilidad SDD:** plan §4.11.3 (open → closed_pending); RF-M11-10, RF-M11-13, EC-M11-09, RNF-13, RNF-20
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget-period.repository.ts`
    - `apps/api/src/application/jobs/budgets.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/budgets-close-job.test.ts`
  - **Especificación de Implementación:** Con `withUserLock`, por cada período `open` con `end_date` < hoy en la zona del usuario: lo pasa a `closed_pending` con `decision_deadline = now() + 7 d`, crea el período siguiente (`carryover_in = 0`, aplicando `next_start_day`, con la evaluación de umbrales de inicio) y emite `period_close:{periodId}` con su decisión. Si el presupuesto está `finalizing`, no crea el siguiente y pasa a `finalized`. Corre en el tick y en la puesta al día del usuario.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M11-10`: tras una caída de 3 días, el cierre se genera al volver y el plazo de 7 días cuenta desde ese momento.
    - `RNF-13`: correrlo dos veces no crea dos períodos ni dos avisos.
    - `EC-M11-09`: un presupuesto `finalizing` pasa a `finalized` sin período siguiente.
    - `RNF-20`: el cierre usa la medianoche de la zona del usuario.

- [x] **`TASK-201`: Decidir el cierre de un período**
  - **Dependencias:** Requiere TASK-186, TASK-200
  - **Trazabilidad SDD:** plan §4.11.2 (`decision`), plan §4.11.3 (closed_pending → decided); RF-M11-08, RF-M11-09, EC-M11-02, EC-M11-03, EC-M11-09, RNF-11
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget-period.repository.ts`
    - `apps/api/src/application/services/budgets.service.ts`
    - `apps/api/test/integration/budgets-decision.test.ts`
  - **Especificación de Implementación:** `UPDATE budget_period … WHERE status = 'closed_pending' RETURNING` (si no, `DECISION_ALREADY_MADE`). Guarda `spent_at_decision` y `result_at_decision`. Sobrante: el arrastre reemplaza el `carryover_in` del período siguiente; "Enviar a meta" crea un apartado (`origin = budget`) con la cuenta bajo `FOR UPDATE` y el monto convertido con la referencia vigente, o una transferencia real si la meta tiene cuenta dedicada (`origin = goal_transfer`); el resto se descarta. Exceso: arrastrar (negativo) o absorber. Resuelve el aviso.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Repartir un sobrante": con 800 y 650 gastados, arrastrar 50 y enviar 100 a "Viaje" desde el Banco deja noviembre con 850 disponible y un apartado de 100 en el Banco.
    - Escenario "Exceso arrastrado": 300 con 400 gastados → el período siguiente tiene 200 disponible.
    - `EC-M11-02`: enviar más que el saldo libre da `EARMARK_EXCEEDS_FREE`.
    - `EC-M11-03`: con la meta archivada da `GOAL_NOT_AVAILABLE`.
    - `RF-M11-09`: enviar a meta desde una subcategoría da `TO_GOAL_NOT_ALLOWED`.
    - `EC-M11-09`: arrastrar en un presupuesto finalizado se rechaza.
    - `RNF-11`: una doble decisión aplica una sola.

- [x] **`TASK-202`: Job `budgets.defaultDecision`**
  - **Dependencias:** Requiere TASK-201
  - **Trazabilidad SDD:** plan §4.11.3 (closed_pending → defaulted); RF-M11-10, RNF-12, RNF-13
  - **Archivos en Alcance:**
    - `apps/api/src/composition/container.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget-period.repository.ts`
    - `apps/api/src/application/jobs/budgets.ts`
    - `apps/api/test/integration/budgets-default-job.test.ts`
  - **Especificación de Implementación:** Si `decision_deadline` < `now()`, aplica la `default_action` (ante un exceso, descartar equivale a absorber; un período finalizado no arrastra), pasa a `defaulted` y resuelve el aviso.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Decisión por defecto": con un reloj 7 días después, el período queda `defaulted` y el período en curso no tiene arrastre de ese cierre.
    - `RNF-12`: un usuario que decide en el mismo instante que el job deja una sola decisión.

- [x] **`TASK-203`: Presupuestos al archivar y fusionar categorías**
  - **Dependencias:** Requiere TASK-114, TASK-201
  - **Trazabilidad SDD:** plan §4.5.2 (archivar, fusionar), plan §4.11.3 (finalizing); RF-M5-07, RF-M5-08, EC-M11-04, EC-M5-03
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/budget-period.repository.ts`
    - `apps/api/src/application/services/categories.service.ts`
    - `apps/api/test/integration/categories-budgets.test.ts`
  - **Especificación de Implementación:** Archivar una categoría pasa su presupuesto a `finalizing`; la decisión pendiente sigue disponible hasta su plazo. Fusionar: si A tiene un cierre pendiente, da `MERGE_PENDING_CLOSE`; el presupuesto de A pasa a B si B no tenía; si los dos tenían, se conserva el de B y se elimina el de A, con un aviso en la respuesta.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Archivar una categoría con presupuesto y recurrente" (parte de presupuestos): el presupuesto sigue hasta el fin del período y pasa a Finalizado.
    - `EC-M11-04`: la decisión pendiente sigue disponible después de archivar.
    - `RF-M5-08`: con los dos presupuestos se conserva el de B; con un cierre pendiente en A, `MERGE_PENDING_CLOSE`.
    - `EC-M5-03`: después de mover una subcategoría, los períodos cerrados del padre no cambian.

- [x] **`TASK-204`: Rutas HTTP de presupuestos**
  - **Dependencias:** Requiere TASK-198, TASK-202, TASK-203
  - **Trazabilidad SDD:** plan §4.11.2 (tabla de endpoints), ADR-18; RNF-14, RF-M2-03
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/budgets.routes.ts`
    - `apps/api/src/presentation/controllers/budgets.controller.ts`
    - `apps/api/src/presentation/presenters/budgets.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/budgets.test.ts`
    - `apps/api/test/http/budgets.isolation.test.ts`
    - `apps/api/test/http/isolation-sweep.test.ts`
  - **Especificación de Implementación:** Monta los endpoints de plan §4.11.2 detrás de `releaseGate('m11')`.
  - **Criterios de Verificación (Tests & DoD):**
    - Cada endpoint responde con sus estados y errores.
    - `RNF-14`: el usuario B recibe 404 con un presupuesto o un período de A, también al decidir.
    - `RF-M2-03`: con `RELEASE=1.0`, `RELEASE_NOT_AVAILABLE`.

- [x] **`TASK-205`: Web: lista y detalle de presupuestos**
  - **Dependencias:** Requiere TASK-179, TASK-204
  - **Trazabilidad SDD:** plan §4.11.4 (`/presupuestos`, `/presupuestos/:id`); RF-M11-05, RF-M11-12, RF-M11-14, EC-M11-01, spec §2.11.1 (seguir el período)
  - **Archivos en Alcance:**
    - `apps/web/src/features/budgets/api.ts`
    - `apps/web/src/features/budgets/hooks/use-budgets.ts`
    - `apps/web/src/features/budgets/components/budget-list.tsx`
    - `apps/web/src/features/budgets/components/budget-progress.tsx`
    - `apps/web/src/features/budgets/components/pace-text.tsx`
    - `apps/web/src/features/budgets/components/carryover-breakdown.tsx`
    - `apps/web/src/features/budgets/components/period-history.tsx`
    - `apps/web/src/features/budgets/components/budget-actions.tsx`
    - `apps/web/src/features/budgets/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/budgets.json`
    - `e2e/m11-budgets.spec.ts`
  - **Especificación de Implementación:** Barras con el período visible. Detalle con la barra y la marca "hoy deberías llevar X", el ritmo, "Monto ± arrastre = disponible" con los ajustes tardíos, el historial de 12 períodos y las acciones Pausar, Reanudar, Reiniciar arrastre (con confirmación que muestra el monto) y Eliminar.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M11-01`: un período que empieza superado muestra "Superado por X" desde el inicio.
    - `RF-M11-12`: la confirmación de reiniciar muestra el monto.
    - `RF-M11-05`: se ve el desglose del arrastre.

- [x] **`TASK-206`: Web: formulario de presupuesto**
  - **Dependencias:** Requiere TASK-205
  - **Trazabilidad SDD:** plan §4.11.4 (formulario); RF-M11-01, RF-M11-07, RF-M9-06, EC-M11-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/budgets/components/budget-list.tsx`
    - `apps/web/src/features/budgets/components/budget-actions.tsx`
    - `apps/web/src/features/budgets/api.ts`
    - `apps/web/src/features/budgets/hooks/use-budgets.ts`
    - `apps/web/src/features/budgets/components/budget-form.tsx`
    - `apps/web/src/features/budgets/routes.tsx`
    - `apps/web/src/locales/es-BO/budgets.json`
    - `e2e/m11-budget-form.spec.ts`
  - **Especificación de Implementación:** Alcance (categoría, subcategoría o General; sin "Deudas y préstamos"), monto, moneda, día de inicio, acción por defecto y hasta 3 umbrales. Usa un borrador. Al editar no se puede cambiar la moneda, y al cambiar el día de inicio se informa la fecha de fin del período alargado.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M11-06`: crear un segundo presupuesto para la misma categoría ofrece editar el existente.
    - `RF-M11-07`: cambiar el día de inicio muestra la fecha de fin.
    - `RF-M11-01`: "Deudas y préstamos" no se ofrece como alcance.

- [x] **`TASK-207`: Web: decisión de cierre en el presupuesto y en la bandeja**
  - **Dependencias:** Requiere TASK-191, TASK-205
  - **Trazabilidad SDD:** plan §4.11.4 (`CloseDecisionCard`, en la bandeja); RF-M11-08, RF-M11-09, EC-M11-03, EC-M11-09, RF-M15-03
  - **Archivos en Alcance:**
    - `apps/web/src/features/budgets/routes.tsx`
    - `apps/web/src/features/budgets/api.ts`
    - `apps/web/src/features/budgets/hooks/use-budgets.ts`
    - `apps/web/src/features/budgets/components/close-decision-card.tsx`
    - `apps/web/src/features/budgets/components/surplus-split-form.tsx`
    - `apps/web/src/features/budgets/components/deficit-choice.tsx`
    - `apps/web/src/features/notifications/components/notification-item.tsx`
    - `apps/web/src/locales/es-BO/budgets.json`
    - `e2e/m11-close-decision.spec.ts`
  - **Especificación de Implementación:** "Comida cerró octubre: sobraron Bs 150,00" (o "te pasaste por…"). `SurplusSplitForm` reparte en vivo con suma exacta, con selector de meta y cuenta (solo donde se permite enviar a meta). `DeficitChoice` ofrece Arrastrar y Absorber. En un presupuesto finalizado no se ofrece arrastrar. La bandeja muestra la versión compacta, que llama al mismo endpoint.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Repartir un sobrante" (E2E): después de aplicar, noviembre muestra Bs 850,00 disponible.
    - `RF-M11-08`: "Aplicar" está deshabilitado mientras la suma no es exacta.
    - `EC-M11-03`: una meta archivada desaparece de las opciones.
    - `RF-M15-03`: la decisión se toma desde la bandeja y queda resuelta en el presupuesto.

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M5 - Categorías]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-18 - Entregas con RELEASE]]
- **Requerimientos no funcionales:** [[Spec 3.10 Límites por usuario]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.7 Tiempo]]
- **Fases de tareas:** [[Tareas Fase 10 - M5 Categorías (V1.0)]] · [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]] · [[Tareas Fase 3 - Dominio transversal]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 3.6 Planificación (M11 a M14)]] · [[Plan 4.11 M11 - Presupuestos (V1.1)]] · [[Plan 4.5 M5 - Categorías (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]] · [[Spec 2.11 M11 - Presupuestos (V1.1)]]
- **Entidades:** [[Entidad - Budget]] · [[Entidad - BudgetLateAdjustment]] · [[Entidad - BudgetThresholdHit]]

