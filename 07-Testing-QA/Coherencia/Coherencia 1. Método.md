---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § 1. Método"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
actualizado: "2026-10-30"
---

↑ [[Coherencia - Informe de revisión SDD]] · → [[Coherencia 2. Requisitos por módulo]]

## 1. Método

- **Filas:** una por cada RF, EC y RNF de `spec.md` v1.5, en el orden de la spec (M1 a M15 y luego los RNF).
- **Estado:**
  - `coincide`: el código hace lo que dice el requisito y al menos una prueba que lo cita lo demuestra.
  - `difiere`: el código, la prueba o el documento dicen otra cosa; el detalle está en la tabla de diferencias (§3).
  - `no verificable`: el requisito depende de condiciones que el pipeline no reproduce (un dispositivo, un navegador o una red reales). Se indica la prueba que lo aproxima.
- **Evidencia:** las pruebas (Vitest y Playwright) que citan el ID en su nombre o en su comentario, hasta dos por fila; entre paréntesis, cuántas más lo citan. No se cuenta `sdd-coherence.test.ts`, que cita todos los IDs para comprobar la matriz.
- **Revisión del contenido:** se leyó a mano el código de los requisitos que cambió la v1.5 (RF-M1-08, RF-M1-16, RF-M1-18, EC-M1-11, EC-M1-13, EC-M1-14, RF-M2-13, RF-M2-14, EC-M2-04, RNF-25, RNF-29) y los límites de RNF-28 (`apps/api/src/application/shared/limits.ts`). Para el resto, la evidencia es la prueba que cita el ID y que está en verde en la rama.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]]
- **Requerimientos no funcionales:** [[Spec 3.10 Límites por usuario]] · [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.9 Auditoría y retención]]

