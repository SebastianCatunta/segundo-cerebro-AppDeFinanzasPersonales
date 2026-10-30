---
tipo: "protocolo"
fuente: "docs/execution-protocol.md § 4. Hooks"
documento: "[[Protocolo de ejecución con agentes]]"
tags:
  - "ia/protocolo"
actualizado: "2026-10-30"
---

↑ [[Protocolo de ejecución con agentes]] · ← [[Protocolo 3. Subagentes]] · → [[Protocolo 5. Ramas, commits y PR]]

## 4. Hooks

### 4.1 `SubagentStop` → `tools/sdd/gate.mjs`

Lee `active-task.json` y aplica el gate de la fase. Si un control falla, bloquea el cierre del subagente y le devuelve el error como motivo, para que siga trabajando. Sin tarea activa, o con la tarea bloqueada, no hace nada.

- **A quién juzga:** el *matcher* del hook lo limita a los tres subagentes del pipeline. Además, el gate lee `agent_type` de la entrada del hook y solo juzga al subagente de la fase vigente: `test-author` en `tests`, `implementer` en `implement` y `sdd-auditor` en `audit`. Un subagente de exploración que termine durante una tarea no consume intentos.
- **Paradas:** si `last_assistant_message` empieza con `NEEDS_CLARIFICATION` o `SCOPE_CHANGE_REQUEST` (§3.2), no corre los controles: bloquea la tarea con ese motivo y deja terminar al subagente.
- **Autoverificación:** antes de terminar, el test-author y el implementer corren `node tools/sdd/check.mjs`. Aplica los mismos controles del gate de la fase (`lib/gates.mjs`), pero sin gastar intentos, y sale con código 0 si el gate pasaría. Si el Gate B pasaría y el árbol de trabajo no cambió mientras corría, anota su huella en el estado y el hook de cierre reutiliza ese resultado en lugar de repetir los controles (basta que cambie un archivo, o que haya otra ronda, para que se corran de nuevo). Así, la mayoría de los errores (tipos, lint, comandos, alcance) se corrigen antes de que cuente un intento.

**Gate A (`phase = tests`):**
1. Los archivos cambiados o nuevos (`git status --porcelain`) son solo archivos de test del alcance.
2. Existe al menos un caso de prueba, y cada caso lleva un ID `RN-`, `RF-`, `EC-`, `RNF-` o `TASK-` en su nombre.
3. Cada RF y EC citado en la Trazabilidad de la tarea tiene al menos un caso con su ID en el nombre, en la tarea o en el repositorio (adelanta el control 4 del `pre-push`).
4. Las pruebas corren y **fallan**. Un error de sintaxis en el propio archivo de test no cuenta como rojo. En una tarea de verificación (§2.1), las pruebas deben **pasar**, porque verifican algo que ya existe; si siguen fallando después de los intentos, el pipeline se detiene y pregunta, ya que el defecto puede estar fuera del alcance de la tarea.
5. Si todo pasa, guarda el hash SHA-256 de cada archivo de test en `tests.lock`.

**Auditoría (`phase = audit`):** al pasar a esta fase, `state.mjs` guarda una huella del árbol de trabajo. Cuando el auditor termina, el gate la compara: si algo cambió, deja terminar al auditor, marca la tarea `blocked` y el orquestador le pregunta al usuario.

**Error interno del gate:** si el propio script falla, deja terminar al subagente y marca la tarea `blocked` con el error.

**Gate B (`phase = implement`):**
1. Los archivos cambiados o nuevos están dentro del alcance.
2. Los hashes de `tests.lock` no cambiaron.
3. Typecheck (`tsc --noEmit`) de cada workspace tocado.
4. ESLint de los archivos cambiados (incluye `i18next/no-literal-string` y la prohibición de `.only` y `.skip`).
5. dependency-cruiser, si se tocó `apps/api`.
6. Las pruebas de la tarea y `vitest related` de los archivos cambiados, en verde. Si alguna es de integración, levanta antes Postgres con `docker compose up -d`.
7. Los comandos de la tarea (`commands`, §6), si los hay, terminan con código 0.

**Límites:** cada gate bloquea como máximo 3 veces por tarea. A la cuarta falla deja cerrar al subagente, marca `status = blocked` con la salida en `gate.log`, y el orquestador le pregunta al usuario.

**Resultados obsoletos:** los controles tardan, y mientras corren el orquestador puede cambiar de fase (un subagente puede terminar tarde). Cada cambio de fase, `block` y `unblock` incrementa `epoch` en `active-task.json`. Antes de guardar, el gate relee el estado: si la tarea, la fase, `epoch` o `status` ya no son los que vio al empezar, descarta su resultado, lo anota en `gate.log` y deja terminar al subagente sin tocar el estado.

### 4.2 `pre-push` → `tools/sdd/pre-push.mjs`

Revisa los commits que se van a subir (los que no están en el remoto) y su diff. Si alguno de estos controles falla, el push se rechaza:
1. **commitlint** sobre cada commit (constitución §7).
2. **Secretos:** ningún archivo `.env*` salvo `.env.example`, y ningún valor con forma de clave, token o URL de base de datos con contraseña.
3. **Trazabilidad:** cada commit con el trailer `Task: TASK-XXX` tiene esa tarea en `[x]` en `tasks.md` y el trailer `Audit: approved`.
4. **Cobertura de IDs:** cada RF y EC citado en la Trazabilidad de las tareas cerradas aparece en el nombre de al menos un test del repositorio (plan §5.4.1).

Son controles de segundos. La suite completa (lint, typecheck, dependency-cruiser, unitarios e integración) no corre en el `pre-push`: la corre CI en cada push y PR (§4.4), y la protección de `develop` exige que pase antes de fusionar. Ahí se detectan las regresiones entre tareas, porque el Gate B solo corre las pruebas relacionadas. Los E2E completos, axe y rendimiento también corren en CI (`qa-e2e.yml`).

### 4.3 `SessionStart` → `tools/sdd/session-brief.mjs`

Al abrir, retomar, limpiar o compactar una sesión de Claude en el proyecto, le agrega al contexto un resumen corto de dónde quedó el trabajo, para que cada integrante retome sin buscar a mano:
- la rama actual, y si el árbol de trabajo está limpio;
- la tarea activa, con su etapa y su estado; si está `blocked`, el motivo;
- el avance: tareas cerradas sobre el total, y las de la fase en curso;
- hasta 5 tareas disponibles, es decir, abiertas con todas sus dependencias cerradas.

El texto lo arma `lib/brief.mjs`, una función pura con sus pruebas. El hook solo lee: no cambia archivos ni el estado, y no participa en el pipeline. Si algo no se puede leer (no hay `tasks.md`, el estado está corrupto o no es un repositorio git), omite ese dato y sale igual con código 0: nunca impide abrir una sesión.

### 4.4 Controles que no son hooks

- La protección de ramas de GitHub impide el push directo a `develop`, `qa` y `main` (plan 1.5).
- CI repite lint, tipos, capas, commitlint y tests en cada push y PR.
- El auditor no tiene herramientas de escritura en su definición.

---

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Constitución 7. Git Flow]] · [[Plan 5.4 Definición de terminado de cada módulo]]

