---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 3.6 Exactitud monetaria"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 3. Requerimientos no funcionales globales (RNF)]] · ← [[Spec 3.5 Privacidad y seguridad]] · → [[Spec 3.7 Tiempo]]

### 3.6 Exactitud monetaria
- **RNF-18:** Los cálculos DEBEN ser exactos al centavo, con el redondeo de RN-06. No deben acumularse diferencias por redondeo: el interés de las deudas se acumula con precisión exacta y solo se redondea al mostrarlo o al pagarlo.
- **RNF-19:** Los valores históricos (movimientos, períodos cerrados, interés acumulado) NUNCA DEBEN cambiar por movimientos del tipo de cambio ni por cambios de configuración. Los únicos cambios que alteran cifras pasadas son los de RN-11.

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

