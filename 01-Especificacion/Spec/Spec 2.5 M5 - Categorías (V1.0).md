---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.5 M5 - Categorías (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M5"
modulo: "M5"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.4 M4 - Cuentas (V1.0)]] · → [[Spec 2.6 M6 - Transacciones (V1.0)]]

### 2.5 M5 — Categorías (V1.0)

#### 2.5.1 Flujos de usuario
**Categorías precargadas**
- GASTOS:
  - Comida (Supermercado, Restaurantes)
  - Transporte (Micro/Trufi, Taxi/Apps, Combustible)
  - Vivienda (Alquiler, Anticrético)
  - Servicios (Luz, Agua, Gas, Internet, Celular, Comisiones bancarias)
  - Salud, Educación, Ocio, Ropa, Cuidado personal, Regalos, Mascotas, Otros gastos
- INGRESOS: Sueldo, Negocio/Ventas, Mesada, Trabajos independientes, Regalos recibidos, Otros ingresos.
- DEL SISTEMA: "Deudas y préstamos", en gasto y en ingreso, con la subcategoría "Intereses".

**Gestionar**
- El usuario crea, renombra, reordena (arrastrando), cambia el ícono y el color, archiva y restaura categorías de gasto o de ingreso.
- Puede agregar subcategorías (un nivel), mover una subcategoría a otro padre del mismo tipo o convertirla en principal.

**Fusionar**
1. El usuario elige "Fusionar A en B" (mismo tipo).
2. La app muestra cuántos movimientos se moverán y lo que pasará con los presupuestos.
3. Tras la confirmación, todo pasa de A a B y A queda eliminada.

#### 2.5.2 Ciclo de vida y estados

| Desde | Hacia | Condición |
|---|---|---|
| — | Activa | Creación o precarga |
| Activa | Archivada | Si es padre, sus subcategorías se archivan también, con una confirmación que las lista |
| Archivada | Activa | Restauración. Si es padre, el usuario elige qué subcategorías vuelven. Si es una subcategoría con el padre archivado, hay que restaurar el padre o moverla a otro padre activo |
| Activa | Eliminada | Solo sin movimientos y sin presupuesto ni regla recurrente que la use (si no, se pide archivarla); sus atajos se borran con ella. También como origen de una fusión |

- Prohibido: eliminar una categoría con movimientos; cambiar su tipo; convertir en subcategoría una categoría que tiene subcategorías; mover una subcategoría a un padre archivado; renombrar, archivar, eliminar o fusionar (como origen o como destino) la categoría del sistema.

#### 2.5.3 Requerimientos funcionales
- **RF-M5-01:** Gastos e ingresos DEBEN tener categorías separadas. El tipo de una categoría nunca cambia.
- **RF-M5-02:** El nombre DEBE tener de 1 a 30 caracteres y ser único dentro del mismo tipo y el mismo padre, sin distinguir mayúsculas.
- **RF-M5-03:** Un movimiento PUEDE asignarse a una categoría padre o a una subcategoría. El total de un padre incluye el de sus subcategorías.
- **RF-M5-04:** El ícono DEBE elegirse de una galería fija (unos 60) y el color de una paleta de 12 colores con contraste AA en tema claro y oscuro. Las subcategorías heredan el color del padre por defecto.
- **RF-M5-05:** La categoría del sistema "Deudas y préstamos" (gasto e ingreso) y su subcategoría "Intereses" DEBEN estar protegidas. Solo cambian su color y su ícono. Se pueden usar a mano y llevan el distintivo "del sistema".
- **RF-M5-06:** Una categoría archivada NO DEBE ofrecerse al registrar y DEBE conservar su historia.
- **RF-M5-07:** Antes de archivar una categoría en uso, el sistema DEBE listar lo afectado y aplicar:
  - el presupuesto sigue vigente hasta el fin del período actual y pasa a Finalizado;
  - los recurrentes se pausan, con un aviso para elegir otra categoría;
  - los atajos se ocultan y reaparecen si la categoría se restaura.
- **RF-M5-08:** La fusión de A en B DEBE cumplir:
  - solo entre categorías del mismo tipo, con A sin subcategorías y B activa. A y B pueden estar en niveles distintos;
  - ninguna de las dos puede ser la categoría del sistema;
  - si A tiene un cierre de presupuesto pendiente, hay que decidirlo antes de fusionar;
  - mueve a B los movimientos, recurrentes y atajos de A;
  - el presupuesto de A pasa a B si B no tenía; si ambas tenían, se conserva el de B y se elimina el de A, con aviso;
  - A queda eliminada y la fusión no se puede deshacer.
- **RF-M5-09:** Fusionar categorías o mover una subcategoría a otro padre DEBE cambiar el gasto por categoría de los meses pasados en el Inicio y en la lista (RN-11). Los períodos cerrados de los presupuestos no cambian.

#### 2.5.4 Casos borde y excepciones
- **EC-M5-01:** Se crea "comida" existiendo "Comida" en gastos. Se rechaza por duplicado.
- **EC-M5-02:** Se intenta fusionar una categoría con subcategorías. Se pide fusionar o mover primero las subcategorías.
- **EC-M5-03:** Se mueve una subcategoría con presupuesto a otro padre. El gasto del presupuesto del padre anterior deja de incluirla desde ese momento, y la historia de sus períodos cerrados no cambia.
- **EC-M5-04:** Al restaurar una categoría, su nombre ya está en uso en el mismo nivel. Se pide renombrarla.
- **EC-M5-05:** Se convierte una subcategoría en principal y ya existe una principal con ese nombre. Se pide renombrarla antes.
- **EC-M5-06:** Se restaura una subcategoría cuyo padre está archivado. Se pide restaurar el padre o elegir otro padre activo.
- **EC-M5-07:** Se intenta eliminar una categoría sin movimientos que usa un presupuesto o una regla recurrente. Se rechaza y se sugiere archivarla.

#### 2.5.5 Criterios de aceptación
```gherkin
Escenario: Archivar una categoría con presupuesto y recurrente
  Dado "Ocio" con un presupuesto activo y un recurrente "Netflix"
  Cuando el usuario archiva "Ocio" y confirma
  Entonces el presupuesto sigue hasta el fin del período y pasa a Finalizado
  Y el recurrente "Netflix" queda pausado con un aviso para elegir otra categoría

Escenario: Fusionar duplicados
  Dado "Taxis" con 12 movimientos y "Taxi/Apps" con 40
  Cuando el usuario fusiona "Taxis" en "Taxi/Apps"
  Entonces "Taxi/Apps" tiene 52 movimientos
  Y "Taxis" deja de existir

Escenario: Categoría del sistema protegida
  Cuando el usuario intenta archivar "Deudas y préstamos"
  Entonces la acción no está disponible
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

