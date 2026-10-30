---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § M10 - Onboarding"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
  - "modulo/M10"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M9 - Ajustes y personalización]] · → [[Coherencia M11 - Presupuestos]]

### M10 — Onboarding

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RF-M10-01 | El progreso DEBE guardarse en la cuenta en cada paso. Si se interrumpe, retoma en el paso pendiente, en… | coincide | `apps/api/test/http/onboarding.test.ts`, `apps/api/test/integration/onboarding-step1.test.ts` (+2) |  |
| RF-M10-02 | Saltar el paso 1 DEBE dejar BOB como moneda base. | coincide | `apps/api/test/http/onboarding.test.ts`, `apps/api/test/integration/onboarding-step1.test.ts` (+1) |  |
| RF-M10-03 | Saltar el paso 2 NO DEBE crear ninguna cuenta. | coincide | `apps/api/test/http/onboarding.test.ts`, `apps/api/test/integration/onboarding-step1.test.ts` |  |
| RF-M10-04 | Los saldos del paso 2 DEBEN cumplir las reglas de saldo inicial (RF-M4-02), con fecha de hoy. | coincide | `apps/api/test/http/onboarding.test.ts`, `apps/api/test/integration/onboarding-step2.test.ts` (+2) |  |
| RF-M10-05 | En el paso 3, la categoría del sistema "Deudas y préstamos" NO DEBE poder desmarcarse. | coincide | `apps/api/test/http/onboarding.test.ts`, `apps/api/test/integration/onboarding-step3.test.ts` (+1) |  |
| RF-M10-06 | Saltar el paso 3 DEBE conservar todas las categorías precargadas. | coincide | `apps/api/test/http/onboarding.test.ts`, `apps/api/test/integration/onboarding-step1.test.ts` |  |
| EC-M10-01 | Se ingresa un saldo negativo para el efectivo. Se rechaza con la explicación. | coincide | `apps/api/test/http/onboarding.test.ts`, `apps/api/test/integration/onboarding-step2.test.ts` (+1) |  |
| EC-M10-02 | Se renombran dos cuentas con el mismo nombre. Se rechaza por duplicado (RF-M4-01). | coincide | `apps/api/test/http/onboarding.test.ts`, `apps/api/test/integration/onboarding-step2.test.ts` (+1) |  |
| EC-M10-03 | Se desmarcan todas las categorías de gasto, o todas las de ingreso. Se permite. Registrar mostrará "Ver… | coincide | `apps/api/test/integration/onboarding-step3.test.ts`, `e2e/m10-onboarding-step3.spec.ts` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M4 - Cuentas]] · [[M9 - Ajustes y personalización]]

