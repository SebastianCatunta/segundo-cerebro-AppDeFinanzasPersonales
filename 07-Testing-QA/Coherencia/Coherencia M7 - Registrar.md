---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M7 - Registrar"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M7"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M6 - Transacciones]] · → [[Coherencia M8 - Inicio]]

### M7 — Registrar

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M7-01 | Registrar DEBE ser una pestaña normal: centro de la barra inferior en celular, entrada de la barra lateral en… | coincide | `e2e/m2-navigation.spec.ts` |  |
| RF-M7-02 | Al entrar con el formulario vacío, el tipo DEBE ser Gasto y el foco DEBE estar en el monto. Si hay un… | coincide | `packages/domain/test/format-money.test.ts`, `e2e/gherkin-register.spec.ts` |  |
| RF-M7-03 | La cuenta preseleccionada DEBE ser la cuenta por defecto de Ajustes (una sola, para gastos e ingresos), si… | coincide | `apps/api/test/http/settings-register.test.ts`, `apps/api/test/integration/gherkin-accounts-categories.test.ts` (+1) |  |
| RF-M7-04 | La grilla DEBE mostrar 8 categorías del tipo actual: | coincide | `apps/api/test/http/settings-register.test.ts`, `e2e/m9-settings-register.spec.ts` |  |
| RF-M7-05 | La fecha DEBE ofrecer las fichas "Hoy" (marcada), "Ayer" y "Calendario", sin fechas futuras. | coincide | `e2e/gherkin-register.spec.ts` |  |
| RF-M7-06 | "Guardar" DEBE habilitarse con monto mayor que 0 y categoría (gasto o ingreso), o con origen y destino… | coincide | `e2e/gherkin-register.spec.ts` |  |
| RF-M7-07 | Al guardar, el sistema DEBE limpiar el formulario y permanecer en Registrar. Debe mostrar "Deshacer" durante… | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `apps/api/test/integration/transactions-delete-undo.test.ts` (+1) |  |
| RF-M7-08 | El borrador DEBE conservarse según RF-M2-10, también tras volver a iniciar sesión el mismo usuario. | coincide | `apps/web/test/drafts.test.ts` |  |
| RF-M7-09 | Los atajos DEBEN guardar nombre (de 1 a 30 caracteres), tipo (gasto, ingreso o transferencia), monto… | coincide | `packages/db/test/schema-ledger.test.ts`, `e2e/gherkin-register.spec.ts` |  |
| RF-M7-10 | Los atajos se crean con "Guardar como atajo" y se editan, reordenan y eliminan en Ajustes › Registrar. | coincide | `e2e/m9-settings-register.spec.ts` |  |
| RF-M7-11 | La ficha de cuenta DEBE mostrar el saldo libre de la cuenta. En una tarjeta, muestra el crédito disponible… | coincide | `apps/api/test/integration/accounts-goals.test.ts` |  |
| RF-M7-12 | En escritorio, el formulario DEBE poder usarse completo con Tab y Enter. No hay atajos de teclado propios. | coincide | `e2e/keyboard-v1-0.spec.ts` |  |
| RF-M7-13 | El ajuste "Mostrar la nota siempre" DEBE poner la nota en el primer nivel. | coincide | `e2e/m9-settings-register.spec.ts` |  |
| RF-M7-14 | Al registrar una salida de una cuenta dedicada a una meta, DEBE mostrarse el aviso no bloqueante "Esto resta… | coincide | `e2e/m12-earmark-confirm.spec.ts` |  |
| EC-M7-01 | No hay cuentas. Registrar muestra "Crea tu primera cuenta" con un formulario mínimo (nombre, tipo, moneda,… | coincide | `e2e/gherkin-register.spec.ts` |  |
| EC-M7-02 | El gasto dejaría el efectivo en negativo. Se muestra el error en la pantalla y el formulario no se limpia. | coincide | `e2e/gherkin-register.spec.ts` |  |
| EC-M7-03 | El gasto usa dinero apartado para metas. Aparece la confirmación de M12. Si se cancela, el formulario queda… | coincide | `e2e/i18n-direct-load.spec.ts`, `e2e/m12-earmark-confirm.spec.ts` |  |
| EC-M7-04 | No hay ninguna tasa y la cuenta está en dólares. Se pide el valor en ese momento (EC-M3-02). | coincide | `e2e/gherkin-register.spec.ts` |  |
| EC-M7-05 | La cuenta por defecto se archiva. El ajuste se limpia y se aplica RF-M7-03. | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `e2e/gherkin-register.spec.ts` |  |
| EC-M7-06 | Ya existen 12 atajos. "Guardar como atajo" informa el límite y ofrece gestionar los atajos. | coincide | `apps/api/test/integration/gherkin-accounts-categories.test.ts`, `e2e/gherkin-register.spec.ts` |  |
| EC-M7-07 | No hay categorías del tipo elegido (gasto o ingreso). "Ver todas" aparece vacío con la acción "Crear… | coincide | `e2e/gherkin-register.spec.ts`, `e2e/m10-onboarding-step3.spec.ts` |  |
| EC-M7-08 | El borrador apunta a una cuenta archivada desde otro dispositivo. El campo de cuenta se vacía y se marca para… | coincide | `e2e/gherkin-register.spec.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]]

