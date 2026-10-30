---
tipo: "feature"
modulo: "M12"
entrega: "V1.1"
aliases:
  - "M12"
  - "Metas de ahorro"
tags:
  - "feature"
  - "modulo/M12"
  - "entrega/V1.1"
actualizado: "2026-10-30"
---

# M12 · Metas de ahorro

> [!summary] Entrega V1.1
> Metas con monto y fecha objetivo, apartados (dinero reservado que sigue en su cuenta) o cuenta dedicada, aporte mensual sugerido, estado derivado (en curso, cumplida, vencida, ADR-13), hitos de avance, celebración, "usar y cerrar", archivar y restaurar.

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.12 M12 - Metas de ahorro (V1.1)]]
- **Plan técnico (cómo):** [[Plan 4.12 M12 - Metas de ahorro (V1.1)]]
- **Tareas:** [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]]
- **Coherencia con el código:** [[Coherencia M12 - Metas de ahorro]]

## ⚙️ Backend

- **Endpoints:** [[API goals]]
- **Servicios compartidos:** [[Compartido - goal-milestones]], [[Compartido - balance-guard]]

## 🖥️ Frontend

- **Features:** [[Web - goals]]

## 🗄️ Datos

- [[Entidad - Goal]]
- [[Entidad - GoalAllocationEvent]]

## 🧩 Paquetes compartidos

- **Dominio:** [[Dominio - goals]]
- **Contratos:** [[Contrato - goals]]

## 🧪 Pruebas E2E

- `e2e/m12-earmark-confirm.spec.ts` — TASK-192 confirmación de apartados
- `e2e/m12-goal-dialogs.spec.ts` — TASK-191 diálogos de metas
- `e2e/m12-goals.spec.ts` — TASK-190 lista y detalle de metas

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-13 - Estados derivados al leer]]

