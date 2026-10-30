---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 1.3 Matriz de roles"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 1. Visión general, actores y exclusiones]] · ← [[Spec 1.2 Entregas]] · → [[Spec 1.4 Fuera de alcance (Out-of-Scope)]]

### 1.3 Matriz de roles

| Actor | Descripción | Puede |
|---|---|---|
| **Visitante** | Persona sin sesión | Registrarse, iniciar sesión, pedir la recuperación de su contraseña, abrir los enlaces de confirmación y recuperación |
| **Usuario sin confirmar** | Se registró pero no confirmó su correo. No tiene sesión | Ver la pantalla "Revisa tu correo" y reenviar la confirmación. Nada más |
| **Usuario** | Persona con sesión y correo confirmado | Todo lo descrito en este documento, SOLO sobre sus propios datos |
| **Sistema** | Procesos automáticos, sin intervención humana | Actualizar el tipo de cambio, ejecutar los recurrentes, cerrar los períodos de presupuesto, generar avisos, omitir pendientes vencidos, descartar registros sin confirmar |
| **Fuentes externas** | Mercado paralelo (paralelo.bo), Banco Central de Bolivia y servicio de correo | Proveer tasas y entregar los correos de la cuenta. Pueden fallar, y el sistema DEBE tolerarlo |

- No existen roles de administración, cuentas compartidas ni acceso de un usuario a los datos de otro.
