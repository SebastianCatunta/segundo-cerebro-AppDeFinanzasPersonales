---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M9 - Ajustes y personalización"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M9"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M8 - Inicio]] · → [[Coherencia M10 - Onboarding]]

### M9 — Ajustes y personalización

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M9-01 | TODOS los ajustes, incluidos el tema y la barra lateral contraída, DEBEN guardarse en la cuenta y verse… | coincide | `apps/api/test/http/settings.test.ts`, `apps/web/test/formatters.test.ts` (+3) |  |
| RF-M9-02 | El símbolo de la moneda DEBE ir antes del monto, separado por un espacio ("Bs 35,00", "$ 97,09"). Al escribir… | coincide | `apps/web/test/formatters.test.ts`, `packages/domain/test/format-money.test.ts` (+1) |  |
| RF-M9-03 | Todas las fechas y montos de la app DEBEN respetar los formatos elegidos. Las listas usan expresiones… | coincide | `apps/web/test/formatters.test.ts`, `packages/domain/test/format-date.test.ts` (+1) |  |
| RF-M9-04 | El primer día de la semana DEBE aplicarse al calendario. | coincide | `packages/domain/test/format-date.test.ts` |  |
| RF-M9-05 | "Restablecer" NO DEBE tocar datos: cuentas, movimientos, categorías, atajos, monedas ni moneda base. En… | coincide | `apps/api/test/http/settings-reset.test.ts`, `e2e/m9-settings-general.spec.ts` |  |
| RF-M9-06 | NO existen valores globales de presupuestos. Cada presupuesto se configura por separado (M11). | coincide | `apps/api/test/integration/budgets-create.test.ts`, `e2e/m11-budget-form.spec.ts` |  |
| EC-M9-01 | Se cambia un ajuste en dos dispositivos a la vez. Gana el último guardado, y el otro dispositivo lo refleja… | coincide | `apps/api/test/http/settings.test.ts`, `e2e/m9-settings-general.spec.ts` |  |
| EC-M9-02 | Se elige como cuenta por defecto una cuenta que luego se archiva. Se aplica EC-M7-05. | coincide | `apps/api/test/http/settings-register.test.ts`, `e2e/m9-settings-register.spec.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]

