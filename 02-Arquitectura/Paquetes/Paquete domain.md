---
tipo: "paquete"
tags:
  - "paquete/domain"
  - "arquitectura"
actualizado: "2026-10-30"
---

# 📦 Paquete `@finanzas/domain`

↑ [[Arquitectura general]] · [[Monorepo pnpm]]

**Reglas de negocio puras**, sin entrada/salida: dinero, conversiones, períodos, interés, recurrencias y formatos. Solo depende de `decimal.js` y `date-fns` (+ `@date-fns/tz`). Es la capa 3 del backend ([[ADR-19 - Backend en capas]]), y la web la usa para calcular lo mismo que el servidor. El API siempre vuelve a validar y tiene la última palabra.

Regla verificada por [[Config - dependency-cruiser]] (`domain-pure`). ESLint prohíbe `parseFloat` en este paquete ([[Config - eslint compartido]]).

## Módulos

| Archivo | Qué resuelve | Módulo |
|---|---|---|
| [[Dominio - money]] | Redondeo a 2 decimales (mitad alejándose del cero), parseo y comparación de montos | transversal · [[M6 - Transacciones]] |
| [[Dominio - dates]] | Día local por zona horaria, rangos de mes, días entre fechas (RN-07) | transversal |
| [[Dominio - format]] | Formato de montos y fechas según los ajustes del usuario | [[M9 - Ajustes y personalización]] |
| [[Dominio - fx]] | Compra/venta, brecha, referencia del dólar, conversión | [[M3 - Monedas y tipo de cambio]] |
| [[Dominio - balance]] | Saldo desde los asientos (RN-01), vista de tarjeta, patrimonio neto | [[M4 - Cuentas]] |
| [[Dominio - dashboard]] | Ventana de comparación, variación %, tasa de ahorro | [[M8 - Inicio (dashboard)]] |
| [[Dominio - budget]] | Períodos, disponible, umbrales cruzados, ritmo | [[M11 - Presupuestos]] |
| [[Dominio - goals]] | Progreso, estado derivado, aporte mensual sugerido | [[M12 - Metas de ahorro]] |
| [[Dominio - debts]] | Interés diario como foto, división de pagos, estado | [[M13 - Deudas y préstamos]] |
| [[Dominio - recurrence]] | Próximas fechas, fechas omitidas, cuotas | [[M14 - Recurrentes]] |

Tareas: [[Tareas Fase 3 - Dominio transversal]]. Pruebas: [[Pruebas de los paquetes]].

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

