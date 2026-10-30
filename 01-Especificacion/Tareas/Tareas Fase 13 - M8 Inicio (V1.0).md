---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 13 - M8 Inicio (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M8"
fase: "13"
tareas: "6"
modulo: "M8"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 12 - M7 Registrar (V1.0)]] · → [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]]

### Fase 13 — M8 Inicio (V1.0)

- [x] **`TASK-143`: Contratos de M8**
  - **Dependencias:** Requiere TASK-096, TASK-118
  - **Trazabilidad SDD:** plan §4.8.1; RF-M8-01, RF-M8-03
  - **Archivos en Alcance:**
    - `packages/contracts/src/dashboard.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/dashboard.test.ts`
  - **Especificación de Implementación:** `DashboardQuery` y `DashboardDto` (incluye los tipos opcionales `BudgetBarDto` y `UpcomingItemDto` de V1.1).
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M8-01`: `month` exige el formato AAAA-MM.
    - `RF-M8-03`: `savingsRatePct` admite `null`.

- [x] **`TASK-144`: Dominio `dashboard`: comparación, variación y tasa de ahorro**
  - **Dependencias:** Requiere TASK-027
  - **Trazabilidad SDD:** plan §4.8.1 (`packages/domain/dashboard`); RF-M8-03, RF-M8-04, EC-M8-03
  - **Archivos en Alcance:**
    - `packages/domain/src/dashboard.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/dashboard.test.ts`
  - **Especificación de Implementación:** `comparisonWindow(month, today)`: en el mes en curso, el mismo tramo de días del mes anterior (o hasta su último día); en un mes cerrado, el mes anterior completo. `pctChange` es un entero redondeado con la mitad hacia arriba, y `null` si el anterior es 0. `savingsRate` es `null` si no hay ingresos o el balance es negativo. `savingsRateDeltaPp`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Comparación por el mismo tramo" (`RF-M8-04`): el 15/10, 1.000 contra 1.200 da +20.
    - `EC-M8-03`: el día 31 contra un mes de 30 días compara con el mes completo.
    - Escenario "Tasa de ahorro oculta" (`RF-M8-03`): con ingresos 3.000 y gastos 3.500, da `null`.
    - Con un valor anterior de 0, `pctChange` da `null`.

- [x] **`TASK-145`: `DashboardService`: tarjetas, variaciones y rango de meses**
  - **Dependencias:** Requiere TASK-126, TASK-143, TASK-144
  - **Trazabilidad SDD:** plan §4.8.2, plan §4.8.3; RF-M8-01, RF-M8-02, RF-M8-03, RF-M8-04, EC-M8-02, RN-02, RN-05, RN-12
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/dashboard.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/dashboard.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/dashboard-cards.test.ts`
  - **Especificación de Implementación:** Dentro de una transacción de solo lectura, con una consulta SQL por bloque: ingresos y gastos sin lo de RN-02, convertidos con las tasas guardadas; balance; tasa de ahorro; variaciones según `comparisonWindow`. El rango va desde el mes del primer movimiento o del primer saldo inicial hasta el mes actual.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Préstamos no inflan los ingresos" (`RN-02`): un ingreso de Bs 5.000 en "Deudas y préstamos" no suma en Ingresos, pero sí en el saldo de la cuenta.
    - `EC-M8-02`: un mes sin movimientos da tarjetas en 0 y la tasa de ahorro en `null`.
    - `RF-M8-01`: el rango empieza en el mes del primer saldo inicial y no incluye meses futuros.
    - `RN-12`: un gasto anterior al saldo inicial cuenta en los gastos del mes.

- [x] **`TASK-146`: `DashboardService`: bloques y endpoint `/api/dashboard`**
  - **Dependencias:** Requiere TASK-145
  - **Trazabilidad SDD:** plan §4.8.2 (`GET /api/dashboard`), plan §4.8.3; RF-M8-05, RF-M8-06, RF-M8-07, RF-M8-10, RF-M5-03, RF-M5-09, EC-M8-04, RNF-14
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/dashboard.service.ts`
    - `apps/api/src/infrastructure/persistence/repositories/dashboard.repository.ts`
    - `apps/api/src/presentation/routes/dashboard.routes.ts`
    - `apps/api/src/presentation/controllers/dashboard.controller.ts`
    - `apps/api/src/presentation/presenters/dashboard.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/dashboard.test.ts`
  - **Especificación de Implementación:** Gasto por categoría: las 5 principales con sus hijas sumadas, con monto y %, más "Otras". Ritmo: el gasto acumulado por día del mes (hasta hoy, si es el actual) contra el mes anterior completo. Saldos: el total neto de hoy en la base y la otra moneda, y las 5 primeras cuentas. Los 5 últimos movimientos. Omite los bloques no liberados y los ocultos en `dashboard_blocks`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M8-05` / `RF-M5-03`: una subcategoría suma a su padre, y la sexta categoría va a "Otras".
    - `RF-M5-09`: después de mover una subcategoría, los totales del mes pasado cambian.
    - `RF-M8-07`: los saldos son los de hoy aunque se pida un mes pasado.
    - `EC-M8-04`: sin tasa, `netWorth.other` es `null`.
    - `RF-M8-10`: un bloque oculto no viene en la respuesta.
    - `RNF-14`: el usuario B nunca ve datos de A.

- [x] **`TASK-147`: Web: Inicio, selector de mes y tarjetas**
  - **Dependencias:** Requiere TASK-107, TASK-129, TASK-146
  - **Trazabilidad SDD:** plan §4.8.4 (`/`); RF-M8-01, RF-M8-03, RF-M8-04, RF-M8-11, EC-M8-01, EC-M8-02
  - **Archivos en Alcance:**
    - `apps/web/src/features/dashboard/api.ts`
    - `apps/web/src/features/dashboard/hooks/use-dashboard.ts`
    - `apps/web/src/features/dashboard/components/summary-cards.tsx`
    - `apps/web/src/features/dashboard/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/dashboard.json`
    - `e2e/m8-dashboard-cards.spec.ts`
  - **Especificación de Implementación:** Selector de mes (reutiliza `MonthSelector`) y las 4 tarjetas con sus variaciones: los gastos que suben, en rojo; los ingresos, el balance y la tasa de ahorro que suben, en verde. `['dashboard', month]` con `staleTime` 0, invalidado por toda mutación. Sin cuentas, invita a crear la primera con `QuickAccountForm`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Registro rápido en menos de 10 segundos" (Inicio): después de guardar en Registrar, el Inicio refleja el gasto (`RF-M8-11`).
    - `EC-M8-01`: sin cuentas, se ve la invitación.
    - `RF-M8-04`: una variación de gastos positiva se muestra en rojo, con un texto accesible que no depende solo del color.
    - `EC-M8-02`: en un mes vacío, la tasa de ahorro no aparece.

- [x] **`TASK-148`: Web: bloques del Inicio y navegación**
  - **Dependencias:** Requiere TASK-147
  - **Trazabilidad SDD:** plan §4.8.4 (orden de `dashboard_blocks`, navegación); RF-M8-05, RF-M8-06, RF-M8-07, RF-M8-10, EC-M8-04
  - **Archivos en Alcance:**
    - `apps/web/src/features/dashboard/components/dashboard-blocks.tsx`
    - `apps/web/src/features/dashboard/components/category-bars.tsx`
    - `apps/web/src/features/dashboard/components/pace-chart.tsx`
    - `apps/web/src/features/dashboard/components/balances-block.tsx`
    - `apps/web/src/features/dashboard/components/recent-block.tsx`
    - `apps/web/src/features/dashboard/routes.tsx`
    - `apps/web/src/locales/es-BO/dashboard.json`
    - `e2e/m8-dashboard-blocks.spec.ts`
  - **Especificación de Implementación:** Los bloques en el orden de `dashboard_blocks`, cada uno con sus estados Con datos y Vacío ("Aún no tienes gastos este mes · Registrar"). "Saldos al día de hoy" con "Ver todas". Cada tarjeta o categoría navega a `/movimientos?month=…&kind=…` o `&categoryId=…`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M8-10`: tocar la tarjeta Gastos abre Movimientos filtrado por gasto y ese mes.
    - `RF-M8-07`: se ve la leyenda "Saldos al día de hoy".
    - `EC-M8-04`: sin tasa, se ve "Sin tipo de cambio".
    - `RF-M8-05`: tocar una categoría filtra Movimientos por ella.

---
## 🔗 Relacionado

- **Módulos:** [[M5 - Categorías]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Requerimientos no funcionales:** [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 3 - Dominio transversal]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 4.8 M8 - Inicio (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

