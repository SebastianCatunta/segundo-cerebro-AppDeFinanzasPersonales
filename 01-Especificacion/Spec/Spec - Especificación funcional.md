---
tipo: "indice-documento"
fuente: "001-appFinanzas-mvp/spec.md"
tags:
  - "sdd/spec"
  - "indice"
actualizado: "2026-10-30"
---

# Especificación Funcional - App de Finanzas Personales

> [!info] Fuente
> Nota índice generada desde `001-appFinanzas-mvp/spec.md` del proyecto real. Cada sección es una nota propia; el texto se conserva tal cual.

**Versión:** 1.5 · **Fecha:** 2026-10-28 · **Alcance:** V1 completa (V1.0, V1.1, V1.2)
**Estado:** V1.0 Aprobada · V1.1 Aprobada · V1.2 Aprobada (2026-10-16)
**Documentos relacionados:** `docs/constitution.md` (principios innegociables) · `plan.md` y `tasks.md` (en esta misma carpeta)

Este documento define el **qué** y el **porqué**. No define el cómo técnico.

---

## Secciones

- [[Spec 1. Visión general, actores y exclusiones|1. Visión general, actores y exclusiones]]
  - [[Spec 1.1 Visión|1.1 Visión]]
  - [[Spec 1.2 Entregas|1.2 Entregas]]
  - [[Spec 1.3 Matriz de roles|1.3 Matriz de roles]]
  - [[Spec 1.4 Fuera de alcance (Out-of-Scope)|1.4 Fuera de alcance (Out-of-Scope)]]
  - [[Spec 1.5 Glosario|1.5 Glosario]]
  - [[Spec 1.6 Reglas de negocio transversales (RN)|1.6 Reglas de negocio transversales (RN)]]
- [[Spec 2. Desglose por módulos|2. Desglose por módulos]]
  - [[Spec 2.1 M1 - Acceso y cuenta de usuario (V1.0)|2.1 M1 - Acceso y cuenta de usuario (V1.0)]]
  - [[Spec 2.2 M2 - Navegación y estructura (V1.0)|2.2 M2 - Navegación y estructura (V1.0)]]
  - [[Spec 2.3 M3 - Monedas y tipo de cambio (V1.0)|2.3 M3 - Monedas y tipo de cambio (V1.0)]]
  - [[Spec 2.4 M4 - Cuentas (V1.0)|2.4 M4 - Cuentas (V1.0)]]
  - [[Spec 2.5 M5 - Categorías (V1.0)|2.5 M5 - Categorías (V1.0)]]
  - [[Spec 2.6 M6 - Transacciones (V1.0)|2.6 M6 - Transacciones (V1.0)]]
  - [[Spec 2.7 M7 - Registrar (pestaña) (V1.0)|2.7 M7 - Registrar (pestaña) (V1.0)]]
  - [[Spec 2.8 M8 - Inicio (dashboard) (V1.0)|2.8 M8 - Inicio (dashboard) (V1.0)]]
  - [[Spec 2.9 M9 - Ajustes y personalización (V1.0)|2.9 M9 - Ajustes y personalización (V1.0)]]
  - [[Spec 2.10 M10 - Onboarding (V1.0)|2.10 M10 - Onboarding (V1.0)]]
  - [[Spec 2.11 M11 - Presupuestos (V1.1)|2.11 M11 - Presupuestos (V1.1)]]
  - [[Spec 2.12 M12 - Metas de ahorro (V1.1)|2.12 M12 - Metas de ahorro (V1.1)]]
  - [[Spec 2.13 M13 - Deudas y préstamos (V1.1)|2.13 M13 - Deudas y préstamos (V1.1)]]
  - [[Spec 2.14 M14 - Recurrentes (V1.2)|2.14 M14 - Recurrentes (V1.2)]]
  - [[Spec 2.15 M15 - Recordatorios y avisos (bandeja básica en V1.1, completo en V1.2)|2.15 M15 - Recordatorios y avisos (bandeja básica en V1.1, completo en V1.2)]]
- [[Spec 3. Requerimientos no funcionales globales (RNF)|3. Requerimientos no funcionales globales (RNF)]]
  - [[Spec 3.1 Tiempos límite|3.1 Tiempos límite]]
  - [[Spec 3.2 Compatibilidad y accesibilidad|3.2 Compatibilidad y accesibilidad]]
  - [[Spec 3.3 Concurrencia|3.3 Concurrencia]]
  - [[Spec 3.4 Idempotencia|3.4 Idempotencia]]
  - [[Spec 3.5 Privacidad y seguridad|3.5 Privacidad y seguridad]]
  - [[Spec 3.6 Exactitud monetaria|3.6 Exactitud monetaria]]
  - [[Spec 3.7 Tiempo|3.7 Tiempo]]
  - [[Spec 3.8 Disponibilidad y tolerancia a fallos|3.8 Disponibilidad y tolerancia a fallos]]
  - [[Spec 3.9 Auditoría y retención|3.9 Auditoría y retención]]
  - [[Spec 3.10 Límites por usuario|3.10 Límites por usuario]]
  - [[Spec 3.11 Rendimiento de cada pestaña|3.11 Rendimiento de cada pestaña]]
- [[Spec 4. Historial de cambios|4. Historial de cambios]]

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]

