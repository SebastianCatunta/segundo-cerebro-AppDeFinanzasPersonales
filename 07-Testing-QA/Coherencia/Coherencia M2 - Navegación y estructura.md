---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M2 - Navegación y estructura"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M2"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M1 - Acceso y cuenta de usuario]] · → [[Coherencia M3 - Monedas y tipo de cambio]]

### M2 — Navegación y estructura

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M2-01 | Por debajo de 1024 px, el sistema DEBE usar la barra inferior de 5 pestañas con Registrar en el centro. Desde… | coincide | `e2e/m2-navigation.spec.ts` |  |
| RF-M2-02 | "Más" DEBE existir solo en el formato de barra inferior. | coincide | `e2e/m2-navigation.spec.ts` |  |
| RF-M2-03 | El sistema DEBE mostrar únicamente los módulos de las entregas liberadas. | coincide | `apps/api/test/http/budgets.test.ts`, `apps/api/test/http/debts.test.ts` (+9) |  |
| RF-M2-04 | Cada pestaña DEBE recordar su estado (mes, filtros, posición, detalle abierto) al cambiar de pestaña. Ese… | coincide | `apps/web/test/prefetch-routes.test.ts`, `apps/web/test/search-params.test.ts` (+3) |  |
| RF-M2-05 | Tocar la pestaña activa DEBE llevar al inicio de esa pestaña. En Registrar no borra el borrador. | coincide | `apps/web/test/ui-store.test.ts`, `e2e/m2-more-menu.spec.ts` |  |
| RF-M2-06 | El botón Atrás del navegador o del celular DEBE funcionar en todas las pantallas. | coincide | `apps/web/test/search-params.test.ts`, `e2e/m2-back-button.spec.ts` (+1) |  |
| RF-M2-07 | Sin conexión, el sistema DEBE bloquear toda la app, incluido Registrar, con una pantalla de aviso y liberarla… | coincide | `apps/web/test/api-client.test.ts`, `apps/web/test/online.test.ts` (+2) |  |
| RF-M2-08 | Con la sesión vencida, el sistema DEBE pedir que el usuario inicie sesión y, tras hacerlo, volver a la misma… | coincide | `apps/api/test/http/session-middlewares.test.ts`, `apps/web/test/api-client.test.ts` (+1) |  |
| RF-M2-09 | El estado contraído de la barra lateral DEBE guardarse en la cuenta del usuario (M9). | coincide | `apps/api/test/http/settings.test.ts`, `packages/contracts/test/settings.test.ts` (+2) |  |
| RF-M2-10 | Todo formulario con datos sin guardar DEBE conservarlos como borrador en el mismo dispositivo al cambiar de… | coincide | `apps/web/test/drafts.test.ts`, `e2e/gherkin-register.spec.ts` (+2) |  |
| RF-M2-11 | Al restaurar un borrador, o al aplicar un atajo, cuya cuenta o categoría ya no está activa, ese campo DEBE… | coincide | `apps/web/test/drafts.test.ts` |  |
| RF-M2-12 | Las secciones de "Más" y de la barra lateral sin módulos liberados DEBEN ocultarse. | coincide | `e2e/m2-more-menu.spec.ts` |  |
| RF-M2-13 | Toda pantalla que no sea la raíz de una pestaña DEBE mostrar en la cabecera un botón "Volver", antes del… | coincide | `apps/web/test/route-parents.test.ts`, `e2e/m2-back-button.spec.ts` |  |
| RF-M2-14 | La app DEBE mostrar su logo como ícono de la pestaña del navegador, en las pantallas de acceso y registro, y… | coincide | `apps/web/test/brand-assets.test.ts`, `e2e/m2-brand.spec.ts` |  |
| EC-M2-01 | Otra persona inicia sesión tras el vencimiento de la sesión en el mismo dispositivo. El borrador del usuario… | coincide | `apps/web/test/drafts.test.ts`, `e2e/m1-sign-in.spec.ts` (+1) |  |
| EC-M2-02 | La conexión se pierde a mitad de un guardado. Aparece el bloqueo. Al reconectar, el usuario ve si el… | coincide | `apps/web/test/online.test.ts` |  |
| EC-M2-03 | El ancho de la pantalla cambia al girar la tablet. La navegación cambia de formato sin perder el estado. | coincide | `e2e/m2-navigation.spec.ts` |  |
| EC-M2-04 | Se abre una pantalla interna desde un enlace directo, sin pantallas previas en la app. "Volver" lleva a la… | coincide | `e2e/m2-back-button.spec.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M9 - Ajustes y personalización]]

