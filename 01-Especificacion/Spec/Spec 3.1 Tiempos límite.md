---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 3.1 Tiempos límite"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 3. Requerimientos no funcionales globales (RNF)]] · → [[Spec 3.2 Compatibilidad y accesibilidad]]

### 3.1 Tiempos límite
- **RNF-01:** Registrar un movimiento DEBE tomar menos de 10 segundos desde abrir la app (flujo M7).
- **RNF-02:** Guardar un movimiento DEBE tardar menos de 1 segundo en el 95 % de los casos.
- **RNF-03:** El Inicio DEBE cargar en menos de 2 segundos con 5.000 movimientos, en una conexión 4G.
- **RNF-04:** La actualización del tipo de cambio NUNCA DEBE bloquear ni demorar el uso de la app.
- Los tiempos de RNF-01 a RNF-03 se miden en un celular de gama media con red 4G.

---
## 🔗 Relacionado

- **Módulos:** [[M7 - Registrar]]

