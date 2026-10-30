---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.2 M2 - Navegación y estructura (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M2"
modulo: "M2"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · → [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]]

### 4.2 M2 — Navegación y estructura (V1.0)

#### 4.2.1 Contratos

```ts
HealthOutput = void                                         // GET /api/health → 204, público
ReadyOutput  = void                                         // GET /api/health/ready → 204 o 503, público
UpdateSettingsInput.pick({ sidebarCollapsed: true })        // definido en M9
ModuleRelease = Record<ModuleKey, '1.0'|'1.1'|'1.2'>        // packages/contracts/releases.ts
```

#### 4.2.2 Endpoints
- `GET /api/health`: `204`, sin sesión. No toca la base de datos. Lo usan la detección sin conexión y el *health check* de Render.
- `GET /api/health/ready`: sin sesión. Hace `SELECT 1` en la base de datos con un límite de 2 s y responde `204` si contesta o `503` sin cuerpo si no, sin detalles internos (constitución §4). La presentación lo recibe como un puerto `ReadinessProbe` (`application/ports/readiness.ts`), implementado en `infrastructure/persistence/readiness.ts` (ADR-19). Lo usan las pruebas de humo de `deploy.yml` para verificar los enlaces API → BD y web → API → BD (1.2).
- `PATCH /api/settings {sidebarCollapsed}` (RF-M2-09). El contrato completo está en M9.
- `releaseGate(module)`: middleware del API. Si el módulo no está en `RELEASE`, responde `RELEASE_NOT_AVAILABLE 404` (RF-M2-03).

#### 4.2.3 Ciclo de vida y concurrencia

| Estado de la app | Mecanismo |
|---|---|
| Normal → Sin conexión | Evento `offline`, o error de red en `api-client` → `online.setOffline()` → `onlineManager.setOnline(false)` (pausa TanStack Query) + `<OfflineOverlay>` sin desmontar nada (RF-M2-07). |
| Sin conexión → Normal | Evento `online`, o `GET /api/health` (cada 5 s mientras dura) devuelve 204 → `setOnline(true)` → `queryClient.invalidateQueries()`. Una mutación que estaba en vuelo se reenvía una vez con el mismo `id` (ADR-11): el usuario ve "Guardado" o el error real, nunca un duplicado (EC-M2-02). |
| Normal → Sesión vencida | `SESSION_EXPIRED` → `<SessionExpiredDialog>` con SignInForm encima de la pantalla. Mismo usuario → se cierra y se reintentan las consultas. Otro usuario (EC-M2-01) → `drafts.clearAll()`, `queryClient.clear()`, navega a `/`. |

- **Disposición (EC-M2-03):** `<BottomTabBar>` (`lg:hidden`) y `<Sidebar>` (`hidden lg:flex`) están siempre montadas en el mismo árbol. Girar la tablet no pierde estado.
- **Memoria por módulo (RF-M2-04, RF-M2-05):** `ui-store.tabMemory[moduleKey] = { url, scrollY }`, guardada en sessionStorage.
  - En el celular, "Más" recuerda el último módulo abierto desde ella.
  - Tocar la pestaña activa lleva a la raíz del módulo; en Registrar no borra el borrador.
- **Botón Atrás (RF-M2-06):** los detalles son rutas hijas, y los diálogos usan `useBackToClose`.
- **Borradores (RF-M2-10, RF-M2-11):**

```ts
function useDraft<T extends FieldValues>(formKey: string, form: UseFormReturn<T>, opts: {
  schema: ZodType<Partial<T>>;
  validateRefs?: (v: Partial<T>) => Partial<Record<keyof T, 'reselect'>>;   // cuenta o categoría no activa → se vacía
}): { clear(): void; restoredWithIssues: boolean };
// clave sessionStorage: draft:{userId}:{formKey} · se guarda 300 ms después del último cambio
// se borra al guardar, con Limpiar o Cancelar, al cerrar sesión y cuando entra otro usuario
```

#### 4.2.4 UI y estado
- **Árbol:**
  - `<AppShell>` contiene `<Header>` (`<BackButton>` en las pantallas internas, `<BrandMark>`, título, `<RateChip>`, `<BellButton>` desde V1.1) y `<Sidebar>` (lg+, contraíble, con tooltips y foco por teclado).
  - Dentro, `<main><Outlet/></main>`, `<BottomTabBar>` (menos de lg) y `<MoreMenu>` en `/mas`, con PLANIFICAR, ORGANIZAR y CUENTA y las secciones vacías ocultas (RF-M2-12).
  - Encima de todo: `<OfflineOverlay>`, `<SessionExpiredDialog>` y `<UndoToast>`.
- **Guardas:** `RequireSession` → `RequireOnboardingDone` → `ReleaseGate(module)`.
- **Volver (RF-M2-13, EC-M2-04):** `parentOf(pathname)`, una función pura en `layout/route-parents.ts`, devuelve la pantalla de la que cuelga una ruta, o `null` en las raíces: `/movimientos/:id` → `/movimientos`; `/cuentas/nueva` y `/cuentas/:id` → `/cuentas`; `/cuentas/:id/editar` → `/cuentas/:id`; `/categorias/nueva`, `/categorias/archivadas` y `/categorias/:id/editar` → `/categorias`; `/presupuestos/:id`, `/metas/:id` y `/deudas/:id` → su lista; `/perfil/eliminar` → `/perfil`; `/ajustes/*` → `/ajustes`; y, solo por debajo de 1024 px, las raíces de "Más" (`/categorias`, `/tipo-de-cambio`, `/presupuestos`, `/metas`, `/deudas`, `/recurrentes`, `/perfil`, `/ajustes`) → `/mas`. `<BackButton>` hace `navigate(-1)` cuando la entrada anterior del historial es de la app (`history.state.idx > 0`) y `navigate(padre)` cuando no. Tiene objetivo táctil de 44 px y `aria-label`. Los "Volver a…" propios de cada pantalla se retiran, porque la cabecera los reemplaza.
- **Marca (RF-M2-14):** `<BrandMark>` (`components/brand-mark.tsx`) muestra el logo de la app con su texto alternativo, en la cabecera (24 px) y centrado sobre el título en las pantallas públicas (48 px). El ícono de la pestaña (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`) vive en `apps/web/public/` y se enlaza en `index.html`. Los archivos de diseño y la disposición confirmada se registran en `docs/design-direction.md`, sección "Marca".
- **Estado:** `ui-store` (useSyncExternalStore) con `offline`, `sessionExpired`, `tabMemory` y `undo`. `<RateChip>` y `<BellButton>` se refrescan con `background: true`.

---

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]] · [[ADR-19 - Backend en capas]]
- **Spec / Plan / Constitución:** [[Constitución 4. Seguridad]]

