---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 24 - M15 Recordatorios y avisos completos (V1.2)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M15"
fase: "24"
tareas: "6"
modulo: "M15"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 23 - M14 Recurrentes (V1.2)]] · → [[Tareas Fase 25 - Final integración E2E y validación de RNF]]

### Fase 24 — M15 Recordatorios y avisos completos (V1.2)

- [x] **`TASK-237`: Preferencias de avisos**
  - **Dependencias:** Requiere TASK-177, TASK-226
  - **Trazabilidad SDD:** plan §4.15.2 (`/api/notification-preferences`), plan §4.15.3; RF-M15-03, RF-M15-07
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/notifications.service.ts`
    - `apps/api/src/presentation/routes/notifications.routes.ts`
    - `apps/api/src/presentation/controllers/notifications.controller.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/notification-preference.repository.ts`
    - `apps/api/test/http/notification-preferences.test.ts`
    - `apps/api/test/http/isolation-sweep.test.ts`
  - **Especificación de Implementación:** `GET` y `PATCH /api/notification-preferences`, disponibles solo con `RELEASE` = 1.2. La hora, la anticipación y los días de la semana se aceptan solo en los tipos que los usan.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M15-07`: con `RELEASE=1.1`, la configuración da `RELEASE_NOT_AVAILABLE`.
    - Escenario "Decisión visible con el aviso desactivado" (`RF-M15-03`): con `recurring_pending` desactivado, un pendiente no crea ningún aviso, pero sí aparece en `/api/recurring`.

- [x] **`TASK-238`: Avisos programados de pagos próximos (recurrentes y tarjetas)**
  - **Dependencias:** Requiere TASK-215, TASK-237
  - **Trazabilidad SDD:** plan §4.15.1 (valores por defecto), plan §4.15.3 (generación programada); RF-M15-02, RF-M15-09, RF-M15-10, EC-M15-02, RF-M4-08
  - **Archivos en Alcance:**
    - `apps/api/src/application/jobs/notifications.ts`
    - `apps/api/test/integration/notifications-payments-job.test.ts`
  - **Especificación de Implementación:** A las 08:00 locales: recurrentes de gasto y transferencia con frecuencia semanal o mayor (no diarias), con la anticipación configurada (1 día por defecto) y "monto por definir" si no tienen monto; tarjetas, el día de corte y 3 días antes del pago (si el mes no tiene ese día, el último día). La clave incluye la fecha. Solo se evalúa el día en curso.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M15-02`: una regla diaria no genera aviso; una semanal genera uno un día antes.
    - `EC-M15-02`: si cambia el día de pago después de generado el aviso, no se repite, y el próximo usa la nueva fecha.
    - `RF-M15-10`: al reactivar el tipo, no se generan avisos de días pasados.
    - `RF-M4-08`: una tarjeta con corte el 31 en noviembre avisa el 30.

- [x] **`TASK-239`: Aviso "Registrar el día"**
  - **Dependencias:** Requiere TASK-237
  - **Trazabilidad SDD:** plan §4.15.3 (`log_day`); RF-M15-02, EC-M15-03
  - **Archivos en Alcance:**
    - `apps/api/src/application/jobs/notifications.ts`
    - `apps/api/test/integration/notifications-log-day-job.test.ts`
  - **Especificación de Implementación:** Con `log_day` activo, a su hora (21:00 por defecto) y en los días de la semana elegidos, crea un aviso por día con la clave `log_day:{fecha}`.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M15-03`: el aviso se genera aunque haya movimientos ese día.
    - `RF-M15-02`: en un día no elegido no se genera.

- [x] **`TASK-240`: Avisos de avance de metas**
  - **Dependencias:** Requiere TASK-187, TASK-237
  - **Trazabilidad SDD:** plan §4.12.3 (hitos), plan §4.15.1; RF-M15-02, RF-M15-04, RF-M12-01, RNF-12
  - **Archivos en Alcance:**
    - `apps/api/src/application/shared/goal-milestones.ts`
    - `apps/api/src/application/services/goals.service.ts`
    - `apps/api/src/application/jobs/fx.ts`
    - `apps/api/src/application/jobs/notifications.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/src/application/services/budgets.service.ts`
    - `apps/api/test/integration/goal-milestones.test.ts`
  - **Especificación de Implementación:** Después de cada evento de apartado, de cada asiento de una cuenta dedicada (*handler* de `LedgerHooks`) y del job horario de tasas, evalúa los hitos 25, 50, 75 y 100 y emite `goal:{id}:milestone:{n}`. El día 1 de cada mes, a las 08:00, avisa si el aporte del mes anterior (apartados + entradas a la dedicada − retiros, sin el efecto del tipo de cambio) fue menor que el sugerido.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Sin duplicados" (`RF-M15-04`, `RNF-12`): cuando el 50 % baja y vuelve a cruzarse por el tipo de cambio, no hay un segundo aviso.
    - `RF-M12-01`: cambiar la moneda de la meta no repite los hitos ya avisados.
    - `RF-M15-02`: el aviso mensual sale solo si el aporte fue menor que el sugerido.

- [x] **`TASK-241`: Web: Ajustes de recordatorios**
  - **Dependencias:** Requiere TASK-151, TASK-237
  - **Trazabilidad SDD:** plan §4.15.4 (`/ajustes/recordatorios`); RF-M15-03, RF-M15-07, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/settings/components/preferences-list.tsx`
    - `apps/web/src/features/settings/routes.tsx`
    - `apps/web/src/locales/es-BO/settings.json`
    - `apps/web/src/features/settings/components/settings-hub.tsx`
    - `apps/web/src/features/settings/api.ts`
    - `apps/web/src/features/settings/hooks/use-notification-preferences.ts`
    - `apps/web/src/app/router.tsx`
    - `e2e/m15-preferences.spec.ts`
  - **Especificación de Implementación:** `PreferencesList` con un interruptor por tipo y, según el tipo, la hora, la anticipación de 0 a 7 días y los días de la semana. Se guarda al instante. Con `RELEASE` < 1.2, la sección no aparece.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Decisión visible con el aviso desactivado" (E2E): con el tipo desactivado, el pendiente no llega a la bandeja pero sí aparece en Recurrentes.
    - `RNF-06`: los controles se manejan con el teclado y sin violaciones de axe.

- [x] **`TASK-242`: Exportadores de V1.2**
  - **Dependencias:** Requiere TASK-221, TASK-231
  - **Trazabilidad SDD:** plan §4.1.2 (`GET /api/me/export`); RF-M1-14, RNF-16
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/export.service.ts`
    - `apps/api/src/infrastructure/persistence/repositories/export.repository.ts`
    - `apps/api/test/http/me-export-v1-2.test.ts`
  - **Especificación de Implementación:** Agrega los CSV de reglas recurrentes y de pendientes y ocurrencias, filtrados por `RELEASE`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-14`: con `RELEASE=1.2`, el ZIP incluye las reglas y los pendientes; con 1.1, no.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M12 - Metas de ahorro]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M4 - Cuentas]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]] · [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]] · [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]] · [[Tareas Fase 21 - M13 Deudas y préstamos (V1.1)]] · [[Tareas Fase 22 - Cierre de V1.1 Inicio, exportación y regresión]]
- **Spec / Plan / Constitución:** [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Plan 4.12 M12 - Metas de ahorro (V1.1)]] · [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]]

