---
tipo: "feature"
modulo: "M13"
entrega: "V1.1"
aliases:
  - "M13"
  - "Deudas y préstamos"
tags:
  - "feature"
  - "modulo/M13"
  - "entrega/V1.1"
actualizado: "2026-10-30"
---

# M13 · Deudas y préstamos

> [!summary] Entrega V1.1
> Deudas que el usuario debe y préstamos que le deben, con interés simple diario como foto (ADR-14), pagos divididos entre interés y capital, eliminar el último pago, condonar, estados derivados (vencida) y avisos de vencimiento.

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.13 M13 - Deudas y préstamos (V1.1)]]
- **Plan técnico (cómo):** [[Plan 4.13 M13 - Deudas y préstamos (V1.1)]]
- **Tareas:** [[Tareas Fase 21 - M13 Deudas y préstamos (V1.1)]]
- **Coherencia con el código:** [[Coherencia M13 - Deudas y préstamos]]

## ⚙️ Backend

- **Endpoints:** [[API debts]]

## 🖥️ Frontend

- **Features:** [[Web - debts]]

## 🗄️ Datos

- [[Entidad - Debt]]
- [[Entidad - DebtPayment]]

## 🧩 Paquetes compartidos

- **Dominio:** [[Dominio - debts]]
- **Contratos:** [[Contrato - debts]]

## 🧪 Pruebas E2E

- `e2e/m13-debt-forms.spec.ts` — TASK-218 formulario de deuda
- `e2e/m13-debts.spec.ts` — TASK-217 lista y detalle de deudas

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-14 - Interés de deudas como foto]]

