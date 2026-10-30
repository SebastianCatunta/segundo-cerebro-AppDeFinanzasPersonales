---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 3 - Dominio transversal"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "3"
tareas: "4"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 2 - Contratos y catálogos compartidos]] · → [[Tareas Fase 4 - Base del API]]

### Fase 3 — Dominio transversal

- [x] **`TASK-026`: Dominio `money`: redondeo y aritmética decimal**
  - **Dependencias:** Requiere TASK-006
  - **Trazabilidad SDD:** ADR-03, plan §5.1 (tests de propiedades); RN-06, RNF-18; constitución §3
  - **Archivos en Alcance:**
    - `packages/domain/src/money.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/money.test.ts`
  - **Especificación de Implementación:** Configuración de decimal.js, `round2` (mitad alejándose del cero), `parseMoney` y `toMoneyString` ("1234.56"), `sumRounded` (suma de valores ya redondeados) y comparaciones. Ninguna función acepta ni devuelve `number`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RN-06`: 0,005 → 0,01; −0,005 → −0,01; 2,345 → 2,35.
    - `RNF-18`: una prueba de propiedad con 1.000 casos aleatorios verifica que `sumRounded` no acumula diferencias.

- [x] **`TASK-027`: Dominio `dates`: día local, meses y zona horaria**
  - **Dependencias:** Requiere TASK-006
  - **Trazabilidad SDD:** plan §4.0 (`Clock`), plan §5.1; RN-07, RNF-20, RF-M3-13, RF-M14-02
  - **Archivos en Alcance:**
    - `packages/domain/src/dates.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/dates.test.ts`
  - **Especificación de Implementación:** Tipo `LocalDate`, `todayFor(tz, now)`, `isFutureFor(date, tz, now)`, `boliviaDay(instant)` (America/La_Paz), `monthRange(yyyy-mm)`, `clampDay(year, month, day)`, `addMonths`, `daysBetween` y `startOfDayInstant(date, tz)`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RN-07`: detecta una fecha futura en America/La_Paz, Europe/Madrid y America/Santiago, en los cruces de medianoche.
    - `RNF-20`: `startOfDayInstant` es correcto en los días de cambio de horario de verano.
    - `RF-M14-02`: `clampDay(2027, 2, 29)` da el 28 y `clampDay(2026, 11, 31)` da el 30.
    - `RF-M3-13`: `boliviaDay` usa el calendario de Bolivia.

- [x] **`TASK-028`: Dominio `format`: montos y parseo de lo que escribe el usuario**
  - **Dependencias:** Requiere TASK-026
  - **Trazabilidad SDD:** plan §4.9.1, plan §4.7.1 (`parseAmountInput`); RF-M9-02, RF-M7-02
  - **Archivos en Alcance:**
    - `packages/domain/src/format.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/format-money.test.ts`
  - **Especificación de Implementación:** `formatMoney(amount, symbol, numberFormat)` → "Bs 1.234,56" o "Bs 1,234.56", con el símbolo antes y un espacio, y el signo menos tipográfico en los negativos. `parseAmountInput(raw)`: solo dígitos y, al final, un punto o una coma seguidos de 1 o 2 dígitos como decimal; sin separador de miles ni operaciones.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M9-02`: "Bs 1.234,56" y "Bs 1,234.56" según el formato elegido.
    - `RF-M7-02`: "35.50" y "35,50" dan 35,50 con los dos formatos (escenarios "Formato de números" y "Punto decimal con el formato por defecto").
    - `RF-M7-02`: "35,5" da 35,50, mientras que "1.234", "3+4" y "1,234.56" dan `null`.

- [x] **`TASK-029`: Dominio `format`: fechas y días relativos**
  - **Dependencias:** Requiere TASK-027, TASK-028
  - **Trazabilidad SDD:** plan §4.9.1; RF-M9-03, RF-M9-04
  - **Archivos en Alcance:**
    - `packages/domain/src/format.ts`
    - `packages/domain/test/format-date.test.ts`
  - **Especificación de Implementación:** `formatDate(date, dateFormat)` en `dmy` (15/10/2026), `iso` (2026-10-15) y `short_text` (15 oct 2026). `relativeDay(date, today, weekStart)` devuelve "Hoy", "Ayer" o "Lun 13" dentro de la semana, y la fecha formateada fuera de ella. `weekDays(weekStart)` da el orden de los días del calendario.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M9-03`: los tres formatos de fecha y "Hoy", "Ayer" y "Lun 13".
    - `RF-M9-04`: `weekDays('sunday')` empieza en domingo.

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]] · [[M3 - Monedas y tipo de cambio]] · [[M7 - Registrar]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]]
- **Requerimientos no funcionales:** [[Spec 3.6 Exactitud monetaria]] · [[Spec 3.7 Tiempo]]
- **Fases de tareas:** [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]]
- **Spec / Plan / Constitución:** [[Constitución 3. Datos y dinero]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.7 M7 - Registrar (V1.0)]] · [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]] · [[Plan 5.1 Estrategia]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

