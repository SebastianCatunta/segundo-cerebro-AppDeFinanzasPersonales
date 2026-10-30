---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 18 - M15 Bandeja de avisos (V1.1)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M15"
fase: "18"
tareas: "5"
modulo: "M15"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 17 - Cierre de V1.0 rendimiento, accesibilidad y despliegue]] · → [[Tareas Fase 19 - M12 Metas de ahorro (V1.1)]]

### Fase 18 — M15 Bandeja de avisos (V1.1)

- [x] **`TASK-175`: Contratos de avisos (M15)**
  - **Dependencias:** Requiere TASK-023
  - **Trazabilidad SDD:** plan §4.15.1; RF-M15-01, RF-M15-02, RF-M15-08
  - **Archivos en Alcance:**
    - `packages/contracts/src/notifications.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/notifications.test.ts`
  - **Especificación de Implementación:** `NotificationType`, `NotificationDto`, `NotificationsQuery`, `PreferencesInput` y `DEFAULT_PREFERENCES` (tabla de plan §4.15.1).
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M15-08`: `NotificationType` tiene exactamente los 6 tipos del plan y ninguno de "cambio fuerte del dólar".
    - `RF-M15-02`: los valores por defecto coinciden con la tabla (`log_day` y `goal_progress` desactivados; `log_day` a las 21).
    - `PreferencesInput` limita la hora a 0–23 y la anticipación a 0–7.

- [x] **`TASK-176`: `NotificationEmitter`: avisos únicos por evento y decisiones**
  - **Dependencias:** Requiere TASK-120, TASK-175
  - **Trazabilidad SDD:** plan §4.15.3 (un solo aviso por evento, generación por eventos, entrega); RN-10, RF-M15-01, RF-M15-03, RF-M15-04, RF-M15-07, RNF-12
  - **Archivos en Alcance:**
    - `apps/api/src/application/shared/notification-emitter.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/notification.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/notification-preference.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/notification-emitter.test.ts`
  - **Especificación de Implementación:** `emit(tx, userId, { type, eventKey, params, targetRoute, decision? })` no crea nada si el tipo no está liberado o su preferencia está desactivada. Si no, hace `INSERT … ON CONFLICT (user_id, event_key) DO NOTHING`. `resolveDecision(tx, userId, kind, ref)` pasa a `resolved` los avisos que esperan esa decisión. Nunca escribe en `email_outbox`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RN-10` / `RNF-12`: emitir dos veces la misma `eventKey` deja un solo aviso.
    - `RF-M15-03`: con la preferencia desactivada no se crea el aviso.
    - `RF-M15-07`: con `RELEASE=1.1`, un `log_day` no se crea.
    - `RF-M15-01`: emitir no inserta filas en `email_outbox`.
    - `resolveDecision` deja el aviso en `resolved`.

- [x] **`TASK-177`: Servicio y endpoints de la bandeja**
  - **Dependencias:** Requiere TASK-176
  - **Trazabilidad SDD:** plan §4.15.2 (endpoints); RF-M15-06, RF-M15-12, RNF-14
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/notifications.service.ts`
    - `apps/api/src/presentation/routes/notifications.routes.ts`
    - `apps/api/src/presentation/controllers/notifications.controller.ts`
    - `apps/api/src/presentation/presenters/notifications.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/notifications.test.ts`
  - **Especificación de Implementación:** `GET /api/notifications` por cursor, del más nuevo al más viejo; `GET /api/notifications/unread-count`; `POST /:id/read`; `POST /read-all`; `DELETE /:id`. Todo detrás de `releaseGate` de la bandeja.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M15-06`: el contador cuenta solo los no leídos.
    - `RF-M15-12`: "marcar todo como leído" y eliminar incluyen los avisos que esperan una decisión, y la decisión sigue en su módulo.
    - `RNF-14`: el usuario B recibe 404 con un aviso de A.
    - Con `RELEASE=1.0`, las rutas dan `RELEASE_NOT_AVAILABLE`.

- [x] **`TASK-178`: Job `maintenance`: retención de avisos**
  - **Dependencias:** Requiere TASK-063, TASK-176
  - **Trazabilidad SDD:** plan §4.15.3 (retención), plan §3.9; RF-M15-05, RNF-26
  - **Archivos en Alcance:**
    - `apps/api/src/application/jobs/maintenance.ts`
    - `apps/api/src/application/ports/maintenance-store.ts`
    - `apps/api/src/infrastructure/persistence/maintenance-store.ts`
    - `apps/api/test/integration/maintenance-notifications.test.ts`
  - **Especificación de Implementación:** Borra los avisos de más de 90 días con `decision_status IS NULL OR decision_status = 'resolved'`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M15-05`: un aviso de 91 días se borra, salvo si espera una decisión; uno de 89 días se conserva.

- [x] **`TASK-179`: Web: campana y bandeja de avisos**
  - **Dependencias:** Requiere TASK-072, TASK-177
  - **Trazabilidad SDD:** plan §4.15.4 (cabecera, `NotificationsPanel`), plan §4.2.4; RF-M15-06, RF-M15-11, RF-M15-12, RNF-06
  - **Archivos en Alcance:**
    - `apps/web/src/features/notifications/api.ts`
    - `apps/web/src/features/notifications/hooks/use-notifications.ts`
    - `apps/web/src/features/notifications/components/bell-button.tsx`
    - `apps/web/src/features/notifications/components/notifications-panel.tsx`
    - `apps/web/src/features/notifications/components/notification-item.tsx`
    - `apps/web/src/components/resource-not-found.tsx`
    - `apps/web/src/app/layout/header.tsx`
    - `apps/web/src/locales/es-BO/notifications.json`
    - `apps/api/src/presentation/internal/test-support.controller.ts`
    - `apps/api/src/composition/container.ts`
    - `e2e/m15-inbox.spec.ts`
  - **Especificación de Implementación:** `BellButton` con el contador, refrescado cada 60 s con `X-Background` y al reenfocar la ventana. `NotificationsPanel` (Sheet) con el texto i18n de cada tipo y sus parámetros: tocar un aviso lo marca como leído y navega; un menú "…" permite eliminarlo; está "Marcar todo como leído". `ResourceNotFound` muestra "Esto ya no existe" y lo usan las pantallas de detalle. Solo con `INTEGRATIONS=fake`, `POST /internal/test/notifications` crea avisos para E2E.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M15-06`: la campana muestra la cantidad de no leídos.
    - `RF-M15-11`: un aviso cuyo destino no existe muestra "Esto ya no existe" y queda leído.
    - `RF-M15-12`: "Marcar todo como leído" deja el contador en 0.
    - `RNF-06`: eliminar desde el menú "…" funciona con el teclado y sin violaciones de axe.

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M15 - Recordatorios y avisos]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.9 Auditoría y retención]]
- **Fases de tareas:** [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 3.9 Seguridad a nivel de datos]] · [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - EmailOutbox]]

