---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § 3. Diferencias"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
actualizado: "2026-10-30"
---

↑ [[Coherencia - Informe de revisión SDD]] · ← [[Coherencia 2. Requisitos por módulo]] · → [[Coherencia 4. Tareas cerradas con texto obsoleto por la Fase 27]]

## 3. Diferencias

| # | Documento | Sección | Lo que dice | Lo que hace el código | Corrección propuesta | Cambia |
|---|---|---|---|---|---|---|
| D-01 | `spec.md` | §2.1.4 EC-M1-11 | Al confirmar el correo de A en un navegador con la sesión de B, "se cierra la sesión de B, su borrador se descarta y se inicia la de A". | `POST /api/auth/confirmation/status` cierra la sesión de B y abre la de A (`auth.service.ts`, `e2e/m1-sign-up-confirm-sync.spec.ts`), pero `CheckEmail.onConfirmed` (`apps/web/src/features/auth/components/check-email.tsx`) solo invalida `['me']` y navega a `/bienvenida`: no llama a `clearAllDrafts` con el id de B, como sí lo hace el diálogo de sesión vencida (EC-M2-01). Los borradores de B quedan guardados bajo `draft:{idDeB}:…` y vuelven a aparecer cuando B inicia sesión. | Tarea nueva: en `onConfirmed`, leer el `me` anterior de la caché y, si es de otro usuario, llamar a `clearAllDrafts(previous.id)` antes de limpiar la caché; agregar el caso al E2E de EC-M1-11. | Código |
| D-02 | `plan.md` | §5.5 Matriz de trazabilidad | "Cada regla, requerimiento, caso borde y RNF de `spec.md` v1.3". | La matriz ya incluye los IDs de la v1.5 (RF-M1-18, EC-M1-13, EC-M1-14, RF-M2-13, RF-M2-14, EC-M2-04, RNF-29), y el encabezado del plan dice `spec.md` v1.5. | Cambiar "v1.3" por "v1.5" en la frase de §5.5. | Documento |
| D-03 | `spec.md` | §3.6 RNF-19 | Los valores históricos nunca cambian por el tipo de cambio ni por la configuración. | El comportamiento se cumple (tasa guardada en cada asiento, ingresos y gastos con la tasa guardada: RN-05, RN-11), pero RNF-19 es el único RF, EC o RNF que ninguna prueba cita, así que no se puede rastrear desde la spec. | Tarea nueva: citar RNF-19 en las pruebas de RN-05 que ya lo demuestran (`packages/domain/test/fx-convert.test.ts`, `apps/api/test/integration/dashboard-cards.test.ts`) o agregar una que cambie la tasa y la zona horaria y compare un período cerrado. | Código (pruebas) |
| D-04 | `plan.md` | §5.5 Matriz de trazabilidad | La fila de EC-M3-07 aparece antes que la de EC-M3-06. | No afecta al código; el resto de la matriz sigue el orden de la spec. | Poner EC-M3-06 antes de EC-M3-07. | Documento |
| D-05 | `tasks.md` | TASK-048, TASK-052, TASK-054, TASK-055, TASK-056, TASK-057, TASK-063, TASK-065 | Describen el correo de intentos fallidos y la confirmación que abría la sesión (detalle en §4). | El código sigue la v1.5 (TASK-262 a TASK-266). | Agregar a cada tarea la nota de §4, sin reescribir su texto (son tareas cerradas con su commit). | Documento |

Los requisitos marcados `no verificable` (RNF-01, RNF-02, RNF-03, RNF-05 y RNF-29) no son diferencias: el código tiene la prueba que los aproxima en el pipeline (`e2e/perf.spec.ts`, `e2e/perf-tabs.spec.ts`, las pruebas de accesibilidad en Chromium, WebKit y Firefox), pero la condición de la spec (celular de gama media, red 4G real, Safari y Firefox) solo se comprueba con una medición manual antes de cada entrega.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.6 Exactitud monetaria]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

