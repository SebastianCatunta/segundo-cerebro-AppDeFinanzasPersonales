---
tipo: "ejecucion"
fuente: ".claude/run/TASK-273/context.md"
tags:
  - "ia/ejecucion"
actualizado: "2026-10-30"
---

> [!abstract] Estado local del pipeline para TASK-273 (`.claude/run/TASK-273/context.md`, no versionado). Etapa: **Paquete de contexto**. Ver [[Protocolo 2. Skill implement-task TASK-XXX]].

# Paquete de contexto — TASK-273: Confirmación del correo con otra sesión abierta: descartar los borradores de esa sesión

Fase 27 — Pulido transversal: rendimiento, correos, navegación y marca. Lee este archivo completo antes de empezar.

## 1. La tarea (tasks.md)

- [ ] **`TASK-273`: Confirmación del correo con otra sesión abierta: descartar los borradores de esa sesión**
  - **Dependencias:** Requiere TASK-266, TASK-272
  - **Trazabilidad SDD:** plan §4.1.4 (Confirmación desde otro dispositivo), `coherencia.md` D-01; EC-M1-11, EC-M2-01
  - **Archivos en Alcance:**
    - `apps/web/src/features/auth/components/check-email.tsx`
    - `e2e/m1-sign-up-confirm-sync.spec.ts`
  - **Especificación de Implementación:** EC-M1-11 dice que al confirmar el correo de A en un navegador con la sesión de B abierta "se cierra la sesión de B, su borrador se descarta y se inicia la de A". El servidor ya cierra la sesión de B y abre la de A, pero `CheckEmail.onConfirmed` solo invalida `['me']` y navega a `/bienvenida`, así que los borradores de B (`draft:{idDeB}:…`) siguen guardados y reaparecen cuando B vuelve a entrar. En `onConfirmed`, antes de invalidar, se lee el `MeDto` anterior de la caché (`ME_QUERY_KEY`); si existe y su `id` no es el de la persona que acaba de confirmar, se llama a `clearAllDrafts(previous.id)` y se limpia la caché (`queryClient.clear()`), igual que el diálogo de sesión vencida (EC-M2-01, `session-expired-dialog.tsx`). Si no había sesión o es la misma persona, el comportamiento no cambia.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M1-11`: el E2E existente se amplía: B deja un borrador guardado antes de que se confirme el correo de A; después de que la app continúa sola a `/bienvenida`, no queda ninguna clave `draft:{idDeB}:` en el almacenamiento del navegador, y al volver a entrar como B el formulario está vacío.
    - `RF-M1-18`: sin otra sesión abierta, la confirmación sigue llevando a `/bienvenida` sin cambios.

## 2. Archivos en alcance

- **Archivos de test** (los escribe test-author y quedan bloqueados después): `e2e/m1-sign-up-confirm-sync.spec.ts`

- **Archivos de implementación** (los escribe implementer): `apps/web/src/features/auth/components/check-email.tsx`

Ningún otro archivo del repositorio se puede crear, modificar ni borrar. Se puede leer cualquier archivo.

## 3. Reglas de la spec citadas (texto literal)

- **EC-M1-11:** Se confirma el correo de A mientras la app que lo espera está en un navegador con la sesión de B abierta. Se cierra la sesión de B, su borrador se descarta y se inicia la de A.

- **EC-M2-01:** Otra persona inicia sesión tras el vencimiento de la sesión en el mismo dispositivo. El borrador del usuario anterior se descarta.

## 4. Escenarios Gherkin citados

_Ninguno._

## 5. Plan técnico: convenciones y secciones citadas

- El código, las tablas y las columnas están en inglés. Las rutas de la interfaz y los textos están en español (constitución §5).
- "Bloqueo por usuario" es `pg_advisory_xact_lock(hashtext('user:' || user_id))`.
- "Idempotente" significa que la creación lleva un `id` UUID v7 generado por el cliente (ADR-11).
- Todos los montos y tasas viajan como texto decimal (ADR-03).

#### 4.1.4 UI y estado
- **Rutas públicas:** `/registro` (SignUpForm), `/entrar` (SignInForm con cuenta regresiva desde `retryAfterSeconds`), `/revisa-tu-correo` (CheckEmail con reenvío cada 60 s), `/confirmar` (ConfirmLink), `/olvide-mi-contrasena`, `/restablecer`.
- **Rutas privadas:** `/perfil` (ProfileForm: nombre, zona horaria, idioma fijo, correo en solo lectura con su explicación, cambio de contraseña, cerrar sesión, cerrar todas, exportar) y `/perfil/eliminar` (DeleteAccount con la palabra ELIMINAR y la opción de exportar antes).
- **Servidor:** `useMe()`, con la clave `['me']`.
- **Cliente:** formularios con react-hook-form y los schemas de `contracts`; la cuenta regresiva vive en el componente.
- **Confirmación desde otro dispositivo (RF-M1-18, EC-M1-11, EC-M1-13):** `CheckEmail` usa `useConfirmationWatch`, que llama a `POST /api/auth/confirmation/status` cada 3 s mientras la pestaña está visible (cada 10 s pasados 5 minutos), al recuperar el foco y al volverse visible, y se detiene al confirmar, al desmontarse o a las 24 h. Con `confirmed`, invalida `['me']` y navega a `/bienvenida`. `ConfirmLink` solo llama a `confirm` y muestra "Correo confirmado: vuelve a la app donde creaste tu cuenta, que continúa sola; si ya la cerraste, inicia sesión", con un enlace a `/entrar`: no navega ni abre sesión. Los errores de red del sondeo se ignoran.
- **Exportar:** descarga con `fetch` + `blob`, con un indicador de progreso.

---

## 6. Dirección visual

Esta tarea escribe interfaz. Todo lo visual (tokens, tipografía, estética, componentes) debe respetar este documento (`docs/design-direction.md`); no inventes otro estilo.

# Dirección visual de la web

**Decidida el 2026-10-19 con el usuario.** Aplica a toda pantalla y componente de `apps/web`. Si algo cambia, se edita este documento en su propio commit `docs:`.

## Estética y tono

**Minimalista neutro.** Una app de dinero para el día a día en celular: calma, mucho aire y casi ningún adorno. El color lo ponen la marca (poco) y las categorías (donde corresponde); todo lo demás es neutro. Sin degradados, sin sombras decorativas, sin ilustraciones de relleno.

- La jerarquía sale del tamaño y del peso de la letra, no de cajas ni colores.
- Bordes de 1 px (`--border`) para separar; las sombras solo en elementos que flotan (menús, hojas, diálogos).
- Una sola cosa memorable por pantalla: el monto o el estado principal, grande y alineado.

## Tema

Claro y oscuro, y el valor por defecto es el del sistema (`theme = system`). Los fondos NO se tocan: `--background` es `0 0% 100%` en claro y `222.2 84% 4.9%` en oscuro, porque el contraste AA de los 12 colores de categoría se mide contra ellos (`THEME_BACKGROUND`).

## Color de marca: verde azulado profundo

Solo para la acción principal, los enlaces y el foco. Los 12 colores de `PALETTE` son de las categorías, no de la marca.

| Token (`index.css`) | Claro | Oscuro |
|---|---|---|
| `--primary` | `168 60% 24%` | `168 48% 52%` |
| `--primary-foreground` | `0 0% 100%` | `222.2 84% 4.9%` |
| `--ring` | `168 60% 24%` | `168 48% 52%` |
| `--destructive` | `0 72% 45%` | `0 84% 66%` |
| `--destructive-foreground` | `0 0% 100%` | `222.2 84% 4.9%` |
| `--muted-foreground` | `215.4 16.3% 42%` | `215 20.2% 65.1%` (sin cambio) |

El resto de tokens de shadcn (`--secondary`, `--muted`, `--accent`, `--border`, `--input`) se queda en los neutros actuales. `--destructive` es solo para errores y acciones que borran, nunca para "gasto". Sirve a la vez de color de texto y de fondo de botón, así que cumple AA (≥ 4,5:1) en las dos formas, en claro y en oscuro: sobre blanco 5,8:1 y con texto blanco 5,8:1 (claro); sobre el fondo oscuro 6,2:1 y con texto oscuro 6,2:1 (oscuro). `--muted-foreground` sobre `--muted` queda en 5,2:1 en claro.

## Marca

Isotipo de tres barras que suben, en blanco sobre un cuadrado de esquinas redondeadas en el color de marca (`#186253`, el `--primary` claro). No lleva texto: el nombre "Finanzas" va en el título. Los archivos están en `apps/web/public/`: `logo.svg` y `favicon.svg` (el mismo dibujo), `favicon.ico` (16, 32 y 48 px) y `apple-touch-icon.png` (180×180, sin esquinas, porque iOS las redondea).

- **a) Pestaña:** el ícono y el título "Finanzas"; `theme-color` es el color de marca.
- **b) Pantallas de acceso y Onboarding:** el logo de 48 px, centrado, sobre el título.
- **c) Cabecera:** en celular y escritorio, el logo de 24 px a la izquierda del título, después de "Volver" si lo hay.
- **d) Barra lateral de escritorio:** sin logo propio, para no repetirlo junto al de la cabecera.
- **e) Tema oscuro:** la misma marca y el mismo archivo. El cuadrado de color lleva su propio fondo, así que se lee igual sobre el fondo claro y sobre el oscuro, sin variantes ni `currentColor`.

## Tipografía: IBM Plex Sans

Una sola familia, pesos 400, 500 y 600, cargada desde Google Fonts con `font-display: swap`. Pila: `"IBM Plex Sans", system-ui, sans-serif`.

- **Montos y cifras:** `font-variant-numeric: tabular-nums` siempre, alineadas a la derecha en listas y tablas.
- **Escala:** cuerpo 16 px (nunca menos en celular), texto secundario 14 px, títulos de pantalla 24 px / 600, monto destacado 32 px / 600.
- **Mayúsculas:** frases en minúscula (sentence case). Sin etiquetas en mayúsculas ni encabezados decorativos sobre los títulos.
- Líneas de texto de menos de 80 caracteres.

## Forma y densidad

- Radio base `--radius: 0.5rem` en todo; los controles pequeños (casillas, insignias) usan `calc(var(--radius) - 2px)`.
- Densidad cómoda, celular primero: objetivos táctiles de al menos 44 px de alto, 16 px de margen lateral, espaciado en múltiplos de 4 px.
- Una columna en celular. En escritorio (≥ 1024 px) el contenido se centra con un ancho máximo cómodo; no se estira.

## Reglas de componentes y pantallas

- Usar los componentes de shadcn/ui tal cual, con estos tokens. No crear variantes de botón nuevas sin una razón en la spec.
- **Un solo botón primario por vista.** Las demás acciones, secundarias o de texto.
- **Montos:** el signo `−` (menos) va delante en gastos y el `+` en ingresos; nunca se comunica solo por color. La moneda y el formato salen de los formateadores (`useFormatters`), no se escriben a mano.
- **Formularios:** etiqueta visible encima del campo, error debajo en `--destructive` y con texto que explica cómo corregirlo. Foco visible siempre (anillo de `--ring`).
- **Estados vacíos y errores:** dicen qué pasó y qué hacer; sin disculpas ni humor. Los textos van en `locales/es-BO`, nunca en el código.
- **Movimiento:** solo como respuesta a una acción (abrir, expandir, confirmar) y breve. Sin animaciones de entrada ni efectos al pasar el cursor. Respetar `prefers-reduced-motion`.
- **Accesibilidad:** contraste AA (≥ 4,5:1), navegación completa con teclado, `aria-label` en botones de solo ícono, y los íconos de lucide-react nunca son la única señal.

## Metas (M12)

- **Anillo de progreso:** SVG de trazo de 4 px (8 px en el detalle), pista en `--muted` y avance en el color de la meta (`PALETTE`). El porcentaje va en texto dentro o al lado del anillo; el color nunca es la única señal (`role="progressbar"` con `aria-valuenow`).
- **Estado de la meta:** insignia de texto (en curso, lograda, vencida, archivada) con estilo neutro; "lograda" puede usar el color de la meta en el borde, nunca `--destructive` para "vencida".
- **Celebración:** un diálogo de shadcn con el ícono de la meta, el título y el monto logrado en 32 px / 600, y un solo botón primario para cerrarlo. Sin confeti ni animaciones propias: solo la transición del diálogo, que respeta `prefers-reduced-motion`.

## Presupuestos (M11)

- **Barra de progreso:** barra horizontal de 8 px con radio completo, pista en `--muted` y avance en el color de la categoría (`PALETTE`; el presupuesto general usa `--primary`). Las marcas de los umbrales son líneas verticales de 1 px en `--muted-foreground`. Pasado el 100 % la barra queda llena y el texto dice "Superado por …"; el exceso no se pinta con `--destructive`. El porcentaje y lo gastado de lo disponible van en texto junto a la barra (`role="progressbar"` con `aria-valuenow`); el color nunca es la única señal.
- **Lo memorable:** en el detalle, el disponible en 32 px / 600 y debajo el texto de ritmo ("Puedes gastar … por día durante … días", "Vas … por encima del ritmo" o "Superado por …") en 16 px; en la lista, el disponible alineado a la derecha y el ritmo como texto secundario de 14 px.
- **Estado:** insignia de texto neutra (activo, pausado, finalizando, finalizado). Un cierre pendiente de decisión se marca con una insignia con borde `--primary` y el texto "Decidir cierre", nunca solo con color.
- **Desglose del arrastre e historial:** lista simple con separadores de 1 px; cada fila con su etiqueta a la izquierda y el monto con signo y `tabular-nums` a la derecha. El historial muestra los 12 últimos períodos, el más reciente arriba.
- **Acciones:** pausar, reanudar, reiniciar el arrastre y eliminar van en un menú secundario; eliminar y reiniciar el arrastre piden confirmación con un diálogo de shadcn, y solo eliminar usa el botón `destructive`.
- **Decisión de cierre:** un formulario en hoja o diálogo con el resultado en 32 px / 600 arriba, un campo por destino (arrastrar, enviar a meta, descartar) con la suma restante visible, y un único botón primario "Confirmar decisión" que solo se habilita cuando la suma cuadra.


## 7. Constitución del proyecto

# Constitución — App de Finanzas Personales

**Versión:** 1.2.0 · **Ratificada:** 2026-10-15 · **Última enmienda:** 2026-10-16

Principios innegociables del proyecto. Los DEBEN respetar todas las personas y agentes de IA que trabajen en él. El *qué* se define en cada especificación y el *cómo* en cada plan; este documento fija solo lo que no cambia.

## 1. Producto
- **Propósito:** que una persona en Bolivia lleve sus finanzas personales en bolivianos y dólares, con el tipo de cambio paralelo y el oficial.
- **Principio rector:** registrar un movimiento DEBE ser siempre rápido y simple. Ninguna funcionalidad puede volver más lento ni más complicado ese flujo.
- **Privacidad:** cada usuario ve y modifica SOLO sus propios datos, y puede exportarlos o borrarlos cuando quiera.
- **Plataforma:** aplicación web responsive y accesible, en español de Bolivia, con los textos preparados para traducirse.
- **Entregas incrementales:** V1.0 (núcleo) → V1.1 (presupuestos, metas, deudas y bandeja básica de avisos) → V1.2 (recurrentes y recordatorios completos). Cada entrega DEBE quedar usable antes de empezar la siguiente.
- **Avisos:** todos los avisos llegan solo dentro de la app. El correo se usa únicamente para la cuenta del usuario (confirmación, recuperación y seguridad).
- **Fuera de alcance:** reportes, inteligencia artificial, conexión con bancos, cuentas compartidas o roles, app nativa, notificaciones push, avisos por correo y modo sin conexión.

## 2. Stack tecnológico
- **Lenguaje:** TypeScript en todo el proyecto, organizado como monorepo.
- **Frontend:** React + Vite, Tailwind CSS + shadcn/ui, TanStack Query.
- **Backend:** Node.js + Express, Prisma, Zod.
- **Base de datos:** PostgreSQL.
- **Autenticación:** Better Auth.
- **Dinero:** decimal.js.
- **Correo (solo de cuenta):** Resend.
- **Tests:** Vitest y Playwright.
- **Despliegue:** Railway o Render (backend), Neon (base de datos), Vercel o Netlify (frontend).

Agregar una tecnología que reemplace o duplique alguna de estas requiere el acuerdo de todo el equipo.

## 3. Datos y dinero
- El dinero se calcula SIEMPRE con precisión decimal exacta, NUNCA con punto flotante. Los montos se redondean a dos decimales, con la mitad hacia arriba.
- La historia no se reescribe: un movimiento conserva el tipo de cambio con el que se registró, y los valores históricos no cambian por movimientos del dólar ni por cambios de configuración.
- Los saldos se calculan a partir de los movimientos y NUNCA se editan a mano.
- Las cuentas y categorías con movimientos se archivan, no se borran.
- Una misma acción repetida NUNCA genera registros duplicados, y un mismo evento NUNCA genera dos avisos.

## 4. Seguridad
- Toda entrada al sistema DEBE validarse. NUNCA se confía en lo que envía el cliente.
- La identidad del usuario sale SIEMPRE de su sesión, nunca de los datos que envía.
- NUNCA se exponen secretos, contraseñas ni detalles internos en el código, los logs ni los mensajes de error.

## 5. Calidad
- El código DEBE tener tipado estricto y pasar lint, verificación de tipos y tests antes de integrarse.
- Toda regla de negocio DEBE tener un test que la verifique.
- Todo acceso a datos DEBE tener un test que demuestre el aislamiento entre usuarios.
- El código se escribe en inglés y la interfaz en español.

## 6. Desarrollo guiado por especificaciones (SDD)
- Toda funcionalidad sigue este orden: **especificación → plan → tareas → implementación**.
- Cada funcionalidad vive en una carpeta `NNN-nombre/` en la raíz del proyecto, al mismo nivel que `docs/`, con su `spec.md`, `plan.md` y `tasks.md`.
- No se implementa nada sin una especificación aprobada por el equipo.
- Ante una ambigüedad, se pregunta. NUNCA se inventan reglas de negocio.
- Si un cambio contradice la especificación, primero se actualiza la especificación.
- Los agentes de IA pueden programar, ejecutar tests y hacer acciones de git, siguiendo esta Constitución y el flujo de §7.

## 7. Git Flow
- **`main`:** producción.
- **`qa`:** validación antes de producción.
- **`develop`:** integración.
- **`feature/*` y `fix/*`:** salen de `develop` y vuelven a `develop` por Pull Request.
- **Promoción:** `develop` → `qa` → `main`, siempre por Pull Request.
- **`hotfix/*`:** sale de `main` y se integra en `main`, `qa` y `develop`.
- Los commits siguen Conventional Commits.

## 8. Ejecución de tareas con agentes
- La unidad de trabajo es una tarea de `tasks.md`. Se implementa una tarea a la vez y solo dentro de los archivos que declara.
- Cada tarea pasa por el mismo pipeline: **pruebas primero → implementación → auditoría** contra esta Constitución, la especificación y el plan. Cada etapa la hace un agente distinto, con el contexto mínimo de la tarea.
- Lo que una máquina puede verificar lo verifican hooks deterministas, no un agente: alcance de archivos, lint, tipos, reglas de capas y tests.
- Una tarea se cierra solo con todas las verificaciones en verde y la auditoría aprobada, y queda en un commit propio que la referencia.
- Si un agente encuentra una ambigüedad o necesita salir del alcance, se detiene y pregunta (§6). Nunca se cambian el alcance ni las pruebas para que algo pase.
- Ningún guardarraíl se salta.
- El detalle operativo vive en `docs/execution-protocol.md`.

## 9. Enmiendas
Esta Constitución solo cambia con el acuerdo de todo el equipo. Cada cambio sube su número de versión.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M2 - Navegación y estructura]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]] · [[ADR-11 - Idempotencia con UUID v7]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]
- **Spec / Plan / Constitución:** [[Constitución 5. Calidad]] · [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]]

