---
tipo: "feature"
modulo: "M11"
entrega: "V1.1"
aliases:
  - "M11"
  - "Presupuestos"
tags:
  - "feature"
  - "modulo/M11"
  - "entrega/V1.1"
actualizado: "2026-10-30"
---

# M11 · Presupuestos

> [!summary] Entrega V1.1
> Presupuestos generales o por categoría con día de inicio propio, umbrales de aviso, ritmo ("X/día"), cierre de período con decisión del excedente o del déficit (arrastrar, enviar a meta, etc.), decisión por defecto a los 7 días, pausa y reanudación, y ajustes tardíos.

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.11 M11 - Presupuestos (V1.1)]]
- **Plan técnico (cómo):** [[Plan 4.11 M11 - Presupuestos (V1.1)]]
- **Tareas:** [[Tareas Fase 20 - M11 Presupuestos (V1.1)]]
- **Coherencia con el código:** [[Coherencia M11 - Presupuestos]]

## ⚙️ Backend

- **Endpoints:** [[API budgets]]
- **Servicios compartidos:** [[Compartido - budget-ledger-hook]]
- **Jobs:** [[Job - budgets]]

## 🖥️ Frontend

- **Features:** [[Web - budgets]]

## 🗄️ Datos

- [[Entidad - Budget]]
- [[Entidad - BudgetPeriod]]
- [[Entidad - BudgetLateAdjustment]]
- [[Entidad - BudgetThresholdHit]]

## 🧩 Paquetes compartidos

- **Dominio:** [[Dominio - budget]]
- **Contratos:** [[Contrato - budgets]]

## 🧪 Pruebas E2E

- `e2e/m11-budget-form.spec.ts` — TASK-206 formulario de presupuesto
- `e2e/m11-budgets.spec.ts` — TASK-205 lista y detalle de presupuestos
- `e2e/m11-close-decision.spec.ts` — TASK-207 decisión de cierre del presupuesto

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].
