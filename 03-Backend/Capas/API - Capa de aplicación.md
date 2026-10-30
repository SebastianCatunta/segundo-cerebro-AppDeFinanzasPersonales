---
tipo: "backend"
tags:
  - "backend/aplicacion"
actualizado: "2026-10-30"
---

# Capa 2 · Aplicación (`application/`)

↑ [[API - Visión general]] · anterior: [[API - Capa de presentación]] · usa: [[Paquete domain]] · la implementa: [[API - Capa de infraestructura]]

Aquí viven los **casos de uso**. **Puede depender** del dominio, de los tipos de `packages/contracts` y de sus propios puertos. **No puede importar** `express`, `@prisma/client` ni `better-auth` (`application-no-framework`, [[Config - dependency-cruiser]]).

## Contenido

| Carpeta | Qué hay | Notas |
|---|---|---|
| `services/` | Un servicio por módulo, con un método por caso de uso. Cada uno abre su transacción con `uow.run(fn, { userLock })` | sección "Servicio" de cada nota `API <grupo>` |
| `shared/` | Servicios que comparten varios módulos dentro de la misma transacción | ver abajo |
| `jobs/` | El tick y los jobs de cada módulo | [[Flujo - Tick de jobs]] |
| `ports/` | Interfaces que implementa la infraestructura | [[API - Puertos]] |
| `errors.ts` | `AppError(code, data)`: el estado HTTP sale de `ErrorCode` | [[Contrato - errors]] |

## Servicios compartidos

| Servicio | Para qué |
|---|---|
| [[Compartido - balance-guard]] | Valida los saldos negativos y los apartados de metas antes de mover dinero |
| [[Compartido - ledger-hooks]] | Lo que reacciona a un cambio del libro: presupuestos, hitos y avisos |
| [[Compartido - budget-ledger-hook]] | Ajustes tardíos y umbrales de presupuestos |
| [[Compartido - notification-emitter]] | Crea avisos sin duplicar el mismo evento (RN-10) |
| [[Compartido - currency-usage]] | Indica si una moneda sigue en uso antes de desactivarla |
| [[Compartido - goal-milestones]] | Hitos de avance de las metas |
| [[Compartido - recurring-generator]] | Genera las ocurrencias recurrentes |
| [[Compartido - email-links]] | Tokens de confirmación y recuperación (solo se guarda su SHA-256) |
| [[Compartido - login-throttle]] | Espera progresiva tras intentos fallidos |
| [[Compartido - limits]] | Límites por usuario (RNF-28 → `LIMIT_REACHED`) |
| [[Compartido - user-bootstrap]] | Datos iniciales de un usuario nuevo |

## Reglas

- **Transacciones solo aquí.** Los repositorios llegan ya ligados a la transacción y al `userId` ([[API - Unit of Work y aislamiento]]).
- **Tiempo y ids inyectados:** los puertos `Clock` e `IdGenerator` permiten probar sin depender del reloj real.
- **Pruebas:** unitarias con repositorios en memoria y un `Clock` falso, más integración con la infraestructura real para probar la concurrencia.

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.10 Límites por usuario]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

