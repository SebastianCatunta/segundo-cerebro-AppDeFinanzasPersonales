---
tipo: "feature"
modulo: "M2"
entrega: "V1.0"
aliases:
  - "M2"
  - "Navegación y estructura"
tags:
  - "feature"
  - "modulo/M2"
  - "entrega/V1.0"
actualizado: "2026-10-30"
---

# M2 · Navegación y estructura

> [!summary] Entrega V1.0
> Estructura de la SPA: barra de pestañas inferior en móvil y barra lateral en escritorio, menú "Más", cabecera con botón "Volver", guardas de sesión y de Onboarding, rutas por entrega (RELEASE, ADR-18), memoria de cada pestaña, borradores en sessionStorage, overlay sin conexión y diálogo de sesión expirada. Incluye la marca (logo) y el health check.

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.2 M2 - Navegación y estructura (V1.0)]]
- **Plan técnico (cómo):** [[Plan 4.2 M2 - Navegación y estructura (V1.0)]]
- **Tareas:** [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]
- **Coherencia con el código:** [[Coherencia M2 - Navegación y estructura]]

## ⚙️ Backend

- **Endpoints:** [[API health]], [[API me]]

## 🖥️ Frontend

- **Features:** [[Web - Layout (AppShell)]], [[Web - Router y rutas]], [[Web - App (guards y prefetch)]]

## 🗄️ Datos

- Sin tablas propias.

## 🧩 Paquetes compartidos

- **Dominio:** —
- **Contratos:** [[Contrato - releases]]

## 🧪 Pruebas E2E

- `e2e/m2-back-button.spec.ts` — TASK-267 botón Volver en la cabecera
- `e2e/m2-brand.spec.ts` — TASK-270 el logo acompaña a la app
- `e2e/m2-guards.spec.ts` — TASK-071 guardas de rutas
- `e2e/m2-more-menu.spec.ts` — TASK-073 menú Más, memoria por pestaña y botón Atrás
- `e2e/m2-navigation.spec.ts` — TASK-072 AppShell, barra inferior y barra lateral
- `e2e/m2-offline-session.spec.ts` — TASK-075 bloqueo sin conexión
- `e2e/m2-startup-parallel.spec.ts` — TASK-258 arranque en paralelo y esqueletos
- `e2e/m2-tab-prefetch.spec.ts` — TASK-259 precarga de los datos de cada pestaña

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-18 - Entregas con RELEASE]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]

