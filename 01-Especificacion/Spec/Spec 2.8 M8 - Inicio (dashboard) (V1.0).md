---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.8 M8 - Inicio (dashboard) (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M8"
modulo: "M8"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.7 M7 - Registrar (pestaña) (V1.0)]] · → [[Spec 2.9 M9 - Ajustes y personalización (V1.0)]]

### 2.8 M8 — Inicio (dashboard) (V1.0)

#### 2.8.1 Flujos de usuario
**Revisar el mes**
1. El usuario abre la app y ve el mes actual.
2. Cambia de mes con el selector y compara.
3. Toca la tarjeta de Gastos (o una categoría) y llega a Movimientos filtrado por ese tipo (o esa categoría) y ese mes.
4. Edita o elimina un movimiento y el Inicio se recalcula al volver.

**Bloques, en el orden por defecto**
1. Selector de mes (fijo).
2. Cuatro tarjetas: Ingresos, Gastos, Balance y Tasa de ahorro (fijas).
3. Presupuesto del mes (V1.1).
4. Gasto por categoría.
5. Ritmo del gasto.
6. Próximos pagos y deudas (V1.1).
7. Saldos por cuenta.
8. Últimos 5 movimientos.

#### 2.8.2 Ciclo de vida y estados
Cada bloque tiene uno de estos estados:
- **Con datos.**
- **Vacío:** muestra un mensaje y una acción sugerida, por ejemplo "Aún no tienes gastos este mes · Registrar".
- **No disponible:** su entrega no está liberada, así que el bloque no aparece.
- **Oculto:** el usuario lo ocultó en Ajustes.

#### 2.8.3 Requerimientos funcionales
- **RF-M8-01:** El mes DEBE ser el mes calendario. El selector va desde el mes del primer movimiento o del primer saldo inicial hasta el mes actual, sin meses futuros.
- **RF-M8-02:** Los ingresos y gastos DEBEN excluir los movimientos que indica RN-02 y convertirse con la tasa guardada en cada movimiento (RN-05).
- **RF-M8-03:** Balance = ingresos − gastos. Tasa de ahorro = balance ÷ ingresos, en porcentaje entero redondeado con la mitad hacia arriba. La tasa de ahorro DEBE ocultarse si no hay ingresos o si el balance es negativo.
- **RF-M8-04:** Cada tarjeta DEBE mostrar su variación contra el mes anterior:
  - en el mes en curso, contra el mismo tramo de días del mes anterior (o hasta su último día, si es más corto);
  - en un mes cerrado, contra el mes anterior completo;
  - Ingresos y Gastos muestran la variación en %, redondeada a entero con la mitad hacia arriba; si el valor anterior es 0, se muestra "—";
  - Balance muestra la variación en moneda;
  - Tasa de ahorro muestra la variación en puntos porcentuales ("+3 pp").

  Los gastos que suben se marcan en rojo; los ingresos, el balance y la tasa de ahorro que suben, en verde.
- **RF-M8-05:** "Gasto por categoría" DEBE mostrar barras horizontales con las 5 categorías principales de mayor gasto (subcategorías sumadas), con monto y %, más "Otras".
- **RF-M8-06:** "Ritmo del gasto" DEBE comparar el gasto acumulado día a día del mes elegido (hasta hoy, si es el actual) contra el del mes anterior completo.
- **RF-M8-07:** "Saldos por cuenta" DEBE mostrar el total neto en moneda base y en la otra moneda (glosario) y las 5 primeras cuentas según el orden del usuario, con "Ver todas". Siempre son los saldos de hoy, con la leyenda "Saldos al día de hoy".
- **RF-M8-08:** "Presupuesto del mes" (V1.1) DEBE mostrar una barra por presupuesto activo, con su período visible. En un mes pasado, muestra los períodos que terminaron dentro de ese mes.
- **RF-M8-09:** "Próximos pagos y deudas" (V1.1) DEBE listar los vencimientos de los próximos 7 días: deudas (en ambas direcciones), tarjetas y, desde la V1.2, recurrentes. En un mes pasado, el bloque se oculta.
- **RF-M8-10:** Cada bloque DEBE llevar a su módulo. Los bloques 3 a 8 se reordenan y ocultan en Ajustes.
- **RF-M8-11:** El Inicio DEBE reflejar todo cambio de datos al volver a él.

#### 2.8.4 Casos borde y excepciones
- **EC-M8-01:** Usuario sin cuentas. El Inicio invita a crear la primera cuenta.
- **EC-M8-02:** Mes sin movimientos. Las tarjetas muestran 0, la tasa de ahorro se oculta y los gráficos muestran su estado vacío.
- **EC-M8-03:** Mes actual el día 31 contra un mes anterior de 30 días. Se compara con el mes anterior completo.
- **EC-M8-04:** No hay ninguna tasa. Los saldos en otra moneda no se convierten y se indica "Sin tipo de cambio".

#### 2.8.5 Criterios de aceptación
```gherkin
Escenario: Préstamos no inflan los ingresos
  Dado que el usuario recibió un préstamo de Bs 5.000,00 registrado en "Deudas y préstamos"
  Cuando mira el Inicio del mes
  Entonces la tarjeta Ingresos no incluye esos Bs 5.000,00
  Y el saldo de la cuenta sí los incluye

Escenario: Comparación por el mismo tramo
  Dado que hoy es 15 de octubre
  Y del 1 al 15 de septiembre se gastaron Bs 1.000,00
  Y del 1 al 15 de octubre se gastaron Bs 1.200,00
  Entonces la tarjeta Gastos muestra "+20 %" en rojo

Escenario: Tasa de ahorro oculta
  Dado un mes con ingresos Bs 3.000,00 y gastos Bs 3.500,00
  Entonces la tarjeta Tasa de ahorro no se muestra
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

