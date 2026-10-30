---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 3.9 Auditoría y retención"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 3. Requerimientos no funcionales globales (RNF)]] · ← [[Spec 3.8 Disponibilidad y tolerancia a fallos]] · → [[Spec 3.10 Límites por usuario]]

### 3.9 Auditoría y retención
- **RNF-24:** En la V1 no existe un historial de ediciones por movimiento.
- **RNF-25:** Los eventos de seguridad (cambio de contraseña y eliminación de la cuenta) DEBEN notificarse al dueño por correo.
- **RNF-26:** Retención:
  - avisos: 90 días (salvo los que esperan decisión);
  - registros sin confirmar: 7 días;
  - datos de una cuenta eliminada: se borran de inmediato.
- **RNF-27:** La fuente "paralelo.bo" DEBE mostrarse junto a sus datos, como exige su licencia de uso.
