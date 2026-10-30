---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.14 M14 - Recurrentes (V1.2)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M14"
modulo: "M14"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.13 M13 - Deudas y préstamos (V1.1)]] · → [[Spec 2.15 M15 - Recordatorios y avisos (bandeja básica en V1.1, completo en V1.2)]]

### 2.14 M14 — Recurrentes (V1.2)

#### 2.14.1 Flujos de usuario
**Crear una regla**
1. En Recurrentes, el usuario toca "Nueva regla" y elige el tipo: gasto, ingreso o transferencia.
2. Define:
   - el nombre (de 1 a 40 caracteres, por ejemplo "Netflix");
   - el monto (opcional solo en modo confirmación), la cuenta (o el origen y el destino), la categoría y la nota;
   - la frecuencia: diaria, semanal (eligiendo un solo día), mensual (día fijo) o anual (fecha fija);
   - la fecha de inicio (hoy o futura);
   - el fin: sin fin, hasta una fecha (incluida, igual o posterior al inicio) o después de N veces (de 1 a 999);
   - el modo: automático o con confirmación.
3. Guarda. La regla muestra sus próximas fechas. Si empieza hoy, la ocurrencia de hoy se crea en ese momento.

**En la fecha de una ocurrencia**
- En modo automático, el movimiento se registra a las 00:00 en la zona horaria del usuario.
- En modo confirmación, se crea un pendiente. Se ve en la bandeja (si el aviso está activo) y siempre en la sección "Pendientes de confirmar" de Recurrentes.
- El usuario confirma (ajustando el monto, la fecha o la tasa) u omite.

**Pausar y reanudar**
1. El usuario pausa la regla.
2. Al reanudarla, la app pregunta qué ocurrencias de la pausa registrar. Las elegidas se registran con su fecha original y la tasa de esa fecha; las que bloquearían M4 o M12 quedan como pendientes. Si la fecha de fin ya pasó, la regla queda Finalizada y solo se ofrecen las ocurrencias hasta esa fecha.

#### 2.14.2 Ciclo de vida y estados

**Regla**

| Desde | Hacia | Condición |
|---|---|---|
| — | Activa | Creación |
| Activa | Pausada | Por el usuario, o automáticamente si se archiva su categoría o su cuenta (con aviso) |
| Pausada | Activa | Reanudar (con la pregunta por las ocurrencias saltadas) |
| Activa o Pausada | Finalizada | Se alcanza la fecha de fin, o se genera (o se registra al reanudar) la ocurrencia número N |
| Finalizada | Activa | Se extiende el fin |
| Cualquiera | Eliminada | Por el usuario |

- Estado final: Eliminada.

**Ocurrencia:** ver el ciclo de Pendiente en M6.

#### 2.14.3 Requerimientos funcionales
- **RF-M14-01:** Las frecuencias DEBEN ser diaria, semanal, mensual con día fijo y anual. Una regla semanal tiene un solo día y lo respeta.
- **RF-M14-02:** Si el día elegido no existe en un mes, la ocurrencia DEBE caer el último día del mes. El 29 de febrero pasa al 28 en los años no bisiestos.
- **RF-M14-03:** La fecha de inicio DEBE ser hoy o futura. El sistema NUNCA genera ocurrencias con fecha anterior a la fecha de inicio. Si la regla empieza hoy, la ocurrencia de hoy se genera al guardarla.
- **RF-M14-04:** Las ocurrencias DEBEN ejecutarse a las 00:00 en la zona horaria del usuario. Si ese día no existe la 00:00 (horario de verano), se ejecutan en el primer minuto válido del día. Un cambio de zona horaria no repite ni pierde fechas.
- **RF-M14-05:** Una ocurrencia automática DEBE quedar como pendiente si dejaría una cuenta en negativo (M4) o si tocaría dinero apartado (M12).
- **RF-M14-06:** En una transferencia recurrente entre monedas distintas, el modo automático DEBE usar la precarga de RF-M3-07 del día de ejecución. En modo confirmación, el usuario ajusta la tasa al confirmar.
- **RF-M14-07:** Un pendiente sin decisión DEBE pasar a Omitido a los 30 días de generado, con un aviso. Esto vale también para los pendientes recuperados tras una caída del sistema. Las ocurrencias siguientes se generan aunque haya pendientes anteriores.
- **RF-M14-08:** Un pendiente se confirma con su fecha original o con otra, sin fechas futuras. Puede ser anterior al saldo inicial de la cuenta (RF-M4-03). Si su cuenta o categoría está archivada, se pide elegir otra. En una regla sin monto, el monto se ingresa al confirmar.
- **RF-M14-09:** Al reanudar una regla, el sistema DEBE preguntar qué ocurrencias saltadas registrar. Se registran con su fecha original y la tasa de esa fecha; las que bloquearían M4 o M12 quedan como pendientes. Para el total de N veces cuenta toda ocurrencia generada: registradas, pendientes y omitidas. Las saltadas cuentan solo si se registran. Al llegar a N, la regla pasa a Finalizada.
- **RF-M14-10:** Editar una regla DEBE afectar solo a las ocurrencias futuras. Los pendientes y los movimientos ya creados no cambian.
- **RF-M14-11:** Eliminar una regla DEBE conservar los movimientos creados y borrar sus pendientes.
- **RF-M14-12:** NUNCA DEBE existir más de una ocurrencia de la misma regla para la misma fecha. Si el sistema estuvo caído, recupera las ocurrencias de esos días sin duplicarlas.
- **RF-M14-13:** La pantalla DEBE mostrar:
  - las reglas con su próxima fecha;
  - "Pendientes de confirmar";
  - "Próximos vencimientos" de 30 días;
  - por regla, las siguientes 3 fechas y "Cuota X de N" si el fin es por cantidad.
- **RF-M14-14:** El monto DEBE ser obligatorio en modo automático y opcional en modo confirmación. Una regla sin monto se muestra como "monto por definir".
- **RF-M14-15:** Cada regla DEBE tener un nombre de 1 a 40 caracteres, que se usa en la etiqueta "De recurrente: X", en la lista y en los avisos.

#### 2.14.4 Casos borde y excepciones
- **EC-M14-01:** Una regla mensual con el día 31 en noviembre. La ocurrencia cae el 30 de noviembre.
- **EC-M14-02:** Se archiva la cuenta de la regla. La regla se pausa con un aviso para elegir otra cuenta.
- **EC-M14-03:** El sistema estuvo caído 2 días. Al volver, crea las ocurrencias de esos días una sola vez.
- **EC-M14-04:** Se elimina una regla con un pendiente. El pendiente desaparece.
- **EC-M14-05:** Se reanuda una regla de "12 veces" que generó 11 ocurrencias antes de la pausa, y el usuario quiere registrar 2 saltadas. Solo puede registrar 1 y la regla pasa a Finalizada.
- **EC-M14-06:** Se reanuda una regla cuya fecha de fin pasó durante la pausa. Queda Finalizada y solo ofrece registrar las ocurrencias saltadas hasta esa fecha.
- **EC-M14-07:** Se crea a las 15:00 una regla que empieza hoy. La ocurrencia de hoy se crea al guardar.

#### 2.14.5 Criterios de aceptación
```gherkin
Escenario: Automático bloqueado pasa a pendiente
  Dado una regla automática "Pasaje" de Bs 50,00 desde Efectivo
  Y el Efectivo tiene Bs 30,00
  Cuando llega la fecha de la ocurrencia
  Entonces no se registra el gasto
  Y se crea un pendiente visible en "Pendientes de confirmar"

Escenario: Pendiente vence
  Dado un pendiente creado hace 30 días sin decisión
  Entonces pasa a Omitido
  Y se genera un aviso

Escenario: Reanudar con ocurrencias saltadas
  Dado una regla semanal pausada durante 3 semanas
  Cuando el usuario la reanuda
  Entonces la app pregunta si registrar las 3 ocurrencias saltadas
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M6 - Transacciones]]

