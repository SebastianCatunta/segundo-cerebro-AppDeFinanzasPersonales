---
tipo: "protocolo"
fuente: "docs/execution-protocol.md § 6. Formato de tasks.md que leen los scripts"
documento: "[[Protocolo de ejecución con agentes]]"
tags:
  - "ia/protocolo"
actualizado: "2026-10-30"
---

↑ [[Protocolo de ejecución con agentes]] · ← [[Protocolo 5. Ramas, commits y PR]] · → [[Protocolo 7. Arranque]]

## 6. Formato de `tasks.md` que leen los scripts

`tools/sdd/task-parse.mjs` espera esto en cada tarea:

- Encabezado: `` - [ ] **`TASK-NNN`: <título>** `` (tres dígitos; `[x]` cuando está cerrada).
- **Dependencias:** `Ninguna` o los IDs `TASK-NNN` separados por comas.
- **Trazabilidad SDD:** cita `plan §x.y.z` y los IDs exactos de la spec (`RF-M4-04`, `EC-M4-01`, `RNF-10`, `RN-06`).
- **Archivos en Alcance:** una ruta entre backticks por viñeta, relativa a la raíz. Solo se admiten globs en `packages/db/prisma/migrations/`.
- **Criterios de Verificación:** las líneas `` Comando: `…` `` son comandos que el Gate B ejecuta y que deben terminar con 0. Se escriben con sintaxis POSIX y corren en `sh` (en Windows, el bash de Git; nunca `cmd.exe`).
- **Pasos manuales** (opcional, después de los cinco obligatorios): lo que una persona tiene que hacer fuera del pipeline, como crear cuentas, configurar paneles o cargar secretos. Va como lista numerada, con sangría de 4 espacios. Los scripts no lo leen y los subagentes no lo ejecutan ni lo auditan. Al cerrar la tarea, el orquestador se lo muestra al usuario como una lista para ir marcando.

Un archivo es de test si coincide con `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`, `**/test/**` o `e2e/**`. Las fases se marcan con encabezados `### Fase N — <nombre>` y definen la rama (§5).

**Reparto del alcance** (`splitScope` en `tools/sdd/lib/scope.mjs`): test-author escribe los archivos de test, salvo los manifiestos y las configuraciones (`package.json`, `tsconfig.json`, `*.config.*`), que siempre escribe el implementer porque es quien instala. Si la tarea no tiene ningún archivo con casos de prueba (`*.test.*`, `*.spec.*`), sus archivos de test son solo harness y también los escribe el implementer: la tarea no pasa por la etapa de pruebas.

**Huecos de alcance** (`scopeProblems` en `tools/sdd/lib/tasks.mjs`): `preflight.mjs` no arranca una tarea con un hueco que haría fallar un gate sin que el subagente pueda corregirlo, y `sdd.test.mjs` revisa todas las tareas abiertas:
- Si una tarea toca un `package.json`, también tiene `pnpm-lock.yaml` en su alcance.
- Cada `.ts` o `.tsx` del alcance cae en el `tsconfig.json` de su paquete (`apps/*`, `packages/*` o `e2e`), creado en esa tarea o en una anterior. Por eso cada `tsconfig.json` de paquete cubre todas sus carpetas, también las que agregarán tareas posteriores. El JS de configuración (`*.js`, `*.cjs`, `*.mjs`) se revisa con ESLint sin información de tipos, así que no necesita un tsconfig.
- Si una tarea crea un `global-setup` de Vitest en `test/`, también tiene el `vitest.config.ts` de su paquete en el alcance, porque hay que registrarlo ahí.

---

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]]
- **Requerimientos no funcionales:** [[Spec 3.3 Concurrencia]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

