---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 5.3 Requerimientos no funcionales → verificación"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 5. Matriz de Verificación y Estrategia de Testing]] · ← [[Plan 5.2 Criterios de aceptación (Gherkin) → pruebas]] · → [[Plan 5.4 Definición de terminado de cada módulo]]

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

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]] · [[M7 - Registrar]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.10 Límites por usuario]] · [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.6 Exactitud monetaria]] · [[Spec 3.7 Tiempo]] · [[Spec 3.8 Disponibilidad y tolerancia a fallos]] · [[Spec 3.9 Auditoría y retención]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]

