---
tipo: "dominio"
fuente: "packages/domain/src/balance.ts"
tags:
  - "paquete/domain"
  - "modulo/M4"
actualizado: "2026-10-30"
---

# Dominio · `balance.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

**Módulo:** [[M4 - Cuentas]]

> [!quote] Comentario del código
> Signed decimal text: inflow positive, outflow negative.

## Exportaciones (13)

| Nombre | Tipo | Descripción |
|---|---|---|
| `AccountType` | type |  |
| `LedgerEntry` | interface |  |
| `RuleResult` | type |  |
| `CardView` | interface |  |
| `TypeChangeInput` | interface |  |
| `balanceFrom` | function | Initial balance plus the entries dated on or after the initial date (RN-01, RN-12). |
| `validateInitialBalance` | function | Validates the initial balance for the account type (RF-M4-02). |
| `cardView` | function | Card balance as "Debes X" / "A favor X", with available credit against the limit (RF-M4-08). |
| `validateTypeChange` | function | Decides whether an account may change type; the reason explains a rejection (RF-M4-07). |
| `NetWorthAccount` | interface |  |
| `NetWorthRates` | interface |  |
| `NetWorthResult` | interface |  |
| `netWorth` | function | Net worth in the base and the other currency, with the breakdown in the base (RF-M4-10, RN-05, RN-06). |

**Pruebas:** `packages/domain/test/balance.test.ts`

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

