---
tipo: "ejecucion"
fuente: ".claude/run/TASK-271/verdict.md"
tags:
  - "ia/ejecucion"
actualizado: "2026-10-30"
---

> [!abstract] Estado local del pipeline para TASK-271 (`.claude/run/TASK-271/verdict.md`, no versionado). Etapa: **Veredicto**. Ver [[Protocolo 2. Skill implement-task TASK-XXX]].

VERDICT: APPROVED

Alcance: el único cambio en el árbol de trabajo es el archivo nuevo <proyecto>\apps\api\test\unit\sdd-coherence.test.ts, que es el único archivo que la tarea declara. No hay archivos de implementación, y eso coincide con lo que pide la tarea.

Cumplimiento de la Especificación de Implementación:
- Lee constitution.md, spec.md, plan.md y tasks.md con `node:fs` y pasa los CRLF a LF.
- Hay un caso por comprobación y cada uno lista sus diferencias usando `setDiff` o listas de faltantes.
- **(1)** Los tipos de correo de la spec RF-M1-16 coinciden en todas las fuentes que la tarea nombra: el enum `email_kind` del plan §3.2, `EMAIL_KINDS`, el tipo `EmailKind` y las plantillas (`emailTemplates`). Además compara con el enum de `schema.prisma` y exige exactamente 5 tipos.
- **Criterios RF-M1-16 y RF-M1-08:** se comprueba que ningún tipo de correo trata de intentos fallidos. También que la spec y el plan no anuncian ese correo; se exceptúan las filas del historial de versiones y las menciones con «sin login_alert». Por último, revisa que la espera progresiva siga en la spec y en el plan, con el texto literal de RF-M1-08 y la fila sign-in con `LOGIN_LOCKED` y `throttle.fail()`.
- **(2)** Endpoints del plan §4.x.2 contra las rutas de `presentation/routes` montadas en `app.ts`, en los dos sentidos.
- **(3)** Catálogo `ErrorCode` de contracts contra los códigos del plan, en los dos sentidos.
- **(4)** Cada `CREATE TABLE` del plan §3 contra los `@@map` de los modelos de Prisma, en los dos sentidos.
- **(5)** Cada RF, EC y RNF de la spec tiene su fila en la matriz §5.5, y cada escenario Gherkin la suya en §5.2.
- **(6)** Cada variable de env.ts está en .env.example, y cada variable de render.yaml con `sync: false` está en env.ts.
- **(7)** Cada ID que cita el backlog de tasks.md existe en la spec.
- **(8)** La versión que cita cada encabezado es la del documento citado.
- **(9)** El mapa de fases cubre exactamente las tareas de cada fase, incluidos los rangos «TASK-x a TASK-y».

Calidad de las pruebas: ningún caso puede pasar sin comprobar nada. Cada uno exige un mínimo de elementos encontrados antes de comparar (por ejemplo más de 50 endpoints, más de 30 tablas, más de 200 IDs, más de 50 escenarios, más de 3 citas de versión y más de 20 fases). Así, un parser roto falla en vez de comparar listas vacías. Los imports existen: `ErrorCode` está en packages/contracts/src/errors.ts, y `EMAIL_KINDS` y `emailTemplates` en apps/api/src/infrastructure/integrations/email-templates.ts.

Constitución: no hay reglas de negocio inventadas, ni secretos, ni manejo de dinero. El código está en inglés y solo los literales que se buscan en los documentos están en español.

Observaciones menores, sin cambios necesarios:
- Las comprobaciones dependen del formato actual de los documentos: encabezados `#### 4.x.y Endpoints`, `### 5.5`, y filas del mapa de fases cuya primera celda es un número. Si ese formato cambia, el caso falla con un error explícito o por el mínimo de elementos; no deja de comprobar sin avisar.
- En (3), los códigos del plan se toman de las expresiones con estado HTTP (por ejemplo `CODE 409`) y de la última columna de las tablas de endpoints. Un código que el plan nombre solo en prosa no se compara contra el catálogo. El sentido catálogo → plan sí busca en todo el texto.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]
- **Spec / Plan / Constitución:** [[Plan 3. Esquema de Datos y Persistencia Global]] · [[Plan 3.2 Tipos enumerados]] · [[Plan 4. Diseño Técnico por Módulo]]

