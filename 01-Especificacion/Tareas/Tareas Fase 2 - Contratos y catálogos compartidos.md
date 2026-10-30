---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 2 - Contratos y catálogos compartidos"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
fase: "2"
tareas: "5"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 1 - Esquema de datos]] · → [[Tareas Fase 3 - Dominio transversal]]

### Fase 2 — Contratos y catálogos compartidos

- [x] **`TASK-021`: Primitivas de contratos: dinero, tasas, fechas, ids y textos**
  - **Dependencias:** Requiere TASK-006
  - **Trazabilidad SDD:** plan §4.3.1, plan §4.4.1, plan §4.6.1, ADR-03; RF-M6-01, RF-M6-03, RF-M3-02, RN-13
  - **Archivos en Alcance:**
    - `packages/contracts/src/common.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/common.test.ts`
  - **Especificación de Implementación:** `Money`, `Rate` (≥ 0,01), `Amount` (0,01 a 999.999.999,99), `AmountAbs`, `Note` (recortada, ≤ 140), `LocalDate`, `CurrencyCode`, `Uuid`, `Cursor` y un constructor `TrimmedName(min, max)`. Todos los montos son texto decimal (ADR-03).
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M6-01`: "0.00" y "1000000000.00" son inválidos; "0.01" y "999999999.99" son válidos.
    - `RF-M6-03`: una nota de 141 caracteres es inválida.
    - `RF-M3-02`: "0.009" no es una `Rate` válida.
    - `RN-13`: un nombre se valida después de recortar sus espacios.
    - Ningún schema acepta `number` para montos.

- [x] **`TASK-022`: Catálogo de errores y formato problem+json**
  - **Dependencias:** Requiere TASK-021
  - **Trazabilidad SDD:** plan §4.0 (catálogo común), plan §4.1.2 a §4.15.2 (errores por módulo), ADR-09; RNF-17
  - **Archivos en Alcance:**
    - `packages/contracts/src/errors.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/errors.test.ts`
  - **Especificación de Implementación:** `ErrorCode` con todos los códigos que aparecen en las tablas de endpoints del plan, cada uno con su estado HTTP. `ProblemSchema` (`type`, `title`, `status`, `code`, `data`, `traceId`).
  - **Criterios de Verificación (Tests & DoD):**
    - Una tabla de pruebas verifica el estado HTTP de cada código según el plan.
    - `RNF-17`: `INTERNAL_ERROR` no admite `data`.

- [x] **`TASK-023`: Mapa de entregas por módulo**
  - **Dependencias:** Requiere TASK-021
  - **Trazabilidad SDD:** plan §4.2.1 (`ModuleRelease`), plan §4.15.3 (entrega), ADR-18; RF-M2-03, spec §1.2
  - **Archivos en Alcance:**
    - `packages/contracts/src/releases.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/releases.test.ts`
  - **Especificación de Implementación:** `Release` (`'1.0' | '1.1' | '1.2'`), `ModuleKey`, `MODULE_RELEASE` según spec §1.2 (la bandeja de M15 en 1.1, la configuración y los demás tipos en 1.2), `isReleased(module, release)` y los tipos de aviso liberados por entrega.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M2-03`: con 1.0 no están liberados M11 a M15.
    - Con 1.1 se liberan M11, M12, M13 y la bandeja, con los tipos `budget_alert`, `period_close` y los avisos de deuda.
    - Con 1.2 está todo liberado.

- [x] **`TASK-024`: Catálogos de colores e íconos**
  - **Dependencias:** Requiere TASK-021
  - **Trazabilidad SDD:** plan §4.5.1 (catálogos fijos); RF-M5-04, RNF-06
  - **Archivos en Alcance:**
    - `packages/contracts/src/catalogs.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/catalogs.test.ts`
  - **Especificación de Implementación:** `PaletteKey` con 12 colores, cada uno con su valor para tema claro y oscuro. `IconKey` con unos 60 nombres de íconos de lucide-react en kebab-case.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M5-04`: hay exactamente 12 colores, y cada uno tiene un contraste ≥ 4,5:1 contra el fondo de su tema.
    - Los nombres de íconos son únicos y hay entre 55 y 65.

- [x] **`TASK-025`: Definición de las categorías precargadas**
  - **Dependencias:** Requiere TASK-024
  - **Trazabilidad SDD:** plan §2 (`packages/db/seed`), plan §4.5.3 (seed); spec §2.5.1; RF-M5-05, RF-M6-05
  - **Archivos en Alcance:**
    - `packages/db/seed/preset-categories.ts`
    - `packages/db/test/preset-categories.test.ts`
    - `packages/db/package.json`
    - `pnpm-lock.yaml`
  - **Especificación de Implementación:** Árbol de las categorías de spec §2.5.1 con nombre, tipo, padre, `seed_order`, ícono y color del catálogo, con la forma de plan §4.5.3 (`PRESET_CATEGORIES`). Incluye las del sistema (`debts` en gasto e ingreso, con su hija `debts_interest` "Intereses"). Declara `@finanzas/contracts` (`workspace:*`) en `packages/db/package.json` y actualiza `pnpm-lock.yaml`.
  - **Criterios de Verificación (Tests & DoD):**
    - La lista coincide exactamente con spec §2.5.1, en el mismo orden.
    - `RF-M5-05`: "Deudas y préstamos" existe en gasto y en ingreso con "Intereses", marcadas como del sistema.
    - `RF-M6-05`: existe "Servicios › Comisiones bancarias".

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M5 - Categorías]] · [[M6 - Transacciones]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]] · [[ADR-09 - Errores problem+json]] · [[ADR-18 - Entregas con RELEASE]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]]
- **Spec / Plan / Constitución:** [[Plan 2. Estructura del Proyecto (Árbol de Directorios)]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]] · [[Plan 4.4 M4 - Cuentas (V1.0)]] · [[Plan 4.5 M5 - Categorías (V1.0)]] · [[Plan 4.6 M6 - Transacciones (V1.0)]] · [[Spec 1.2 Entregas]] · [[Spec 1.6 Reglas de negocio transversales (RN)]] · [[Spec 2.5 M5 - Categorías (V1.0)]]

