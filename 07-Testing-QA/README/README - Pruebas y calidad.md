---
tipo: "readme"
fuente: "README.md § Pruebas y calidad"
documento: "[[README - App de Finanzas Personales]]"
tags:
  - "readme"
actualizado: "2026-10-30"
---

↑ [[README - App de Finanzas Personales]] · ← [[README - Cómo correrlo en local]] · → [[README - Integración y despliegue continuos]]

## Pruebas y calidad

| Comando                       | Qué revisa                                               |
| ----------------------------- | -------------------------------------------------------- |
| `pnpm lint`                   | ESLint estricto, sin textos sueltos en la interfaz       |
| `pnpm typecheck`              | Tipos estrictos en todo el monorepo                      |
| `pnpm depcruise`              | Reglas de capas del backend                              |
| `pnpm test:unit`              | Pruebas unitarias                                        |
| `pnpm test:integration`       | Integración contra Postgres (con `docker compose up -d`) |
| `pnpm --filter e2e test`      | E2E con Playwright (Chromium, WebKit y Firefox)          |
| `node --test tools/sdd/test/` | Pruebas de los scripts del pipeline                      |

Cada regla de negocio tiene su prueba, y el nombre de cada caso lleva el ID que verifica (`RF-M4-04 …`, `TASK-038 …`).

Dentro de `pnpm test:unit`, `sdd-coherence.test.ts` (`apps/api/test/unit/sdd-coherence.test.ts`) compara la spec, el plan y `tasks.md` con el código: tipos de correo, endpoints, códigos de error, tablas, matriz de trazabilidad, variables de entorno, IDs citados, versiones y mapa de fases. Si un documento y el código se separan, la prueba falla y lista cada diferencia. La revisión manual de cada requisito está en [[Coherencia - Informe de revisión SDD|coherencia.md]].

Cada respuesta de la API trae `Server-Timing` (tiempo total, tiempo en la base y número de consultas). Para reproducir en local la distancia a Neon, `DB_LATENCY_MS` agrega esa latencia a cada consulta (solo fuera de producción).

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]]
- **Fases de tareas:** [[Tareas Fase 4 - Base del API]]

