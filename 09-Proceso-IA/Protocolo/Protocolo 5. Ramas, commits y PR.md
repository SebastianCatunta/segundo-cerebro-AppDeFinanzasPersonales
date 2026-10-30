---
tipo: "protocolo"
fuente: "docs/execution-protocol.md § 5. Ramas, commits y PR"
documento: "[[Protocolo de ejecución con agentes]]"
tags:
  - "ia/protocolo"
actualizado: "2026-10-30"
---

↑ [[Protocolo de ejecución con agentes]] · ← [[Protocolo 4. Hooks]] · → [[Protocolo 6. Formato de tasks.md que leen los scripts]]

## 5. Ramas, commits y PR

- **Una rama por fase de `tasks.md`**, salida de `develop`: `feature/<NN>-<slug-de-la-fase>` (por ejemplo, `feature/04-m4-cuentas`). Si el preflight corre en `develop`, crea la rama de la fase de la tarea; si corre en otra rama de feature, exige que sea la de esa fase.
- **Un commit por tarea**, hecho por el orquestador:

  ```
  feat(accounts): TASK-031 implementar AccountsService.create

  <resumen de lo implementado>

  Task: TASK-031
  Audit: approved
  ```

  El tipo es `feat`, `test`, `chore`, `build` o `ci` según la tarea, y el scope es el módulo o el paquete. `close.mjs` pone el ID de la tarea, corta el cuerpo a 100 columnas y pasa el mensaje por commitlint antes de hacer el commit, así un mensaje inválido no aparece recién en el `pre-push`.
- **Traer `develop` a la rama** con un merge es válido: el `pre-push` y commitlint no revisan el asunto de los merges que escribe git.
- **Un PR a `develop`** al cerrar la última tarea de la fase. Antes corre el `pre-push`, y el PR se fusiona con CI en verde.
- Corregir `tasks.md`, `plan.md` o `spec.md` es un commit `docs:` aparte, nunca mezclado con código (constitución §6).

### 5.1 Ramas de grupo

Para trabajar en paralelo una cadena de fases, varias fases pueden repartirse entre **ramas de grupo**, definidas en [[Config - branch-groups.json|tools/sdd/branch-groups.json]]. Cada grupo tiene su rama y la lista de sus tareas (con rangos como `TASK-068..TASK-076`). Una tarea está como mucho en un grupo; las que no están en ninguno siguen la regla de una rama por fase.

- **Preflight:** una tarea de un grupo se hace en la rama del grupo. Desde `develop`, el preflight cambia a esa rama: la local, la de `origin` (con seguimiento) o, si no existe, una nueva. Una tarea que ya estaba a medio hacer se retoma en la rama donde empezó.
- **Dependencias entre grupos:** el preflight sigue exigiendo que las dependencias estén `[x]` en el `tasks.md` de la rama. Si una tarea depende de otra que se cerró en el otro grupo, se trae esa rama con un merge (`git merge origin/<rama-del-otro-grupo>`).
- **Cierre y PR:** `close.mjs` responde `lastOfPhase: true` cuando no quedan tareas abiertas en la rama (todo el grupo), y ahí se abre el PR a `develop`. Se puede abrir antes un PR parcial si el otro grupo necesita algo con urgencia.
- **Resumen de sesión:** en una rama de grupo, el resumen muestra el avance del grupo y solo sus tareas disponibles.
- Cambiar el reparto es editar `branch-groups.json` en un commit `chore(sdd):` aparte y avisar al equipo.

### 5.2 Asignaciones y coordinación entre personas

En las ramas de grupo trabajan varias personas a la vez, cada una con su Claude Code. Cada tarea tiene una sola persona, y nadie elige tareas: las asigna la tabla de [[Asignaciones de las Fases 7 a 25|docs/asignaciones.md]] (`| TASK-NNN..TASK-MMM | @usuario |`, con el usuario de GitHub). Una persona puede tener tareas en las dos ramas de grupo.

- **Qué me toca:** `node tools/sdd/coordinate.mjs next` hace `git fetch` y decide con el `tasks.md` de cada rama de grupo y de `develop` en `origin`: una tarea está cerrada si está `[x]` en alguna. Devuelve la primera tarea propia con todas sus dependencias cerradas, su rama y las ramas que hay que traer con un merge (`implement`); o qué tareas propias esperan a cuáles, de quién y en qué rama (`wait`); o que una espera a una tarea sin persona (`stuck`). La lógica es `lib/coordination.mjs`, una función pura con sus pruebas.
- **Quién soy:** `git config sdd.member <usuario-de-github>`, una vez por copia. Si no está, el script usa el usuario de `gh`.
- **La señal es el push:** una tarea está hecha para los demás cuando su `[x]` llega a `origin`. Por eso `/coordinar-fases` sube cada tarea apenas `close.mjs` hace el commit, y si el push se rechaza trae los cambios con un merge (nunca rebase) y reintenta.
- **Esperar sin gastar:** `node tools/sdd/coordinate.mjs wait` repite el `fetch` cada 3 minutos y termina cuando la acción deja de ser `wait` (o a las 12 horas). La skill lo corre en segundo plano y retoma cuando termina.
- **Estado del equipo:** `node tools/sdd/coordinate.mjs status` dice qué le toca a cada persona y qué tareas abiertas de un grupo no tienen a nadie.
- **Paradas:** si `/implement-task` se detiene, un merge choca o el `pre-push` falla, `/coordinar-fases` se detiene y la persona decide. Quien espera esa tarea sigue esperando hasta que se suba.
- **Cambiar el reparto:** las asignaciones se leen de la copia local, que `/coordinar-fases` actualiza con un `pull` antes de cada tarea. Se cambian con un commit `chore(sdd):` aparte que se sube a las dos ramas de grupo, avisando al equipo.
- **Permisos:** `git switch`, `pull`, `merge` y `push` piden permiso en el modo normal. Para que el bucle no se frene, cada persona elige su modo de permisos (por ejemplo, el automático).

---

---
## 🔗 Relacionado

- **Fases de tareas:** [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]
- **Spec / Plan / Constitución:** [[Constitución 6. Desarrollo guiado por especificaciones (SDD)]]

