---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.4 M4 - Cuentas (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M4"
modulo: "M4"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.3 M3 - Monedas y tipo de cambio (V1.0)]] · → [[Spec 2.5 M5 - Categorías (V1.0)]]

### 2.4 M4 — Cuentas (V1.0)

#### 2.4.1 Flujos de usuario
**Crear una cuenta**
1. El usuario elige el tipo: efectivo, banco, billetera digital, tarjeta de crédito, ahorro u otro.
2. Ingresa el nombre, la moneda, el saldo inicial y su fecha (hoy por defecto), el color y el ícono.
3. En una tarjeta, puede agregar el día de corte, el día de pago y el límite de crédito. El saldo inicial se ingresa como deuda actual o como saldo a favor.

**Ajustar el saldo**
1. Desde el detalle de la cuenta, el usuario toca "Ajustar saldo" y escribe su saldo real.
2. El sistema crea un movimiento de tipo Ajuste por la diferencia, con una nota opcional. Si el saldo real coincide, no crea nada e informa "El saldo ya coincide". En una tarjeta, el usuario escribe su deuda real.

**Pagar la tarjeta:** el usuario registra una transferencia desde el banco hacia la tarjeta.

**Archivar o restaurar**
1. El usuario archiva una cuenta. Si su saldo no es cero, el sistema pide confirmación y sugiere transferir el saldo antes.
2. Desde la lista de archivadas, la restaura.

**Consultar**
- La lista muestra el total neto y su desglose, con las cuentas agrupadas por tipo en el orden del usuario.
- El detalle muestra:
  - el saldo y su equivalente en la otra moneda;
  - un gráfico del saldo día a día y los movimientos agrupados por día, los dos con el mismo filtro de fechas (por defecto, el mes actual);
  - en una tarjeta, además, el límite, el crédito disponible y los días de corte y de pago;
  - en una cuenta con apartados, el saldo apartado y el saldo libre.

#### 2.4.2 Ciclo de vida y estados

| Desde | Hacia | Condición |
|---|---|---|
| — | Activa | Creación |
| Activa | Archivada | Confirmación (con aviso si el saldo no es cero). Prohibido si tiene apartados de metas o está dedicada a una meta |
| Archivada | Activa | Restauración. Si su nombre ya está en uso entre las activas, se pide renombrarla. Si su moneda está inactiva, se pide reactivarla |
| Activa | Eliminada | Solo si no tiene ningún movimiento (el saldo inicial no cuenta como movimiento) y no está dedicada a una meta |

- Prohibido: eliminar una cuenta con movimientos, y archivar una cuenta con apartados o dedicada.

#### 2.4.3 Requerimientos funcionales
- **RF-M4-01:** El nombre DEBE tener de 1 a 40 caracteres y ser único entre las cuentas activas, sin distinguir mayúsculas.
- **RF-M4-02:** El saldo inicial DEBE cumplir según el tipo:
  - efectivo y billetera, mayor o igual a 0;
  - tarjeta, se ingresa como deuda actual (se registra como saldo negativo) o como saldo a favor (se registra como saldo positivo);
  - banco, ahorro y otro, cualquier valor.

  Por defecto es 0. En valor absoluto llega hasta 999.999.999,99, con 2 decimales como máximo.
- **RF-M4-03:** El saldo DEBE calcularse según RN-01. Un movimiento con fecha anterior a la del saldo inicial se permite, aparece en la historia con el aviso "anterior al saldo inicial" y no altera el saldo, pero sí cuenta como ingreso o gasto (RN-12).
- **RF-M4-04:** En efectivo y billetera, el sistema DEBE rechazar toda acción que deje el saldo actual en negativo, y explicar cuál sería el saldo resultante. Incluye gastos, transferencias salientes (monto y comisión juntos), ediciones, eliminaciones de ingresos, deshacer y ajustes. Los saldos de días pasados no se validan.
- **RF-M4-05:** Un ajuste NO cuenta como ingreso ni como gasto. Se puede editar y eliminar. Si la diferencia es 0, no se crea. En una cuenta dedicada a una meta, el ajuste cambia el progreso y queda en la historia de la meta con el origen "ajuste".
- **RF-M4-06:** La moneda de una cuenta solo DEBE poder cambiarse si no tiene movimientos.
- **RF-M4-07:** El saldo inicial y su fecha NO DEBEN editarse después de crear la cuenta: cualquier diferencia se corrige con "Ajustar saldo". El nombre, el color y el ícono se editan siempre. El tipo se puede cambiar si el saldo inicial cumple RF-M4-02 para el nuevo tipo, si el saldo actual no queda negativo en efectivo o billetera (RF-M4-04) y si no se convierte en tarjeta una cuenta dedicada o con apartados. Al dejar de ser tarjeta, se borran el día de corte, el día de pago y el límite.
- **RF-M4-08:** En una tarjeta:
  - el saldo DEBE mostrarse como "Debes X" o "A favor X";
  - con límite, se muestra el crédito disponible (límite − deuda), y al superarlo aparece un aviso sin bloquear;
  - el día de corte y el día de pago son opcionales. Si un mes no tiene ese día, cae el último día del mes. En la V1.0 solo se guardan y se muestran en el detalle; desde la V1.1 aparecen en "Próximos pagos" del Inicio y desde la V1.2 generan avisos (M15);
  - una tarjeta no puede dedicarse a una meta ni tener apartados (M12).
- **RF-M4-09:** Una cuenta archivada NO DEBE aparecer en los selectores ni sumar en los saldos y totales actuales, y DEBE conservar su historia. Sus movimientos siguen contando en los ingresos y gastos de su mes (RN-11).
- **RF-M4-10:** El total neto DEBE ser la suma de las cuentas activas (la deuda de tarjetas resta), en moneda base y su equivalente en la otra moneda, con la referencia vigente. El desglose incluye:
  - Líquido (efectivo, banco, billetera, otro);
  - Ahorro;
  - Deuda en tarjetas: la suma de los saldos de todas las tarjetas (un saldo a favor reduce la deuda);
  - Apartado para metas (V1.1): los apartados más el saldo positivo de las cuentas dedicadas. No altera el total.
- **RF-M4-11:** Las cuentas DEBEN poder reordenarse. La lista agrupa por tipo y respeta ese orden.
- **RF-M4-12:** Si se archiva la cuenta por defecto o la última usada en Registrar, Registrar DEBE pasar a la cuenta que indica RF-M7-03.
- **RF-M4-13:** Al eliminar una cuenta sin movimientos, el sistema DEBE quitarla como cuenta por defecto y eliminar sus atajos. Si una regla recurrente usa la cuenta, se rechaza la eliminación y se sugiere archivarla (al archivarla, sus reglas se pausan con un aviso, EC-M14-02).

#### 2.4.4 Casos borde y excepciones
- **EC-M4-01:** Se elimina un ingreso del efectivo y el saldo quedaría en −50. Se rechaza: "El efectivo quedaría en Bs −50,00".
- **EC-M4-02:** El usuario quiere corregir el saldo inicial de una cuenta. No es editable; se ofrece "Ajustar saldo".
- **EC-M4-03:** Un recurrente automático dejaría el efectivo en negativo. No se registra y pasa a pendiente (M14).
- **EC-M4-04:** Se restaura una cuenta cuyo nombre está en uso. Se pide un nombre nuevo antes de restaurarla.
- **EC-M4-05:** La única cuenta activa se archiva. Registrar y el Inicio invitan a crear una cuenta.
- **EC-M4-06:** Un banco queda con saldo negativo. Se permite (sobregiro).
- **EC-M4-07:** Se restaura una cuenta cuya moneda está inactiva. Se pide reactivar la moneda primero.
- **EC-M4-08:** Se ajusta el saldo al mismo valor que ya tiene. No se crea ningún ajuste y se informa "El saldo ya coincide".

#### 2.4.5 Criterios de aceptación
```gherkin
Escenario: Movimiento anterior al saldo inicial no altera el saldo
  Dado una cuenta Efectivo creada el 10/10 con saldo inicial Bs 500,00
  Cuando el usuario registra un gasto de Bs 50,00 con fecha 5/10
  Entonces el saldo sigue siendo Bs 500,00
  Y el gasto aparece en la historia con el aviso "anterior al saldo inicial"

Escenario: Bloqueo de negativo en efectivo
  Dado una cuenta Efectivo con saldo Bs 30,00
  Cuando el usuario intenta registrar un gasto de Bs 35,00
  Entonces el gasto no se guarda
  Y ve "El efectivo quedaría en Bs −5,00"

Escenario: Ajuste de saldo
  Dado una cuenta Banco con saldo Bs 1.200,00
  Cuando el usuario indica que su saldo real es Bs 1.250,00
  Entonces se crea un Ajuste de Bs +50,00
  Y los ingresos del mes no cambian

Escenario: Pago de tarjeta no es gasto
  Dado una tarjeta con deuda de Bs 1.000,00
  Cuando el usuario transfiere Bs 1.000,00 del Banco a la tarjeta
  Entonces la tarjeta muestra "Debes Bs 0,00"
  Y los gastos del mes no cambian
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M7 - Registrar]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

