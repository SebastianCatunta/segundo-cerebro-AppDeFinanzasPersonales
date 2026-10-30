---
tipo: "constitucion"
fuente: "docs/constitution.md § 6. Desarrollo guiado por especificaciones (SDD)"
documento: "[[Constitución]]"
tags:
  - "sdd/constitucion"
actualizado: "2026-10-30"
---

↑ [[Constitución]] · ← [[Constitución 5. Calidad]] · → [[Constitución 7. Git Flow]]

## 6. Desarrollo guiado por especificaciones (SDD)
- Toda funcionalidad sigue este orden: **especificación → plan → tareas → implementación**.
- Cada funcionalidad vive en una carpeta `NNN-nombre/` en la raíz del proyecto, al mismo nivel que `docs/`, con su `spec.md`, `plan.md` y `tasks.md`.
- No se implementa nada sin una especificación aprobada por el equipo.
- Ante una ambigüedad, se pregunta. NUNCA se inventan reglas de negocio.
- Si un cambio contradice la especificación, primero se actualiza la especificación.
- Los agentes de IA pueden programar, ejecutar tests y hacer acciones de git, siguiendo esta Constitución y el flujo de §7.
