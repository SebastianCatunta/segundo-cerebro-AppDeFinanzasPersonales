---
tipo: "coherencia"
fuente: "001-appFinanzas-mvp/coherencia.md § 4. Tareas cerradas con texto obsoleto por la Fase 27"
documento: "[[Coherencia - Informe de revisión SDD]]"
tags:
  - "qa/coherencia"
actualizado: "2026-10-30"
---

↑ [[Coherencia - Informe de revisión SDD]] · ← [[Coherencia 3. Diferencias]] · → [[Coherencia 5. Pasos manuales]]

## 4. Tareas cerradas con texto obsoleto por la Fase 27

Su código ya fue reemplazado; el texto de la tarea describe el comportamiento anterior a la spec v1.5.

| Tarea | Texto que quedó obsoleto | Nota a agregar |
|---|---|---|
| TASK-048 | Plantillas para los 6 tipos de `email_kind`; `RNF-25` exige la plantilla de intentos fallidos. Hoy son 5 tipos, sin `login_alert`. | Reemplazada por TASK-262 y TASK-263. |
| TASK-052 | `createLoginThrottle` devuelve `shouldAlert` y "la alerta sale como máximo una vez por hora". | Reemplazada por TASK-262. |
| TASK-054 | `signUp` no entrega el ticket de registro (cookie `__Secure-signup-ticket`) ni lo guarda en `signup_ticket`. | Reemplazada por TASK-265. |
| TASK-055 | `confirm(token, currentSessionId?)` cierra la sesión de otro usuario y crea la sesión; responde `{ next: 'onboarding' }`. Hoy `confirm` solo confirma (`{ status: 'confirmed' }`) y la sesión la abre `confirmation/status`. | Reemplazada por TASK-265. |
| TASK-056 | Ante un fallo de inicio de sesión "encola `login_alert`"; el escenario espera "un solo `login_alert`". | Reemplazada por TASK-262. |
| TASK-057 | `reset` no invalida el ticket del registro anterior (EC-M1-14). | Reemplazada por TASK-265. |
| TASK-063 | Las purgas de `maintenance` no incluyen los `signup_ticket` vencidos. | Reemplazada por TASK-265. |
| TASK-065 | `ConfirmLink` navega a `/bienvenida` con la sesión abierta y `CheckEmail` no espera la confirmación. Hoy el enlace solo muestra "Correo confirmado" y la app que espera continúa sola. | Reemplazada por TASK-266. |

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]]
- **Requerimientos no funcionales:** [[Spec 3.9 Auditoría y retención]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]]
- **Entidades:** [[Entidad - SignupTicket]]

