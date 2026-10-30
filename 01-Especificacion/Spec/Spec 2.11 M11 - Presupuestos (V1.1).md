---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.11 M11 - Presupuestos (V1.1)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M11"
modulo: "M11"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.10 M10 - Onboarding (V1.0)]] · → [[Spec 2.12 M12 - Metas de ahorro (V1.1)]]

### 2.11 M11 — Presupuestos (V1.1)

#### 2.11.1 Flujos de usuario
**Crear un presupuesto**
1. En Presupuestos, el usuario toca "Nuevo presupuesto".
2. Elige el alcance: una categoría o una subcategoría de gasto, o "General" (todos los gastos). No se puede presupuestar "Deudas y préstamos"; sí su subcategoría "Intereses".
3. Define:
   - el monto mensual y la moneda;
   - el día de inicio del período, de 1 a 28 (1 por defecto);
   - la acción por defecto al cierre: descartar (por defecto) o arrastrar;
   - hasta 3 umbrales de alerta (80 % y 100 % por defecto).
4. Guarda. Ve la barra con el gasto que ya existe en el período actual.

**Seguir el período:** el detalle muestra:
- la barra (gastado / disponible) con la marca "hoy deberías llevar X";
- lo gastado y lo que queda;
- "Puedes gastar X/día durante N días" (no se muestra si el disponible es 0 o negativo), "Vas X por encima del ritmo" o "Superado por X";
- el desglose "Monto ± arrastre = disponible";
- el historial de los últimos 12 períodos.

**Decidir el cierre de un período**
1. Al cerrar un período llega un aviso a la bandeja y aparece una tarjeta en el presupuesto: "Comida cerró octubre: sobraron Bs 150,00" (o "te pasaste por Bs 100,00"). El sobrante o exceso es disponible − gastado.
2. Si sobró, el usuario reparte el sobrante entre:
   - "Arrastrar al período siguiente";
   - "Enviar a meta", eligiendo la meta y la cuenta de la que se aparta;
   - "Descartar".

   La suma debe dar exactamente el sobrante.
3. Si se pasó, elige entre "Arrastrar" (resta del período siguiente) y "Absorber" (se perdona).
4. Aplica. Si no decide en 7 días, se aplica la acción por defecto del presupuesto. Ante un exceso, "descartar" equivale a "absorber".

#### 2.11.2 Ciclo de vida y estados

**Presupuesto**

| Desde | Hacia | Condición |
|---|---|---|
| — | Activo | Creación |
| Activo | Pausado | Acción del usuario. No tiene períodos: no se renueva, no alerta, los gastos de la pausa no cuentan y el arrastre queda congelado |
| Pausado | Activo | Reanudar. Empieza el período que contiene hoy, con el arrastre congelado y contando el gasto desde el inicio de ese período |
| Activo o Pausado | Finalizado | Su categoría se archivó. Termina al cierre del período actual. Ese último cierre tiene decisión, pero sin "Arrastrar" |
| Cualquiera (salvo Eliminado) | Eliminado | Acción del usuario con confirmación. Desaparece con su historia |

- Estados finales: Finalizado y Eliminado.

**Cierre de período:** Pendiente de decisión → Decidido (por el usuario) | Decidido por defecto (a los 7 días).

#### 2.11.3 Requerimientos funcionales
- **RF-M11-01:** DEBE existir como máximo un presupuesto activo o pausado por categoría o subcategoría de gasto, más uno general opcional.
- **RF-M11-02:** Los presupuestos se anidan. Un gasto cuenta en el presupuesto de su subcategoría, en el de su padre y en el general. Si los hijos suman más que el padre, se avisa sin bloquear.
- **RF-M11-03:** El gasto de un presupuesto DEBE sumar los gastos de su alcance dentro del período, excluyendo lo que indica RN-02, convertidos a la moneda del presupuesto con la tasa guardada de cada movimiento.
- **RF-M11-04:** El período DEBE empezar el día elegido, que va de 1 a 28.
- **RF-M11-05:** Disponible = monto del período + arrastre (positivo o negativo). Un período puede empezar ya superado: se muestra "Superado por X" desde el inicio.
- **RF-M11-06:** El monto, la acción por defecto y los umbrales DEBEN aplicarse al período actual al editarlos. Los períodos pasados conservan su monto.
- **RF-M11-07:** Un cambio del día de inicio DEBE aplicarse desde el próximo período: el período en curso se alarga hasta el día anterior al nuevo día de inicio, con el monto de un mes, y se avisa su fecha de fin. La moneda NO DEBE cambiar.
- **RF-M11-08:** En el cierre, sobrante o exceso = disponible − gastado. El sobrante DEBE repartirse entre arrastrar, enviar a meta y descartar, con suma exacta. El exceso DEBE arrastrarse o absorberse. Lo arrastrado es el arrastre completo del período siguiente: reemplaza al anterior, no se suma.
- **RF-M11-09:** "Enviar a meta" DEBE:
  - crear un apartado en la cuenta que elija el usuario, dentro de su saldo libre (M12). El monto se convierte de la moneda del presupuesto a la de la cuenta con la referencia vigente;
  - si la meta tiene cuenta dedicada, ofrecer como alternativa una transferencia real hacia ella;
  - estar disponible solo en el presupuesto general o, si no existe, en los presupuestos de categorías principales. Las subcategorías solo arrastran o descartan;
  - desaparecer de la tarjeta si la meta se elimina o se archiva con el cierre pendiente.
- **RF-M11-10:** Si en 7 días no hay decisión, el sistema DEBE aplicar la acción por defecto del presupuesto. Ante un exceso, "descartar" equivale a "absorber". Si el sistema estuvo caído al vencer un período, el cierre se genera al volver y sus 7 días cuentan desde ese momento.
- **RF-M11-11:** Los movimientos tardíos (cargados, editados o eliminados con fecha de un período ya cerrado, sin límite de antigüedad) NO DEBEN reabrir la decisión. Su efecto depende del cierre:
  - decisión pendiente: se recalcula el sobrante o exceso de la tarjeta;
  - la decisión incluyó arrastrar: la diferencia va al arrastre del período en curso, explicada como "Ajuste por movimientos tardíos de [período]";
  - se decidió solo descartar, absorber o enviar a meta: no tiene efecto;
  - presupuesto pausado, finalizado o eliminado: no tiene efecto.
- **RF-M11-12:** "Reiniciar arrastre" DEBE poner el acumulado en 0, con una confirmación que muestra el monto.
- **RF-M11-13:** Los umbrales (de 0 a 3, entre 1 % y 150 %) DEBEN medirse sobre el monto del período, no sobre el disponible:
  - cada uno avisa una sola vez por período (RN-10);
  - si un presupuesto se crea, o un período empieza, ya por encima de umbrales, solo se avisa el más alto cruzado;
  - un presupuesto pausado no alerta.
- **RF-M11-14:** Un presupuesto superado DEBE seguir contando gastos y mostrarse como superado.

#### 2.11.4 Casos borde y excepciones
- **EC-M11-01:** El arrastre negativo supera el monto del período. El período empieza superado y la barra lo muestra.
- **EC-M11-02:** En el cierre se envía a una meta más que el saldo libre de la cuenta elegida. Se rechaza y se pide otra cuenta o un monto menor.
- **EC-M11-03:** Se elimina o se archiva la meta elegida mientras el cierre está pendiente. Esa opción desaparece de la tarjeta.
- **EC-M11-04:** Se archiva la categoría con una decisión de cierre pendiente. La decisión sigue disponible hasta los 7 días.
- **EC-M11-05:** Se elimina un gasto de un período cerrado cuya decisión incluyó arrastrar. El arrastre del período en curso sube por ese monto (RF-M11-11). Si la decisión fue descartar, no cambia nada.
- **EC-M11-06:** Se intenta crear un segundo presupuesto para la misma categoría. Se rechaza y se ofrece editar el existente.
- **EC-M11-07:** Se cambia el día de inicio de 1 a 15 durante el período del 1 al 31 de octubre. Ese período se alarga hasta el 14 de noviembre con el monto de un mes, y el siguiente empieza el 15 de noviembre.
- **EC-M11-08:** Se reanuda a mitad de período un presupuesto pausado. El período que contiene hoy cuenta el gasto desde su inicio, con el arrastre congelado.
- **EC-M11-09:** Se archiva la categoría de un presupuesto. Al cerrar su último período, la decisión ofrece descartar o enviar a meta (o absorber, si hubo exceso), pero no arrastrar.

#### 2.11.5 Criterios de aceptación
```gherkin
Escenario: Repartir un sobrante
  Dado el presupuesto "Comida" de Bs 800,00 que cerró octubre con Bs 650,00 gastados
  Cuando el usuario arrastra 50,00 y envía 100,00 a la meta "Viaje" desde el Banco
  Entonces noviembre tiene disponible Bs 850,00
  Y la meta "Viaje" suma un apartado de Bs 100,00 en el Banco

Escenario: Exceso arrastrado
  Dado el presupuesto "Ocio" de Bs 300,00 que cerró con Bs 400,00 gastados
  Cuando el usuario elige "Arrastrar"
  Entonces el período siguiente tiene disponible Bs 200,00

Escenario: Decisión por defecto
  Dado un cierre pendiente con acción por defecto "Descartar"
  Cuando pasan 7 días sin decisión
  Entonces el resultado se descarta
  Y el período en curso no tiene arrastre de ese cierre

Escenario: Umbral avisa una sola vez
  Dado un presupuesto con umbral 80 % ya cruzado este período
  Cuando el usuario elimina un gasto, baja del 80 % y luego lo vuelve a cruzar
  Entonces no se genera un segundo aviso del 80 %
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

