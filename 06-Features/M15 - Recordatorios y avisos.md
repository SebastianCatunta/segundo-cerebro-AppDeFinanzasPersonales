---
tipo: "feature"
modulo: "M15"
entrega: "V1.1 (bandeja) · V1.2 (completo)"
aliases:
  - "M15"
  - "Recordatorios y avisos"
tags:
  - "feature"
  - "modulo/M15"
  - "entrega/V1.1"
actualizado: "2026-10-30"
---

# M15 · Recordatorios y avisos

> [!summary] Entrega V1.1 (bandeja) · V1.2 (completo)
> Bandeja de avisos dentro de la app (campana, no leídos, marcar como leído, decisiones pendientes) y, en V1.2, recordatorios programados: registrar el día, pagos y deudas por vencer, hitos de metas, con preferencias por tipo. Un mismo evento nunca genera dos avisos (RN-10).

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.15 M15 - Recordatorios y avisos (bandeja básica en V1.1, completo en V1.2)]]
- **Plan técnico (cómo):** [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]]
- **Tareas:** [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]], [[Tareas Fase 24 - M15 Recordatorios y avisos completos (V1.2)]]
- **Coherencia con el código:** [[Coherencia M15 - Recordatorios y avisos]]

## ⚙️ Backend

- **Endpoints:** [[API notifications]]
- **Servicios compartidos:** [[Compartido - notification-emitter]], [[Compartido - goal-milestones]]
- **Jobs:** [[Job - notifications]]

## 🖥️ Frontend

- **Features:** [[Web - notifications]]

## 🗄️ Datos

- [[Entidad - Notification]]
- [[Entidad - NotificationPreference]]

## 🧩 Paquetes compartidos

- **Dominio:** —
- **Contratos:** [[Contrato - notifications]]

## 🧪 Pruebas E2E

- `e2e/m15-inbox.spec.ts` — TASK-179 campana y bandeja de avisos
- `e2e/m15-preferences.spec.ts` — TASK-241 Ajustes de recordatorios

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

