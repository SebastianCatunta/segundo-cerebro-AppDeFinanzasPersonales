---
tipo: "asignaciones"
fuente: "docs/asignaciones-fases-14-25.md § Orden y dependencias entre personas"
documento: "[[Asignaciones de las Fases 14 a 25]]"
tags:
  - "equipo/asignaciones"
actualizado: "2026-10-30"
---

↑ [[Asignaciones de las Fases 14 a 25]] · ← [[Asignaciones 14-25 - Criterio del reparto]] · → [[Asignaciones 14-25 - Tabla]]

## Orden y dependencias entre personas

```
Ya se pueden empezar:  14   15   16   18
                        └────┼────┘    │
                             17        19
                                      ┌┴┐
                                     20  21
                                      └┬┘
                                       22 → 23 → 24 → 25
```

1. **Alejandro empieza por la Fase 18** (bandeja de avisos): habilita la 19 de Sebastián y está al inicio de
   la ruta crítica. Mientras Sebastián hace la 19, Alejandro hace la 16.
2. **Matías** cierra la 14 y sigue con la 15. La 17 espera a la 14, la 15 y la 16 (la 16 es de Alejandro).
3. Con la 19 cerrada, **Alejandro hace la 21 y Sebastián la 20**, en paralelo.
4. La 22 de Matías espera a la 20 (TASK-204) y a la 21 (TASK-216).
5. La 23 se divide por capa: **Alejandro el backend (TASK-223 a TASK-233) y Sebastián la web (TASK-234 a
   TASK-236)**. Después Alejandro hace la 24 y Matías cierra con la 25.

**Riesgo:** la ruta crítica pasa por la 19 y la 20 de Sebastián (28 tareas seguidas). Si se atrasa, TASK-193
a TASK-196 (contratos, dominio y repositorios de presupuestos) no dependen de la 19 y Alejandro puede
adelantarlas.

---
## 🔗 Relacionado

- **Fases de tareas:** [[Tareas Fase 20 - M11 Presupuestos (V1.1)]] · [[Tareas Fase 21 - M13 Deudas y préstamos (V1.1)]] · [[Tareas Fase 23 - M14 Recurrentes (V1.2)]]

