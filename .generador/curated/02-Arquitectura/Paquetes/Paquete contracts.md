---
tipo: paquete
tags: [paquete/contracts, arquitectura]
---
# 📦 Paquete `@finanzas/contracts`

↑ [[Arquitectura general]] · [[Monorepo pnpm]]

**Única definición** de las entradas, salidas y códigos de error del sistema, escrita con **Zod** ([[Plan 1.1 Capas]]). La usan:

- **El API**, para validar cada cuerpo con `validate(schema)` y armar sus DTO ([[API - Middlewares]], [[API - Presentadores]]).
- **La web**, para validar los formularios (react-hook-form + `@hookform/resolvers`) y las respuestas del cliente HTTP tipado ([[Web - lib (utilidades)]]).

Los montos y las tasas viajan como **texto decimal** (`"1234.56"`, [[ADR-03 - Dinero como decimal]]). Las creaciones llevan un `id` UUID v7 generado en el cliente ([[ADR-11 - Idempotencia con UUID v7]]).

## Archivos

| Archivo | Contenido |
|---|---|
| [[Contrato - common]] | Primitivas: `Money`, `LocalDate`, `Uuid`, `CurrencyCode`, `Note`… |
| [[Contrato - errors]] | Catálogo `ErrorCode` → estado HTTP (problem+json, [[ADR-09 - Errores problem+json]]) |
| [[Contrato - releases]] | Entregas y `isReleased(module, release)` ([[ADR-18 - Entregas con RELEASE]]) |
| [[Contrato - catalogs]] | Colores, íconos y categorías precargadas |
| [[Contrato - auth]] | [[M1 - Acceso y cuenta]] |
| [[Contrato - fx]] | [[M3 - Monedas y tipo de cambio]] |
| [[Contrato - accounts]] | [[M4 - Cuentas]] |
| [[Contrato - categories]] | [[M5 - Categorías]] |
| [[Contrato - transactions]] | [[M6 - Transacciones]] |
| [[Contrato - register]] | [[M7 - Registrar]] |
| [[Contrato - dashboard]] | [[M8 - Inicio (dashboard)]] |
| [[Contrato - settings]] | [[M9 - Ajustes y personalización]] |
| [[Contrato - onboarding]] | [[M10 - Onboarding]] |
| [[Contrato - budgets]] | [[M11 - Presupuestos]] |
| [[Contrato - goals]] | [[M12 - Metas de ahorro]] |
| [[Contrato - debts]] | [[M13 - Deudas y préstamos]] |
| [[Contrato - recurring]] | [[M14 - Recurrentes]] |
| [[Contrato - notifications]] | [[M15 - Recordatorios y avisos]] |

Pruebas en [[Pruebas de los paquetes]]. Tareas: [[Tareas Fase 2 - Contratos y catálogos compartidos]].
