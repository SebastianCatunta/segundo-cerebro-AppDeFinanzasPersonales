---
tipo: "feature"
modulo: "M14"
entrega: "V1.2"
aliases:
  - "M14"
  - "Recurrentes"
tags:
  - "feature"
  - "modulo/M14"
  - "entrega/V1.2"
actualizado: "2026-10-30"
---

# M14 · Recurrentes

> [!summary] Entrega V1.2
> Reglas recurrentes (diaria, semanal, mensual, anual) automáticas o con confirmación, ocurrencias pendientes que vencen solas, cuotas, pausa y reanudación con fechas omitidas, y "próximos 30 días". El job se pone al día tras una caída sin duplicar (RNF-13).

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.14 M14 - Recurrentes (V1.2)]]
- **Plan técnico (cómo):** [[Plan 4.14 M14 - Recurrentes (V1.2)]]
- **Tareas:** [[Tareas Fase 23 - M14 Recurrentes (V1.2)]]
- **Coherencia con el código:** [[Coherencia M14 - Recurrentes]]

## ⚙️ Backend

- **Endpoints:** [[API recurring]]
- **Servicios compartidos:** [[Compartido - recurring-generator]]
- **Jobs:** [[Job - recurring]]

## 🖥️ Frontend

- **Features:** [[Web - recurring]]

## 🗄️ Datos

- [[Entidad - RecurringRule]]
- [[Entidad - RecurringOccurrence]]

## 🧩 Paquetes compartidos

- **Dominio:** [[Dominio - recurrence]]
- **Contratos:** [[Contrato - recurring]]

## 🧪 Pruebas E2E

- `e2e/m14-inbox-pending.spec.ts` — TASK-236 pendientes en la bandeja
- `e2e/m14-recurring.spec.ts` — TASK-234 pantalla de Recurrentes
- `e2e/m14-rule-form.spec.ts` — TASK-235 formulario de regla y diálogo de reanudar

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]

