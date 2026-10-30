---
tipo: "protocolo"
fuente: "docs/execution-protocol.md § 2. Skill /implement-task TASK-XXX"
documento: "[[Protocolo de ejecución con agentes]]"
tags:
  - "ia/protocolo"
actualizado: "2026-10-30"
---

↑ [[Protocolo de ejecución con agentes]] · ← [[Protocolo 1. Piezas]] · → [[Protocolo 3. Subagentes]]

## 2. Skill `/implement-task TASK-XXX`

### 2.1 Flujo

```
0 Preflight ─► 1 test-author ─► [Gate A] ─► 2 implementer ─► [Gate B] ─► 3 sdd-auditor ─► 4 Cierre
                                                 ▲                              │
                                                 └── CHANGES_REQUIRED (máx. 2) ─┘
```

| Paso | Quién | Qué hace |
|---|---|---|
| 0 · Preflight | `tools/sdd/preflight.mjs` | Verifica que la tarea exista y esté `[ ]`, que sus dependencias estén `[x]`, que el árbol de trabajo esté limpio y que no haya otra tarea activa sin cerrar. Ubica la rama (§5). Arma el paquete de contexto (§2.3) y escribe `active-task.json`. |
| 1 · Pruebas | Subagente `test-author` | Con `phase = tests`. Se salta si el alcance no tiene archivos de test (§6). |
| 2 · Implementación | Subagente `implementer` | Con `phase = implement`. Se salta en una **tarea de verificación**: aquella cuyo alcance solo tiene archivos de test (regresión, RNF, harness). |
| 3 · Auditoría | Subagente `sdd-auditor` | Con `phase = audit`. El orquestador registra su veredicto con `audit.mjs`, que valida el formato y lo agrega a `audit.md`. Si es `CHANGES_REQUIRED`, vuelve al paso 2 con los hallazgos agregados al contexto. |
| 4 · Cierre | Orquestador | Con `phase = commit`, ejecuta `close.mjs`: marca `[x]` en `tasks.md`, hace el commit (§5) y borra `active-task.json`. Si la tarea es la última de su fase, ofrece abrir el PR. |

Volver a invocar la skill sobre una tarea `blocked` la retoma desde la fase en la que se detuvo.

### 2.2 Estado

`.claude/run/active-task.json`:

```json
{
  "task": "TASK-031",
  "feature": "001-appFinanzas-mvp",
  "branch": "feature/09-m4-cuentas",
  "phase": "preflight | tests | implement | audit | commit",
  "status": "running | blocked",
  "blockedReason": null,
  "scope": ["apps/api/src/application/services/accounts.service.ts", "apps/api/test/integration/accounts-create-list.test.ts"],
  "testFiles": ["apps/api/test/integration/accounts-create-list.test.ts"],
  "implFiles": ["apps/api/src/application/services/accounts.service.ts"],
  "commands": [],
  "verificationOnly": false,
  "gates": { "A": { "attempts": 0, "passed": false }, "B": { "attempts": 0, "passed": false } },
  "auditRounds": 0,
  "auditFingerprint": null
}
```

El estado solo cambia con `tools/sdd/state.mjs` (`phase`, `block`, `unblock`, `abort`), que valida cada transición: por ejemplo, no se pasa a `audit` sin el Gate B aprobado ni a `commit` sin un veredicto `APPROVED`.

`.claude/run/TASK-XXX/`: `context.md` (paquete de contexto), `tests.lock` (hash de las pruebas), `verdict.md` (última respuesta del auditor), `audit.md` (veredictos de todas las rondas), `gate.log` (salida de cada gate) y `commit-msg.txt`.

### 2.3 Paquete de contexto

Cada subagente recibe solo `context.md`, armado por `tools/sdd/context.mjs`:
1. el bloque completo de la tarea en `tasks.md`;
2. `docs/constitution.md` completa (es corta);
3. las convenciones del plan, las filas de los ADR citados y las secciones de `plan.md` citadas en su Trazabilidad, completas;
4. el texto literal de cada RN, RF, EC y RNF citado, y de cada escenario Gherkin citado en sus criterios, tomado de `spec.md`;
5. en una segunda ronda, los hallazgos de la auditoría anterior.

Si un subagente necesita leer otro archivo del repositorio (por ejemplo, un puerto que ya existe), puede hacerlo; lo que no puede es escribir fuera del alcance.

---

---
## 🔗 Relacionado

- **Fases de tareas:** [[Tareas Fase 4 - Base del API]]

