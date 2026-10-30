---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 15 - M10 Onboarding (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M10"
fase: "15"
tareas: "8"
modulo: "M10"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]] · → [[Tareas Fase 16 - Exportación de datos (M1, V1.0)]]

### Fase 15 — M10 Onboarding (V1.0)

- [x] **`TASK-155`: Contratos de M10**
  - **Dependencias:** Requiere TASK-096, TASK-109
  - **Trazabilidad SDD:** plan §4.10.1; RF-M10-04
  - **Archivos en Alcance:**
    - `packages/contracts/src/onboarding.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/onboarding.test.ts`
  - **Especificación de Implementación:** `OnboardingDto`, `Step1Input`, `Step2Input` (hasta 20 cuentas), `Step3Input` y `SkipInput`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M10-04`: `Step2Input` acepta el saldo con las reglas de `AmountAbs`; `Step1Input` solo acepta BOB o USD.

- [x] **`TASK-156`: `OnboardingService`: estado, paso 1 y saltos**
  - **Dependencias:** Requiere TASK-085, TASK-155
  - **Trazabilidad SDD:** plan §4.10.2 (`GET`, `step1`, `skip`, `skip-all`), plan §4.10.3; RF-M10-01, RF-M10-02, RF-M10-03, RF-M10-06
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/onboarding.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user-settings.repository.ts`
    - `apps/api/test/integration/onboarding-step1.test.ts`
  - **Especificación de Implementación:** `get` devuelve el paso, las cuentas sugeridas ("Efectivo (Bs)" ✓, "Banco (Bs)" ✓, "Dólares en efectivo ($)" sin marcar), el árbol de categorías y la tasa en uso o `null`. `step1` y `skip` hacen `UPDATE … WHERE onboarding_step = N AND onboarding_completed_at IS NULL` (si no, `STEP_MISMATCH {currentStep}`). `skipAll` termina el Onboarding. Si ya terminó, todo responde `ONBOARDING_DONE`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M10-01`: dos `step1` simultáneos avanzan una sola vez, y el segundo da `STEP_MISMATCH`.
    - `RF-M10-02`: saltar el paso 1 deja BOB.
    - `RF-M10-03`: saltar el paso 2 no crea cuentas.
    - `RF-M10-06`: saltar el paso 3 conserva todas las precargadas.

- [x] **`TASK-157`: `OnboardingService`: paso 2 (cuentas)**
  - **Dependencias:** Requiere TASK-101, TASK-156
  - **Trazabilidad SDD:** plan §4.10.2 (`step2`); RF-M10-04, EC-M10-01, EC-M10-02, RF-M4-01, RF-M4-02
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/onboarding.service.ts`
    - `apps/api/test/integration/onboarding-step2.test.ts`
  - **Especificación de Implementación:** Crea las cuentas con `AccountsService.create` (idempotente), con la fecha de hoy, y avanza al paso 3 en la misma transacción.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M10-04`: los saldos quedan con fecha de hoy.
    - `EC-M10-01`: un efectivo negativo da `VALIDATION_ERROR` y no se crea ninguna cuenta.
    - `EC-M10-02`: dos cuentas con el mismo nombre dan `NAME_TAKEN`.
    - Reenviar el paso con los mismos ids no duplica las cuentas.

- [x] **`TASK-158`: `OnboardingService`: paso 3 (categorías) y fin**
  - **Dependencias:** Requiere TASK-111, TASK-157
  - **Trazabilidad SDD:** plan §4.10.2 (`step3`), plan §4.5.3 (seed); RF-M10-05, EC-M10-03
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/onboarding.service.ts`
    - `apps/api/test/integration/onboarding-step3.test.ts`
  - **Especificación de Implementación:** Borra las precargadas desmarcadas (al quitar un padre se quitan sus hijas), crea las nuevas y marca `onboarding_completed_at`. La categoría del sistema no se puede quitar.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M10-05`: quitar "Deudas y préstamos" da `SYSTEM_CATEGORY`.
    - `EC-M10-03`: se pueden quitar todas las de gasto.
    - Al terminar, el Onboarding queda completado.

- [x] **`TASK-159`: Rutas HTTP del Onboarding**
  - **Dependencias:** Requiere TASK-158
  - **Trazabilidad SDD:** plan §4.10.2 (tabla de endpoints); RNF-14
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/onboarding.routes.ts`
    - `apps/api/src/presentation/controllers/onboarding.controller.ts`
    - `apps/api/src/presentation/presenters/onboarding.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/onboarding.test.ts`
  - **Especificación de Implementación:** Monta los endpoints de plan §4.10.2.
  - **Criterios de Verificación (Tests & DoD):**
    - Cada endpoint responde con sus estados y errores, incluido `ONBOARDING_DONE`.
    - `RNF-14`: el Onboarding de un usuario no afecta a otro.

- [x] **`TASK-160`: Web: Onboarding, indicador de pasos y paso 1**
  - **Dependencias:** Requiere TASK-147, TASK-159
  - **Trazabilidad SDD:** plan §4.10.4 (`/bienvenida`); RF-M10-01, RF-M10-02, spec §2.10.1
  - **Archivos en Alcance:**
    - `apps/web/src/features/onboarding/api.ts`
    - `apps/web/src/features/onboarding/components/onboarding-stepper.tsx`
    - `apps/web/src/features/onboarding/components/base-currency-step.tsx`
    - `apps/web/src/features/onboarding/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/onboarding.json`
    - `e2e/m10-onboarding-step1.spec.ts`
  - **Especificación de Implementación:** "Paso N de 3", "Saltar paso" y "Saltar todo". El paso 1 elige la base (BOB por defecto) e informa "Usaremos el dólar paralelo: Bs X…" o "Aún no pudimos obtener el dólar…". Al terminar, navega a `/` en el mes actual.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Saltar todo": la base es BOB, no hay cuentas, están todas las categorías y el Inicio invita a crear la primera cuenta.
    - Sin tasa, se ve el mensaje "Aún no pudimos obtener el dólar".

- [x] **`TASK-161`: Web: Onboarding, paso 2 (cuentas)**
  - **Dependencias:** Requiere TASK-160
  - **Trazabilidad SDD:** plan §4.10.4 (`AccountsStep`, borradores); RF-M10-04, EC-M10-01, EC-M10-02
  - **Archivos en Alcance:**
    - `apps/web/src/features/onboarding/components/accounts-step.tsx`
    - `apps/web/src/features/onboarding/routes.tsx`
    - `apps/web/src/locales/es-BO/onboarding.json`
    - `e2e/m10-onboarding-step2.spec.ts`
  - **Especificación de Implementación:** Fichas marcables con un nombre editable y el campo "saldo de hoy" (0 por defecto), más "+ Otra cuenta". Usa el borrador `onboarding-step2`.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M10-01`: un saldo negativo en efectivo muestra la explicación.
    - `EC-M10-02`: dos nombres iguales muestran el error de duplicado.
    - `RF-M10-04`: las cuentas creadas tienen el saldo indicado con fecha de hoy.

- [x] **`TASK-162`: Web: Onboarding, paso 3 (categorías) y retomar**
  - **Dependencias:** Requiere TASK-161
  - **Trazabilidad SDD:** plan §4.10.4 (`CategoriesStep`); RF-M10-01, RF-M10-05, EC-M10-03
  - **Archivos en Alcance:**
    - `apps/web/src/features/onboarding/components/categories-step.tsx`
    - `apps/web/src/features/onboarding/routes.tsx`
    - `apps/web/src/locales/es-BO/onboarding.json`
    - `e2e/m10-onboarding-step3.spec.ts`
  - **Especificación de Implementación:** Árbol con casillas, todas marcadas; desmarcar un padre desmarca sus hijas; la categoría del sistema está bloqueada; "+ Agregar". Usa el borrador `onboarding-step3`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Retomar en otro dispositivo" (`RF-M10-01`): con el paso 1 completado en un contexto, otro contexto abre en el paso 2.
    - `RF-M10-05`: la casilla de "Deudas y préstamos" no se puede desmarcar.
    - `EC-M10-03`: sin categorías de gasto, Registrar muestra "Crear categoría".

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M4 - Cuentas]] · [[M9 - Ajustes y personalización]]
- **Requerimientos no funcionales:** [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 10 - M5 Categorías (V1.0)]] · [[Tareas Fase 13 - M8 Inicio (V1.0)]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 4.10 M10 - Onboarding (V1.0)]] · [[Plan 4.5 M5 - Categorías (V1.0)]] · [[Spec 2.10 M10 - Onboarding (V1.0)]]

