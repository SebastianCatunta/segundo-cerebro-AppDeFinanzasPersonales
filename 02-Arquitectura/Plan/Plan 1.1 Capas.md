---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 1.1 Capas"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 1. Visión Arquitectónica y Flujo del Sistema]] · → [[Plan 1.2 Despliegue y flujo principal]]

### 1.1 Capas

| Capa | Tecnología (constitución §2) | Responsabilidad |
|---|---|---|
| Cliente | React + Vite, Tailwind + shadcn/ui, TanStack Query, React Router, react-hook-form | Interfaz, borradores, navegación, estado de cliente, validación previa con los mismos schemas Zod |
| Contratos | Zod en `packages/contracts` | Única definición de entradas, salidas y códigos de error. La usan la web y el API |
| Dominio | TypeScript puro en `packages/domain`, decimal.js, date-fns + @date-fns/tz | Reglas de negocio sin E/S: dinero, conversiones, períodos, interés, recurrencias, formatos. Las comparten web y API |
| API | Node.js + Express, en 4 capas (1.4) | Presentación HTTP, casos de uso y jobs, reglas de dominio, infraestructura (Prisma, Better Auth, integraciones) |
| Persistencia | Prisma + PostgreSQL (Neon) | Esquema, restricciones de integridad, bloqueos, migraciones |
| Integraciones | paralelo.bo (JSON-RPC), BCB (widget público), Resend | Tasas de cambio y correos de la cuenta |

Principios de diseño:
1. **La identidad sale de la sesión.** Ningún endpoint acepta `userId` del cliente (constitución §4).
2. **Las reglas viven una sola vez.** Lo calculable va en `packages/domain`; el API siempre vuelve a validar y es la autoridad.
3. **Toda mutación es una transacción de base de datos.** Los saldos se validan dentro de ella con bloqueo de fila (RNF-10).
4. **La historia no se reescribe.** Los movimientos guardan sus tasas. Los períodos decididos guardan su resultado. El interés nunca se recalcula hacia atrás (constitución §3, RNF-19).

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.3 Concurrencia]] · [[Spec 3.6 Exactitud monetaria]]
- **Spec / Plan / Constitución:** [[Constitución 2. Stack tecnológico]] · [[Constitución 3. Datos y dinero]] · [[Constitución 4. Seguridad]]

