---
tipo: moc
tags: [moc, inicio]
aliases: [Home, Segundo cerebro]
---
# 🧠 Segundo cerebro · App de Finanzas Personales

Aplicación web para que una persona en Bolivia lleve sus finanzas personales en **bolivianos y dólares**, con el tipo de cambio **paralelo** y el **oficial**. Principio rector: *registrar un movimiento siempre debe ser rápido y simple* ([[Constitución 1. Producto]]).

> [!info] Cómo está hecho este vault
> - Las notas se generaron leyendo el proyecto real `proyecto-parcial/AppDeFinanzasPersonales` (solo lectura).
> - Los `.md` del repo están **divididos por sección**: cada sección es una nota y conserva el texto original.
> - Los archivos que no son `.md` (código, SQL, YAML, JSON) se documentan en notas que explican qué contienen. Cuando citan comentarios del código, van en inglés, tal como están en el repo.
> - Al final de cada nota, **🔗 Relacionado** enlaza de forma automática los módulos, ADR, RNF, fases, secciones del plan y tablas que la nota menciona.
> - Cada carpeta tiene su **color** en el Graph View y en el explorador de archivos.

## 🗺️ Mapas por categoría

| | Categoría | Qué hay |
|---|---|---|
| 🟨 | [[MOC Especificación]] | Constitución, spec, plan por módulo, tareas y asignaciones |
| 🟪 | [[MOC Arquitectura]] | Visión general, ADR, flujos, paquetes compartidos |
| 🟩 | [[MOC Backend]] | API Express en capas, endpoints, jobs, integraciones |
| 🟧 | [[MOC Frontend]] | SPA React, rutas, features, diseño |
| 🟦 | [[MOC Datos]] | Prisma, entidades, migraciones |
| 🟥 | [[MOC Features]] | Hubs de los módulos M1 a M15 |
| 🩷 | [[MOC Testing]] | Suites de pruebas, coherencia, matriz de verificación |
| 🟫 | [[MOC DevOps]] | CI/CD, despliegue, entorno y configuración |
| 🟢 | [[MOC Proceso IA]] | Pipeline SDD con agentes de Claude Code |

También puedes abrir el lienzo **Mapa del proyecto** (`00-Inicio/Mapa del proyecto.canvas`).

## 🚪 Puntos de entrada recomendados

1. **Entender el producto:** [[Spec 1.1 Visión]] → [[Spec 1.2 Entregas]] → [[Entregas V1.0 V1.1 V1.2]] → [[Spec 1.5 Glosario]]
2. **Entender la arquitectura:** [[Arquitectura general]] → [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]] → [[Plan 1.3 Registro de decisiones (ADR)]]
3. **Seguir una petición de punta a punta:** [[Flujo - Guardar un gasto]] · [[Flujo - Petición HTTP en el API]] · [[Flujo - Autenticación y sesión]]
4. **Procesos automáticos:** [[Flujo - Tick de jobs]] · [[Flujo - Tipo de cambio]]
5. **Datos:** [[Modelo de datos]] → [[Entidad - LedgerTransaction]] → [[Entidad - LedgerEntry]]
6. **Cómo se trabajó:** [[Pipeline SDD con agentes]] → [[Protocolo de ejecución con agentes]]
7. **Cómo se despliega:** [[Flujo - Despliegue a producción]] · [[Entorno local]] · [[Variables de entorno]]

## 🧭 Módulos

| V1.0 | V1.1 | V1.2 |
|---|---|---|
| [[M1 - Acceso y cuenta]] | [[M11 - Presupuestos]] | [[M14 - Recurrentes]] |
| [[M2 - Navegación y estructura]] | [[M12 - Metas de ahorro]] | [[M15 - Recordatorios y avisos]] |
| [[M3 - Monedas y tipo de cambio]] | [[M13 - Deudas y préstamos]] | |
| [[M4 - Cuentas]] | | |
| [[M5 - Categorías]] | | |
| [[M6 - Transacciones]] | | |
| [[M7 - Registrar]] | | |
| [[M8 - Inicio (dashboard)]] | | |
| [[M9 - Ajustes y personalización]] | | |
| [[M10 - Onboarding]] | | |

## 📊 Estado

[[README - Estado del proyecto]]: **274 de 274 tareas cerradas** al 2026-10-30. Equipo en [[README - Equipo]]. Documento raíz: [[README - App de Finanzas Personales]].
