---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.13 M13 - Deudas y préstamos (V1.1)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M13"
modulo: "M13"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.12 M12 - Metas de ahorro (V1.1)]] · → [[Spec 2.14 M14 - Recurrentes (V1.2)]]

### 2.13 M13 — Deudas y préstamos (V1.1)

#### 2.13.1 Flujos de usuario
**Registrar una deuda**
1. El usuario toca "Nueva deuda" y elige la dirección: "Debo" o "Me deben".
2. Completa:
   - la persona (texto con autocompletado);
   - el monto, la moneda y la fecha de inicio (hoy o anterior);
   - la fecha límite y la nota (opcionales);
   - el interés simple (opcional): un porcentaje mensual o anual, de 0,01 % a 100 %.
3. Opcionalmente indica la cuenta por la que se movió el dinero:
   - en "Debo", entra a la cuenta como ingreso de "Deudas y préstamos";
   - en "Me deben", sale de la cuenta como gasto de "Deudas y préstamos".

   Si la cuenta tiene otra moneda, indica el tipo de cambio usado.

4. La deuda aparece en la lista con su saldo pendiente y, si tiene fecha límite, en los próximos vencimientos del Inicio.

**Registrar un pago**
1. Desde la deuda, el usuario toca "Registrar pago" y escribe el monto en la moneda de la deuda.
2. La app propone el desglose, primero el interés acumulado y luego el capital, y el usuario puede cambiarlo.
3. Elige la cuenta (opcional) y la fecha. Si la cuenta tiene otra moneda, indica el tipo de cambio usado y la app calcula el monto en la moneda de la cuenta.
4. Guarda. Si eligió una cuenta, se crean los movimientos vinculados:
   - la parte de capital en "Deudas y préstamos";
   - la parte de interés en "Deudas y préstamos › Intereses".

   En "Debo" son gastos; en "Me deben", ingresos.

**Eliminar el último pago:** desde la deuda, el usuario puede eliminar solo el último pago, salvo en una deuda Condonada. El capital y el interés que cubría ese pago se restablecen y, desde ese momento, el interés corre sobre el capital restablecido. Lo ya acumulado no se recalcula (RF-M13-04). De los pagos solo se edita la nota.

**Condonar:** el usuario toca "Condonar saldo" y la deuda pasa a Condonada sin mover dinero.

**Consultar**
- Arriba de la lista, el resumen "Debes X · Te deben Y" en moneda base.
- La lista se ve por deuda (por defecto) o agrupada por persona, con el neto de cada una en moneda base. Los nombres se agrupan sin distinguir mayúsculas ni tildes.

#### 2.13.2 Ciclo de vida y estados

| Desde | Hacia | Condición |
|---|---|---|
| — | Activa | Creación |
| Activa | Vencida | Pasa la fecha límite con saldo pendiente |
| Vencida | Activa | Se extiende la fecha límite |
| Activa o Vencida | Pagada | Capital pendiente = 0 e interés pendiente = 0 |
| Activa o Vencida | Condonada | "Condonar saldo" |
| Pagada | Activa o Vencida | Se elimina su último pago (Vencida si la fecha límite ya pasó) |
| Cualquiera | Eliminada | Con confirmación (ver RF-M13-11) |

- Estados finales: Condonada y Eliminada.
- Prohibido: pagos nuevos sobre una deuda Pagada o Condonada; editar un pago (salvo su nota); eliminar un pago que no sea el último; eliminar pagos de una deuda Condonada.

#### 2.13.3 Requerimientos funcionales
- **RF-M13-01:** La persona DEBE tener de 1 a 40 caracteres, con autocompletado sobre las personas ya usadas. El monto es mayor que 0. La fecha de inicio es hoy o anterior. El interés, si existe, va de 0,01 % a 100 %.
- **RF-M13-02:** El interés simple DEBE acumularse día a día sobre el capital pendiente, desde la fecha de inicio (aunque sea pasada), y seguir corriendo después de la fecha límite hasta que el capital llegue a 0. La tasa diaria es la mensual ÷ 30 o la anual ÷ 365. Se acumula con precisión exacta y solo se redondea a 2 decimales al mostrarlo o al pagarlo. Se muestra aparte del capital.
- **RF-M13-03:** La tasa y el período de interés DEBEN quedar fijos al crear la deuda.
- **RF-M13-04:** El interés ya acumulado NUNCA DEBE recalcularse: ni por pagos con fecha pasada, ni por eliminar un pago, ni por el tipo de cambio o la configuración. Un pago, aunque tenga fecha pasada, reduce el capital desde el momento en que se registra. Eliminar el último pago restablece, desde el momento de la eliminación, el capital y el interés que ese pago había cubierto: ese interés vuelve a quedar sin pagar, sin recalcularse.
- **RF-M13-05:** En cada pago, el desglose DEBE venir precargado (interés primero) y ser editable, cumpliendo:
  - interés ≤ interés acumulado;
  - capital ≤ capital pendiente;
  - interés + capital = monto del pago.
- **RF-M13-06:** Saldo pendiente = capital pendiente + interés acumulado no pagado. Nunca es negativo, y un pago no puede superarlo.
- **RF-M13-07:** La fecha de un pago DEBE estar entre la fecha de inicio y hoy.
- **RF-M13-08:** La parte de interés de un pago DEBE contar como gasto ("Debo") o como ingreso ("Me deben"). La parte de capital y el movimiento inicial NO cuentan (RN-02).
- **RF-M13-09:** Un pago, o el movimiento inicial, en una cuenta de otra moneda DEBE pedir el tipo de cambio usado, precargado según RF-M3-07 y editable, y guardarlo. El monto se ingresa en la moneda de la deuda y la app calcula el de la cuenta, para que nunca quede un residuo por redondeo.
- **RF-M13-10:** La edición DEBE cumplir:
  - en una deuda Activa o Vencida: persona, nota y fecha límite, siempre; monto original, solo si queda mayor o igual al capital ya pagado; dirección, moneda, tasa y período, fijos;
  - en una deuda Pagada o Condonada: solo persona y nota.

  La cuenta y el movimiento inicial se editan desde la deuda. De los pagos solo se edita la nota, y solo se puede eliminar el último, desde la deuda y salvo en una Condonada.
- **RF-M13-11:** Al eliminar una deuda con movimientos asociados (el inicial o pagos), el usuario DEBE elegir entre "Eliminar también los N movimientos asociados" y "Conservarlos como movimientos normales". N incluye el movimiento inicial. Ambas opciones respetan el bloqueo de negativos y los apartados. Una deuda sin ningún movimiento se elimina directamente.
- **RF-M13-12:** "Condonar saldo" DEBE cerrar la deuda en Condonada, mostrar el monto condonado y no crear movimientos.
- **RF-M13-13:** El resumen DEBE mostrar el total que se debe y el total que deben al usuario, en moneda base con la referencia vigente. La vista por persona muestra el neto de cada persona en moneda base, agrupando los nombres sin distinguir mayúsculas ni tildes.
- **RF-M13-14:** Los avisos de vencimiento (desde la V1.1), en ambas direcciones, DEBEN llegar 3 días antes, el día del vencimiento y el día siguiente si la deuda quedó vencida. Después no insisten.

#### 2.13.4 Casos borde y excepciones
- **EC-M13-01:** Un pago supera el saldo pendiente. Se rechaza indicando el saldo.
- **EC-M13-02:** El capital llega a 0 pero queda interés acumulado sin pagar. La deuda sigue Activa (o Vencida) hasta saldarlo, y ya no se acumula más interés.
- **EC-M13-03:** El pago sale del efectivo y lo dejaría en negativo. Se rechaza (M4).
- **EC-M13-04:** El pago sale de una cuenta con apartados. Se aplica la confirmación de M12.
- **EC-M13-05:** Se intenta eliminar un pago que no es el último. La acción no está disponible.
- **EC-M13-06:** La misma persona aparece en "Debo" y en "Me deben". La vista por persona muestra el neto.
- **EC-M13-07:** Se elimina el último pago de una deuda Pagada. Vuelve a Activa (o Vencida): el capital se restablece y el interés corre sobre él desde ese momento, sin recalcular lo ya acumulado.
- **EC-M13-08:** Se crea hoy una deuda con interés y fecha de inicio el 1 de enero. El interés se acumula desde el 1 de enero.

#### 2.13.5 Criterios de aceptación
```gherkin
Escenario: Interés sobre el capital pendiente
  Dado una deuda "Debo" de Bs 2.000,00 al 2 % mensual
  Y un pago de capital de Bs 1.000,00
  Entonces desde que se registra el pago el interés se acumula sobre Bs 1.000,00
  Y el interés acumulado antes del pago no cambia

Escenario: Desglose precargado
  Dado una deuda con interés acumulado Bs 42,30 y capital pendiente Bs 2.000,00
  Cuando el usuario registra un pago de Bs 500,00
  Entonces el desglose propuesto es interés 42,30 y capital 457,70
  Y al guardar desde el Banco, Bs 42,30 cuentan como gasto en "Intereses"

Escenario: Condonar
  Dado una deuda "Me deben" con saldo pendiente Bs 300,00
  Cuando el usuario condona el saldo
  Entonces la deuda queda Condonada
  Y no se crea ningún movimiento
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

