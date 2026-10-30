---
tipo: "feature"
modulo: "M6"
entrega: "V1.0"
aliases:
  - "M6"
  - "Transacciones"
tags:
  - "feature"
  - "modulo/M6"
  - "entrega/V1.0"
actualizado: "2026-10-30"
---

# M6 · Transacciones

> [!summary] Entrega V1.0
> Libro contable de doble asiento (ledger_transaction + ledger_entry, ADR-04): gastos, ingresos, transferencias con comisión y ajustes. Lista por mes con filtros en la URL, totales, detalle, edición, borrado con "Deshacer" de 10 s (ADR-07), borrado y recategorización en lote.

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.6 M6 - Transacciones (V1.0)]]
- **Plan técnico (cómo):** [[Plan 4.6 M6 - Transacciones (V1.0)]]
- **Tareas:** [[Tareas Fase 11 - M6 Transacciones (V1.0)]]
- **Coherencia con el código:** [[Coherencia M6 - Transacciones]]

## ⚙️ Backend

- **Endpoints:** [[API transactions]]
- **Servicios compartidos:** [[Compartido - ledger-hooks]]

## 🖥️ Frontend

- **Features:** [[Web - transactions]]

## 🗄️ Datos

- [[Entidad - LedgerTransaction]]
- [[Entidad - LedgerEntry]]
- [[Entidad - UndoAction]]

## 🧩 Paquetes compartidos

- **Dominio:** [[Dominio - money]]
- **Contratos:** [[Contrato - transactions]]

## 🧪 Pruebas E2E

- Ver [[Pruebas E2E (Playwright)]]

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-04 - Libro contable de doble asiento]] · [[ADR-07 - Deshacer con token]]

