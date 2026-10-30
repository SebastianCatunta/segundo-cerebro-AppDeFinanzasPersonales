---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 3.3 Concurrencia"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 3. Requerimientos no funcionales globales (RNF)]] · ← [[Spec 3.2 Compatibilidad y accesibilidad]] · → [[Spec 3.4 Idempotencia]]

### 3.3 Concurrencia
- **RNF-08:** El mismo usuario PUEDE usar varios dispositivos a la vez. Ante ediciones simultáneas del mismo dato, gana la última guardada.
- **RNF-09:** Una acción sobre un dato eliminado en otro dispositivo DEBE informar que el dato ya no existe, sin guardar nada.
- **RNF-10:** Las validaciones de saldo (negativos y apartados) DEBEN evaluarse con el saldo vigente al momento de guardar, no con el que se veía en pantalla.
