---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 1.6 Reglas de negocio transversales (RN)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 1. Visión general, actores y exclusiones]] · ← [[Spec 1.5 Glosario]]

### 1.6 Reglas de negocio transversales (RN)
Estas reglas aplican a todos los módulos y prevalecen sobre cualquier regla de módulo.

- **RN-01:** El saldo de una cuenta = saldo inicial + entradas − salidas, contando solo los movimientos con fecha igual o posterior a la del saldo inicial. El saldo NUNCA se edita a mano: se corrige con un ajuste. El saldo inicial y su fecha quedan fijos al crear la cuenta (RF-M4-07).
- **RN-02:** NO cuentan como ingreso ni como gasto (en el Inicio ni en los presupuestos):
  - las transferencias;
  - los ajustes;
  - los pendientes;
  - los movimientos con la categoría del sistema "Deudas y préstamos". La excepción es su subcategoría "Intereses", que SÍ cuenta.
- **RN-03:** La moneda de un movimiento es SIEMPRE la de su cuenta.
- **RN-04:** Todo movimiento, también si está en la moneda base, guarda al guardarse la tasa de su moneda frente al boliviano y la boliviano-dólar (RF-M3-06). Sus valores en cualquier moneda base se derivan de esas tasas guardadas y, para una moneda que el movimiento no guardó, del historial de tasas en su fecha. No cambian después, salvo que el usuario edite la tasa a mano.
- **RN-05:**
  - Los saldos y totales actuales (cuentas, deudas, metas) se convierten con la referencia vigente.
  - Los ingresos y gastos de un período se convierten con la tasa guardada en cada movimiento.
- **RN-06:** Los montos y las tasas de cambio se guardan y se muestran con 2 decimales. Las conversiones se redondean a 2 decimales con la mitad hacia arriba; en negativos, la mitad se aleja del cero (−0,005 → −0,01). Los totales son la suma de las conversiones ya redondeadas de cada movimiento.
- **RN-07:** Un movimiento tiene fecha de hoy o anterior, nunca futura. No hay fecha mínima. Su fecha es el día local según la zona horaria del perfil del usuario. Cambiar la zona horaria no altera la fecha de los movimientos ya registrados, aunque en la nueva zona quede como futura.
- **RN-08:** Lo que tiene historia se archiva, no se elimina: cuentas y categorías con movimientos.
- **RN-09:** Cada usuario accede solo a sus propios datos. Un recurso ajeno se comporta como inexistente.
- **RN-10:** Un mismo evento nunca genera dos avisos. Una misma acción repetida (doble toque, reintento) nunca genera dos registros.
- **RN-11:** Los valores históricos NUNCA cambian por el tipo de cambio ni por cambios de configuración. Solo las correcciones de datos del usuario alteran cifras de meses pasados: crear, editar o eliminar movimientos con fecha pasada (incluida una tasa editada a mano), eliminar el último pago de una deuda, y fusionar categorías o mover subcategorías (asignar una categoría es un dato, no configuración). Archivar una cuenta o una categoría NO las altera: sus movimientos siguen contando en los ingresos y gastos de su mes.
- **RN-12:** Un movimiento con fecha anterior al saldo inicial de su cuenta no altera el saldo (RN-01), pero SÍ cuenta como ingreso o gasto en el Inicio, en la lista y en los presupuestos.
- **RN-13:** Todo nombre de texto (usuario, cuenta, categoría, meta, persona, atajo) se valida después de quitarle los espacios del inicio y del final.

---

---
## 🔗 Relacionado

- **Módulos:** [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]]

