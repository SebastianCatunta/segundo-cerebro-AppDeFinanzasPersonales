---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § RNF - Requerimientos no funcionales"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
actualizado: "2026-10-30"
---

↑ [[Coherencia 2. Requisitos por módulo]] · ← [[Coherencia M15 - Recordatorios y avisos]] · → [[Coherencia Totales]]

### RNF — Requerimientos no funcionales

| ID | Lo que pide la spec (resumen) | Estado | Evidencia | Nota |
|---|---|---|---|---|
| RNF-01 | Registrar un movimiento DEBE tomar menos de 10 segundos desde abrir la app (flujo M7). | no verificable | `apps/web/test/bundle-budget.test.ts`, `e2e/perf.spec.ts` | La prueba E2E lo simula (4G y CPU x4); la spec pide medirlo en un celular de gama media real. |
| RNF-02 | Guardar un movimiento DEBE tardar menos de 1 segundo en el 95 % de los casos. | no verificable | `apps/api/test/integration/performance.test.ts` | El p95 se mide en el dispositivo y la red reales; la prueba mide en local. |
| RNF-03 | El Inicio DEBE cargar en menos de 2 segundos con 5.000 movimientos, en una conexión 4G. | no verificable | `apps/api/test/integration/account-ledger-repositories.test.ts`, `apps/api/test/integration/dashboard-cost.test.ts` (+7) | Celular de gama media en 4G; la prueba usa 5.000 movimientos con red simulada. |
| RNF-04 | La actualización del tipo de cambio NUNCA DEBE bloquear ni demorar el uso de la app. | coincide | `apps/api/test/http/rates.test.ts` |  |
| RNF-05 | La app DEBE funcionar desde 360 px de ancho en las 2 últimas versiones mayores de Chrome, Safari y Firefox,… | no verificable | `e2e/a11y-v1-0.spec.ts`, `e2e/a11y-v1-1.spec.ts` (+4) | Playwright corre los motores Chromium, WebKit y Firefox, no las 2 últimas versiones publicadas de cada navegador ni un celular real. |
| RNF-06 | La app DEBE cumplir WCAG 2.2 nivel AA y ser usable por completo con teclado. Toda acción por gesto DEBE tener… | coincide | `packages/contracts/test/catalogs.test.ts`, `e2e/a11y-v1-0.spec.ts` (+12) |  |
| RNF-07 | Todos los textos DEBEN estar en español de Bolivia y preparados para traducirse. | coincide | `apps/web/test/i18n-errors.test.ts`, `e2e/a11y-v1-2.spec.ts` (+1) |  |
| RNF-08 | El mismo usuario PUEDE usar varios dispositivos a la vez. Ante ediciones simultáneas del mismo dato, gana la… | coincide | `apps/api/test/http/settings.test.ts`, `apps/api/test/integration/transactions-update.test.ts` |  |
| RNF-09 | Una acción sobre un dato eliminado en otro dispositivo DEBE informar que el dato ya no existe, sin guardar… | coincide | `apps/api/test/integration/transactions-delete-undo.test.ts`, `apps/api/test/integration/transactions-update.test.ts` |  |
| RNF-10 | Las validaciones de saldo (negativos y apartados) DEBEN evaluarse con el saldo vigente al momento de guardar,… | coincide | `apps/api/test/integration/balance-guard-earmarks.test.ts`, `apps/api/test/integration/balance-guard.test.ts` (+3) |  |
| RNF-11 | Un doble toque, un reintento o una reconexión NUNCA DEBEN duplicar movimientos, pagos, apartados ni… | coincide | `apps/api/test/integration/budgets-decision.test.ts`, `apps/api/test/integration/concurrency-sweep.test.ts` (+3) |  |
| RNF-12 | Un recurrente genera como máximo una ocurrencia por regla y fecha. Un cierre de presupuesto se decide una… | coincide | `apps/api/test/integration/budget-ledger-hook.test.ts`, `apps/api/test/integration/budgets-default-job.test.ts` (+6) |  |
| RNF-13 | Los procesos automáticos que se interrumpan DEBEN retomarse sin duplicar ni omitir lo pendiente. | coincide | `apps/api/test/integration/budgets-close-job.test.ts`, `apps/api/test/integration/budgets-default-job.test.ts` (+6) |  |
| RNF-14 | Cada usuario accede SOLO a sus datos. Un dato ajeno se comporta como inexistente. | coincide | `apps/api/test/http/budgets.isolation.test.ts`, `apps/api/test/http/dashboard-budgets.test.ts` (+18) |  |
| RNF-15 | Los mensajes de registro, recuperación e inicio de sesión NO DEBEN revelar si un correo tiene cuenta ni cuál… | coincide | `apps/api/test/http/auth.test.ts`, `apps/api/test/integration/auth-signin.test.ts` (+4) |  |
| RNF-16 | El usuario DEBE poder exportar todos sus datos y eliminarlos por completo y de inmediato. | coincide | `apps/api/test/http/me-delete.test.ts`, `apps/api/test/http/me-export-v1-1.test.ts` (+2) |  |
| RNF-17 | La app NUNCA DEBE mostrar al usuario detalles internos en los mensajes de error. | coincide | `apps/api/test/http/app.test.ts`, `apps/api/test/http/logs-secrets.test.ts` (+3) |  |
| RNF-18 | Los cálculos DEBEN ser exactos al centavo, con el redondeo de RN-06. No deben acumularse diferencias por… | coincide | `packages/domain/test/debts.test.ts`, `packages/domain/test/money.test.ts` |  |
| RNF-19 | Los valores históricos (movimientos, períodos cerrados, interés acumulado) NUNCA DEBEN cambiar por… | coincide | `packages/domain/test/fx-convert.test.ts`, `apps/api/test/integration/dashboard-cards.test.ts` | D-03 resuelta en TASK-274: las dos pruebas citan RNF-19. |
| RNF-20 | Todas las fechas de negocio (día de un movimiento, períodos, vencimientos, ejecución de recurrentes y avisos)… | coincide | `apps/api/test/integration/budgets-close-job.test.ts`, `apps/api/test/integration/notifications-debts-job.test.ts` (+3) |  |
| RNF-21 | Si fallan las fuentes del tipo de cambio, la app DEBE seguir funcionando con el último valor guardado (M3). | coincide | `apps/api/test/integration/fx-jobs.test.ts` |  |
| RNF-22 | Si falla el servicio de correo, el usuario DEBE poder reenviar los correos de la cuenta respetando los… | coincide | `apps/api/test/integration/outbox.test.ts` |  |
| RNF-23 | Sin conexión, la app DEBE bloquearse por completo, incluido Registrar, sin perder los borradores (M2). Es una… | coincide | `apps/web/test/online.test.ts`, `e2e/m2-offline-session.spec.ts` |  |
| RNF-24 | En la V1 no existe un historial de ediciones por movimiento. | coincide | `apps/api/test/integration/transactions-update.test.ts` |  |
| RNF-25 | Los eventos de seguridad (cambio de contraseña y eliminación de la cuenta) DEBEN notificarse al dueño por… | coincide | `apps/api/test/http/me-delete.test.ts`, `apps/api/test/integration/auth-password.test.ts` (+1) |  |
| RNF-26 | Retención: | coincide | `apps/api/test/integration/maintenance-auth.test.ts`, `apps/api/test/integration/maintenance-notifications.test.ts` (+1) |  |
| RNF-27 | La fuente "paralelo.bo" DEBE mostrarse junto a sus datos, como exige su licencia de uso. | coincide | `apps/api/test/http/rates.test.ts` |  |
| RNF-28 | Cada usuario tiene como máximo 50 cuentas, 300 categorías, 50 metas, 200 deudas, 100 presupuestos, 100 reglas… | coincide | `apps/api/test/integration/budgets-create.test.ts`, `apps/api/test/integration/categories-crud.test.ts` (+4) |  |
| RNF-29 | Cambiar de pestaña DEBE mostrar sus datos principales en menos de 2 segundos en una conexión 4G, con el… | no verificable | `apps/api/test/http/server-timing.test.ts`, `apps/api/test/http/session-middlewares.test.ts` (+9) | Red 4G real con el servicio activo; la prueba usa latencia simulada (`DB_LATENCY_MS`). |

---
## 🔗 Relacionado

- **Módulos:** [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M7 - Registrar]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.10 Límites por usuario]] · [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.6 Exactitud monetaria]] · [[Spec 3.7 Tiempo]] · [[Spec 3.8 Disponibilidad y tolerancia a fallos]] · [[Spec 3.9 Auditoría y retención]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

