---
tipo: "integracion"
modulo: "M3"
tags:
  - "backend/integracion"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# Integración · BCB

Respaldo del tipo de cambio oficial (TCO) desde el widget público del Banco Central de Bolivia, consultado una vez al día.

- **Módulo:** [[M3 - Monedas y tipo de cambio]]
- **Puerto que implementa:** ver [[API - Puertos]]
- **Fakes:** se activan con `INTEGRATIONS=fake` (prohibido en producción, ver [[API - Configuración env.ts]]).

| Archivo | Líneas | Comentario |
|---|---|---|
| `bcb.ts` | 114 | A valid rate is at least 0.01 with at most 2 decimals (EC-M3-04). |
| `bcb.fake.ts` | 34 |  |
