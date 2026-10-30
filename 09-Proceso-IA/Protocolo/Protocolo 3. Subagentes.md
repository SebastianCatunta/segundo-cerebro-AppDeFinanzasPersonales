---
tipo: "protocolo"
fuente: "docs/execution-protocol.md § 3. Subagentes"
documento: "[[Protocolo de ejecución con agentes]]"
tags:
  - "ia/protocolo"
actualizado: "2026-10-30"
---

↑ [[Protocolo de ejecución con agentes]] · ← [[Protocolo 2. Skill implement-task TASK-XXX]] · → [[Protocolo 4. Hooks]]

## 3. Subagentes

| Subagente | Herramientas | Puede escribir | Responsabilidad | Termina con |
|---|---|---|---|---|
| `test-author` | Read, Grep, Glob, Write, Edit, Bash | Solo los archivos de test del alcance | Escribe las pruebas a partir de los «Criterios de verificación» y de los escenarios Gherkin citados. Cada caso lleva en su nombre el ID que verifica (`it('RF-M4-04 …')`, plan §5.4) o, si no hay ID, el de la tarea. No mira ninguna implementación de la tarea. | Pruebas en rojo |
| `implementer` | Read, Grep, Glob, Write, Edit, Bash | Solo los archivos del alcance que no son de test | Escribe el código hasta poner las pruebas en verde, siguiendo el plan: capas (ADR-19), dinero exacto (ADR-03), identidad desde la sesión (ADR-05), errores (ADR-09) y textos en `locales/es-BO`. No modifica las pruebas de la etapa 1. | Código en verde |
| `sdd-auditor` | Read, Grep, Glob, Bash (solo lectura: `git diff`, `git status`) | Nada | Revisa el diff contra la constitución, el plan y el texto de la spec: reglas de negocio inventadas, RF o EC sin cubrir, reglas de capas, dinero en punto flotante, `userId` tomado del cliente, secretos o detalles internos expuestos, textos sin traducir. | Un veredicto (§3.1) |

### 3.1 Veredicto de la auditoría

La respuesta final del auditor empieza con una de estas líneas:

- `VERDICT: APPROVED`
- `VERDICT: CHANGES_REQUIRED`, seguido de los hallazgos, uno por línea: `archivo:línea · regla violada (constitución §x, plan §x.y, RF-xx) · corrección esperada`.
- `VERDICT: NEEDS_CLARIFICATION`, seguido de la pregunta de negocio y las opciones.

### 3.2 Paradas

Cualquier subagente puede terminar su trabajo con una de estas líneas, como **primera línea** de su respuesta. El gate no lo juzga ni le gasta intentos: deja la tarea en `status = blocked` con ese motivo, y el orquestador le pregunta al usuario.

- `NEEDS_CLARIFICATION: <pregunta>`: la spec o el plan son ambiguos (constitución §6).
- `SCOPE_CHANGE_REQUEST: <archivo> · <motivo>`: hace falta un archivo fuera del alcance. Se corrige `tasks.md` en un commit `docs:` y se retoma.

---

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]] · [[ADR-05 - Aislamiento por usuario]] · [[ADR-09 - Errores problem+json]] · [[ADR-19 - Backend en capas]]
- **Spec / Plan / Constitución:** [[Constitución 6. Desarrollo guiado por especificaciones (SDD)]] · [[Plan 5.4 Definición de terminado de cada módulo]]

