---
tipo: "constitucion"
fuente: "docs/constitution.md § 8. Ejecución de tareas con agentes"
documento: "[[Constitución]]"
tags:
  - "sdd/constitucion"
actualizado: "2026-10-30"
---

↑ [[Constitución]] · ← [[Constitución 7. Git Flow]] · → [[Constitución 9. Enmiendas]]

## 8. Ejecución de tareas con agentes
- La unidad de trabajo es una tarea de `tasks.md`. Se implementa una tarea a la vez y solo dentro de los archivos que declara.
- Cada tarea pasa por el mismo pipeline: **pruebas primero → implementación → auditoría** contra esta Constitución, la especificación y el plan. Cada etapa la hace un agente distinto, con el contexto mínimo de la tarea.
- Lo que una máquina puede verificar lo verifican hooks deterministas, no un agente: alcance de archivos, lint, tipos, reglas de capas y tests.
- Una tarea se cierra solo con todas las verificaciones en verde y la auditoría aprobada, y queda en un commit propio que la referencia.
- Si un agente encuentra una ambigüedad o necesita salir del alcance, se detiene y pregunta (§6). Nunca se cambian el alcance ni las pruebas para que algo pase.
- Ningún guardarraíl se salta.
- El detalle operativo vive en `docs/execution-protocol.md`.
