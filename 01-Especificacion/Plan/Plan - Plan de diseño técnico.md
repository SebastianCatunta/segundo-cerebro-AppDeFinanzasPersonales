---
tipo: "indice-documento"
fuente: "001-appFinanzas-mvp/plan.md"
tags:
  - "sdd/plan"
  - "indice"
actualizado: "2026-10-30"
---

# Plan de Diseño Técnico - App de Finanzas Personales

> [!info] Fuente
> Nota índice generada desde `001-appFinanzas-mvp/plan.md` del proyecto real. Cada sección es una nota propia; el texto se conserva tal cual.

**Versión:** 1.4 · **Fecha:** 2026-10-28 · **Estado:** Aprobado (2026-10-16)
**Insumos:** `docs/constitution.md` v1.2.0 · `001-appFinanzas-mvp/spec.md` v1.5
**Alcance:** V1 completa (V1.0, V1.1, V1.2). Este documento define el **cómo**. Las tareas se definen en `tasks.md`.

Convenciones de este documento:
- El código, las tablas y las columnas están en inglés. Las rutas de la interfaz y los textos están en español (constitución §5).
- "Bloqueo por usuario" es `pg_advisory_xact_lock(hashtext('user:' || user_id))`.
- "Idempotente" significa que la creación lleva un `id` UUID v7 generado por el cliente (ADR-11).
- Todos los montos y tasas viajan como texto decimal (ADR-03).

---

## Secciones

- [[Plan 1. Visión Arquitectónica y Flujo del Sistema|1. Visión Arquitectónica y Flujo del Sistema]]
  - [[Plan 1.1 Capas|1.1 Capas]]
  - [[Plan 1.2 Despliegue y flujo principal|1.2 Despliegue y flujo principal]]
  - [[Plan 1.3 Registro de decisiones (ADR)|1.3 Registro de decisiones (ADR)]]
  - [[Plan 1.4 Arquitectura por capas del backend (ADR-19)|1.4 Arquitectura por capas del backend (ADR-19)]]
  - [[Plan 1.5 Integración y despliegue continuos (ADR-20)|1.5 Integración y despliegue continuos (ADR-20)]]
- [[Plan 2. Estructura del Proyecto (Árbol de Directorios)|2. Estructura del Proyecto (Árbol de Directorios)]]
- [[Plan 3. Esquema de Datos y Persistencia Global|3. Esquema de Datos y Persistencia Global]]
  - [[Plan 3.1 Convenciones|3.1 Convenciones]]
  - [[Plan 3.2 Tipos enumerados|3.2 Tipos enumerados]]
  - [[Plan 3.3 Cuenta de usuario y seguridad (M1)|3.3 Cuenta de usuario y seguridad (M1)]]
  - [[Plan 3.4 Ajustes y tipo de cambio (M3, M9, M10)|3.4 Ajustes y tipo de cambio (M3, M9, M10)]]
  - [[Plan 3.5 Cuentas, categorías y libro contable (M4 a M7)|3.5 Cuentas, categorías y libro contable (M4 a M7)]]
  - [[Plan 3.6 Planificación (M11 a M14)|3.6 Planificación (M11 a M14)]]
  - [[Plan 3.7 Avisos e infraestructura (M15)|3.7 Avisos e infraestructura (M15)]]
  - [[Plan 3.8 Integridad y cascadas|3.8 Integridad y cascadas]]
  - [[Plan 3.9 Seguridad a nivel de datos|3.9 Seguridad a nivel de datos]]
- [[Plan 4. Diseño Técnico por Módulo|4. Diseño Técnico por Módulo]]
  - [[Plan 4.0 Elementos transversales|4.0 Elementos transversales]]
  - [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)|4.1 M1 - Acceso y cuenta de usuario (V1.0)]]
  - [[Plan 4.2 M2 - Navegación y estructura (V1.0)|4.2 M2 - Navegación y estructura (V1.0)]]
  - [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)|4.3 M3 - Monedas y tipo de cambio (V1.0)]]
  - [[Plan 4.4 M4 - Cuentas (V1.0)|4.4 M4 - Cuentas (V1.0)]]
  - [[Plan 4.5 M5 - Categorías (V1.0)|4.5 M5 - Categorías (V1.0)]]
  - [[Plan 4.6 M6 - Transacciones (V1.0)|4.6 M6 - Transacciones (V1.0)]]
  - [[Plan 4.7 M7 - Registrar (V1.0)|4.7 M7 - Registrar (V1.0)]]
  - [[Plan 4.8 M8 - Inicio (V1.0)|4.8 M8 - Inicio (V1.0)]]
  - [[Plan 4.9 M9 - Ajustes y personalización (V1.0)|4.9 M9 - Ajustes y personalización (V1.0)]]
  - [[Plan 4.10 M10 - Onboarding (V1.0)|4.10 M10 - Onboarding (V1.0)]]
  - [[Plan 4.11 M11 - Presupuestos (V1.1)|4.11 M11 - Presupuestos (V1.1)]]
  - [[Plan 4.12 M12 - Metas de ahorro (V1.1)|4.12 M12 - Metas de ahorro (V1.1)]]
  - [[Plan 4.13 M13 - Deudas y préstamos (V1.1)|4.13 M13 - Deudas y préstamos (V1.1)]]
  - [[Plan 4.14 M14 - Recurrentes (V1.2)|4.14 M14 - Recurrentes (V1.2)]]
  - [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)|4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]]
- [[Plan 5. Matriz de Verificación y Estrategia de Testing|5. Matriz de Verificación y Estrategia de Testing]]
  - [[Plan 5.1 Estrategia|5.1 Estrategia]]
  - [[Plan 5.2 Criterios de aceptación (Gherkin) → pruebas|5.2 Criterios de aceptación (Gherkin) → pruebas]]
  - [[Plan 5.3 Requerimientos no funcionales → verificación|5.3 Requerimientos no funcionales → verificación]]
  - [[Plan 5.4 Definición de terminado de cada módulo|5.4 Definición de terminado de cada módulo]]
  - [[Plan 5.5 Matriz de trazabilidad (spec → plan)|5.5 Matriz de trazabilidad (spec → plan)]]

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]] · [[ADR-11 - Idempotencia con UUID v7]] · [[ADR-19 - Backend en capas]] · [[ADR-20 - CI-CD con GitHub Actions]]
- **Spec / Plan / Constitución:** [[Constitución 5. Calidad]]

