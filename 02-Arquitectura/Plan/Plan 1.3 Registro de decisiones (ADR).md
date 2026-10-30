---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 1.3 Registro de decisiones (ADR)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 1. Visión Arquitectónica y Flujo del Sistema]] · ← [[Plan 1.2 Despliegue y flujo principal]] · → [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]]

### 1.3 Registro de decisiones (ADR)

| ID | Decisión | Motivo | Alternativas descartadas |
|---|---|---|---|
| ADR-01 | Jobs: API en Render gratis. cron-job.org llama cada minuto a `POST /internal/jobs/tick` (secreto en un encabezado, directo a Render). Jobs idempotentes que se ponen al día. Respaldo: la primera petición de cada usuario ejecuta lo vencido para él. | Costo 0. El ping mantiene despierto el servidor (sin arranque en frío). Los atrasos se recuperan solos (RF-M14-12, RNF-13). | pg-boss o node-cron (necesitan un servidor siempre encendido), GitHub Actions (mínimo cada 5 min y con retrasos), Railway Hobby (USD 5/mes). |
| ADR-02 | Sesión entre dominios: Vercel hace de proxy de `/api/*`. Cookie propia `HttpOnly; Secure; SameSite=Lax` + verificación de `Origin`. | Safari bloquea las cookies de terceros. Sin dominio propio ni CORS. | Subdominios con dominio propio, `SameSite=None`. |
| ADR-03 | Dinero: `NUMERIC` en Postgres, `Prisma.Decimal` (decimal.js) en el servidor, texto `"1234.56"` en el JSON, decimal.js en la web. Solo los gráficos convierten a `number`, para dibujar. `ROUND(numeric, 2)` de Postgres = mitad alejándose del cero = RN-06. | Constitución §3: nunca punto flotante. | `number` en el JSON. |
| ADR-04 | Libro contable: `ledger_transaction` (cabecera) + `ledger_entry` (asientos con signo). Saldo = inicial + Σ asientos. | Transferencias, comisiones y ajustes con un solo modelo; un `SUM` uniforme. | Una fila por movimiento con columnas de origen y destino. |
| ADR-05 | Aislamiento: los repositorios reciben `userId` de la sesión; una extensión de Prisma inyecta y verifica `user_id`; claves foráneas compuestas `(user_id, x_id)` hacen imposible referenciar datos de otro usuario. Un test de aislamiento por repositorio. Sin RLS. | Defensa en dos capas sin el costo operativo de RLS con el pooler de Neon. | RLS en Postgres. |
| ADR-06 | Tasas: paralelo.bo por JSON-RPC (`get_current_rate`, `get_historical_rate`, `convert_currency` official). "Venta" = el mayor de buy/sell, "compra" = el menor. TCO: paralelo.bo, con respaldo en el widget del BCB. Carga única del histórico. Atribución CC-BY-4.0 (RNF-27). | Fuentes reales verificadas el 2026-10-16. El BCB solo publica un TCO desde el 27/06/2026. | Extraer compra y venta oficiales del sitio del BCB (ya no existen). |
| ADR-07 | Deshacer: `deleted_at` + token de un solo uso (`undo_action`, vence a los 12 s). Un job purga. | Restaura lo vinculado de forma atómica; las consultas filtran `deleted_at IS NULL`. | Borrado real + recrear desde el cliente. |
| ADR-08 | Autenticación: endpoints propios `/api/auth/*` sobre la API de servidor de Better Auth (usuario, hash scrypt, sesiones, cookie). Enlaces, bloqueos y correos son propios. El manejador HTTP genérico de Better Auth no se expone. | Better Auth no permite invalidar el enlace anterior, ni dar mensajes neutros, ni bloquear correos sin cuenta. | Solo hooks y plugins. |
| ADR-09 | Errores: `application/problem+json` (RFC 9457) con `code` estable y datos seguros; la web los traduce con i18next. Errores inesperados: `INTERNAL_ERROR` + `traceId`. | Constitución §4. | Formato propio con el mensaje en español desde el servidor. |
| ADR-10 | Esquema: `schema.prisma` para modelos y relaciones. Las migraciones SQL agregan lo que Prisma no expresa: índices únicos parciales, `CHECK`, triggers, la función `user_rate_on`, la extensión `unaccent`. | Prisma es la puerta de acceso (§2); la integridad vive en la base. | Solo validaciones en el servicio. |
| ADR-11 | Idempotencia: toda creación lleva un `id` UUID v7 generado por el cliente. `INSERT … ON CONFLICT (id) DO NOTHING`: 201 si es nuevo, 200 con el existente si coincide, `IDEMPOTENCY_CONFLICT 409` si difiere. Las decisiones únicas usan `UPDATE … WHERE status = <esperado>`. | RN-10, RNF-11 y EC-M2-02 sin tabla de llaves. | Tabla de idempotency keys. |
| ADR-12 | Datos de mercado globales (`market_rate`) sin `user_id`; los escriben solo los jobs. | Son públicos e iguales para todos. Única excepción a la regla del `user_id`. | Copiar las tasas por usuario. |
| ADR-13 | Los estados que dependen del tipo de cambio o del tiempo se derivan al leer: meta (en curso, cumplida, vencida), deuda vencida. | Siguen al progreso sin jobs ni carreras (RF-M12-02, EC-M12-03). | Columnas de estado mantenidas por jobs. |
| ADR-14 | Interés de deudas como foto: `capital_outstanding`, `interest_unpaid NUMERIC(24,10)`, `accrued_through`. Cada evento primero lleva el interés hasta hoy. | El interés nunca se recalcula hacia atrás (RF-M13-04) y no acumula error de redondeo (RNF-18). | Recalcular por tramos desde el inicio. |
| ADR-15 | Tablas del libro contable: `ledger_transaction` y `ledger_entry` en lugar de `transaction` y `transaction_entry`. | `TRANSACTION` es palabra clave de SQL. | Comillas en todas las consultas. |
| ADR-16 | Navegación: React Router. El mes, los filtros y el detalle van en la URL, validados con Zod (`useValidatedSearch`). La memoria de cada pestaña es por módulo, en sessionStorage. | RF-M2-04 y RF-M2-06 con el botón Atrás nativo. | TanStack Router. |
| ADR-17 | Estado de cliente: store mínimo propio (`useSyncExternalStore`). Borradores en sessionStorage (`draft:{userId}:{formKey}`). | Muy poco estado; sobrevive a que el celular descarte la pestaña y se borra al cerrarla (RF-M2-10). | Zustand, solo memoria. |
| ADR-18 | Entregas: variable `RELEASE` del API, devuelta en `GET /api/me`. Las rutas de módulos no liberados responden 404 y sus jobs no corren. | Una sola fuente; liberar no exige recompilar el frontend (RF-M2-03). | Variable de compilación en cada app. |
| ADR-19 | Backend en capas: presentación → aplicación → dominio. La infraestructura implementa los puertos que define la aplicación, y una raíz de composición los une. dependency-cruiser verifica las reglas en CI (1.4). | Separa HTTP, reglas e infraestructura; los casos de uso se prueban sin Express ni Prisma; las reglas de dependencia no se rompen sin que CI lo note. | Organización por módulos con rutas, servicio y repositorio juntos, sin reglas verificadas. |
| ADR-20 | CI/CD con GitHub Actions. CI en cada push y PR. QA efímero en CI para la rama `qa` (Postgres, API y web dentro del runner, con E2E completo). Despliegue automático solo desde `main`, después de que CI pase: migraciones → Deploy Hook de Render → Vercel CLI → pruebas de humo. Render y Vercel no despliegan solos desde Git (1.5). | Ningún cambio llega a producción sin pasar CI; el orden migración → API → web es seguro; costo USD 0 sin arriesgar las horas gratis de Render. | Auto-deploy nativo en cada push (despliega aunque CI falle); entorno QA desplegado (consume horas gratis de Render). |

**Librerías además del stack de la constitución.** Ninguna reemplaza ni duplica una tecnología del stack (constitución §2).

| Uso | Librerías |
|---|---|
| Interfaz | react-router, react-hook-form + @hookform/resolvers, recharts, i18next + react-i18next, lucide-react (íconos de shadcn/ui), @dnd-kit (reordenar arrastrando) |
| Fechas e ids | date-fns + @date-fns/tz, uuidv7 (ids del cliente) |
| Servidor | archiver (ZIP de la exportación) |
| Desarrollo y CI | supertest, @axe-core/playwright, eslint-plugin-i18next, dependency-cruiser (reglas de capas), @commitlint/cli + config-conventional (§7), vercel (CLI de despliegue) |

La integración y el despliegue continuos corren en GitHub Actions (1.5, ADR-20).

**Pruebas técnicas previas a implementar:**
- **S-1:** confirmar que la API de servidor de Better Auth permite crear una sesión y su cookie desde un endpoint propio, marcar el correo verificado y hashear y verificar contraseñas.
- **S-2:** confirmar los límites de uso de `https://paralelo.bo/mcp` y la estabilidad del widget del BCB.

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M2 - Navegación y estructura]]
- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]] · [[ADR-02 - Sesión entre dominios (proxy de Vercel)]] · [[ADR-03 - Dinero como decimal]] · [[ADR-04 - Libro contable de doble asiento]] · [[ADR-05 - Aislamiento por usuario]] · [[ADR-06 - Fuentes de tasas de cambio]] · [[ADR-07 - Deshacer con token]] · [[ADR-08 - Autenticación sobre Better Auth]] · [[ADR-09 - Errores problem+json]] · [[ADR-10 - Esquema Prisma más SQL]] · [[ADR-11 - Idempotencia con UUID v7]] · [[ADR-12 - Datos de mercado globales]] · [[ADR-13 - Estados derivados al leer]] · [[ADR-14 - Interés de deudas como foto]] · [[ADR-15 - Nombres de tablas del libro]] · [[ADR-16 - Navegación con React Router]] · [[ADR-17 - Estado de cliente mínimo]] · [[ADR-18 - Entregas con RELEASE]] · [[ADR-19 - Backend en capas]] · [[ADR-20 - CI-CD con GitHub Actions]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]] · [[Spec 3.6 Exactitud monetaria]] · [[Spec 3.9 Auditoría y retención]]
- **Spec / Plan / Constitución:** [[Constitución 2. Stack tecnológico]] · [[Constitución 3. Datos y dinero]] · [[Constitución 4. Seguridad]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - LedgerEntry]] · [[Entidad - LedgerTransaction]] · [[Entidad - MarketRate]] · [[Entidad - UndoAction]]

