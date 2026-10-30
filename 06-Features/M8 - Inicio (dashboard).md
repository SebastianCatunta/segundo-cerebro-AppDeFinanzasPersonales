---
tipo: "feature"
modulo: "M8"
entrega: "V1.0"
aliases:
  - "M8"
  - "Inicio (dashboard)"
tags:
  - "feature"
  - "modulo/M8"
  - "entrega/V1.0"
actualizado: "2026-10-30"
---

# M8 · Inicio (dashboard)

> [!summary] Entrega V1.0
> El dashboard: tarjetas de ingresos, gastos, balance y tasa de ahorro con variación contra el mes anterior, ritmo del gasto, barras por categoría, saldos, presupuestos, próximos vencimientos y recientes. Los bloques se reordenan desde Ajustes.

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.8 M8 - Inicio (dashboard) (V1.0)]]
- **Plan técnico (cómo):** [[Plan 4.8 M8 - Inicio (V1.0)]]
- **Tareas:** [[Tareas Fase 13 - M8 Inicio (V1.0)]]
- **Coherencia con el código:** [[Coherencia M8 - Inicio]]

## ⚙️ Backend

- **Endpoints:** [[API dashboard]]

## 🖥️ Frontend

- **Features:** [[Web - dashboard]]

## 🗄️ Datos

- Sin tablas propias.

## 🧩 Paquetes compartidos

- **Dominio:** [[Dominio - dashboard]]
- **Contratos:** [[Contrato - dashboard]]

## 🧪 Pruebas E2E

- `e2e/m8-dashboard-blocks.spec.ts` — TASK-148 bloques del Inicio y navegación
- `e2e/m8-dashboard-budgets.spec.ts` — TASK-219 Inicio: bloque Presupuesto del mes
- `e2e/m8-dashboard-cards.spec.ts` — TASK-147 Inicio, selector de mes y tarjetas
- `e2e/m8-dashboard-upcoming.spec.ts` — TASK-220 Inicio: bloque Próximos pagos y deudas

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].

---
## 🔗 Relacionado

- **Fases de tareas:** [[Tareas Fase 22 - Cierre de V1.1 Inicio, exportación y regresión]]

