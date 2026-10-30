---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 25 - Final: integración E2E y validación de RNF"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "25"
tareas: "7"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 24 - M15 Recordatorios y avisos completos (V1.2)]] · → [[Tareas Fase 26 - Correcciones de QA]]

### Fase 25 — Final: integración E2E y validación de RNF

- [x] **`TASK-243`: Cobertura de escenarios Gherkin y regresión completa**
  - **Dependencias:** Requiere TASK-236, TASK-241, TASK-242
  - **Trazabilidad SDD:** plan §5.2 (criterios de aceptación → pruebas), plan §5.4 (definición de terminado, puntos 1 y 3)
  - **Archivos en Alcance:**
    - `e2e/gherkin-coverage.spec.ts`
    - `apps/api/test/integration/gherkin-accounts-categories.test.ts`
    - `e2e/gherkin-accounts-categories.spec.ts`
    - `e2e/gherkin-register.spec.ts`
  - **Especificación de Implementación:** Lee los títulos de todos los escenarios Gherkin de `spec.md` y verifica que cada uno aparece en el nombre de al menos un test (E2E o del API). Además, verifica que cada RF y EC de la spec aparece en el nombre de algún test. Las Fases 7 a 12 se hicieron sin pruebas nuevas, así que quedaron 9 escenarios y 20 RF/EC de V1.0 sin test con su nombre; esta tarea los cubre con pruebas nuevas, sin tocar las existentes. Escenarios sin test: «Bloqueo sin conexión conserva el borrador», «La historia no se reescribe al cambiar la base», «Ajuste de saldo», «Fusionar duplicados», «Categoría del sistema protegida», «Borrador al cambiar de pestaña», «Atajo rellena sin guardar», «El borrador conserva su tipo» y «Deshacer después de guardar». RF/EC sin test: RF-M4-06, RF-M4-09, RF-M4-11, RF-M4-12, EC-M4-04, EC-M4-05, EC-M4-07, EC-M4-08, EC-M5-02, EC-M5-07, EC-M6-06, RF-M7-05, RF-M7-06 y EC-M7-01, EC-M7-02, EC-M7-04 a EC-M7-08. Cada prueba nueva lleva en su nombre el título del escenario o el ID, y verifica el comportamiento que ya existe.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-243`: los 56 escenarios Gherkin tienen su test, y la prueba lista los que falten.
    - `TASK-243`: cada RF y EC de `spec.md` aparece en el nombre de algún test.

- [x] **`TASK-244`: Jobs interrumpidos que se retoman (RNF-13)**
  - **Dependencias:** Requiere TASK-229, TASK-240
  - **Trazabilidad SDD:** plan §5.3 (RNF-13), ADR-01; RNF-13, RF-M14-12, RNF-12
  - **Archivos en Alcance:**
    - `apps/api/test/integration/jobs-resume.test.ts`
  - **Especificación de Implementación:** Para `budgets.close`, `recurring.generate` y `notifications.scheduled`: inyecta un fallo a mitad de un lote de varios usuarios, vuelve a correr el job y compara con una corrida sin interrupción.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-13`: después de reintentar, no hay duplicados ni omisiones en los cierres, las ocurrencias ni los avisos.

- [x] **`TASK-245`: Fechas de negocio en varias zonas horarias (RNF-20)**
  - **Dependencias:** Requiere TASK-244
  - **Trazabilidad SDD:** plan §5.3 (RNF-20), plan §5.1 (datos de prueba: tres zonas); RNF-20, RF-M14-04, RN-07
  - **Archivos en Alcance:**
    - `apps/api/test/integration/timezones.test.ts`
  - **Especificación de Implementación:** Usuarios en America/La_Paz, Europe/Madrid y America/Santiago, con un reloj en los cruces de medianoche y de horario de verano: validación de la fecha de un movimiento, cierre de presupuestos, ocurrencias a las 00:00 y avisos a las 08:00.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-20`: cada proceso usa el día local del usuario en las tres zonas.
    - `RF-M14-04`: en el día del cambio de hora, la ocurrencia se ejecuta una vez, en el primer minuto válido.

- [x] **`TASK-246`: Barrido de concurrencia**
  - **Dependencias:** Requiere TASK-244
  - **Trazabilidad SDD:** plan §5.1 (concurrencia), plan §4.3.3; RNF-10, RNF-11, RNF-12
  - **Archivos en Alcance:**
    - `apps/api/test/integration/concurrency-sweep.test.ts`
  - **Especificación de Implementación:** Con `Promise.all` y conexiones distintas: desactivar una moneda mientras se crea una cuenta en ella; dos ticks en paralelo; un pago de deuda y la eliminación de su último pago al mismo tiempo; dos apartados que superan juntos el saldo libre.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-10`: ningún saldo ni apartado queda inconsistente.
    - `RNF-11` / `RNF-12`: cada operación surte efecto una sola vez.
    - La moneda queda activa con la cuenta creada, o inactiva sin ella, nunca las dos cosas.

- [x] **`TASK-247`: Validación final de V1.2: accesibilidad, rendimiento, aislamiento y entregas**
  - **Dependencias:** Requiere TASK-243, TASK-245, TASK-246
  - **Trazabilidad SDD:** plan §5.3 (RNF-01 a RNF-07, RNF-14), plan §5.4; RNF-01, RNF-02, RNF-03, RNF-05, RNF-06, RNF-07, RNF-14, RF-M2-03
  - **Archivos en Alcance:**
    - `e2e/a11y-v1-2.spec.ts`
    - `e2e/release-gating.spec.ts`
  - **Especificación de Implementación:** axe en todas las pantallas de V1.2 en los dos temas y los 6 proyectos. Con `RELEASE=1.1`, Recurrentes, Ajustes › Recordatorios y los tipos `log_day` y `goal_progress` no aparecen. Vuelve a correr las suites de rendimiento, el barrido de aislamiento y el lint de textos sobre el producto completo.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-06`: ninguna violación seria o crítica de axe en todo el producto.
    - `RF-M2-03`: con 1.1, los módulos de V1.2 no aparecen.
    - Comando: `pnpm --filter e2e exec playwright test perf.spec.ts --project=chromium-1280`
    - Comando: `pnpm --filter api exec vitest run test/http/isolation-sweep.test.ts test/integration/performance.test.ts`
    - Comando: `pnpm lint`

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]]
- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.7 Tiempo]]
- **Fases de tareas:** [[Tareas Fase 23 - M14 Recurrentes (V1.2)]]
- **Spec / Plan / Constitución:** [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]] · [[Plan 5.1 Estrategia]] · [[Plan 5.2 Criterios de aceptación (Gherkin) → pruebas]] · [[Plan 5.3 Requerimientos no funcionales → verificación]] · [[Plan 5.4 Definición de terminado de cada módulo]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

