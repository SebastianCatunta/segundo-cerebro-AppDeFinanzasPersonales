---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 22 - Cierre de V1.1: Inicio, exportación y regresión"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "22"
tareas: "4"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 21 - M13 Deudas y préstamos (V1.1)]] · → [[Tareas Fase 23 - M14 Recurrentes (V1.2)]]

### Fase 22 — Cierre de V1.1: Inicio, exportación y regresión

- [x] **`TASK-219`: Inicio: bloque "Presupuesto del mes"**
  - **Dependencias:** Requiere TASK-148, TASK-204
  - **Trazabilidad SDD:** plan §4.8.1 (`budgets`), plan §4.8.4 (`BudgetBlock`); RF-M8-08, RF-M8-10
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/dashboard.service.ts`
    - `apps/api/src/infrastructure/persistence/repositories/dashboard.repository.ts`
    - `apps/api/test/http/dashboard-budgets.test.ts`
    - `apps/web/src/features/dashboard/components/budget-block.tsx`
    - `apps/web/src/features/dashboard/components/dashboard-blocks.tsx`
    - `apps/web/src/locales/es-BO/dashboard.json`
    - `e2e/m8-dashboard-budgets.spec.ts`
  - **Especificación de Implementación:** Una barra por presupuesto activo con su período visible. En un mes pasado, los períodos que terminaron dentro de ese mes. Solo con `RELEASE` ≥ 1.1. Lleva a Presupuestos.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M8-08`: en el mes actual se ve un presupuesto activo; en un mes pasado, el período que cerró en él.
    - Con `RELEASE=1.0`, el bloque no viene en la respuesta.

- [x] **`TASK-220`: Inicio: bloque "Próximos pagos y deudas"**
  - **Dependencias:** Requiere TASK-219, TASK-216
  - **Trazabilidad SDD:** plan §4.8.1 (`upcoming`); RF-M8-09, RF-M4-08
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/dashboard.service.ts`
    - `apps/api/src/infrastructure/persistence/repositories/dashboard.repository.ts`
    - `apps/api/test/http/dashboard-upcoming.test.ts`
    - `apps/web/src/features/dashboard/components/upcoming-block.tsx`
    - `apps/web/src/features/dashboard/components/dashboard-blocks.tsx`
    - `apps/web/src/locales/es-BO/dashboard.json`
    - `e2e/m8-dashboard-upcoming.spec.ts`
  - **Especificación de Implementación:** Los vencimientos de los próximos 7 días: deudas en ambas direcciones y tarjetas (corte y pago; si el mes no tiene ese día, el último día del mes). En un mes pasado, el bloque se oculta. Los recurrentes se agregan en TASK-236.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M8-09`: una deuda que vence en 5 días aparece; una que vence en 8, no.
    - `RF-M4-08`: una tarjeta con pago el día 31 en un mes de 30 días aparece el 30.
    - En un mes pasado, el bloque no aparece.

- [x] **`TASK-221`: Exportadores de V1.1**
  - **Dependencias:** Requiere TASK-164, TASK-187, TASK-202, TASK-214, TASK-177
  - **Trazabilidad SDD:** plan §4.1.2 (`GET /api/me/export`); RF-M1-14, RNF-16
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/export.service.ts`
    - `apps/api/src/infrastructure/persistence/repositories/export.repository.ts`
    - `apps/api/test/http/me-export-v1-1.test.ts`
  - **Especificación de Implementación:** Agrega los CSV de apartados y retiros, presupuestos y sus períodos, metas, deudas y pagos, y avisos, filtrados por `RELEASE`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-14`: con `RELEASE=1.1`, el ZIP incluye esos CSV, con las metas archivadas.
    - `RNF-16`: cada CSV tiene todas las filas del usuario.

- [x] **`TASK-222`: Regresión de V1.1: accesibilidad y entregas**
  - **Dependencias:** Requiere TASK-207, TASK-218, TASK-220, TASK-221
  - **Trazabilidad SDD:** plan §5.4 (definición de terminado), plan §5.3 (RNF-05, RNF-06, RNF-14); RNF-05, RNF-06, RNF-14, RF-M2-03
  - **Archivos en Alcance:**
    - `e2e/a11y-v1-1.spec.ts`
    - `e2e/release-gating.spec.ts`
  - **Especificación de Implementación:** axe en todas las pantallas de V1.1 en los dos temas y los 6 proyectos. Verifica que, con `RELEASE=1.0`, ningún módulo de V1.1 aparece en el menú, el Inicio ni la cabecera (sin campana). El barrido de aislamiento de TASK-170 cubre solo las rutas nuevas.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-06`: ninguna violación seria o crítica de axe en las pantallas de V1.1.
    - `RF-M2-03` (`@release-1.0`): no hay campana, ni PLANIFICAR, ni bloques de V1.1.
    - Comando: `pnpm --filter api exec vitest run test/http/isolation-sweep.test.ts`

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M2 - Navegación y estructura]] · [[M4 - Cuentas]] · [[M8 - Inicio (dashboard)]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 13 - M8 Inicio (V1.0)]] · [[Tareas Fase 16 - Exportación de datos (M1, V1.0)]] · [[Tareas Fase 17 - Cierre de V1.0 rendimiento, accesibilidad y despliegue]] · [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]] · [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]] · [[Tareas Fase 20 - M11 Presupuestos (V1.1)]]
- **Spec / Plan / Constitución:** [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Plan 4.8 M8 - Inicio (V1.0)]] · [[Plan 5.3 Requerimientos no funcionales → verificación]] · [[Plan 5.4 Definición de terminado de cada módulo]]

