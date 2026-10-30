---
tipo: "feature"
modulo: "M3"
entrega: "V1.0"
aliases:
  - "M3"
  - "Monedas y tipo de cambio"
tags:
  - "feature"
  - "modulo/M3"
  - "entrega/V1.0"
actualizado: "2026-10-30"
---

# M3 · Monedas y tipo de cambio

> [!summary] Entrega V1.0
> Bolivianos y dólares con el tipo de cambio paralelo (paralelo.bo, compra/venta/mediana), el oficial del BCB (TCO) o un valor manual. Historial de tasas, monedas adicionales con tasa propia, brecha paralelo-oficial y la tasa guardada en cada movimiento: la historia no se reescribe (constitución §3, ADR-06).

## 📄 Documentación SDD

- **Especificación (qué y porqué):** [[Spec 2.3 M3 - Monedas y tipo de cambio (V1.0)]]
- **Plan técnico (cómo):** [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]]
- **Tareas:** [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]]
- **Coherencia con el código:** [[Coherencia M3 - Monedas y tipo de cambio]]

## ⚙️ Backend

- **Endpoints:** [[API fx]], [[API currencies]]
- **Servicios compartidos:** [[Compartido - currency-usage]]
- **Jobs:** [[Job - fx]]
- **Integraciones:** [[Integración - paralelo.bo]], [[Integración - BCB]]

## 🖥️ Frontend

- **Features:** [[Web - fx]]

## 🗄️ Datos

- [[Entidad - MarketRate]]
- [[Entidad - Currency]]
- [[Entidad - UserFxEvent]]

## 🧩 Paquetes compartidos

- **Dominio:** [[Dominio - fx]]
- **Contratos:** [[Contrato - fx]]

## 🧪 Pruebas E2E

- Ver [[Pruebas E2E (Playwright)]]

Más en [[Pruebas del API]] y [[Pruebas E2E (Playwright)]].

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-06 - Fuentes de tasas de cambio]]
- **Spec / Plan / Constitución:** [[Constitución 3. Datos y dinero]]

