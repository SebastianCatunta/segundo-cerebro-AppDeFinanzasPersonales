---
tipo: "asignaciones"
fuente: "docs/asignaciones-fases-14-25.md § Criterio del reparto"
documento: "[[Asignaciones de las Fases 14 a 25]]"
tags:
  - "equipo/asignaciones"
actualizado: "2026-10-30"
---

↑ [[Asignaciones de las Fases 14 a 25]] · → [[Asignaciones 14-25 - Orden y dependencias entre personas]]

## Criterio del reparto

- **Las tareas con E2E (Playwright) van sobre todo a Sebastián y Matías.** En la PC de Alejandro, cada tarea
  con E2E tarda de 40 a 60 minutos con `/implement-task`: levanta la web, el API y 4 navegadores, y la base de
  datos se satura (errores `P2024` de Prisma). Las tareas de backend tardan de 15 a 25 minutos. Por eso
  Alejandro lleva más tareas, pero casi todas de backend.
- **Lo que queda de la Fase 14 es de Matías**, que ya lo está empezando. TASK-151 quedó bloqueada en la copia
  de Alejandro con parte de la web ya commiteada en `feature/14-m9-ajustes-y-personalizacion`
  (`758172c`, `87eb04d`); Matías la retoma desde esa rama.
- **Las cadenas de dependencias van a una misma persona cuando se puede**, como en las Fases 7 a 12.

| Persona           | Fases                                          | Tareas | Con E2E |
| ----------------- | ---------------------------------------------- | -----: | ------: |
| @alejandrorozich  | 16, 18, 21, 23 (backend), 24                    |     36 |       5 |
| @matiasmm1011     | 14 (lo que queda), 15, 17, 22, 25              |     28 |      14 |
| @SebastianCatunta | 19, 20, 23 (web)                               |     31 |       9 |

---
## 🔗 Relacionado

- **Fases de tareas:** [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]]

