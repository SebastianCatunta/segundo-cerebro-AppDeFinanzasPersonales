---
tipo: "testing"
fuente: "e2e/"
tags:
  - "testing/e2e"
actualizado: "2026-10-30"
---

# Pruebas E2E con Playwright

Carpeta `e2e/`. Corren en [[Workflow qa-e2e.yml]] contra un entorno efímero, en 3 navegadores × 2 anchos (ver [[Config - playwright.config.ts]]). Incluyen accesibilidad con axe (`a11y-*`), teclado, rendimiento (`perf*`), cobertura de escenarios Gherkin y control de entregas.

- **fixtures/**: `auth.ts`, `base.ts`, `mailbox.ts` (sesión, base y buzón de correos falso)
- **support/**: `axe.ts`, `network-profiles.ts` (axe y perfiles de red)

| Archivo | Primer describe | Casos | Módulo |
|---|---|---|---|
| `a11y-v1-0.spec.ts` | TASK-169 accesibilidad de V1.0 en ${THEME_NAME[theme]} | 6 | — |
| `a11y-v1-1.spec.ts` | TASK-222 accesibilidad de V1.1 en ${THEME_NAME[theme]} | 7 | — |
| `a11y-v1-2.spec.ts` | TASK-247 accesibilidad de V1.2 en ${THEME_NAME[theme]} | 15 | — |
| `gherkin-accounts-categories.spec.ts` | TASK-243 M4 ajuste de saldo | 10 | — |
| `gherkin-coverage.spec.ts` | TASK-243 cobertura de la especificación | 4 | — |
| `gherkin-register.spec.ts` | TASK-243 M2 bloqueo sin conexión | 15 | — |
| `i18n-direct-load.spec.ts` | TASK-249 el detector de claves sin traducir | 13 | — |
| `keyboard-v1-0.spec.ts` | TASK-169 Registrar solo con el teclado | 11 | — |
| `m1-delete-account.spec.ts` | TASK-076 eliminar la cuenta | 4 | [[M1 - Acceso y cuenta\|M1]] |
| `m1-export.spec.ts` | TASK-165 exportar mis datos | 3 | [[M1 - Acceso y cuenta\|M1]] |
| `m1-password-reset.spec.ts` | TASK-067 recuperar la contraseña | 5 | [[M1 - Acceso y cuenta\|M1]] |
| `m1-profile.spec.ts` | TASK-074 pantalla de perfil | 9 | [[M1 - Acceso y cuenta\|M1]] |
| `m1-sign-in.spec.ts` | TASK-066 inicio de sesión | 7 | [[M1 - Acceso y cuenta\|M1]] |
| `m1-sign-up-confirm-sync.spec.ts` | TASK-266 la app que espera continúa sola al Onboarding | 6 | [[M1 - Acceso y cuenta\|M1]] |
| `m1-sign-up.spec.ts` | TASK-065 registro, revisa tu correo y confirmación | 9 | [[M1 - Acceso y cuenta\|M1]] |
| `m10-onboarding-step1.spec.ts` | TASK-160 Onboarding: indicador de pasos y paso 1 | 6 | [[M10 - Onboarding\|M10]] |
| `m10-onboarding-step2.spec.ts` | TASK-161 Onboarding: paso 2 (cuentas) | 9 | [[M10 - Onboarding\|M10]] |
| `m10-onboarding-step3.spec.ts` | TASK-162 Onboarding: paso 3 (categorías) y retomar | 12 | [[M10 - Onboarding\|M10]] |
| `m11-budget-form.spec.ts` | TASK-206 formulario de presupuesto | 9 | [[M11 - Presupuestos\|M11]] |
| `m11-budgets.spec.ts` | TASK-205 lista y detalle de presupuestos | 9 | [[M11 - Presupuestos\|M11]] |
| `m11-close-decision.spec.ts` | TASK-207 decisión de cierre del presupuesto | 9 | [[M11 - Presupuestos\|M11]] |
| `m12-earmark-confirm.spec.ts` | TASK-192 confirmación de apartados | 9 | [[M12 - Metas de ahorro\|M12]] |
| `m12-goal-dialogs.spec.ts` | TASK-191 diálogos de metas | 8 | [[M12 - Metas de ahorro\|M12]] |
| `m12-goals.spec.ts` | TASK-190 lista y detalle de metas | 9 | [[M12 - Metas de ahorro\|M12]] |
| `m13-debt-forms.spec.ts` | TASK-218 formulario de deuda | 27 | [[M13 - Deudas y préstamos\|M13]] |
| `m13-debts.spec.ts` | TASK-217 lista y detalle de deudas | 10 | [[M13 - Deudas y préstamos\|M13]] |
| `m14-inbox-pending.spec.ts` | TASK-236 pendientes en la bandeja | 5 | [[M14 - Recurrentes\|M14]] |
| `m14-recurring.spec.ts` | TASK-234 pantalla de Recurrentes | 4 | [[M14 - Recurrentes\|M14]] |
| `m14-rule-form.spec.ts` | TASK-235 formulario de regla y diálogo de reanudar | 5 | [[M14 - Recurrentes\|M14]] |
| `m15-inbox.spec.ts` | TASK-179 campana y bandeja de avisos | 10 | [[M15 - Recordatorios y avisos\|M15]] |
| `m15-preferences.spec.ts` | TASK-241 Ajustes de recordatorios | 10 | [[M15 - Recordatorios y avisos\|M15]] |
| `m2-back-button.spec.ts` | TASK-267 botón Volver en la cabecera | 15 | [[M2 - Navegación y estructura\|M2]] |
| `m2-brand.spec.ts` | TASK-270 el logo acompaña a la app | 7 | [[M2 - Navegación y estructura\|M2]] |
| `m2-guards.spec.ts` | TASK-071 guardas de rutas | 3 | [[M2 - Navegación y estructura\|M2]] |
| `m2-more-menu.spec.ts` | TASK-073 menú Más, memoria por pestaña y botón Atrás | 6 | [[M2 - Navegación y estructura\|M2]] |
| `m2-navigation.spec.ts` | TASK-072 AppShell, barra inferior y barra lateral | 8 | [[M2 - Navegación y estructura\|M2]] |
| `m2-offline-session.spec.ts` | TASK-075 bloqueo sin conexión | 7 | [[M2 - Navegación y estructura\|M2]] |
| `m2-startup-parallel.spec.ts` | TASK-258 arranque en paralelo y esqueletos | 7 | [[M2 - Navegación y estructura\|M2]] |
| `m2-tab-prefetch.spec.ts` | TASK-259 precarga de los datos de cada pestaña | 8 | [[M2 - Navegación y estructura\|M2]] |
| `m8-dashboard-blocks.spec.ts` | TASK-148 bloques del Inicio y navegación | 6 | [[M8 - Inicio (dashboard)\|M8]] |
| `m8-dashboard-budgets.spec.ts` | TASK-219 Inicio: bloque Presupuesto del mes | 2 | [[M8 - Inicio (dashboard)\|M8]] |
| `m8-dashboard-cards.spec.ts` | TASK-147 Inicio, selector de mes y tarjetas | 8 | [[M8 - Inicio (dashboard)\|M8]] |
| `m8-dashboard-upcoming.spec.ts` | TASK-220 Inicio: bloque Próximos pagos y deudas | 2 | [[M8 - Inicio (dashboard)\|M8]] |
| `m9-settings-currencies.spec.ts` | TASK-154 Ajustes de monedas | 15 | [[M9 - Ajustes y personalización\|M9]] |
| `m9-settings-dashboard.spec.ts` | TASK-153 Ajustes del Inicio | 10 | [[M9 - Ajustes y personalización\|M9]] |
| `m9-settings-general.spec.ts` | TASK-151 Ajustes y sección General | 12 | [[M9 - Ajustes y personalización\|M9]] |
| `m9-settings-register.spec.ts` | TASK-152 Ajustes de Registrar | 13 | [[M9 - Ajustes y personalización\|M9]] |
| `perf-tabs.spec.ts` | TASK-261 tiempo de cada pestaña | 2 | — |
| `perf.spec.ts` | TASK-168 rendimiento E2E | 3 | — |
| `playwright.config.ts` |  | 0 | — |
| `release-gating.spec.ts` | TASK-222 entregas: V1.1 oculta con RELEASE=1.0 | 18 | — |
| `smoke.spec.ts` | TASK-046 smoke | 4 | — |

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]]
- **Fases de tareas:** [[Tareas Fase 13 - M8 Inicio (V1.0)]] · [[Tareas Fase 14 - M9 Ajustes y personalización (V1.0)]] · [[Tareas Fase 15 - M10 Onboarding (V1.0)]] · [[Tareas Fase 16 - Exportación de datos (M1, V1.0)]] · [[Tareas Fase 17 - Cierre de V1.0 rendimiento, accesibilidad y despliegue]] · [[Tareas Fase 18 - M15 Bandeja de avisos (V1.1)]] · [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]] · [[Tareas Fase 20 - M11 Presupuestos (V1.1)]] · [[Tareas Fase 21 - M13 Deudas y préstamos (V1.1)]] · [[Tareas Fase 22 - Cierre de V1.1 Inicio, exportación y regresión]] · [[Tareas Fase 23 - M14 Recurrentes (V1.2)]] · [[Tareas Fase 24 - M15 Recordatorios y avisos completos (V1.2)]] · [[Tareas Fase 25 - Final integración E2E y validación de RNF]] · [[Tareas Fase 26 - Correcciones de QA]] · [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]] · [[Tareas Fase 5 - Base de la web y harness E2E]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]

