---
tipo: "testing"
tags:
  - "testing"
actualizado: "2026-10-30"
---

# 🧪 Estrategia de pruebas

↑ [[MOC Testing]] · Diseño: [[Plan 5.1 Estrategia]] · Principio: [[Constitución 5. Calidad]]

> Toda regla de negocio tiene una prueba, y todo acceso a datos tiene una prueba de aislamiento entre usuarios. El nombre de cada caso lleva el ID que verifica (`RF-M4-04 …`, `TASK-038 …`).

## Pirámide

| Nivel | Herramienta | Dónde | Nota |
|---|---|---|---|
| Dominio | Vitest, funciones puras | `packages/domain/test` | [[Pruebas de los paquetes]] |
| Contratos | Vitest | `packages/contracts/test` | [[Pruebas de los paquetes]] |
| Esquema | Vitest + Postgres | `packages/db/test` | [[Pruebas de los paquetes]] |
| Aplicación e infraestructura | Vitest + Postgres (Docker en local, *service* en CI) | `apps/api/test/integration` | [[Pruebas del API]] |
| Contratos HTTP | Vitest + supertest | `apps/api/test/http` | [[Pruebas del API]] |
| Web (unitarias) | Vitest | `apps/web/test` | [[Pruebas de la web]] |
| E2E, accesibilidad y rendimiento | Playwright + axe | `e2e/` | [[Pruebas E2E (Playwright)]] |
| Pipeline SDD | `node --test` | `tools/sdd/test` | [[Scripts SDD (tools-sdd)]] |

## Dónde corren

- **Local:** `pnpm test:unit`, `pnpm test:integration` (con `docker compose up -d`) y `pnpm --filter e2e test` ([[README - Pruebas y calidad]], [[Entorno local]]).
- **CI en cada push y PR:** [[Workflow ci.yml]].
- **QA efímero (rama `qa` y PR a `main`):** [[Workflow qa-e2e.yml]], con 3 navegadores × 2 anchos, axe y rendimiento.

## Controles especiales

- **Coherencia SDD:** `apps/api/test/unit/sdd-coherence.test.ts` compara la spec, el plan y `tasks.md` con el código. Revisa los tipos de correo, los endpoints, los códigos de error, las tablas, las variables de entorno, los IDs y el mapa de fases ([[Coherencia - Informe de revisión SDD]], [[TASK-271 - Veredicto]]).
- **Costo por petición:** las pruebas de rendimiento cuentan las sentencias SQL y simulan latencia con `DB_LATENCY_MS` ([[Plan 4.0 Elementos transversales]]).
- **Gherkin → pruebas:** [[Plan 5.2 Criterios de aceptación (Gherkin) → pruebas]] · RNF → verificación: [[Plan 5.3 Requerimientos no funcionales → verificación]].
- **Definición de terminado:** [[Plan 5.4 Definición de terminado de cada módulo]] · trazabilidad: [[Plan 5.5 Matriz de trazabilidad (spec → plan)]].

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]] · [[Tareas Fase 4 - Base del API]]

