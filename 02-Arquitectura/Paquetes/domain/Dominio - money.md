---
tipo: "dominio"
fuente: "packages/domain/src/money.ts"
tags:
  - "paquete/domain"
  - "modulo/M6"
actualizado: "2026-10-30"
---

# Dominio · `money.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

**Módulo:** [[M6 - Transacciones]]

> [!quote] Comentario del código
> Decimal constructor used for money arithmetic (ADR-03, constitution §3). High precision so sums never lose cents; half away from zero (RN-06).

## Exportaciones (9)

| Nombre | Tipo | Descripción |
|---|---|---|
| `round2` | function | Rounds to 2 decimals with the half away from zero (RN-06): -0.005 -> -0.01. |
| `parseMoney` | function | Parses decimal text such as "1234.56" into an exact Decimal. |
| `toMoneyString` | function | Formats a value as plain decimal text with exactly 2 decimals ("1234.56"). |
| `sumRounded` | function | Total as the exact sum of already rounded values (RN-06, RNF-18). |
| `moneyEquals` | function |  |
| `isLessThan` | function |  |
| `isLessThanOrEqual` | function |  |
| `isGreaterThan` | function |  |
| `isGreaterThanOrEqual` | function |  |

**Pruebas:** `packages/domain/test/money.test.ts`

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]]
- **Requerimientos no funcionales:** [[Spec 3.6 Exactitud monetaria]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

