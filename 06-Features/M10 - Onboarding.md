---
tipo: "feature"
modulo: "M10"
entrega: "V1.0"
aliases:
  - "M10"
  - "Onboarding"
tags:
  - "feature"
  - "modulo/M10"
  - "entrega/V1.0"
actualizado: "2026-10-30"
---

# M10 · Onboarding

> [!summary] Entrega V1.0
> Asistente de tres pasos al primer ingreso: moneda base, cuentas y categorías. Cada paso puede omitirse, y también todo el asistente.

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.10 M10 - Onboarding (V1.0)]]
- **Plan técnico (cómo):** [[Plan 4.10 M10 - Onboarding (V1.0)]]
- **Tareas:** [[Tareas Fase 15 - M10 Onboarding (V1.0)]]
- **Coherencia con el código:** [[Coherencia M10 - Onboarding]]

## ⚙️ Backend

- **Endpoints:** [[API onboarding]]
- **Servicios compartidos:** [[Compartido - user-bootstrap]]

## 🖥️ Frontend

- **Features:** [[Web - onboarding]]

## 🗄️ Datos

- Sin tablas propias.

## 🧩 Paquetes compartidos

- **Dominio:** —
- **Contratos:** [[Contrato - onboarding]]

## 🧪 Pruebas E2E

- `e2e/m10-onboarding-step1.spec.ts` — TASK-160 Onboarding: indicador de pasos y paso 1
- `e2e/m10-onboarding-step2.spec.ts` — TASK-161 Onboarding: paso 2 (cuentas)
- `e2e/m10-onboarding-step3.spec.ts` — TASK-162 Onboarding: paso 3 (categorías) y retomar

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].
