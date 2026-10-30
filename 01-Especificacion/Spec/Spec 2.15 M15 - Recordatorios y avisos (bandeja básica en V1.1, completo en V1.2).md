---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.15 M15 - Recordatorios y avisos (bandeja básica en V1.1, completo en V1.2)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M15"
modulo: "M15"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.14 M14 - Recurrentes (V1.2)]]

### 2.15 M15 — Recordatorios y avisos (bandeja básica en V1.1, completo en V1.2)

#### 2.15.1 Flujos de usuario
**Bandeja**
1. La campana de la cabecera muestra el número de avisos sin leer.
2. El usuario abre la bandeja. Tocar un aviso lo marca como leído y lleva a su pantalla. Si lo que avisa ya no existe, se muestra "Esto ya no existe".
3. Los avisos que piden decisión (cierre de presupuesto, pendiente de recurrente) tienen sus botones en la misma bandeja.
4. El usuario puede marcar todo como leído (también los avisos que esperan decisión) o eliminar un aviso deslizándolo o desde su menú "…". Si el aviso esperaba una decisión, esta sigue disponible en su módulo.

**Configurar** (V1.2): en Ajustes › Recordatorios, el usuario activa o desactiva cada tipo y ajusta su hora, los días de anticipación (de 0 a 7) o los días de la semana, según el tipo.

#### 2.15.2 Ciclo de vida y estados

| Desde | Hacia | Condición |
|---|---|---|
| — | No leído | Se genera el aviso |
| No leído | Leído | El usuario lo toca, o usa "Marcar todo como leído" |
| No leído o Leído | Eliminado | El usuario lo elimina (deslizándolo o desde su menú), o pasan 90 días |
| Esperando decisión | Resuelto | El usuario decide, o el sistema aplica el valor por defecto (7 días para un cierre, 30 días para un pendiente) |

- Prohibido: borrar por antigüedad un aviso que espera una decisión.

#### 2.15.3 Requerimientos funcionales
- **RF-M15-01:** Todos los avisos DEBEN llegar solo dentro de la app, sin correo de avisos ni notificaciones push.
- **RF-M15-02:** Los tipos y sus valores por defecto DEBEN ser:

  | Tipo | Activo por defecto | Comportamiento |
  |---|---|---|
  | Pago próximo | Sí | Recurrentes de gasto y de transferencia con frecuencia semanal o mayor (no diarias), 1 día antes; sin monto, dicen "monto por definir". Tarjetas, el día del corte y 3 días antes del pago. Deudas en ambas direcciones, 3 días antes, el día y el día siguiente si quedó vencida |
  | Alertas de presupuesto | Sí | Según los umbrales de cada presupuesto (M11) |
  | Cierre de período | Sí | Al cerrar cada período de presupuesto |
  | Pendiente de recurrente | Sí | Al generarse un pendiente, al omitirse por vencimiento y al pausarse una regla porque se archivó su cuenta o su categoría (para elegir otra) |
  | Registrar el día | No | Siempre a la hora elegida (21:00 por defecto), en los días de la semana elegidos |
  | Avance de metas | No | Al cruzar el 25 %, 50 %, 75 % y 100 %. Además, el día 1 de cada mes, si el mes anterior se aportó menos que lo sugerido. Aporte del mes = apartados + entradas a la cuenta dedicada − retiros, sin el efecto del tipo de cambio |

- **RF-M15-03:** Todos los tipos DEBEN poder desactivarse. Desactivar un tipo de decisión no oculta la decisión: los pendientes siguen en Recurrentes y la tarjeta de cierre en el presupuesto.
- **RF-M15-04:** Un mismo evento NUNCA DEBE generar dos avisos (RN-10). Cada hito de meta avisa una sola vez, aunque el tipo de cambio lo haga oscilar.
- **RF-M15-05:** Los avisos DEBEN borrarse solos a los 90 días, salvo los que esperan una decisión.
- **RF-M15-06:** El contador de la campana DEBE mostrar los avisos no leídos.
- **RF-M15-07:** En la V1.1 existen la campana, la bandeja y los avisos de alertas de presupuesto, cierre de período y vencimiento de deudas, todos activos y sin configuración. La V1.2 agrega los demás tipos y la configuración.
- **RF-M15-08:** El aviso de "cambio fuerte del dólar" NO existe.
- **RF-M15-09:** Los avisos programados sin hora configurable (vencimientos de deudas y tarjetas, pagos próximos, avance mensual de metas) DEBEN generarse a las 08:00 en la zona horaria del usuario.
- **RF-M15-10:** Al reactivar un tipo de aviso, NO DEBEN generarse avisos de lo ocurrido mientras estaba desactivado.
- **RF-M15-11:** Al tocar un aviso de algo que ya no existe (deuda, meta, regla), el sistema DEBE mostrar "Esto ya no existe" y marcarlo como leído.
- **RF-M15-12:** "Marcar todo como leído" y eliminar un aviso DEBEN funcionar también con los avisos que esperan una decisión. La decisión sigue en su módulo (RF-M15-03).

#### 2.15.4 Casos borde y excepciones
- **EC-M15-01:** El usuario resuelve un pendiente desde Recurrentes. El aviso de la bandeja queda Resuelto.
- **EC-M15-02:** Se cambia el día de pago de una tarjeta después de generado su aviso. El aviso ya generado no se repite, y el próximo usa la nueva fecha.
- **EC-M15-03:** El aviso "Registrar el día" se genera aunque ya haya movimientos ese día, porque es el comportamiento elegido.

#### 2.15.5 Criterios de aceptación
```gherkin
Escenario: Aviso de vencimiento de deuda
  Dado una deuda "Debo" a Juan con fecha límite el 20/10
  Cuando es 17/10
  Entonces llega a la bandeja "Vence en 3 días: debes Bs 1.200,00 a Juan"

Escenario: Decisión visible con el aviso desactivado
  Dado que el usuario desactivó los avisos de pendientes de recurrentes
  Cuando se genera un pendiente
  Entonces no aparece en la bandeja
  Y sí aparece en "Pendientes de confirmar" de Recurrentes

Escenario: Sin duplicados
  Dado que ya se avisó el hito 50 % de la meta "Viaje"
  Cuando el progreso baja y vuelve a cruzar el 50 %
  Entonces no se genera otro aviso
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

