---
tipo: "ejecucion"
fuente: ".claude/run/TASK-273/verdict.md"
tags:
  - "ia/ejecucion"
actualizado: "2026-10-30"
---

> [!abstract] Estado local del pipeline para TASK-273 (`.claude/run/TASK-273/verdict.md`, no versionado). Etapa: **Veredicto**. Ver [[Protocolo 2. Skill implement-task TASK-XXX]].

VERDICT: APPROVED

TASK-273 cumple la spec y la constitución. Revisé el diff de los dos archivos en alcance y no corrí nada.

Archivos auditados:
- <proyecto>\apps\web\src\features\auth\components\check-email.tsx
- <proyecto>\e2e\m1-sign-up-confirm-sync.spec.ts

**Spec (EC-M1-11, EC-M2-01, RF-M1-18)**
- `onConfirmed` lee de la caché el `MeDto` anterior (`ME_QUERY_KEY`). Luego pide `/api/me` para saber quién confirmó. Si la persona anterior es otra, llama a `clearAllDrafts(id)` y a `queryClient.clear()`, igual que `session-expired-dialog.tsx` (plan §4.2.3).
- Al final siempre navega a `/bienvenida` con `replace`. Si `/api/me` falla, vuelve al comportamiento anterior: invalida `['me']` y navega igual.
- **EC-M1-11 / EC-M2-01:** el E2E deja un borrador `draft:{idDeB}:profile`. La clave y el esquema `{ name }` son los que usa de verdad `profile-form.tsx` (`PROFILE_DRAFT_KEY = 'profile'`), así que la prueba no pasa sola. Después comprueba que no queda ninguna clave `draft:{idDeB}:` y que, al volver a entrar como B, `/perfil` muestra su nombre real y no el del borrador.
- **RF-M1-18:** hay un caso aparte sin otra sesión abierta que verifica la llegada a `/bienvenida` (Paso 1 de 3) y la sesión de A.

**Constitución:** no hay dinero, textos de interfaz nuevos, secretos ni estilos visuales en el cambio. El código está en inglés.

**Alcance:** solo cambiaron los dos archivos declarados.

Observaciones menores, que no requieren cambios:
1. **Más de lo que pide la Especificación de Implementación.** Además de leer el `MeDto` de la caché, `otherDraftOwners` recorre `sessionStorage` y descarta los borradores de cualquier usuario que no sea el que confirmó. Hace falta para que pase el E2E: B entra con `page.request` y su `MeDto` nunca llega a la caché de esa pestaña. No es una regla inventada: aplica tal cual el texto de EC-M1-11 ("su borrador se descarta") y de EC-M2-01 ("el borrador del usuario anterior se descarta"). Como `sessionStorage` es de cada pestaña, esos borradores solo pueden ser de sesiones anteriores en ella. Conviene que la descripción de la tarea en `tasks.md` lo mencione.
2. **Diferencia con el caso sin otra sesión.** En vez de solo invalidar `['me']`, ahora se hace `fetchQuery` antes de navegar. Para quien usa la app el resultado es el mismo: llega a `/bienvenida` con la sesión de A.
3. **Constante duplicada.** `DRAFT_PREFIX = 'draft:'` se repite en `check-email.tsx` y en `lib/drafts.ts`, que no exporta una función para listar a los dueños de los borradores. Es duplicación, no una violación de ninguna regla.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]
- **Spec / Plan / Constitución:** [[Plan 4.2 M2 - Navegación y estructura (V1.0)]]

