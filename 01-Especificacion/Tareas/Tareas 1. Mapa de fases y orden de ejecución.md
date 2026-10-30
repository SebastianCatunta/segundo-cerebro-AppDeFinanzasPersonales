---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § 1. Mapa de fases y orden de ejecución"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
actualizado: "2026-10-30"
---

↑ [[Tareas - Backlog del MVP]] · → [[Tareas 2. Backlog de tareas atómicas]]

## 1. Mapa de fases y orden de ejecución

Las tareas se ejecutan en orden numérico, salvo lo que indican las **Decisiones de orden**. Una tarea empieza solo cuando sus dependencias están cerradas. Cada entrega (V1.0, V1.1, V1.2) queda usable y desplegable antes de empezar la siguiente (constitución §1).

| Fase | Contenido | Entrega | Tareas |
|---|---|---|---|
| **0** | Cimientos: monorepo, configuración compartida, Postgres local, andamiaje de paquetes y apps, reglas de capas y CI | Base | TASK-001 a TASK-010 |
| **1** | Esquema de datos completo (plan §3), con sus restricciones, triggers y cascadas | Base | TASK-011 a TASK-020 |
| **2** | Contratos compartidos: primitivas, catálogo de errores, entregas, colores, íconos y categorías precargadas | Base | TASK-021 a TASK-025 |
| **3** | Dominio transversal: dinero, fechas y formatos | Base | TASK-026 a TASK-029 |
| **4** | Base del API: entorno, puertos, aislamiento, transacciones, middlewares, composición, límites y tick de jobs | Base | TASK-030 a TASK-038 |
| **5** | Base de la web: i18n, estado, sin conexión, cliente HTTP, borradores, router y harness E2E | Base | TASK-039 a TASK-046 |
| **6** | M1 Acceso y cuenta | V1.0 | TASK-047 a TASK-067 |
| **7** | M2 Navegación y estructura, perfil y ajustes base | V1.0 | TASK-068 a TASK-076 |
| **8** | M3 Monedas y tipo de cambio | V1.0 | TASK-077 a TASK-095 |
| **9** | M4 Cuentas | V1.0 | TASK-096 a TASK-108 |
| **10** | M5 Categorías | V1.0 | TASK-109 a TASK-117 |
| **11** | M6 Transacciones | V1.0 | TASK-118 a TASK-133 |
| **12** | M7 Registrar | V1.0 | TASK-134 a TASK-142 |
| **13** | M8 Inicio | V1.0 | TASK-143 a TASK-148 |
| **14** | M9 Ajustes y personalización | V1.0 | TASK-149 a TASK-154 |
| **15** | M10 Onboarding | V1.0 | TASK-155 a TASK-162 |
| **16** | Exportación de datos (M1) | V1.0 | TASK-163 a TASK-165 |
| **17** | Cierre de V1.0: rendimiento, accesibilidad, aislamiento y despliegue | V1.0 | TASK-166 a TASK-174 y TASK-248 |
| **18** | M15 Bandeja de avisos | V1.1 | TASK-175 a TASK-179 |
| **19** | M12 Metas de ahorro | V1.1 | TASK-180 a TASK-192 |
| **20** | M11 Presupuestos | V1.1 | TASK-193 a TASK-207 |
| **21** | M13 Deudas y préstamos | V1.1 | TASK-208 a TASK-218 |
| **22** | Cierre de V1.1: bloques del Inicio, exportación y regresión | V1.1 | TASK-219 a TASK-222 |
| **23** | M14 Recurrentes | V1.2 | TASK-223 a TASK-236 |
| **24** | M15 Recordatorios y avisos completos | V1.2 | TASK-237 a TASK-242 |
| **25** | **Final:** cobertura de escenarios Gherkin, jobs interrumpidos, zonas horarias, concurrencia y validación de RNF | V1.2 | TASK-243 a TASK-247 |
| **26** | Correcciones de QA: textos de metas, pruebas E2E frágiles, rutas por entrega y diálogo de sesión | V1.2 | TASK-249 a TASK-253 |
| **27** | Pulido transversal: rendimiento de cada pestaña, correos de la cuenta, botón "Volver", logo y coherencia de la documentación | Transversal | TASK-254 a TASK-274 |

**Orden dentro de cada fase de módulo:** contratos → dominio → repositorios → servicios y jobs → rutas HTTP con su test de aislamiento → interfaz y estado → E2E de sus escenarios.

**Decisiones de orden:**
- **Despliegue temprano:** TASK-171 y TASK-173 se hacen apenas cierra la Fase 4 (TASK-036), en la rama de la Fase 17, para que las tres partes (web, API y base de datos) estén desplegadas y conectadas desde el principio. Cada entrega llega a producción por `deploy.yml`. El resto de la Fase 17 sigue en su orden. `qa-e2e` (TASK-172) se suma a la protección de `main` cuando existe.
- El esquema completo, incluidas las tablas de V1.1 y V1.2, se crea en la Fase 1, como la migración inicial de plan §3. Los módulos no liberados responden 404 por `RELEASE` (ADR-18).
- M12 Metas va antes que M11 Presupuestos, porque la decisión de cierre "Enviar a meta" usa los apartados.
- La bandeja de avisos (M15 básico) va al inicio de V1.1, porque la usan los umbrales y cierres de presupuestos y los vencimientos de deudas.
- Los servicios compartidos crecen por entrega: `BalanceGuard` (negativos en TASK-100, apartados en TASK-183), `CurrencyUsage` (cada módulo registra su uso), `LedgerHooks` (presupuestos en TASK-199, hitos de metas en TASK-240) y la exportación (TASK-164, TASK-221 y TASK-242).

**Convenciones de las pruebas (plan §5.4):** el nombre de cada test incluye el ID que verifica (`it('RF-M4-04 …')`), o el de la tarea si no hay un ID de la spec. Las pruebas E2E se ejecutan con el harness de TASK-046. Las que verifican la entrega 1.0 llevan la etiqueta `@release-1.0`.

---

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-18 - Entregas con RELEASE]]
- **Fases de tareas:** [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]] · [[Tareas Fase 1 - Esquema de datos]] · [[Tareas Fase 10 - M5 Categorías (V1.0)]] · [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 12 - M7 Registrar (V1.0)]] · [[Tareas Fase 13 - M8 Inicio (V1.0)]] · [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]] · [[Tareas Fase 15 - M10 Onboarding (V1.0)]] · [[Tareas Fase 16 - Exportación de datos (M1, V1.0)]] · [[Tareas Fase 17 - Cierre de V1.0 rendimiento, accesibilidad y despliegue]] · [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]] · [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]] · [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 20 - M11 Presupuestos (V1.1)]] · [[Tareas Fase 21 - M13 Deudas y préstamos (V1.1)]] · [[Tareas Fase 22 - Cierre de V1.1 Inicio, exportación y regresión]] · [[Tareas Fase 23 - M14 Recurrentes (V1.2)]] · [[Tareas Fase 24 - M15 Recordatorios y avisos completos (V1.2)]] · [[Tareas Fase 25 - Final integración E2E y validación de RNF]] · [[Tareas Fase 26 - Correcciones de QA]] · [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]] · [[Tareas Fase 3 - Dominio transversal]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 5 - Base de la web y harness E2E]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]
- **Spec / Plan / Constitución:** [[Constitución 1. Producto]] · [[Plan 3. Esquema de Datos y Persistencia Global]] · [[Plan 5.4 Definición de terminado de cada módulo]]

