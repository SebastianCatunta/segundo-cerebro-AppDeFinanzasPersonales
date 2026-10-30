---
tipo: "readme"
fuente: "README.md § Estado del proyecto"
documento: "[[README - App de Finanzas Personales]]"
tags:
  - "readme"
actualizado: "2026-10-30"
---

↑ [[README - App de Finanzas Personales]] · ← [[README - Puesta en marcha del despliegue (una sola vez)]] · → [[README - Documentación]]

## Estado del proyecto

Avance real al 2026-10-30: **274 de 274 tareas cerradas (100 %)**. La Fase 27 está en la rama `feature/27-pulido-transversal-rendimiento-correos`, pendiente de su PR a `develop`. El hook `SessionStart` muestra el valor actualizado en cada sesión.

| Entrega | Fases                                                                                                                                     | Tareas cerradas |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Base    | 0 a 5: cimientos, esquema, contratos, dominio, API y web                                                                                  | 46 / 46         |
| V1.0    | 6 a 17: acceso, navegación, monedas, cuentas, categorías, transacciones, registrar, inicio, ajustes, onboarding, exportación y despliegue | 129 / 129       |
| V1.1    | 18 a 22: avisos, metas, presupuestos y deudas                                                                                             | 48 / 48         |
| V1.2    | 23 a 25: recurrentes, recordatorios y validación final                                                                                    | 25 / 25         |
| Pulido  | 26 y 27: correcciones de QA, rendimiento, correos de la cuenta, botón "Volver", marca y coherencia de la documentación                    | 26 / 26         |

Las tres entregas y el pulido están completos. La Fase 25 cerró la validación final: la regresión con todos los escenarios Gherkin, los jobs que se retoman tras una interrupción sin duplicar (RNF-13), las fechas de negocio en varias zonas horarias, la consistencia ante operaciones concurrentes y la accesibilidad y el control de versión de V1.2.

La Fase 27 pulió la app de punta a punta:

- **Rendimiento:** la sesión se resuelve en una consulta, las lecturas ya no bloquean por usuario, Inicio pide pocas consultas, la web pide los datos junto con la sesión, muestra esqueletos y precarga cada pestaña al elegirla. La API corre en Virginia, junto a Neon.
- **Correos de la cuenta:** ya no existe el correo de intentos fallidos (`login_alert`); quedan 5 tipos. El enlace de confirmación solo confirma, y la app que espera en "Revisa tu correo" continúa sola al Onboarding con un ticket de registro. Si en ese navegador había otra sesión abierta, se cierra y sus borradores se descartan.
- **Navegación y marca:** botón "Volver" en la cabecera de las pantallas internas, y el logo en la pestaña, las pantallas de acceso, el Onboarding y la cabecera.
- **Coherencia de la documentación:** la prueba automática y el informe descritos en Pruebas y calidad; las 5 diferencias encontradas quedaron resueltas.

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]

