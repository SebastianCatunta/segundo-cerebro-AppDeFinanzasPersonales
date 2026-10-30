---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 16 - Exportación de datos (M1, V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M1"
fase: "16"
tareas: "3"
modulo: "M1"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 15 - M10 Onboarding (V1.0)]] · → [[Tareas Fase 17 - Cierre de V1.0 rendimiento, accesibilidad y despliegue]]

### Fase 16 — Exportación de datos (M1, V1.0)

- [x] **`TASK-163`: Generador de CSV y ZIP en streaming**
  - **Dependencias:** Requiere TASK-007
  - **Trazabilidad SDD:** plan §4.1.2 (`GET /api/me/export`), plan §2 (`export/csv-zip.ts`); RF-M1-14
  - **Archivos en Alcance:**
    - `apps/api/src/infrastructure/export/csv-zip.ts`
    - `apps/api/test/unit/csv-zip.test.ts`
  - **Especificación de Implementación:** `createZipStream(files: AsyncIterable<{ name, rows }>)` con archiver. Los CSV van en UTF-8, con coma como separador, montos como `1234.56` (sin separador de miles) y comillas cuando hacen falta. Toda celda que empieza con `=`, `+`, `-` o `@` se neutraliza anteponiendo un apóstrofo.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-14`: una nota "=SUM(A1)" queda neutralizada; un monto se escribe como "1234.56"; una nota con comas y tildes se lee igual.

- [x] **`TASK-164`: Exportadores de V1.0 y endpoint `/api/me/export`**
  - **Dependencias:** Requiere TASK-136, TASK-163
  - **Trazabilidad SDD:** plan §4.1.2 (`GET /api/me/export`); RF-M1-14, RNF-16, RN-09
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/export.service.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/export.repository.ts`
    - `apps/api/src/presentation/routes/me.routes.ts`
    - `apps/api/src/presentation/controllers/me.controller.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/me-export.test.ts`
  - **Especificación de Implementación:** Registro de exportadores por módulo, filtrado por `RELEASE`. En V1.0: perfil y ajustes, monedas e historial de tasas manuales, cuentas, categorías, movimientos (con sus asientos y tasas) y atajos, incluidos los archivados. La respuesta es `application/zip` en streaming.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-16`: el ZIP contiene un CSV por cada tipo de dato liberado, con todas las filas del usuario y las archivadas.
    - `RF-M1-14`: con `RELEASE=1.0` no hay CSV de presupuestos, metas, deudas, recurrentes ni avisos.
    - `RN-09`: el ZIP no contiene datos de otro usuario.

- [x] **`TASK-165`: Web: exportar mis datos**
  - **Dependencias:** Requiere TASK-076, TASK-164
  - **Trazabilidad SDD:** plan §4.1.4 (exportar); RF-M1-14, RF-M1-15
  - **Archivos en Alcance:**
    - `apps/web/src/features/profile/components/export-button.tsx`
    - `apps/web/src/features/profile/components/profile-form.tsx`
    - `apps/web/src/features/profile/components/delete-account.tsx`
    - `apps/web/src/locales/es-BO/profile.json`
    - `e2e/m1-export.spec.ts`
  - **Especificación de Implementación:** "Exportar mis datos" descarga con `fetch` + `blob` y muestra el progreso. La pantalla de eliminar la cuenta ofrece "Exportar antes".
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M1-14`: la descarga produce un ZIP con los CSV esperados.
    - `RF-M1-15`: "Exportar antes" está disponible en la pantalla de eliminación.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]]
- **Requerimientos no funcionales:** [[Spec 3.5 Privacidad y seguridad]]
- **Fases de tareas:** [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]] · [[Tareas Fase 12 - M7 Registrar (V1.0)]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 2. Estructura del Proyecto (Árbol de Directorios)]] · [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

