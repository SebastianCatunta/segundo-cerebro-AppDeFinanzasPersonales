---
tipo: "feature"
modulo: "M9"
entrega: "V1.0"
aliases:
  - "M9"
  - "Ajustes y personalización"
tags:
  - "feature"
  - "modulo/M9"
  - "entrega/V1.0"
actualizado: "2026-10-30"
---

# M9 · Ajustes y personalización

> [!summary] Entrega V1.0
> Preferencias generales (formato de número y fecha, inicio de semana, tema, zona horaria), monedas, ajustes de Registrar (favoritas, atajos, cuenta por defecto), orden de los bloques del Inicio, recordatorios (V1.2) y restablecer cada sección.

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.9 M9 - Ajustes y personalización (V1.0)]]
- **Plan técnico (cómo):** [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]]
- **Tareas:** [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]]
- **Coherencia con el código:** [[Coherencia M9 - Ajustes y personalización]]

## ⚙️ Backend

- **Endpoints:** [[API settings]]

## 🖥️ Frontend

- **Features:** [[Web - settings]]

## 🗄️ Datos

- [[Entidad - UserSettings]]

## 🧩 Paquetes compartidos

- **Dominio:** [[Dominio - format]]
- **Contratos:** [[Contrato - settings]]

## 🧪 Pruebas E2E

- `e2e/m9-settings-currencies.spec.ts` — TASK-154 Ajustes de monedas
- `e2e/m9-settings-dashboard.spec.ts` — TASK-153 Ajustes del Inicio
- `e2e/m9-settings-general.spec.ts` — TASK-151 Ajustes y sección General
- `e2e/m9-settings-register.spec.ts` — TASK-152 Ajustes de Registrar

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].
