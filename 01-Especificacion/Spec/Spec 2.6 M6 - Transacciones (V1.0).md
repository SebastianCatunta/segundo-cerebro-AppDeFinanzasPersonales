---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.6 M6 - Transacciones (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M6"
modulo: "M6"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.5 M5 - Categorías (V1.0)]] · → [[Spec 2.7 M7 - Registrar (pestaña) (V1.0)]]

### 2.6 M6 — Transacciones (V1.0)

#### 2.6.1 Flujos de usuario
**Registrar** (el flujo rápido está en M7)
- Gasto o ingreso: monto, cuenta, categoría, fecha y nota opcional.
- Transferencia: cuenta de origen, cuenta de destino, monto, fecha, nota y comisión opcional.
  - Si las monedas difieren: monto que sale, tipo de cambio usado y monto que llega (M3).
  - La comisión crea un gasto vinculado en la cuenta de origen, con la categoría "Servicios › Comisiones bancarias". Si esa categoría no existe o está archivada, se pide elegir otra categoría de gasto.

**Revisar**
1. La lista abre en el mes actual, con selector de mes. Agrupa por día con el neto de cada día y muestra arriba los totales del filtro activo.
2. Filtros: fecha o rango, cuenta, categoría (incluye sus subcategorías) y tipo.
3. Búsqueda por nota, sin distinguir mayúsculas ni tildes, o por monto exacto en su moneda original, con coma o punto como decimal ("35" encuentra 35,00 pero no 135).
4. Al bajar se cargan más movimientos.

**Editar:** desde el detalle, el usuario cambia el monto, la cuenta, la categoría, la fecha, la nota o la tasa, según las reglas de abajo.

**Eliminar:** el movimiento se elimina al instante (queda guardado en el servidor) y aparece "Deshacer" durante 10 segundos, que lo restaura.

**Acciones en lote**
1. Con una pulsación larga (o casillas en escritorio), el usuario selecciona varios de los movimientos ya cargados. No existe "seleccionar todo".
2. Puede eliminarlos, o recategorizarlos si son todos gastos o todos ingresos. Un solo "Deshacer" revierte cualquiera de las dos acciones.

#### 2.6.2 Ciclo de vida y estados

| Desde | Hacia | Disparador |
|---|---|---|
| — | Registrado | Guardado manual, o recurrente automático (M14) |
| — | Pendiente | Recurrente en modo confirmación, o automático bloqueado (M14) |
| Pendiente | Registrado | El usuario confirma (puede ajustar el monto, la fecha y la tasa; si su cuenta o categoría está archivada, elige otra) |
| Pendiente | Omitido | El usuario omite, o pasan 30 días sin decisión |
| Registrado | Eliminado (deshacible) | Eliminación |
| Eliminado (deshacible) | Registrado | "Deshacer" dentro de los 10 segundos |
| Eliminado (deshacible) | Eliminado definitivo | Pasan 10 segundos o el usuario cambia de pantalla |

- Estados finales: Omitido y Eliminado definitivo.
- El "Deshacer" que aparece al guardar en Registrar elimina el movimiento recién creado, con las mismas validaciones que una eliminación (RF-M7-07).
- Sin conexión no se ofrece "Deshacer": la app está bloqueada (M2).
- Prohibido: cambiar el tipo de un movimiento, y deshacer después de los 10 segundos.

#### 2.6.3 Requerimientos funcionales
- **RF-M6-01:** El monto DEBE estar entre 0,01 y 999.999.999,99, con 2 decimales como máximo.
- **RF-M6-02:** La fecha DEBE ser hoy o anterior (RN-07), sin hora y sin fecha mínima. Dentro de un día, la lista ordena por momento de registro, del más reciente al más antiguo.
- **RF-M6-03:** La nota DEBE ser opcional y de hasta 140 caracteres.
- **RF-M6-04:** El origen y el destino de una transferencia DEBEN ser cuentas activas y distintas.
- **RF-M6-05:** La comisión de una transferencia DEBE crear un gasto vinculado en la cuenta de origen. Se edita desde la transferencia y se elimina con ella: acompaña la fecha y la cuenta de origen de la transferencia, y su monto no se edita en V1 (para cambiarlo, se elimina la transferencia y se vuelve a crear). Si su categoría no existe o está archivada, se pide elegir otra. El monto y la comisión se validan juntos contra el bloqueo de negativos (M4). La comisión puede ser mayor que el monto.
- **RF-M6-06:** El tipo de un movimiento NO DEBE cambiar.
- **RF-M6-07:** La cuenta PUEDE cambiarse:
  - a otra de la misma moneda, libremente;
  - a otra de distinta moneda: el monto en la nueva moneda se precarga convertido con la tasa guardada (o, si el movimiento no guardó la tasa de esa moneda, con el historial en su fecha), y el usuario lo confirma o edita la tasa a mano (RF-M3-10). Si la conversión supera el máximo de RF-M6-01, se rechaza con la explicación.
  - En una transferencia, el origen y el destino PUEDEN cambiarse, cada uno solo a otra cuenta de la misma moneda que la que reemplaza y respetando RF-M6-04. Para pasar a otra moneda, se elimina la transferencia y se vuelve a crear.
- **RF-M6-08:** Toda edición, eliminación o deshacer DEBE respetar el bloqueo de negativos (M4), la protección de apartados (M12) y las reglas de tasa (M3).
- **RF-M6-09:** En los movimientos vinculados (glosario), el monto, la cuenta y la fecha DEBEN editarse solo desde su origen, y el detalle ofrece "Ir a…". La nota y la categoría se editan desde la lista, salvo la categoría del sistema.
- **RF-M6-10:** Los movimientos creados por un recurrente DEBEN ser movimientos normales, editables y eliminables, con el distintivo "De recurrente: X", donde X es el nombre de la regla.
- **RF-M6-11:** Los pendientes NO DEBEN aparecer en la lista de movimientos ni contar en saldos o totales.
- **RF-M6-12:** El neto diario y los totales de la lista DEBEN excluir los movimientos que indica RN-02.
- **RF-M6-13:** Las acciones en lote DEBEN omitir los movimientos que violarían el bloqueo de negativos o de apartados. Al eliminar, omiten además todos los vinculados; al recategorizar, las transferencias, los ajustes y los vinculados con la categoría del sistema. Deben avisar cuántos quedaron fuera.
- **RF-M6-14:** Un doble toque o un reintento NUNCA DEBE crear dos movimientos (RN-10). No existe aviso de posible duplicado.

#### 2.6.4 Casos borde y excepciones
- **EC-M6-01:** El mismo movimiento se edita en dos dispositivos. Gana la última edición guardada.
- **EC-M6-02:** Se guarda la edición de un movimiento eliminado en otro dispositivo. Se informa "Este movimiento ya no existe" y no se guarda nada.
- **EC-M6-03:** Se intenta deshacer una eliminación cuyo resultado violaría el bloqueo de negativos. Se rechaza con la explicación.
- **EC-M6-04:** Se cambia la fecha de un gasto en dólares. Conserva su tasa guardada; el usuario puede editarla a mano (RF-M3-10).
- **EC-M6-05:** Se elimina una transferencia con comisión. Se eliminan ambas, con un único "Deshacer".
- **EC-M6-06:** El usuario cambia de pantalla durante los 10 segundos de "Deshacer". La eliminación queda definitiva.
- **EC-M6-07:** Se pasa un movimiento a una cuenta de otra moneda y el monto convertido superaría 999.999.999,99. Se rechaza con la explicación. Los saldos y totales sí pueden superar ese tope.
- **EC-M6-08:** Se carga una comisión y "Comisiones bancarias" fue eliminada en el Onboarding. Se pide elegir otra categoría de gasto.

#### 2.6.5 Criterios de aceptación
```gherkin
Escenario: Eliminar y deshacer
  Dado un gasto de Bs 35,00 en Efectivo
  Cuando el usuario lo elimina
  Entonces el saldo de Efectivo sube Bs 35,00 al instante
  Y ve "Movimiento eliminado · Deshacer" durante 10 segundos
  Cuando toca "Deshacer"
  Entonces el gasto vuelve y el saldo se restablece

Escenario: Transferencia con comisión
  Dado que el usuario transfiere Bs 500,00 del Banco a Efectivo con comisión Bs 5,00
  Entonces el Banco baja Bs 505,00 y el Efectivo sube Bs 500,00
  Y se crea un gasto de Bs 5,00 en "Comisiones bancarias"
  Y la transferencia no cuenta como ingreso ni como gasto

Escenario: Doble toque no duplica
  Dado que el usuario toca "Guardar" dos veces seguidas
  Entonces se crea un solo movimiento

Escenario: Vinculado solo se edita en su origen
  Dado un pago de deuda a Juan de Bs 200,00
  Cuando el usuario abre ese movimiento desde la lista
  Entonces el monto, la cuenta y la fecha no son editables
  Y ve la opción "Ir a la deuda"
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M14 - Recurrentes]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

