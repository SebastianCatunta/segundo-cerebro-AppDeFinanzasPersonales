---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 5.1 Estrategia"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 5. Matriz de Verificación y Estrategia de Testing]] · → [[Plan 5.2 Criterios de aceptación (Gherkin) → pruebas]]

### 5.1 Estrategia

| Nivel | Herramienta | Alcance | Regla de la constitución |
|---|---|---|---|
| Unitario de dominio | Vitest | Todo `packages/domain`: dinero y redondeo, conversiones, resolución de tasas, períodos, interés, recurrencias, progreso de metas, formatos, parseo de montos. Incluye tests de propiedades para el redondeo (sin diferencias acumuladas) y las fechas. | §5: toda regla de negocio tiene un test |
| Contratos | Vitest | Cada schema de `packages/contracts` con casos válidos e inválidos en la frontera (largos, rangos, decimales, enums). | §4: toda entrada se valida |
| Integración de API | Vitest + Supertest + Postgres en Docker | Cada endpoint contra una base real migrada: transacciones, triggers, CHECK, índices únicos, códigos de error, idempotencia, jobs. | — |
| Aislamiento | Vitest (integración) | Por cada repositorio y endpoint: el usuario B no puede leer, editar, borrar ni referenciar recursos de A (responde 404), incluso por clave foránea. | §5: todo acceso a datos tiene test de aislamiento |
| Concurrencia | Vitest (integración, `Promise.all` con conexiones distintas) | Gastos simultáneos sobre el mismo efectivo, doble confirmación de un enlace, doble decisión de cierre, doble confirmación de un pendiente, jobs en paralelo, desactivar una moneda mientras se crea una cuenta. | — |
| E2E | Playwright (Chromium, WebKit y Firefox; 360 px y 1280 px) | Escenarios Gherkin de la spec, navegación adaptable, sin conexión, sesión vencida, teclado, accesibilidad con `@axe-core/playwright`. | — |
| Rendimiento | Playwright + seed de 5.000 movimientos | RNF-01, RNF-02 y RNF-03 con perfil de red 4G y CPU de gama media (×4 de throttling). | — |
| Calidad en CI | GitHub Actions (`ci.yml`) | commitlint, lint, typecheck estricto, reglas de capas (dependency-cruiser), unitarios e integración en cada push y PR. Los contratos HTTP del API (proyecto `http` de Vitest, supertest sin BD) corren dentro de `test:unit`. Ningún PR se integra con fallas. | §5 y §7 |
| QA efímero | GitHub Actions (`qa-e2e.yml`) | E2E completo, axe y rendimiento contra un entorno temporal en cada push a `qa` y en cada PR hacia `main`. Es un check requerido para integrar en `main`. | §7 (validación antes de producción) |
| Despliegue | GitHub Actions (`deploy.yml`) | En cada push a `main`: CI → migraciones → Render → Vercel → pruebas de humo de los tres enlaces (1.2). Si un paso falla, no se sigue y queda en línea la versión anterior. | §7 |

**Datos de prueba:** fábricas por entidad en `apps/api/test/factories`. Cada test usa un usuario nuevo. Los jobs se prueban con un reloj inyectable (`Clock`) y zonas horarias distintas (America/La_Paz, Europe/Madrid, America/Santiago).

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]]

