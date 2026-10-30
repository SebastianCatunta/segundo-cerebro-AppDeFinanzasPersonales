---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.12 M12 - Metas de ahorro (V1.1)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M12"
modulo: "M12"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.11 M11 - Presupuestos (V1.1)]] · → [[Spec 2.13 M13 - Deudas y préstamos (V1.1)]]

### 2.12 M12 — Metas de ahorro (V1.1)

#### 2.12.1 Flujos de usuario
**Crear una meta**
1. El usuario toca "Nueva meta" e ingresa:
   - el nombre;
   - el monto objetivo y la moneda;
   - la fecha objetivo (opcional);
   - el ícono y el color.
2. Opcionalmente, dedica a la meta una cuenta de banco, ahorro, efectivo, billetera u otro (nunca una tarjeta). Todo su saldo actual cuenta desde ese momento.
3. La app muestra el aporte mensual sugerido.

**Aportar con un apartado**
1. Desde la meta, el usuario toca "Apartar", elige una cuenta y un monto (hasta el saldo libre).
2. El dinero sigue en la cuenta pero queda reservado. La cuenta muestra Saldo · Apartado para metas · Libre.

**Aportar a la cuenta dedicada:** cualquier ingreso o transferencia hacia la cuenta dedicada suma automáticamente, incluido el cobro de una deuda "Me deben".

**Retirar:** el usuario libera un apartado (total o parcial). En la cuenta dedicada, toda salida resta automáticamente, sin pedir confirmación; Registrar muestra el aviso "Esto resta a tu meta X".

**Usar y cerrar**
1. Al usar el dinero, el usuario toca "Usar y cerrar". Se liberan todos los apartados, la cuenta dedicada vuelve a ser normal y la meta pasa a Archivada.
2. El usuario registra el gasto real como un gasto normal.

#### 2.12.2 Ciclo de vida y estados

| Desde | Hacia | Condición |
|---|---|---|
| — | En curso | Creación |
| En curso | Cumplida | Progreso ≥ objetivo (la celebración se muestra solo la primera vez) |
| Cumplida | En curso | El progreso baja del objetivo (por retiros, ediciones o el tipo de cambio) y la fecha no pasó |
| Cumplida | Vencida | El progreso baja del objetivo y la fecha objetivo ya pasó |
| En curso | Vencida | Pasa la fecha objetivo sin cumplirse |
| Vencida | En curso | Se extiende la fecha objetivo |
| Vencida | Cumplida | Progreso ≥ objetivo |
| Cualquiera (sin apartados ni cuenta dedicada) | Archivada | Acción del usuario |
| Cualquiera | Archivada | "Usar y cerrar" (libera todo) |
| Archivada | En curso / Cumplida / Vencida | Restaurar (según el progreso; sin apartados previos) |

- El estado SIGUE al progreso, incluido el efecto del tipo de cambio.
- Prohibido: archivar o eliminar una meta con apartados o cuenta dedicada, salvo con "Usar y cerrar". Una meta vacía sí se elimina, junto con su historia.

#### 2.12.3 Requerimientos funcionales
- **RF-M12-01:** El nombre DEBE tener de 1 a 40 caracteres, el objetivo DEBE ser mayor que 0 y la fecha objetivo, si existe, DEBE ser hoy o futura. La moneda es cualquiera activa y se puede editar. Al cambiarla, los hitos ya avisados no se repiten.
- **RF-M12-02:** El progreso DEBE ser el saldo de su cuenta dedicada (si tiene, con mínimo 0) más sus apartados en otras cuentas, convertido a la moneda de la meta con la tasa vigente. No existen aportes sin cuenta.
- **RF-M12-03:** Una meta DEBE tener como máximo una cuenta dedicada, que no puede ser una tarjeta. Una cuenta dedicada pertenece a una sola meta y no tiene apartados de otras metas.
- **RF-M12-04:** Una cuenta normal que no sea tarjeta PUEDE tener apartados de varias metas. Solo se aparta dentro del saldo libre.
- **RF-M12-05:** El sistema DEBE pedir confirmación antes de guardar toda operación que deje el saldo de una cuenta por debajo de lo apartado: gastos, transferencias, ediciones, eliminaciones de ingresos, deshacer, ajustes, pagos de deuda y eliminación de una deuda con sus movimientos:
  - la confirmación muestra "Este gasto usa X apartados" y las metas afectadas;
  - viene una propuesta precargada (primero la meta con la fecha más lejana o sin fecha) que el usuario puede cambiar;
  - si confirma, se guarda y los apartados se reducen, registrado como retiro en cada meta;
  - si cancela, no se guarda nada.

  Las salidas de una cuenta dedicada NO piden confirmación: restan automáticamente y Registrar muestra el aviso "Esto resta a tu meta X".

- **RF-M12-06:** Aporte mensual sugerido = (objetivo − progreso) ÷ meses calendario restantes, incluido el actual. Además:
  - si la fecha es este mes, se muestra "Faltan X este mes";
  - sin fecha, una calculadora "Aportando X/mes llegas en [mes]";
  - si está vencida, "Elige una nueva fecha";
  - si el progreso ya alcanzó el objetivo, no se muestra.
- **RF-M12-07:** El detalle DEBE mostrar el progreso por cuenta, la historia de apartados y retiros con su origen (manual, presupuesto, cuenta dedicada, gasto confirmado) y el sugerido.
- **RF-M12-08:** El total neto de Cuentas NO DEBE cambiar por los apartados. El desglose suma la línea "Apartado para metas": los apartados más el saldo positivo de las cuentas dedicadas.
- **RF-M12-09:** "Usar y cerrar" DEBE liberar todos los apartados, convertir la cuenta dedicada en normal y archivar la meta con su historia.

#### 2.12.4 Casos borde y excepciones
- **EC-M12-01:** Se intenta apartar más que el saldo libre. Se rechaza indicando el saldo libre.
- **EC-M12-02:** Se intenta archivar una cuenta con apartados. Se rechaza indicando qué metas debe liberar primero.
- **EC-M12-03:** Una meta en USD con apartados en BOB baja del 100 % porque el dólar subió. Pasa a En curso.
- **EC-M12-04:** La cuenta dedicada queda en negativo (un banco con sobregiro). Aporta 0 a la meta, nunca un valor negativo.
- **EC-M12-05:** Un recurrente automático tocaría dinero apartado. No se registra y pasa a pendiente (M14).
- **EC-M12-06:** Se dedica a una meta una cuenta que ya tiene apartados de otras metas. Se rechaza: primero hay que liberar esos apartados.
- **EC-M12-07:** Se registra un ajuste negativo en un banco y su saldo quedaría por debajo de lo apartado. Se pide la confirmación de RF-M12-05.
- **EC-M12-08:** Se intenta dedicar una tarjeta a una meta. La opción no está disponible.

#### 2.12.5 Criterios de aceptación
```gherkin
Escenario: Progreso combinado
  Dado la meta "Viaje" con cuenta dedicada "Ahorro" de saldo Bs 850,00
  Y apartados de Bs 200,00 en el Banco y Bs 150,00 en Efectivo
  Entonces el progreso de "Viaje" es Bs 1.200,00

Escenario: Gasto que toca dinero apartado
  Dado el Banco con saldo Bs 4.800,00 y Bs 300,00 apartados
  Cuando el usuario registra un gasto de Bs 4.600,00 desde el Banco
  Entonces la app pregunta de qué metas tomar Bs 100,00
  Cuando confirma
  Entonces el gasto se guarda y los apartados del Banco quedan en Bs 200,00

Escenario: Usar y cerrar
  Dado la meta "Laptop" cumplida con apartados en dos cuentas
  Cuando el usuario toca "Usar y cerrar"
  Entonces los apartados se liberan
  Y la meta queda Archivada con su historia

Escenario: Salida de la cuenta dedicada sin confirmación
  Dado la meta "Viaje" con cuenta dedicada "Ahorro"
  Cuando el usuario registra un gasto desde "Ahorro"
  Entonces el gasto se guarda sin pedir confirmación
  Y ve el aviso "Esto resta a tu meta Viaje"
  Y el progreso de "Viaje" baja por ese monto
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]]

