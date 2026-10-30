---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.3 M3 - Monedas y tipo de cambio (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M3"
modulo: "M3"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.2 M2 - Navegación y estructura (V1.0)]] · → [[Spec 2.4 M4 - Cuentas (V1.0)]]

### 2.3 M3 — Monedas y tipo de cambio (V1.0)

#### 2.3.1 Flujos de usuario
**Elegir la referencia del dólar**
1. En el panel de Tipo de cambio (o en Ajustes), el usuario elige la referencia: paralelo (compra, venta o mediana), oficial (TCO) o valor manual.
2. Al guardar, los saldos y totales actuales se recalculan. Los movimientos registrados no cambian.

**Cargar un valor manual**
1. El usuario escribe un valor (por ejemplo, Bs 10,10 por dólar) y lo activa.
2. Ese valor tiene prioridad sobre cualquier referencia automática hasta que el usuario lo desactive.
3. Mientras está activo, el panel de Tipo de cambio muestra un aviso fijo: "Usando tu valor manual (Bs 10,10) desde hace N días", y la ficha del dólar de la cabecera lleva un distintivo.

**Agregar una moneda**
1. El usuario agrega una moneda con su código de 3 letras, su símbolo y su valor en bolivianos (por ejemplo, 1 EUR = Bs 11,20).
2. Esa tasa es siempre manual y el usuario la actualiza cuando quiera. Cada cambio queda en el historial de tasas.

**Cambiar la moneda base**
1. El usuario elige cualquier moneda activa como base.
2. Los totales y la historia se reexpresan con las tasas guardadas en cada movimiento y, para una moneda que el movimiento no guardó, con el historial de tasas en su fecha. Nunca con las de hoy.

**Consultar el panel**
1. El usuario abre Tipo de cambio desde la cabecera o el menú.
2. Ve:
   - la tasa actual de cada referencia y cuál está en uso;
   - la brecha entre el paralelo y el oficial, en % y en Bs (RF-M3-12);
   - "actualizado hace X" con su fuente (paralelo.bo, BCB);
   - un gráfico de evolución con un punto por día, en rangos de 7 días, 30 días, 90 días y 1 año.

#### 2.3.2 Ciclo de vida y estados

**Moneda activa**

| Desde | Hacia | Condición |
|---|---|---|
| — | Activa | BOB y USD lo están siempre. Las demás, al agregarlas con su tasa manual |
| Activa | Inactiva | Solo monedas agregadas, que no sean la base y que nada activo use: cuentas activas, metas no archivadas, presupuestos activos o pausados, deudas activas o vencidas, ni reglas recurrentes no eliminadas. Las cuentas archivadas no lo impiden. Su historia se conserva |
| Inactiva | Activa | Reactivación con una tasa manual vigente |

- Prohibido: desactivar BOB o USD, desactivar la moneda base, o desactivar una moneda en uso por algo activo.

**Valor manual del dólar:** Inactivo ↔ Activo. Solo cambia por acción del usuario. Nunca vence solo.

#### 2.3.3 Requerimientos funcionales
- **RF-M3-01:** BOB y USD DEBEN estar siempre activas. Toda moneda usa 2 decimales, y las tasas de cambio también se guardan con 2 decimales.
- **RF-M3-02:** El código de una moneda DEBE tener 3 letras y ser único para el usuario. Las monedas agregadas DEBEN tener una tasa manual en bolivianos, de Bs 0,01 como mínimo: no se admiten monedas que valgan menos.
- **RF-M3-03:** La referencia por defecto DEBE ser la mediana del paralelo, tal como la publica paralelo.bo. El valor manual activo tiene prioridad sobre cualquier referencia, también en las precargas de transferencias y pagos de deuda.
- **RF-M3-04:** El sistema DEBE actualizar las tasas automáticas:
  - al abrir la app, si el valor guardado tiene más de 1 minuto;
  - el paralelo, cada hora en segundo plano;
  - el oficial, una vez al día en segundo plano.

  Las tasas automáticas son las mismas para todos los usuarios. El valor manual y las tasas de las monedas agregadas son de cada usuario.

- **RF-M3-05:** El sistema DEBE mostrar junto a toda tasa "actualizado hace X" y su fuente. NO muestra avisos de desactualización.
- **RF-M3-06:** Todo movimiento, esté o no en la moneda base, DEBE guardar al guardarse la tasa de su moneda frente al boliviano y la tasa boliviano-dólar. Si la fecha es hoy, guarda las vigentes en ese momento, con la referencia en uso (el valor manual, si está activo). Si es pasada, guarda las del historial en esa fecha, con la referencia y el valor manual que el usuario tenía en uso ese día (RF-M3-13). La tasa guardada nunca se actualiza sola: solo el usuario puede editarla a mano (RF-M3-10).
- **RF-M3-07:** En una transferencia entre monedas distintas, el sistema DEBE precargar el campo "Tipo de cambio usado":
  - con el valor manual del dólar, si está activo;
  - si no, con el paralelo según la dirección: venta si el usuario compra dólares, compra si los vende;
  - si no interviene el dólar, con la tasa manual de la moneda agregada o, entre dos monedas agregadas, con la tasa cruzada a través de BOB.

  Para una fecha pasada se precargan los valores de ese día: el valor manual si estaba activo, o el paralelo de ese día (RF-M3-06, RF-M3-13).

- **RF-M3-08:** En esa transferencia, el sistema DEBE calcular el monto que llega a partir del monto que sale y la tasa. Si el usuario edita el monto que llega, la tasa se recalcula. Ese monto manda y se guarda tal cual; como la tasa tiene 2 decimales, puede no reproducirlo exactamente (diferencia máxima de 0,01).
- **RF-M3-09:** La tasa declarada en una transferencia DEBE ser la tasa histórica de ese movimiento.
- **RF-M3-10:** Al editar un movimiento, la tasa guardada DEBE conservarse siempre, aunque cambien su fecha o su cuenta. Solo cambia si el usuario la edita a mano desde el detalle del movimiento. En una transferencia, la tasa declarada solo cambia si el usuario la edita.
- **RF-M3-11:** Cambiar la referencia o la moneda base DEBE recalcular los saldos y totales actuales sin modificar los movimientos registrados.
- **RF-M3-12:** La brecha DEBE calcularse como (paralelo − oficial) ÷ oficial, en % y en Bs, comparando con el oficial (TCO) la referencia del paralelo en uso o el valor manual. Si la referencia en uso es el oficial, se muestra la mediana del paralelo contra el oficial.
- **RF-M3-13:** El sistema DEBE guardar un historial diario de tasas por moneda: las referencias automáticas del dólar, el valor manual, las tasas de las monedas agregadas y la referencia elegida por el usuario (cada cambio del usuario). El día de una tasa de mercado es el día calendario de Bolivia. La tasa de un día es la última vigente ese día. Para un día sin compra o venta del paralelo se usa la mediana de ese día. Para un día sin dato se usa la del día anterior más cercano y, antes del primer dato, el primer valor conocido.

#### 2.3.4 Casos borde y excepciones
- **EC-M3-01:** La fuente no responde. Se usa el último valor guardado y la app sigue funcionando.
- **EC-M3-02:** La fuente no responde y no hay ningún valor guardado (usuario nuevo).
  - Los movimientos en bolivianos se registran sin restricción.
  - Al guardar un movimiento en otra moneda, se pregunta "No pudimos obtener el dólar. ¿A cuánto lo tomamos?". El valor ingresado queda como tasa de ese movimiento y como valor manual activo.
  - Mientras no exista ninguna tasa, no se muestran equivalentes en la otra moneda.
- **EC-M3-03:** Se registra un movimiento con fecha de un día sin registro de tasas. Se usa la del día anterior más cercano y, si es anterior al primer dato, el primer valor conocido (RF-M3-13).
- **EC-M3-04:** La fuente devuelve un valor inválido (cero, negativo o vacío). Se descarta y se conserva el último valor válido. Cualquier valor positivo se acepta, aunque sea un salto grande.
- **EC-M3-05:** El usuario intenta desactivar una moneda en uso. Se rechaza y se indica qué la usa (cuentas, metas, presupuestos, deudas o reglas).
- **EC-M3-07:** Se agrega una moneda con una tasa menor a Bs 0,01 (por ejemplo, el peso argentino o el chileno). Se rechaza explicando que no se admiten monedas de valor tan bajo.
- **EC-M3-06:** Con el valor manual activo, se transfiere de una cuenta en Bs a una en $. Se precarga el valor manual, no el paralelo.

#### 2.3.5 Criterios de aceptación
```gherkin
Escenario: La historia no se reescribe al cambiar la base
  Dado un gasto de $ 10,00 registrado el 1/10 con el dólar a Bs 10,00
  Y la moneda base es BOB
  Cuando el dólar sube a Bs 11,00 y el usuario cambia la base a USD y luego vuelve a BOB
  Entonces ese gasto sigue valiendo Bs 100,00 en la historia

Escenario: Tasa precargada según la dirección
  Dado que el paralelo está en compra 10,10 y venta 10,30
  Cuando el usuario transfiere Bs 1.000,00 de una cuenta en Bs a una en $
  Entonces el campo "Tipo de cambio usado" muestra 10,30
  Y el monto que llega es $ 97,09

Escenario: Valor manual con prioridad
  Dado que el usuario activó un valor manual de Bs 10,00
  Cuando el paralelo cambia a Bs 10,40
  Entonces los totales siguen convirtiéndose con Bs 10,00
  Y el panel de Tipo de cambio muestra "Usando tu valor manual (Bs 10,00) desde hace N días"

Escenario: Sin ninguna tasa disponible
  Dado un usuario nuevo y la fuente del dólar no responde
  Cuando guarda un gasto en su cuenta en dólares
  Entonces la app le pide "¿A cuánto lo tomamos?"
  Y el valor que ingresa queda como tasa del gasto y como valor manual activo
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]]

