---
tipo: "indice-documento"
fuente: "001-appFinanzas-mvp/coherencia.md"
tags:
  - "qa/coherencia"
  - "indice"
actualizado: "2026-10-30"
---

# Coherencia de la documentación SDD con el código - Informe de revisión

> [!info] Fuente
> Nota índice generada desde `001-appFinanzas-mvp/coherencia.md` del proyecto real. Cada sección es una nota propia; el texto se conserva tal cual.

**Tarea:** TASK-272 · **Fecha:** 2026-10-30 · **Actualizado:** 2026-10-30, con las correcciones de §6 · **Rama:** `feature/27-pulido-transversal-rendimiento-correos`
**Documentos revisados:** `spec.md` v1.5 · `plan.md` v1.4 · `tasks.md` (Fase 27) · `docs/constitution.md` v1.2.0
**Complementa a:** `apps/api/test/unit/sdd-coherence.test.ts` (TASK-271), que ya compara de forma automática los tipos de correo, los endpoints, los códigos de error, las tablas, la matriz de trazabilidad, las variables de entorno, los IDs citados, las versiones y el mapa de fases.

Este informe no modifica la spec, el plan ni `tasks.md`. Las correcciones se aplican después, con lo que la persona apruebe: los cambios de documento en commits `docs:` aparte, y los cambios de código en tareas nuevas.

## Secciones

- [[Coherencia 1. Método|1. Método]]
- [[Coherencia 2. Requisitos por módulo|2. Requisitos por módulo]]
  - [[Coherencia M1 - Acceso y cuenta de usuario|M1 - Acceso y cuenta de usuario]]
  - [[Coherencia M2 - Navegación y estructura|M2 - Navegación y estructura]]
  - [[Coherencia M3 - Monedas y tipo de cambio|M3 - Monedas y tipo de cambio]]
  - [[Coherencia M4 - Cuentas|M4 - Cuentas]]
  - [[Coherencia M5 - Categorías|M5 - Categorías]]
  - [[Coherencia M6 - Transacciones|M6 - Transacciones]]
  - [[Coherencia M7 - Registrar|M7 - Registrar]]
  - [[Coherencia M8 - Inicio|M8 - Inicio]]
  - [[Coherencia M9 - Ajustes y personalización|M9 - Ajustes y personalización]]
  - [[Coherencia M10 - Onboarding|M10 - Onboarding]]
  - [[Coherencia M11 - Presupuestos|M11 - Presupuestos]]
  - [[Coherencia M12 - Metas de ahorro|M12 - Metas de ahorro]]
  - [[Coherencia M13 - Deudas y préstamos|M13 - Deudas y préstamos]]
  - [[Coherencia M14 - Recurrentes|M14 - Recurrentes]]
  - [[Coherencia M15 - Recordatorios y avisos|M15 - Recordatorios y avisos]]
  - [[Coherencia RNF - Requerimientos no funcionales|RNF - Requerimientos no funcionales]]
  - [[Coherencia Totales|Totales]]
- [[Coherencia 3. Diferencias|3. Diferencias]]
- [[Coherencia 4. Tareas cerradas con texto obsoleto por la Fase 27|4. Tareas cerradas con texto obsoleto por la Fase 27]]
- [[Coherencia 5. Pasos manuales|5. Pasos manuales]]
- [[Coherencia 6. Seguimiento de las diferencias|6. Seguimiento de las diferencias]]

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]

