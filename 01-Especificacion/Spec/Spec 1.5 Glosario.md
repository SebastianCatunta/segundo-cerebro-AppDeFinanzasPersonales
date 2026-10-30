---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 1.5 Glosario"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 1. Visión general, actores y exclusiones]] · ← [[Spec 1.4 Fuera de alcance (Out-of-Scope)]] · → [[Spec 1.6 Reglas de negocio transversales (RN)]]

### 1.5 Glosario
- **Moneda base:** moneda en la que se expresan los totales. BOB por defecto. Puede ser cualquier moneda activa.
- **Otra moneda:** la de BOB y USD que no es la base. Si la base es otra moneda, BOB. Es la moneda de los equivalentes (total neto, detalle de cuenta).
- **Referencia del dólar:** cotización que la app usa para convertir. Opciones: paralelo (compra, venta o mediana), oficial del BCB (TCO, un solo valor) o valor manual. En el paralelo, "venta" es el mayor de los dos valores publicados (lo que paga quien compra dólares) y "compra" el menor, sin importar cómo los nombre la fuente.
- **Tasa guardada:** tipo de cambio que un movimiento guarda al guardarse. NUNCA cambia por movimientos del mercado ni al editar la fecha o la cuenta del movimiento. Solo cambia si el usuario la edita a mano (RF-M3-10).
- **Historial de tasas:** una tasa por moneda y por día: las referencias automáticas del dólar, el valor manual y las tasas de las monedas agregadas (RF-M3-13).
- **Movimiento:** gasto, ingreso, transferencia o ajuste.
- **Movimiento vinculado:** movimiento creado por otro módulo: movimiento inicial o pago de una deuda, comisión de una transferencia o transferencia de "Enviar a meta". Su monto, cuenta y fecha se editan solo desde su origen.
- **Apartado:** dinero de una cuenta reservado para una meta. Sigue en la cuenta. Apartar y retirar NO son movimientos.
- **Saldo libre:** saldo de una cuenta menos sus apartados.
- **Cuenta dedicada:** cuenta cuyo saldo completo pertenece a una meta.
- **Período (de presupuesto):** lapso de un mes que empieza en el día de inicio elegido para ese presupuesto (de 1 a 28).
- **Arrastre:** monto, positivo o negativo, que un cierre pasa al período siguiente. Cada cierre lo reemplaza: no se suma al arrastre anterior.
- **Disponible (de presupuesto):** monto del período más (o menos) el arrastre. El término "disponible" se usa solo en presupuestos.
- **Líquido:** en el desglose de Cuentas, la suma de efectivo, banco, billetera y otro.
- **Crédito disponible:** en una tarjeta con límite, límite − deuda.
- **Pendiente:** ocurrencia recurrente que espera confirmación. No cuenta en saldos ni totales.

---
## 🔗 Relacionado

- **Módulos:** [[M3 - Monedas y tipo de cambio]]

