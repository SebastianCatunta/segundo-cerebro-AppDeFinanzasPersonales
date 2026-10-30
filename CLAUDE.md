# CLAUDE.md — Segundo cerebro de AppDeFinanzasPersonales

Este directorio es un **vault de Obsidian**: la documentación navegable del proyecto real. No es código.

- **Proyecto real (fuente de verdad):** `<RUTA_PROYECTO>`, la carpeta `AppDeFinanzasPersonales` dentro de `proyecto-parcial`, hermana de `obsi`.
- **Vault (este directorio):** `<RUTA_VAULT>`, la carpeta `SecondBrain-AppFinanzasPersonales` dentro de `obsi`.
- Las rutas se escriben genéricas a propósito. Las notas del vault usan `<proyecto>` en lugar de la ruta absoluta del equipo.
- Idioma de las notas: español. Los nombres técnicos (clases, endpoints, tablas, archivos) van tal como están en el código.

## Reglas

1. **El proyecto real es de solo lectura.** Nunca crear, editar, mover ni borrar nada allí. Copiar o leer sí.
2. **Nunca leer ni copiar `.env`** ni ningún secreto. Las variables se documentan por nombre y propósito, desde `.env.example`.
3. Los `.md` del proyecto **no se copian enteros**: se dividen por secciones, una nota por sección, conservando el texto original.
4. Los archivos que no son `.md` (código, SQL, YAML, JSON) se documentan en notas que explican qué contienen. Los comentarios del código se citan en inglés, como están en el repo.

## Cómo se actualiza: el generador

Casi todo el vault lo produce `.generador/gen.mjs` (Node 22, sin dependencias):

```bash
# desde la raíz del vault, con Obsidian cerrado
node .generador/gen.mjs "<RUTA_PROYECTO>" "<RUTA_VAULT>" "<RUTA_VAULT>/.generador/curated"
```

- `.generador/meta.mjs`: datos curados a mano. Contiene los módulos M1–M15 (resumen, entrega, fases, rutas, features web, modelos, jobs, servicios compartidos), los títulos de los ADR, los colores por carpeta y las descripciones de los archivos de configuración.
- `.generador/curated/`: notas narrativas escritas a mano (Inicio, flujos, visiones generales, capas). Sus rutas reflejan las del vault. **Para editarlas de forma permanente, edita aquí** y vuelve a generar.
- `.obsidian/generated-manifest.json`: lista de archivos generados. Al regenerar, **solo se borran y reescriben los archivos de esa lista**; las notas creadas a mano fuera del generador no se tocan.
- La salida termina con `Enlaces rotos: N`, que debe ser 0.
- **Ejecutar con Obsidian cerrado.** Si Obsidian está abierto, guarda su configuración de memoria encima de `.obsidian/graph.json` y se pierden los grupos de color del grafo.
- También reescribe `graph.json` (grupos de color), `snippets/colores-carpetas.css`, `appearance.json`, `app.json`, `bookmarks.json` y `00-Inicio/Mapa del proyecto.canvas`.

Si el proyecto real cambia (nuevas rutas, modelos, features, fases o módulos), primero actualiza `meta.mjs` o las notas de `curated/` y después regenera. Las listas de endpoints, entidades, migraciones, componentes, pruebas y workflows se extraen del código automáticamente.

## Estructura y colores

| Carpeta | Color | Contenido |
|---|---|---|
| `00-Inicio` | `#F5C542` | `Inicio`, los MOC por categoría, el lienzo y las secciones del README (equipo, estado) |
| `01-Especificacion` | `#4A90E2` | Constitución, spec, plan §4 por módulo, tareas por fase y asignaciones |
| `02-Arquitectura` | `#9B59B6` | Arquitectura general, ADR, flujos, paquetes (`contracts`, `domain`, `db`, `config`), plan §1–2 |
| `03-Backend` | `#27AE60` | API: endpoints por grupo, capas, servicios compartidos, jobs, integraciones |
| `04-Frontend` | `#E67E22` | Web: router, layout, features, lib, UI, i18n, dirección de diseño |
| `05-Datos` | `#16A085` | Modelo de datos, entidades (una por modelo Prisma), enums, migraciones, plan §3 |
| `06-Features` | `#E74C3C` | Un hub por módulo (`M4 - Cuentas`, …) que enlaza todo lo de ese módulo |
| `07-Testing-QA` | `#FF6FB5` | Estrategia, suites de pruebas, informe de coherencia, plan §5 |
| `08-DevOps` | `#A0522D` | Workflows, despliegue, entorno local, variables, configuración del repo, latencia |
| `09-Proceso-IA` | `#A3E635` | Pipeline SDD: agentes, skills, protocolo, scripts `tools/sdd`, ejecuciones `.claude/run` |

## Convenciones de las notas

- **Nombres únicos en todo el vault**, con prefijo por tipo: `Spec 2.4 …`, `Plan 4.4 …`, `Tareas Fase 9 …`, `Coherencia M4 …`, `Constitución 3. …`, `ADR-05 - …`, `API accounts`, `Web - accounts`, `Entidad - Account`, `Migración 0004_account`, `Dominio - money`, `Contrato - accounts`, `Compartido - balance-guard`, `Job - fx`, `Integración - BCB`, `Workflow ci.yml`, `Config - …`, `Agente - …`, `Skill - …`, `TASK-NNN - …`, `Flujo - …`.
- **Frontmatter:** `tipo`, `modulo` (si aplica), `entrega`, `fuente` (ruta en el repo), `tags`, `actualizado`. Los hubs llevan `aliases` (`M4`, `Cuentas`).
- **Tags jerárquicos:** `modulo/M4`, `sdd/spec`, `backend/api`, `frontend/feature`, `datos/entidad`, `testing/e2e`, `devops/ci`, `ia/agente`, `entrega/V1.1`…
- **Navegación:** las notas divididas llevan arriba `↑ índice · ← anterior · → siguiente`. Al final, la sección `🔗 Relacionado` se calcula sola a partir de los IDs mencionados (M1–M15, ADR-NN, RNF-NN, RN-NN, TASK-NNN, `plan §x.y`, `spec §x.y`, `constitución §n` y los nombres de tabla entre comillas invertidas).
- En las tablas, el alias de un wikilink se escribe `[[Nota\|alias]]`.
- Este `CLAUDE.md` está excluido del grafo y de la búsqueda (`userIgnoreFilters`).
