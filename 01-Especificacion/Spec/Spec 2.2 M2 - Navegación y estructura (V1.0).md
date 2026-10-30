---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.2 M2 - Navegación y estructura (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M2"
modulo: "M2"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.1 M1 - Acceso y cuenta de usuario (V1.0)]] · → [[Spec 2.3 M3 - Monedas y tipo de cambio (V1.0)]]

### 2.2 M2 — Navegación y estructura (V1.0)

#### 2.2.1 Flujos de usuario
**Celular (menos de 1024 px de ancho)**
1. La barra inferior muestra cinco pestañas: Inicio · Movimientos · **Registrar** (centro) · Cuentas · Más.
2. Registrar es una pestaña como cualquier otra.
3. "Más" abre una pantalla completa con tres secciones:
   - PLANIFICAR: Presupuestos, Metas de ahorro, Deudas y préstamos, Recurrentes;
   - ORGANIZAR: Categorías, Tipo de cambio (con la tasa en uso);
   - CUENTA: Perfil, Ajustes, Cerrar sesión.
4. Las secciones sin módulos liberados se ocultan (en la V1.0, PLANIFICAR no aparece).

**Escritorio (1024 px o más)**
1. Una barra lateral muestra todos los módulos y no existe "Más".
2. El orden es: Inicio, Movimientos, Registrar, Cuentas, y luego las secciones PLANIFICAR, ORGANIZAR y CUENTA.
3. La barra lateral se puede contraer a solo íconos. Con el puntero encima o con el foco del teclado se ve el nombre.

**Cabecera (todos los tamaños)**
- En las pantallas internas (las que no son la raíz de una pestaña), un botón "Volver" antes del título.
- El logo de la app, antes del título.
- El título de la pantalla.
- Una ficha con el dólar en Bs de la referencia en uso (por ejemplo "$ 10,25"), con un distintivo si es el valor manual, o "$ —" si no hay ninguna tasa. Lleva al panel de Tipo de cambio.
- Desde la V1.1, la campana con el número de avisos sin leer.

#### 2.2.2 Ciclo de vida y estados

| Estado de la app | Qué ve el usuario | Sale cuando |
|---|---|---|
| Normal | La app completa | — |
| Sin conexión | Una pantalla de bloqueo "Sin conexión" tapa toda la app, incluido Registrar. Los borradores de todos los formularios se conservan debajo | Vuelve la conexión: el bloqueo desaparece solo y los datos se actualizan |
| Sesión vencida | "Tu sesión venció, vuelve a entrar" con el inicio de sesión | Inicia sesión: vuelve a la misma pantalla con sus borradores |

#### 2.2.3 Requerimientos funcionales
- **RF-M2-01:** Por debajo de 1024 px, el sistema DEBE usar la barra inferior de 5 pestañas con Registrar en el centro. Desde 1024 px, la barra lateral con todos los módulos.
- **RF-M2-02:** "Más" DEBE existir solo en el formato de barra inferior.
- **RF-M2-03:** El sistema DEBE mostrar únicamente los módulos de las entregas liberadas.
- **RF-M2-04:** Cada pestaña DEBE recordar su estado (mes, filtros, posición, detalle abierto) al cambiar de pestaña. Ese estado vive en el dispositivo mientras la app esté abierta y no se sincroniza entre dispositivos.
- **RF-M2-05:** Tocar la pestaña activa DEBE llevar al inicio de esa pestaña. En Registrar no borra el borrador.
- **RF-M2-06:** El botón Atrás del navegador o del celular DEBE funcionar en todas las pantallas.
- **RF-M2-07:** Sin conexión, el sistema DEBE bloquear toda la app, incluido Registrar, con una pantalla de aviso y liberarla sola al reconectar, actualizando los datos. Es una excepción aceptada al principio rector: no existe modo sin conexión.
- **RF-M2-08:** Con la sesión vencida, el sistema DEBE pedir que el usuario inicie sesión y, tras hacerlo, volver a la misma pantalla con los borradores intactos.
- **RF-M2-09:** El estado contraído de la barra lateral DEBE guardarse en la cuenta del usuario (M9).
- **RF-M2-10:** Todo formulario con datos sin guardar DEBE conservarlos como borrador en el mismo dispositivo al cambiar de pestaña, al vencer la sesión o al quedar bloqueado sin conexión. El borrador se descarta con "Limpiar" o "Cancelar", al cerrar la app o la sesión, o si entra otro usuario.
- **RF-M2-11:** Al restaurar un borrador, o al aplicar un atajo, cuya cuenta o categoría ya no está activa, ese campo DEBE vaciarse y marcarse para elegir otra.
- **RF-M2-12:** Las secciones de "Más" y de la barra lateral sin módulos liberados DEBEN ocultarse.
- **RF-M2-13:** Toda pantalla que no sea la raíz de una pestaña DEBE mostrar en la cabecera un botón "Volver", antes del título. Lleva a la pantalla anterior de la app; si el usuario llegó directo por un enlace, a la pantalla de la que cuelga. En el formato de barra inferior, las pantallas de "Más" (Presupuestos, Metas, Deudas, Recurrentes, Categorías, Tipo de cambio, Perfil y Ajustes) cuelgan de "Más" y también lo llevan; en la barra lateral son raíces y no lo llevan. Volver NO descarta los borradores (RF-M2-10).
- **RF-M2-14:** La app DEBE mostrar su logo como ícono de la pestaña del navegador, en las pantallas de acceso y registro, y en la cabecera de cada pantalla, antes del título. El diseño y la disposición exacta se registran en `docs/design-direction.md` al incorporar el logo.

#### 2.2.4 Casos borde y excepciones
- **EC-M2-01:** Otra persona inicia sesión tras el vencimiento de la sesión en el mismo dispositivo. El borrador del usuario anterior se descarta.
- **EC-M2-02:** La conexión se pierde a mitad de un guardado. Aparece el bloqueo. Al reconectar, el usuario ve si el movimiento se guardó o no, y nunca se guarda dos veces (RN-10).
- **EC-M2-03:** El ancho de la pantalla cambia al girar la tablet. La navegación cambia de formato sin perder el estado.
- **EC-M2-04:** Se abre una pantalla interna desde un enlace directo, sin pantallas previas en la app. "Volver" lleva a la pantalla de la que cuelga y no saca al usuario de la app.

#### 2.2.5 Criterios de aceptación
```gherkin
Escenario: Registrar en el centro de la barra en el celular
  Dado un usuario en un celular de 360 px de ancho
  Cuando abre la app
  Entonces ve la barra inferior "Inicio · Movimientos · Registrar · Cuentas · Más"
  Y Registrar ocupa la posición central

Escenario: Sin "Más" en escritorio
  Dado un usuario en una pantalla de 1280 px
  Cuando abre la app
  Entonces ve la barra lateral con todos los módulos
  Y no existe la opción "Más"

Escenario: Bloqueo sin conexión conserva el borrador
  Dado que el usuario escribió "35" en Registrar
  Cuando pierde la conexión
  Entonces una pantalla de bloqueo tapa la app
  Y al volver la conexión encuentra "35" en Registrar

Escenario: Volver desde una pantalla interna
  Dado un usuario en el detalle de una cuenta, a la que llegó desde la lista de Cuentas
  Cuando toca "Volver" en la cabecera
  Entonces regresa a la lista de Cuentas
  Y la lista conserva su posición

Escenario: El logo acompaña a la app
  Dado un usuario con la app abierta
  Entonces la pestaña del navegador muestra el logo de la app
  Y la cabecera de cada pantalla muestra el logo antes del título
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M9 - Ajustes y personalización]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

