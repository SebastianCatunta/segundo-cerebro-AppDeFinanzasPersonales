---
tipo: "integracion"
modulo: "M1"
tags:
  - "backend/integracion"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# Integración · Resend

Envío de los correos de la cuenta (confirmación, recuperación y seguridad) por la API de Resend, más las plantillas HTML/texto. El fake captura los correos en un buzón de prueba que lee E2E.

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Puerto que implementa:** ver [[API - Puertos]]
- **Fakes:** se activan con `INTEGRATIONS=fake` (prohibido en producción, ver [[API - Configuración env.ts]]).

| Archivo | Líneas | Comentario |
|---|---|---|
| `resend.ts` | 38 |  |
| `resend.fake.ts` | 29 |  |
| `email-templates.ts` | 71 |  |
