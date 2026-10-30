---
tipo: "ejecucion"
fuente: ".claude/run/TASK-274/context.md"
tags:
  - "ia/ejecucion"
actualizado: "2026-10-30"
---

> [!abstract] Estado local del pipeline para TASK-274 (`.claude/run/TASK-274/context.md`, no versionado). Etapa: **Paquete de contexto**. Ver [[Protocolo 2. Skill implement-task TASK-XXX]].

# Paquete de contexto — TASK-274: RNF-19 citado en las pruebas: la historia no cambia con la tasa ni con la configuración

Fase 27 — Pulido transversal: rendimiento, correos, navegación y marca. Lee este archivo completo antes de empezar.

## 1. La tarea (tasks.md)

- [ ] **`TASK-274`: RNF-19 citado en las pruebas: la historia no cambia con la tasa ni con la configuración**
  - **Dependencias:** Requiere TASK-272
  - **Trazabilidad SDD:** plan §5.3 (RNF-18 / RNF-19), `coherencia.md` D-03; RNF-19, RN-05, RN-11
  - **Archivos en Alcance:**
    - `packages/domain/test/fx-convert.test.ts`
    - `apps/api/test/integration/dashboard-cards.test.ts`
  - **Especificación de Implementación:** Tarea de verificación. RNF-19 es el único RF, EC o RNF que ninguna prueba cita, aunque el comportamiento se cumple (cada asiento guarda su tasa; ingresos y gastos se convierten con la tasa guardada). Se cita `RNF-19` en los nombres de las pruebas de RN-05 que ya lo demuestran, sin cambiar lo que comprueban, y se agrega un caso de integración en `dashboard-cards.test.ts`: con movimientos en USD de un mes ya pasado, registrar una tasa personalizada nueva y cambiar la moneda base o la zona horaria no altera los montos convertidos de esos movimientos ni el resultado del período (plan §5.3).
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-19`: al menos una prueba unitaria y una de integración lo citan y pasan.
    - `RNF-19`: cambiar la tasa de referencia después de registrar un movimiento no altera su monto convertido ni el total del período.

## 2. Archivos en alcance

- **Archivos de test** (los escribe test-author y quedan bloqueados después): `packages/domain/test/fx-convert.test.ts`, `apps/api/test/integration/dashboard-cards.test.ts`

- **Archivos de implementación** (los escribe implementer): ninguno

Ningún otro archivo del repositorio se puede crear, modificar ni borrar. Se puede leer cualquier archivo.

## 3. Reglas de la spec citadas (texto literal)

- **RNF-18:** Los cálculos DEBEN ser exactos al centavo, con el redondeo de RN-06. No deben acumularse diferencias por redondeo: el interés de las deudas se acumula con precisión exacta y solo se redondea al mostrarlo o al pagarlo.

- **RNF-19:** Los valores históricos (movimientos, períodos cerrados, interés acumulado) NUNCA DEBEN cambiar por movimientos del tipo de cambio ni por cambios de configuración. Los únicos cambios que alteran cifras pasadas son los de RN-11.

- **RN-05:**
  - Los saldos y totales actuales (cuentas, deudas, metas) se convierten con la referencia vigente.
  - Los ingresos y gastos de un período se convierten con la tasa guardada en cada movimiento.

- **RN-11:** Los valores históricos NUNCA cambian por el tipo de cambio ni por cambios de configuración. Solo las correcciones de datos del usuario alteran cifras de meses pasados: crear, editar o eliminar movimientos con fecha pasada (incluida una tasa editada a mano), eliminar el último pago de una deuda, y fusionar categorías o mover subcategorías (asignar una categoría es un dato, no configuración). Archivar una cuenta o una categoría NO las altera: sus movimientos siguen contando en los ingresos y gastos de su mes.

## 4. Escenarios Gherkin citados

_Ninguno._

## 5. Plan técnico: convenciones y secciones citadas

- El código, las tablas y las columnas están en inglés. Las rutas de la interfaz y los textos están en español (constitución §5).
- "Bloqueo por usuario" es `pg_advisory_xact_lock(hashtext('user:' || user_id))`.
- "Idempotente" significa que la creación lleva un `id` UUID v7 generado por el cliente (ADR-11).
- Todos los montos y tasas viajan como texto decimal (ADR-03).

### 5.3 Requerimientos no funcionales → verificación

| RNF | Verificación |
|---|---|
| RNF-01 · menos de 10 s para registrar | E2E cronometrado del flujo M7 con 4G simulado y CPU ×4; presupuesto de la ruta `/registrar` ≤ 305 KB gzip (la Fase 27 lo subió de 300 a 305 KB porque la precarga de datos por pestaña, TASK-259, suma cerca de 1,3 KB; medido: 286 KB antes de esa fase, con el código dividido por ruta; las librerías base —React, router, zod, i18next, decimal.js y Query— suman unos 150 KB por sí solas) |
| RNF-02 · guardar en menos de 1 s (p95) | 200 POST en la integración de rendimiento contra Postgres; p95 del endpoint < 300 ms en el servidor; E2E < 1 s |
| RNF-03 · Inicio en menos de 2 s con 5.000 movimientos | Seed de 5.000; `EXPLAIN ANALYZE` sin escaneo secuencial; E2E del Inicio < 2 s en 4G |
| RNF-04 · las tasas no bloquean | Integración: `GET /api/rates/current` con la fuente simulada lenta responde < 100 ms |
| RNF-05 · 360 px y 3 navegadores | Matriz de Playwright (Chromium, WebKit, Firefox) × (360, 1280) |
| RNF-06 · AA y teclado | axe sin violaciones serias; E2E solo con teclado de Registrar, Movimientos y la bandeja; alternativas a los gestos |
| RNF-07 · español y traducible | Lint que prohíbe texto literal en JSX (`i18next/no-literal-string`); todo en `locales/es-BO` |
| RNF-08 · varios dispositivos, gana la última escritura | Integración con dos PATCH seguidos |
| RNF-09 · acción sobre un dato eliminado | PATCH y DELETE sobre un id eliminado → `NOT_FOUND` |
| RNF-10 · saldo vigente al guardar | Tests de concurrencia de `BalanceGuard` |
| RNF-11 / RNF-12 · idempotencia | Reintentos con el mismo id en cada creación; decisiones y confirmaciones dobles → una sola surte efecto |
| RNF-13 · jobs que se retoman | Interrumpir un job a mitad de lote y volver a correrlo: sin duplicados ni omisiones (cierres, recurrentes, avisos) |
| RNF-14 · aislamiento | Suite de aislamiento (5.1) |
| RNF-15 · mensajes neutros | Respuestas idénticas (cuerpo y estado) con correos existentes e inexistentes; diferencia de tiempo < 50 ms (p95) |
| RNF-16 · exportar y eliminar | Integración: el ZIP contiene un CSV por entidad liberada con todas las filas; tras eliminar, conteo 0 en todas las tablas |
| RNF-17 · sin detalles internos | Un error provocado devuelve solo `INTERNAL_ERROR` + `traceId`; test de que los logs no contienen la contraseña ni el token |
| RNF-18 / RNF-19 · exactitud y la historia no cambia | Tests de propiedades de redondeo; cambiar la referencia o la base no altera las tasas guardadas ni los períodos decididos ni el interés acumulado |
| RNF-20 · zona horaria del usuario | Jobs y validación de fechas probados en 3 zonas y en los cruces de medianoche y de horario de verano |
| RNF-21 · fuente caída | Cliente de paralelo.bo simulado con error o valor inválido → se conserva el último válido |
| RNF-22 · correo caído | Resend simulado con error → reintento en la bandeja de salida; respuesta neutra |
| RNF-23 · bloqueo sin conexión | E2E de M2 |
| RNF-24 / RNF-25 · auditoría | Cambiar la contraseña y eliminar la cuenta generan correos; los intentos fallidos no; no existe historial de ediciones |
| RNF-26 · retención | Jobs de mantenimiento con reloj: avisos a 90 días (sin borrar los que esperan decisión), sin confirmar a 7 días |
| RNF-27 · atribución de paralelo.bo | E2E: el enlace a la fuente está visible junto a cada tasa del paralelo |
| RNF-28 · límites | Integración: el elemento 51 de cuentas → `LIMIT_REACHED` (y lo mismo para cada entidad) |
| RNF-29 · cada pestaña en menos de 2 s | Integración: presupuesto de sentencias SQL por petición (4.0); E2E de cada pestaña en 4G con 5.000 movimientos < 2 s |

## 6. Dirección visual

_No aplica: la tarea no escribe pantallas ni estilos de la web._

## 7. Constitución del proyecto

# Constitución — App de Finanzas Personales

**Versión:** 1.2.0 · **Ratificada:** 2026-10-15 · **Última enmienda:** 2026-10-16

Principios innegociables del proyecto. Los DEBEN respetar todas las personas y agentes de IA que trabajen en él. El *qué* se define en cada especificación y el *cómo* en cada plan; este documento fija solo lo que no cambia.

## 1. Producto
- **Propósito:** que una persona en Bolivia lleve sus finanzas personales en bolivianos y dólares, con el tipo de cambio paralelo y el oficial.
- **Principio rector:** registrar un movimiento DEBE ser siempre rápido y simple. Ninguna funcionalidad puede volver más lento ni más complicado ese flujo.
- **Privacidad:** cada usuario ve y modifica SOLO sus propios datos, y puede exportarlos o borrarlos cuando quiera.
- **Plataforma:** aplicación web responsive y accesible, en español de Bolivia, con los textos preparados para traducirse.
- **Entregas incrementales:** V1.0 (núcleo) → V1.1 (presupuestos, metas, deudas y bandeja básica de avisos) → V1.2 (recurrentes y recordatorios completos). Cada entrega DEBE quedar usable antes de empezar la siguiente.
- **Avisos:** todos los avisos llegan solo dentro de la app. El correo se usa únicamente para la cuenta del usuario (confirmación, recuperación y seguridad).
- **Fuera de alcance:** reportes, inteligencia artificial, conexión con bancos, cuentas compartidas o roles, app nativa, notificaciones push, avisos por correo y modo sin conexión.

## 2. Stack tecnológico
- **Lenguaje:** TypeScript en todo el proyecto, organizado como monorepo.
- **Frontend:** React + Vite, Tailwind CSS + shadcn/ui, TanStack Query.
- **Backend:** Node.js + Express, Prisma, Zod.
- **Base de datos:** PostgreSQL.
- **Autenticación:** Better Auth.
- **Dinero:** decimal.js.
- **Correo (solo de cuenta):** Resend.
- **Tests:** Vitest y Playwright.
- **Despliegue:** Railway o Render (backend), Neon (base de datos), Vercel o Netlify (frontend).

Agregar una tecnología que reemplace o duplique alguna de estas requiere el acuerdo de todo el equipo.

## 3. Datos y dinero
- El dinero se calcula SIEMPRE con precisión decimal exacta, NUNCA con punto flotante. Los montos se redondean a dos decimales, con la mitad hacia arriba.
- La historia no se reescribe: un movimiento conserva el tipo de cambio con el que se registró, y los valores históricos no cambian por movimientos del dólar ni por cambios de configuración.
- Los saldos se calculan a partir de los movimientos y NUNCA se editan a mano.
- Las cuentas y categorías con movimientos se archivan, no se borran.
- Una misma acción repetida NUNCA genera registros duplicados, y un mismo evento NUNCA genera dos avisos.

## 4. Seguridad
- Toda entrada al sistema DEBE validarse. NUNCA se confía en lo que envía el cliente.
- La identidad del usuario sale SIEMPRE de su sesión, nunca de los datos que envía.
- NUNCA se exponen secretos, contraseñas ni detalles internos en el código, los logs ni los mensajes de error.

## 5. Calidad
- El código DEBE tener tipado estricto y pasar lint, verificación de tipos y tests antes de integrarse.
- Toda regla de negocio DEBE tener un test que la verifique.
- Todo acceso a datos DEBE tener un test que demuestre el aislamiento entre usuarios.
- El código se escribe en inglés y la interfaz en español.

## 6. Desarrollo guiado por especificaciones (SDD)
- Toda funcionalidad sigue este orden: **especificación → plan → tareas → implementación**.
- Cada funcionalidad vive en una carpeta `NNN-nombre/` en la raíz del proyecto, al mismo nivel que `docs/`, con su `spec.md`, `plan.md` y `tasks.md`.
- No se implementa nada sin una especificación aprobada por el equipo.
- Ante una ambigüedad, se pregunta. NUNCA se inventan reglas de negocio.
- Si un cambio contradice la especificación, primero se actualiza la especificación.
- Los agentes de IA pueden programar, ejecutar tests y hacer acciones de git, siguiendo esta Constitución y el flujo de §7.

## 7. Git Flow
- **`main`:** producción.
- **`qa`:** validación antes de producción.
- **`develop`:** integración.
- **`feature/*` y `fix/*`:** salen de `develop` y vuelven a `develop` por Pull Request.
- **Promoción:** `develop` → `qa` → `main`, siempre por Pull Request.
- **`hotfix/*`:** sale de `main` y se integra en `main`, `qa` y `develop`.
- Los commits siguen Conventional Commits.

## 8. Ejecución de tareas con agentes
- La unidad de trabajo es una tarea de `tasks.md`. Se implementa una tarea a la vez y solo dentro de los archivos que declara.
- Cada tarea pasa por el mismo pipeline: **pruebas primero → implementación → auditoría** contra esta Constitución, la especificación y el plan. Cada etapa la hace un agente distinto, con el contexto mínimo de la tarea.
- Lo que una máquina puede verificar lo verifican hooks deterministas, no un agente: alcance de archivos, lint, tipos, reglas de capas y tests.
- Una tarea se cierra solo con todas las verificaciones en verde y la auditoría aprobada, y queda en un commit propio que la referencia.
- Si un agente encuentra una ambigüedad o necesita salir del alcance, se detiene y pregunta (§6). Nunca se cambian el alcance ni las pruebas para que algo pase.
- Ningún guardarraíl se salta.
- El detalle operativo vive en `docs/execution-protocol.md`.

## 9. Enmiendas
Esta Constitución solo cambia con el acuerdo de todo el equipo. Cada cambio sube su número de versión.

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]] · [[M7 - Registrar]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]] · [[ADR-11 - Idempotencia con UUID v7]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.10 Límites por usuario]] · [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.6 Exactitud monetaria]] · [[Spec 3.7 Tiempo]] · [[Spec 3.8 Disponibilidad y tolerancia a fallos]] · [[Spec 3.9 Auditoría y retención]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]
- **Spec / Plan / Constitución:** [[Constitución 5. Calidad]] · [[Plan 5.3 Requerimientos no funcionales → verificación]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

