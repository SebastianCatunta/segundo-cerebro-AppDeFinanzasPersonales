// Generador del vault de Obsidian a partir del proyecto real (solo lectura sobre SRC).
// Uso: node gen.mjs <SRC> <VAULT> <CURATED>
import fs from 'node:fs';
import path from 'node:path';

import { ADR_TITLES, COLORS, CONFIG_FILES, FOLDERS as F, MODULES, ROUTE_MODULE, ROUTE_SERVICES, WORKFLOW_DESC } from './meta.mjs';

const [, , SRC, VAULT, CURATED] = process.argv;
for (const mod of MODULES) mod.hub = `${mod.id} - ${mod.name}`;
const TODAY = '2026-10-30';
const rd = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').replace(/\r\n/g, '\n');
const ex = (p) => fs.existsSync(path.join(SRC, p));
const ls = (p) => (ex(p) ? fs.readdirSync(path.join(SRC, p)).sort() : []);
const lsFiles = (p, re = /./) => ls(p).filter((f) => fs.statSync(path.join(SRC, p, f)).isFile() && re.test(f));

// ---------------------------------------------------------------- notas
const notes = new Map(); // nombre → { folder, fm, body }
const fileNote = new Map(); // ruta del repo → nota que la documenta
const docIndex = new Map(); // ruta de .md del repo → nota índice

const sanitize = (n) => n.replace(/[\\/:*?"<>|#^[\]`]/g, '').replace(/\s+/g, ' ').trim().replace(/\.+$/, '');

function add(folder, name, body, fm = {}) {
  name = sanitize(name);
  if (notes.has(name)) throw new Error(`Nota duplicada: ${name}`);
  notes.set(name, { folder, fm, body });
  return name;
}
const L = (n, label) => (label ? `[[${sanitize(n)}|${label}]]` : `[[${sanitize(n)}]]`);
const code = (lang, text) => '```' + lang + '\n' + text.replace(/\n+$/, '') + '\n```';
const collapsed = (title, lang, text) =>
  `> [!example]- ${title}\n` + code(lang, text).split('\n').map((l) => '> ' + l).join('\n');

// ---------------------------------------------------------------- parseo de markdown
function stripFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  return m ? { fm: m[1], text: text.slice(m[0].length) } : { fm: null, text };
}

function parseMd(text) {
  const root = { level: 0, title: null, heading: null, lines: [], children: [] };
  const stack = [root];
  let fence = null;
  for (const line of text.split('\n')) {
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) {
      if (!fence) fence = f[1];
      else if (line.trim().startsWith(fence)) fence = null;
      stack.at(-1).lines.push(line);
      continue;
    }
    const h = !fence && line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (h) {
      const node = { level: h[1].length, title: h[2], heading: line, lines: [], children: [] };
      while (stack.at(-1).level >= node.level) stack.pop();
      stack.at(-1).children.push(node);
      stack.push(node);
    } else stack.at(-1).lines.push(line);
  }
  return root;
}
const render = (n) => [n.heading, ...n.lines, ...n.children.map(render)].filter((x) => x !== null).join('\n');
const cleanTitle = (t) =>
  t.replace(/\*\*/g, '').replace(/`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s*—\s*/g, ' - ').replace(/\s+/g, ' ').trim();
const trimBlank = (s) => s.replace(/^\s*\n/, '').replace(/\n\s*$/, '');

// Reescribe enlaces relativos del repo a wikilinks (fuera de bloques de código).
function rewriteLinks(text, srcFile) {
  let fence = null;
  return text
    .split('\n')
    .map((line) => {
      const f = line.match(/^\s*(```+|~~~+)/);
      if (f) {
        if (!fence) fence = f[1];
        else if (line.trim().startsWith(fence)) fence = null;
        return line;
      }
      if (fence) return line;
      return line.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (all, bang, label, target) => {
        if (bang || /^(https?:|mailto:)/.test(target)) return all;
        if (target.startsWith('#')) return label;
        const clean = target.split('#')[0];
        const repoPath = path.posix.normalize(path.posix.join(path.posix.dirname(srcFile), clean));
        const n = docIndex.get(repoPath) ?? fileNote.get(repoPath);
        if (n) return `[[${n}|${label.replace(/`/g, '')}]]`;
        return `${label} (\`${repoPath}\`)`;
      });
    })
    .join('\n');
}

const pendingRewrites = []; // [nombre, srcFile] — se reescriben al final, cuando los mapas están completos

/**
 * Divide un .md por secciones. Las secciones de nivel < depth con hijos son índices; las de nivel
 * depth (o sin hijos) son notas completas. place(node) → { folder } decide la carpeta por sección.
 */
function splitDoc({ file, prefix, depth, indexName, indexFolder, place, tags = [], tipo, extraFm = () => ({}) }) {
  const { fm: srcFm, text } = stripFrontmatter(rd(file));
  const root = parseMd(text);
  let top = root, preamble = root.lines;
  if (root.children.length === 1 && root.children[0].level === 1) {
    top = root.children[0];
    preamble = [...root.lines, ...top.lines];
  }
  docIndex.set(file, sanitize(indexName));
  const nameOf = (node) => sanitize(`${prefix} ${cleanTitle(node.title)}`);
  const emitted = [];
  const tocLines = [];

  const emit = (node, parent, siblings, i, depthIndent) => {
    const name = nameOf(node);
    tocLines.push(`${'  '.repeat(depthIndent)}- ${L(name, cleanTitle(node.title))}`);
    const nav = [`↑ ${L(parent)}`];
    if (i > 0) nav.push(`← ${L(nameOf(siblings[i - 1]))}`);
    if (i < siblings.length - 1) nav.push(`→ ${L(nameOf(siblings[i + 1]))}`);
    const isIndex = node.level < depth && node.children.length > 0;
    let body = nav.join(' · ') + '\n\n';
    if (isIndex) {
      body += [node.heading, ...node.lines].join('\n') + '\n\n**Subsecciones:**\n' +
        node.children.map((c) => `- ${L(nameOf(c), cleanTitle(c.title))}`).join('\n');
    } else body += render(node);
    const p = place(node, cleanTitle(node.title));
    add(p.folder, name, body, {
      tipo, fuente: `${file} § ${cleanTitle(node.title)}`, documento: `[[${sanitize(indexName)}]]`,
      tags: [...tags, ...(p.tags ?? [])], ...extraFm(node, cleanTitle(node.title)),
    });
    pendingRewrites.push([name, file]);
    emitted.push({ name, node, title: cleanTitle(node.title) });
    if (isIndex) node.children.forEach((c, j) => emit(c, name, node.children, j, depthIndent + 1));
  };
  top.children.forEach((c, i) => emit(c, indexName, top.children, i, 0));

  let body = `# ${cleanTitle(top.title ?? indexName)}\n\n`;
  body += `> [!info] Fuente\n> Nota índice generada desde \`${file}\` del proyecto real. Cada sección es una nota propia; el texto se conserva tal cual.\n\n`;
  if (srcFm) body += '**Frontmatter original:**\n\n' + code('yaml', srcFm) + '\n\n';
  body += trimBlank(preamble.join('\n')) + '\n\n## Secciones\n\n' + tocLines.join('\n');
  add(indexFolder, indexName, body, { tipo: 'indice-documento', fuente: file, tags: [...tags, 'indice'] });
  pendingRewrites.push([sanitize(indexName), file]);
  return emitted;
}

// Las rutas absolutas del equipo del autor se generalizan: `C:\Users\<usuario>\...\AppDeFinanzasPersonales\x`
// pasa a `<proyecto>\x`. Cubre barras invertidas y normales.
const genericPaths = (t) =>
  t.replace(/[A-Za-z]:[\\/]+Users[\\/]+[^\\/\s`'")]+(?:[\\/]+[^\\/\s`'")]+)*?[\\/]+AppDeFinanzasPersonales/g, '<proyecto>');

// Copia un .md entero como una nota (agentes, skills, runs).
function wholeDoc({ file, folder, name, tipo, tags = [], intro = '' }) {
  const { fm: srcFm, text: rawText } = stripFrontmatter(rd(file));
  const text = genericPaths(rawText);
  let body = intro ? intro + '\n\n' : '';
  if (srcFm) body += '**Frontmatter original:**\n\n' + code('yaml', srcFm) + '\n\n';
  body += text;
  docIndex.set(file, sanitize(name));
  add(folder, name, body, { tipo, fuente: file, tags });
  pendingRewrites.push([sanitize(name), file]);
}

// ---------------------------------------------------------------- utilidades de código
function docBefore(text, idx) {
  const before = text.slice(0, idx);
  const m = before.match(/\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*$/);
  return m ? m[1].split('\n').map((l) => l.replace(/^\s*\*\s?/, '')).join(' ').replace(/\s+/g, ' ').trim() : '';
}
function fileDoc(text) {
  // Primer comentario de documentación del archivo (JSDoc, o // al inicio).
  const head = text.match(/^(?:\s*\/\/[^\n]*\n)+/);
  if (head) {
    const t = head[0].split('\n').map((l) => l.replace(/^\s*\/\/\s?/, '')).join(' ').replace(/\s+/g, ' ').trim();
    if (t && !t.startsWith('#!')) return t;
  }
  const m = text.match(/\/\*\*((?:(?!\*\/)[\s\S])*)\*\//);
  return m ? m[1].split('\n').map((l) => l.replace(/^\s*\*\s?/, '')).join(' ').replace(/\s+/g, ' ').trim() : '';
}
function exportsOf(text) {
  const out = [];
  const re = /^export (?:async )?(function|const|class|type|interface|enum) (\w+)/gm;
  let m;
  while ((m = re.exec(text))) out.push({ kind: m[1], name: m[2], doc: docBefore(text, m.index) });
  return out;
}
const esc = (s) => s.replace(/\|/g, '\\|');
const firstDescribe = (text) => (text.match(/describe\(\s*['"`]([^'"`]+)['"`]/) ?? [])[1] ?? '';

// ================================================================ 1. DOCUMENTOS .md DEL PROYECTO
const moduleDocs = {}; // M → { spec, plan, tareas:[], coherencia }
const modOf = (title) => (title.match(/\bM(1[0-5]|[1-9])\b/) ?? [])[0];
const pushMod = (m, kind, name) => {
  if (!m) return;
  moduleDocs[m] ??= { tareas: [] };
  if (kind === 'tareas') moduleDocs[m].tareas.push(name);
  else moduleDocs[m][kind] ??= name;
};

// README: cada sección va a su categoría
const README_PLACE = {
  'Despliegues': F.devops, 'Equipo': F.inicio, 'Stack': F.arq, 'Estructura': F.arq,
  'Cómo correrlo en local': F.devops, 'Pruebas y calidad': F.test, 'Integración y despliegue continuos': F.devops,
  'Desarrollo guiado por especificaciones (SDD) con agentes': F.ia, 'Secretos y variables': F.devops,
  'Puesta en marcha del despliegue (una sola vez)': F.devops, 'Estado del proyecto': F.inicio, 'Documentación': F.inicio,
};
splitDoc({
  file: 'README.md', prefix: 'README -', depth: 2, indexName: 'README - App de Finanzas Personales', indexFolder: F.inicio,
  tipo: 'readme', tags: ['readme'], place: (n, t) => ({ folder: (README_PLACE[t] ?? F.inicio) + '/README' }),
});

splitDoc({
  file: 'docs/constitution.md', prefix: 'Constitución', depth: 2, indexName: 'Constitución', indexFolder: `${F.spec}/Constitucion`,
  tipo: 'constitucion', tags: ['sdd/constitucion'], place: () => ({ folder: `${F.spec}/Constitucion` }),
});

for (const e of splitDoc({
  file: '001-appFinanzas-mvp/spec.md', prefix: 'Spec', depth: 3, indexName: 'Spec - Especificación funcional', indexFolder: `${F.spec}/Spec`,
  tipo: 'spec', tags: ['sdd/spec'],
  place: (n, t) => ({ folder: `${F.spec}/Spec`, tags: modOf(t) ? [`modulo/${modOf(t)}`] : [] }),
  extraFm: (n, t) => (modOf(t) ? { modulo: modOf(t) } : {}),
})) if (/^2\.\d+ M/.test(e.title)) pushMod(modOf(e.title), 'spec', e.name);

const planFolder = (t) => {
  const num = t.match(/^(\d+)/)?.[1];
  if (num === '1' || num === '2') return `${F.arq}/Plan`;
  if (num === '3') return `${F.datos}/Plan`;
  if (num === '5') return `${F.test}/Plan`;
  return `${F.spec}/Plan`;
};
for (const e of splitDoc({
  file: '001-appFinanzas-mvp/plan.md', prefix: 'Plan', depth: 3, indexName: 'Plan - Plan de diseño técnico', indexFolder: `${F.spec}/Plan`,
  tipo: 'plan', tags: ['sdd/plan'],
  place: (n, t) => ({ folder: planFolder(t), tags: modOf(t) && /^4\./.test(t) ? [`modulo/${modOf(t)}`] : [] }),
  extraFm: (n, t) => (modOf(t) && /^4\./.test(t) ? { modulo: modOf(t) } : {}),
})) if (/^4\.\d+ M/.test(e.title)) pushMod(modOf(e.title), 'plan', e.name);

for (const e of splitDoc({
  file: '001-appFinanzas-mvp/tasks.md', prefix: 'Tareas', depth: 3, indexName: 'Tareas - Backlog del MVP', indexFolder: `${F.spec}/Tareas`,
  tipo: 'tareas', tags: ['sdd/tareas'],
  place: (n, t) => ({ folder: `${F.spec}/Tareas`, tags: modOf(t) ? [`modulo/${modOf(t)}`] : [] }),
  extraFm: (n, t) => {
    const fase = t.match(/^Fase (\d+)/)?.[1];
    const tasks = (render(n).match(/`TASK-\d{3}`:/g) ?? []).length;
    return { ...(fase ? { fase: Number(fase), tareas: tasks } : {}), ...(modOf(t) ? { modulo: modOf(t) } : {}) };
  },
})) if (/^Fase/.test(e.title)) pushMod(modOf(e.title), 'tareas', e.name);

for (const e of splitDoc({
  file: '001-appFinanzas-mvp/coherencia.md', prefix: 'Coherencia', depth: 3, indexName: 'Coherencia - Informe de revisión SDD', indexFolder: `${F.test}/Coherencia`,
  tipo: 'coherencia', tags: ['qa/coherencia'],
  place: (n, t) => ({ folder: `${F.test}/Coherencia`, tags: modOf(t) ? [`modulo/${modOf(t)}`] : [] }),
})) if (/^M\d/.test(e.title)) pushMod(modOf(e.title), 'coherencia', e.name);

splitDoc({
  file: 'docs/design-direction.md', prefix: 'Diseño -', depth: 2, indexName: 'Diseño - Dirección visual de la web', indexFolder: `${F.front}/Diseno`,
  tipo: 'diseno', tags: ['frontend/diseno'], place: () => ({ folder: `${F.front}/Diseno` }),
});
splitDoc({
  file: 'docs/execution-protocol.md', prefix: 'Protocolo', depth: 2, indexName: 'Protocolo de ejecución con agentes', indexFolder: `${F.ia}/Protocolo`,
  tipo: 'protocolo', tags: ['ia/protocolo'], place: () => ({ folder: `${F.ia}/Protocolo` }),
});
splitDoc({
  file: 'docs/latencia-despliegue.md', prefix: 'Latencia -', depth: 2, indexName: 'Latencia del despliegue', indexFolder: `${F.devops}/Latencia`,
  tipo: 'devops', tags: ['devops/latencia'], place: () => ({ folder: `${F.devops}/Latencia` }),
});
splitDoc({
  file: 'docs/asignaciones-fases-14-25.md', prefix: 'Asignaciones 14-25 -', depth: 2, indexName: 'Asignaciones de las Fases 14 a 25', indexFolder: `${F.spec}/Tareas/Asignaciones`,
  tipo: 'asignaciones', tags: ['equipo/asignaciones'], place: () => ({ folder: `${F.spec}/Tareas/Asignaciones` }),
});
wholeDoc({ file: 'docs/asignaciones.md', folder: `${F.spec}/Tareas/Asignaciones`, name: 'Asignaciones de las Fases 7 a 25', tipo: 'asignaciones', tags: ['equipo/asignaciones'] });

// .claude: agentes, skills y ejecuciones
for (const f of lsFiles('.claude/agents', /\.md$/)) {
  wholeDoc({ file: `.claude/agents/${f}`, folder: `${F.ia}/Agentes`, name: `Agente - ${f.replace('.md', '')}`, tipo: 'agente', tags: ['ia/agente'],
    intro: `> [!abstract] Subagente de Claude Code definido en \`.claude/agents/${f}\`. Ver [[Pipeline SDD con agentes]].` });
}
for (const d of ls('.claude/skills')) {
  wholeDoc({ file: `.claude/skills/${d}/SKILL.md`, folder: `${F.ia}/Skills`, name: `Skill - ${d}`, tipo: 'skill', tags: ['ia/skill'],
    intro: `> [!abstract] Skill de Claude Code (\`/${d}\`) definida en \`.claude/skills/${d}/SKILL.md\`. Ver [[Pipeline SDD con agentes]].` });
}
const RUN_KIND = { 'context.md': 'Paquete de contexto', 'audit.md': 'Auditoría', 'verdict.md': 'Veredicto' };
for (const t of ls('.claude/run').filter((d) => /^TASK-/.test(d))) {
  for (const f of lsFiles(`.claude/run/${t}`, /\.md$/)) {
    wholeDoc({ file: `.claude/run/${t}/${f}`, folder: `${F.ia}/Ejecuciones/${t}`, name: `${t} - ${RUN_KIND[f] ?? f}`, tipo: 'ejecucion', tags: ['ia/ejecucion'],
      intro: `> [!abstract] Estado local del pipeline para ${t} (\`.claude/run/${t}/${f}\`, no versionado). Etapa: **${RUN_KIND[f] ?? f}**. Ver [[Protocolo 2. Skill implement-task TASK-XXX]].` });
  }
}

// ADR individuales (desde la tabla del plan §1.3)
const adrNotes = {};
{
  const plan = rd('001-appFinanzas-mvp/plan.md');
  const rows = plan.split('\n').filter((l) => /^\| ADR-\d{2} \|/.test(l));
  for (const row of rows) {
    const cells = row.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim());
    const [id, dec, why, alt] = cells;
    const num = id.slice(4);
    const name = add(`${F.arq}/ADR`, `${id} - ${ADR_TITLES[num] ?? 'Decisión'}`,
      `↑ [[Plan 1.3 Registro de decisiones (ADR)]]\n\n# ${id} · ${ADR_TITLES[num] ?? ''}\n\n## Decisión\n${dec}\n\n## Motivo\n${why}\n\n## Alternativas descartadas\n${alt}\n`,
      { tipo: 'adr', adr: id, fuente: '001-appFinanzas-mvp/plan.md § 1.3', tags: ['arquitectura/adr'] });
    adrNotes[num] = name;
  }
}

// ================================================================ 2. DATOS: Prisma
const schema = rd('packages/db/prisma/schema.prisma');
const models = []; const enums = [];
{
  const lines = schema.split('\n');
  let pendingComments = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^\/\/ /.test(l)) { pendingComments.push(l.replace(/^\/\/ ?/, '')); continue; }
    const m = l.match(/^(model|enum) (\w+) \{/);
    if (!m) { if (l.trim() !== '') pendingComments = []; continue; }
    const block = [l];
    while (!/^\}/.test(lines[++i])) block.push(lines[i]);
    block.push('}');
    const item = { kind: m[1], name: m[2], block: block.join('\n'), comments: pendingComments.join(' ') };
    pendingComments = [];
    (m[1] === 'model' ? models : enums).push(item);
  }
}
const modelNames = new Set(models.map((m) => m.name));
const enumNames = new Set(enums.map((e) => e.name));
const tableToModel = {};
const migrations = ls('packages/db/prisma/migrations').filter((d) => /^\d{4}_/.test(d));
const migSql = Object.fromEntries(migrations.map((d) => [d, rd(`packages/db/prisma/migrations/${d}/migration.sql`)]));
const modelModule = {};
for (const mod of MODULES) for (const m of mod.models) modelModule[m] ??= mod.id;
modelModule['JobRun'] = null;

for (const m of models) {
  m.table = (m.block.match(/@@map\("(\w+)"\)/) ?? [])[1] ?? m.name;
  tableToModel[m.table] = `Entidad - ${m.name}`;
}
for (const m of models) {
  const fields = []; const rels = new Set(); const usesEnums = new Set(); const constraints = [];
  let doc = '';
  for (const raw of m.block.split('\n').slice(1, -1)) {
    const l = raw.trim();
    if (!l) continue;
    if (l.startsWith('///')) { doc += l.slice(3).trim() + ' '; continue; }
    if (l.startsWith('//')) continue;
    if (l.startsWith('@@')) { constraints.push(l); continue; }
    const [fname, ftype, ...rest] = l.split(/\s+/);
    const base = ftype.replace(/[?[\]]/g, '');
    if (modelNames.has(base)) rels.add(base);
    if (enumNames.has(base)) usesEnums.add(base);
    const col = (rest.join(' ').match(/@map\("(\w+)"\)/) ?? [])[1] ?? fname;
    fields.push({ fname, ftype, col, attrs: rest.join(' '), doc: doc.trim(), isRel: modelNames.has(base) });
    doc = '';
  }
  const createdIn = migrations.filter((d) => new RegExp(`CREATE TABLE ${m.table}\\b`).test(migSql[d]));
  const touchedIn = migrations.filter((d) => !createdIn.includes(d) && new RegExp(`(ALTER TABLE ${m.table}\\b|REFERENCES ${m.table}\\s*\\()`).test(migSql[d]));
  const mod = modelModule[m.name];
  const planSec = m.comments.match(/plan §(3\.\d)/)?.[1];
  let body = `# ${m.name} → tabla \`${m.table}\`\n\n`;
  if (m.comments) body += `> [!quote] Comentario del schema\n> ${m.comments}\n\n`;
  body += `- **Módulo:** ${mod ? L(MODULES.find((x) => x.id === mod).hub) : 'infraestructura (jobs)'}\n`;
  if (planSec) body += `- **Diseño:** plan §${planSec}\n`;
  body += `- **Creada en:** ${createdIn.map((d) => L(`Migración ${d}`)).join(', ') || '—'}\n`;
  if (touchedIn.length) body += `- **Modificada/referenciada en:** ${touchedIn.map((d) => L(`Migración ${d}`)).join(', ')}\n`;
  body += `- **Relaciones:** ${[...rels].filter((r) => r !== m.name).map((r) => L(`Entidad - ${r}`)).join(', ') || '—'}\n`;
  if (usesEnums.size) body += `- **Enums:** ${[...usesEnums].map((e) => L('Enums de Prisma', e)).join(', ')}\n`;
  body += `\n## Columnas\n\n| Campo | Columna | Tipo | Atributos | Nota |\n|---|---|---|---|---|\n`;
  for (const f of fields.filter((f) => !f.isRel)) body += `| \`${f.fname}\` | \`${f.col}\` | \`${f.ftype}\` | ${esc(f.attrs.replace(/@map\("\w+"\)\s*/, '')) || ''} | ${esc(f.doc)} |\n`;
  const relFields = fields.filter((f) => f.isRel);
  if (relFields.length) {
    body += `\n## Relaciones de Prisma\n\n| Campo | Modelo | Detalle |\n|---|---|---|\n`;
    for (const f of relFields) body += `| \`${f.fname}\` | ${L(`Entidad - ${f.ftype.replace(/[?[\]]/g, '')}`)} \`${f.ftype}\` | ${esc(f.attrs)} |\n`;
  }
  if (constraints.length) body += `\n## Índices y restricciones (Prisma)\n\n${constraints.map((c) => `- \`${c}\``).join('\n')}\n`;
  body += `\n${collapsed('Bloque original en schema.prisma', 'prisma', m.block)}\n`;
  add(`${F.datos}/Entidades`, `Entidad - ${m.name}`, body, {
    tipo: 'entidad', tabla: m.table, ...(mod ? { modulo: mod } : {}), fuente: 'packages/db/prisma/schema.prisma',
    tags: ['datos/entidad', ...(mod ? [`modulo/${mod}`] : [])],
  });
}
{
  let body = '# Enums de Prisma\n\nTipos enumerados de PostgreSQL definidos en `schema.prisma` y creados por la ' + L('Migración 0001_base') + ' (ver ' + L('Plan 3.2 Tipos enumerados') + ').\n\n';
  for (const e of enums) {
    const values = e.block.split('\n').slice(1, -1).map((l) => l.trim()).filter((l) => l && !l.startsWith('//') && !l.startsWith('@@'));
    const usedBy = models.filter((m) => new RegExp(`\\s${e.name}[?\\[\\s]`).test(m.block)).map((m) => L(`Entidad - ${m.name}`));
    const map = (e.block.match(/@@map\("(\w+)"\)/) ?? [])[1];
    body += `## ${e.name}${map ? ` (\`${map}\`)` : ''}\n\n- **Valores:** ${values.map((v) => `\`${v.split(/\s/)[0]}\``).join(', ')}\n- **Usado por:** ${usedBy.join(', ') || '—'}\n\n`;
  }
  add(F.datos, 'Enums de Prisma', body, { tipo: 'datos', fuente: 'packages/db/prisma/schema.prisma', tags: ['datos/enum'] });
}
for (const d of migrations) {
  const sql = migSql[d];
  const header = (sql.match(/^(?:--[^\n]*\n)+/) ?? [''])[0].split('\n').map((l) => l.replace(/^--\s?/, '')).join(' ').trim();
  const grab = (re) => [...new Set([...sql.matchAll(re)].map((x) => x[1]))];
  const tables = grab(/CREATE TABLE (\w+)/g), altered = grab(/ALTER TABLE (\w+)/g);
  const types = grab(/CREATE TYPE (\w+)/g), funcs = grab(/CREATE (?:OR REPLACE )?FUNCTION (\w+)/g);
  const triggers = grab(/CREATE TRIGGER (\w+)/g), idx = grab(/CREATE (?:UNIQUE )?INDEX (\w+)/g), ext = grab(/CREATE EXTENSION IF NOT EXISTS (\w+)/g);
  const link = (t) => (tableToModel[t] ? L(tableToModel[t], t) : `\`${t}\``);
  let body = `# Migración ${d}\n\n> [!quote] Encabezado del SQL\n> ${header || '—'}\n\n`;
  const i = migrations.indexOf(d);
  body += `← ${i > 0 ? L(`Migración ${migrations[i - 1]}`) : '—'} · → ${i < migrations.length - 1 ? L(`Migración ${migrations[i + 1]}`) : '—'} · ↑ ${L('Modelo de datos')}\n\n`;
  if (ext.length) body += `- **Extensiones:** ${ext.map((x) => `\`${x}\``).join(', ')}\n`;
  if (types.length) body += `- **Tipos creados:** ${types.map((x) => `\`${x}\``).join(', ')} (ver ${L('Enums de Prisma')})\n`;
  if (tables.length) body += `- **Tablas creadas:** ${tables.map(link).join(', ')}\n`;
  if (altered.length) body += `- **Tablas alteradas:** ${altered.map(link).join(', ')}\n`;
  if (funcs.length) body += `- **Funciones:** ${funcs.map((x) => `\`${x}\``).join(', ')}\n`;
  if (triggers.length) body += `- **Triggers:** ${triggers.map((x) => `\`${x}\``).join(', ')}\n`;
  if (idx.length) body += `- **Índices:** ${idx.map((x) => `\`${x}\``).join(', ')}\n`;
  body += `- **Líneas:** ${sql.split('\n').length}\n\n${collapsed('SQL completo', 'sql', sql)}\n`;
  fileNote.set(`packages/db/prisma/migrations/${d}/migration.sql`, `Migración ${d}`);
  add(`${F.datos}/Migraciones`, `Migración ${d}`, body, { tipo: 'migracion', fuente: `packages/db/prisma/migrations/${d}/migration.sql`, tags: ['datos/migracion'] });
}

// ================================================================ 3. PAQUETES compartidos
const contractNote = {}; // export → nota
for (const f of lsFiles('packages/contracts/src', /\.ts$/).filter((f) => f !== 'index.ts')) {
  const t = rd(`packages/contracts/src/${f}`); const base = f.replace('.ts', '');
  const name = `Contrato - ${base}`;
  const exps = exportsOf(t);
  for (const e of exps) contractNote[e.name] ??= name;
  const mods = MODULES.filter((m) => m.contracts.includes(base));
  let body = `# Contratos Zod · \`${f}\`\n\nArchivo \`packages/contracts/src/${f}\` del paquete ${L('Paquete contracts')}. Define schemas Zod compartidos por la web y el API (única fuente de entradas, salidas y errores).\n\n`;
  if (mods.length) body += `**Módulo:** ${mods.map((m) => L(m.hub)).join(', ')}\n\n`;
  const doc = fileDoc(t); if (doc) body += `> [!quote] Comentario del código\n> ${doc}\n\n`;
  body += `## Exportaciones (${exps.length})\n\n| Nombre | Tipo | Descripción |\n|---|---|---|\n` + exps.map((e) => `| \`${e.name}\` | ${e.kind} | ${esc(e.doc)} |`).join('\n') + '\n';
  fileNote.set(`packages/contracts/src/${f}`, name);
  add(`${F.arq}/Paquetes/contracts`, name, body, { tipo: 'contrato', fuente: `packages/contracts/src/${f}`, tags: ['paquete/contracts', ...mods.map((m) => `modulo/${m.id}`)] });
}
for (const f of lsFiles('packages/domain/src', /\.ts$/).filter((f) => f !== 'index.ts')) {
  const t = rd(`packages/domain/src/${f}`); const base = f.replace('.ts', '');
  const exps = exportsOf(t);
  const mods = MODULES.filter((m) => m.domain.includes(base));
  const tests = lsFiles('packages/domain/test').filter((x) => x.startsWith(base));
  let body = `# Dominio · \`${f}\`\n\nReglas puras (sin E/S) del paquete ${L('Paquete domain')}, compartidas por la web y el API (capa 3, ${L('ADR-19 - Backend en capas')}).\n\n`;
  if (mods.length) body += `**Módulo:** ${mods.map((m) => L(m.hub)).join(', ')}\n\n`;
  const doc = fileDoc(t); if (doc) body += `> [!quote] Comentario del código\n> ${doc}\n\n`;
  body += `## Exportaciones (${exps.length})\n\n| Nombre | Tipo | Descripción |\n|---|---|---|\n` + exps.map((e) => `| \`${e.name}\` | ${e.kind} | ${esc(e.doc)} |`).join('\n') + '\n';
  if (tests.length) body += `\n**Pruebas:** ${tests.map((x) => `\`packages/domain/test/${x}\``).join(', ')}\n`;
  fileNote.set(`packages/domain/src/${f}`, `Dominio - ${base}`);
  add(`${F.arq}/Paquetes/domain`, `Dominio - ${base}`, body, { tipo: 'dominio', fuente: `packages/domain/src/${f}`, tags: ['paquete/domain', ...mods.map((m) => `modulo/${m.id}`)] });
}

// ================================================================ 4. BACKEND
const API = 'apps/api/src';

const describeFiles = (dir, folderName, tag, kind) => {
  const files = lsFiles(dir, /\.ts$/);
  const rows = files.map((f) => {
    const t = rd(`${dir}/${f}`);
    const exps = exportsOf(t).map((e) => `\`${e.name}\``).join(', ');
    return { f, doc: fileDoc(t), exps, lines: t.split('\n').length };
  });
  return rows;
};

// 4.1 Servicios: métodos de la interfaz con su JSDoc
function serviceInfo(base) {
  const p = `${API}/application/services/${base}.service.ts`;
  if (!ex(p)) return null;
  const t = rd(p);
  const m = t.match(/export interface (\w+Service) \{([\s\S]*?)\n\}/);
  const methods = [];
  if (m) {
    const block = m[2];
    const re = /^  (\w+)\(/gm; let x;
    while ((x = re.exec(block))) methods.push({ name: x[1], doc: docBefore(block, x.index) });
  }
  const repos = [...new Set([...t.matchAll(/repos\.(\w+)/g)].map((x) => x[1]))].sort();
  return { file: p, iface: m?.[1], methods, repos, doc: fileDoc(t), lines: t.split('\n').length };
}

// 4.2 Rutas: endpoints por router exportado
const appTs = rd(`${API}/presentation/app.ts`);
const mounts = {}; // nombre del router → prefijo
for (const x of appTs.matchAll(/app\.use\(\s*'([^']+)',\s*(\w+)\(/g)) mounts[x[2]] = x[1];
function routesOf(file) {
  const t = rd(file);
  const out = [];
  const starts = [...t.matchAll(/export const (\w+Router) =/g)].map((x) => ({ name: x[1], idx: x.index }));
  const re = /router\.(get|post|put|patch|delete)\(\s*'([^']+)'\s*,([\s\S]*?)\);/g; let x;
  while ((x = re.exec(t))) {
    const owner = starts.filter((s) => s.idx < x.index).at(-1)?.name;
    const args = x[3];
    out.push({
      method: x[1].toUpperCase(), path: (mounts[owner] ?? '') + (x[2] === '/' ? '' : x[2]),
      session: /withSession|requireSession/.test(args), schema: (args.match(/validate\((\w+)/) ?? [])[1],
      handler: (args.match(/controller\.(\w+)/) ?? [])[1] ?? (args.match(/(\w+)\s*$/) ?? [])[1],
      gate: (args.match(/releaseGate\('(\w+)'\)/) ?? [])[1],
    });
  }
  return out;
}
const endpointRows = (rs) => '| Método | Ruta | Sesión | Validación (contrato) | Handler |\n|---|---|---|---|---|\n' +
  rs.map((r) => `| \`${r.method}\` | \`${r.path}\` | ${r.session ? '✅' : '—'} | ${r.schema ? (contractNote[r.schema] ? L(contractNote[r.schema], r.schema) : `\`${r.schema}\``) : '—'} | \`${r.handler ?? ''}\` |`).join('\n');

const allEndpoints = [];
for (const f of lsFiles(`${API}/presentation/routes`, /\.routes\.ts$/)) {
  const base = f.replace('.routes.ts', '');
  const rs = routesOf(`${API}/presentation/routes/${f}`);
  const modId = ROUTE_MODULE[base]; const mod = MODULES.find((m) => m.id === modId);
  allEndpoints.push(...rs.map((r) => ({ ...r, base, modId })));
  const services = (ROUTE_SERVICES[base] ?? [base]).map(serviceInfo).filter(Boolean);
  const ctrl = `${API}/presentation/controllers/${base}.controller.ts`;
  const pres = `${API}/presentation/presenters/${base}.presenter.ts`;
  const tests = lsFiles('apps/api/test/http').filter((x) => x.startsWith(base));
  const itests = lsFiles('apps/api/test/integration').filter((x) => x.startsWith(base.replace(/s$/, '')));
  const name = `API ${base}`;
  let body = `# API · ${base}\n\n- **Módulo:** ${mod ? L(mod.hub) : '—'}\n- **Montaje:** ${[...new Set(rs.map((r) => '`' + r.path.split('/').slice(0, 3).join('/') + '`'))].join(', ')}\n`;
  body += `- **Archivos:** \`presentation/routes/${f}\`${ex(ctrl) ? `, \`presentation/controllers/${base}.controller.ts\`` : ''}${ex(pres) ? `, \`presentation/presenters/${base}.presenter.ts\`` : ''}\n`;
  body += `- **Capa:** ${L('API - Capa de presentación')} → ${L('API - Capa de aplicación')}\n\n`;
  body += `## Endpoints (${rs.length})\n\n${endpointRows(rs)}\n\n`;
  body += `Cada ruta con sesión pasa por \`requireSession\` + \`trackActivity\` y, si tiene cuerpo, por \`validate(schema)\` (ver ${L('API - Middlewares')}).\n\n`;
  for (const s of services) {
    body += `## Servicio \`${s.iface ?? path.basename(s.file)}\` (${s.lines} líneas)\n\nArchivo \`${s.file.replace(API + '/', '')}\`.\n\n`;
    if (s.methods.length) body += '| Caso de uso | Descripción |\n|---|---|\n' + s.methods.map((m) => `| \`${m.name}\` | ${esc(m.doc)} |`).join('\n') + '\n\n';
    if (s.repos.length) body += `**Repositorios que usa (vía UnitOfWork):** ${s.repos.map((r) => `\`${r}\``).join(', ')}\n\n`;
  }
  if (mod?.shared.length) body += `**Servicios compartidos relacionados:** ${mod.shared.map((x) => L(`Compartido - ${x}`)).join(', ')}\n\n`;
  if (mod?.jobs.length) body += `**Jobs relacionados:** ${mod.jobs.map((x) => L(`Job - ${x}`)).join(', ')}\n\n`;
  if (tests.length || itests.length) body += `## Pruebas\n\n${[...tests.map((x) => `- HTTP: \`apps/api/test/http/${x}\``), ...itests.map((x) => `- Integración: \`apps/api/test/integration/${x}\``)].join('\n')}\n`;
  fileNote.set(`${API}/presentation/routes/${f}`, name);
  add(`${F.back}/Endpoints`, name, body, { tipo: 'api', modulo: modId, fuente: `apps/api/src/presentation/routes/${f}`, tags: ['backend/api', `modulo/${modId}`] });
}
{
  // endpoints internos
  const rs = [...routesOf(`${API}/presentation/internal/jobs.controller.ts`), ...routesOf(`${API}/presentation/internal/test-support.controller.ts`)];
  const t1 = rd(`${API}/presentation/internal/jobs.controller.ts`), t2 = rd(`${API}/presentation/internal/test-support.controller.ts`);
  let body = `# API · Endpoints internos\n\n- \`POST /internal/jobs/tick\`: lo llama cron-job.org cada minuto con el encabezado \`x-jobs-secret\` (ADR-01). Ejecuta ${L('Job - tick')}.\n- \`/internal/test/*\`: soporte de pruebas E2E (buzón falso, usuarios, tasas y avisos). Solo existe con \`INTEGRATIONS=fake\`.\n\n`;
  body += '| Método | Ruta |\n|---|---|\n' + rs.map((r) => `| \`${r.method}\` | \`${r.path}\` |`).join('\n') + '\n\n';
  const d1 = fileDoc(t1), d2 = fileDoc(t2);
  if (d1) body += `> [!quote] jobs.controller.ts\n> ${d1}\n\n`;
  if (d2) body += `> [!quote] test-support.controller.ts\n> ${d2}\n`;
  add(`${F.back}/Endpoints`, 'API internal (jobs y test-support)', body, { tipo: 'api', fuente: 'apps/api/src/presentation/internal', tags: ['backend/api', 'backend/jobs'] });
}
{
  // Catálogo de todos los endpoints
  let body = `# Catálogo de endpoints del API\n\nTodos los endpoints montados en \`apps/api/src/presentation/app.ts\`, extraídos de las rutas (${allEndpoints.length} en total). Ver ${L('Flujo - Petición HTTP en el API')}.\n\n| Método | Ruta | Módulo | Sesión | Nota |\n|---|---|---|---|---|\n`;
  body += allEndpoints.map((r) => `| \`${r.method}\` | \`${r.path}\` | ${L(MODULES.find((m) => m.id === r.modId).hub, r.modId)} | ${r.session ? '✅' : '—'} | ${L(`API ${r.base}`)} |`).join('\n');
  add(F.back, 'Catálogo de endpoints', body, { tipo: 'indice', tags: ['backend/api'] });
}

// 4.3 Capas: archivos con su comentario
function layerNote(dir, name, folder, title, intro, tags, linkFn) {
  const rows = describeFiles(dir);
  let body = `# ${title}\n\n${intro}\n\n| Archivo | Líneas | Descripción (comentario del código) | Exporta |\n|---|---|---|---|\n`;
  body += rows.map((r) => `| ${linkFn ? linkFn(r.f) : `\`${r.f}\``} | ${r.lines} | ${esc(r.doc)} | ${esc(r.exps)} |`).join('\n') + '\n';
  for (const r of rows) fileNote.set(`${dir}/${r.f}`, sanitize(name));
  return add(folder, name, body, { tipo: 'backend', fuente: dir, tags });
}
layerNote(`${API}/presentation/middlewares`, 'API - Middlewares', `${F.back}/Capas`, 'Middlewares de Express',
  'Cadena global en `app.ts`: `traceId` → `serverTiming` → `requestLog` → `checkOrigin` → `requireJson` → `express.json()` → `catchUp`, después los routers y al final `errorHandler`. Por ruta: `requireSession`, `trackActivity`, `validate(schema)` y `releaseGate(module)`.', ['backend/presentacion']);
layerNote(`${API}/presentation/presenters`, 'API - Presentadores', `${F.back}/Capas`, 'Presentadores (entidad → DTO)',
  'Convierten las entidades de aplicación en los DTO de `packages/contracts` que devuelve cada endpoint. Uno por grupo de rutas.', ['backend/presentacion'],
  (f) => `\`${f}\` (${L(`API ${f.replace('.presenter.ts', '')}`)})`);
layerNote(`${API}/application/ports`, 'API - Puertos', `${F.back}/Capas`, 'Puertos de la capa de aplicación',
  'Interfaces que la aplicación define y la infraestructura implementa (inversión de dependencias, ADR-19). `repositories.ts` reúne todos los repositorios (1.400 líneas).', ['backend/aplicacion']);
layerNote(`${API}/infrastructure/persistence/repositories`, 'API - Repositorios Prisma', `${F.back}/Capas`, 'Repositorios Prisma',
  `Implementaciones de los puertos de repositorio sobre Prisma. Reciben el cliente de la transacción y el \`userId\` de la sesión (aislamiento, ${L('ADR-05 - Aislamiento por usuario')}). Nunca abren transacciones: eso lo hace el ${L('API - Unit of Work y aislamiento')}.`, ['backend/infraestructura'],
  (f) => {
    const guess = f.replace('.repository.ts', '').split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
    const model = [...modelNames].find((m) => m === guess || m === guess.replace(/^Ledger$/, 'LedgerTransaction'));
    return `\`${f}\`${model ? ` → ${L(`Entidad - ${model}`)}` : ''}`;
  });
layerNote(`${API}/infrastructure/persistence`, 'API - Persistencia', `${F.back}/Capas`, 'Persistencia (cliente Prisma, lease de jobs, readiness)',
  `Infraestructura de datos fuera de los repositorios: cliente Prisma único con la extensión de aislamiento, ${L('API - Unit of Work y aislamiento')}, contador de consultas para \`Server-Timing\`, readiness de \`/api/health/ready\`, lease de \`job_run\` y el almacén de mantenimiento.`, ['backend/infraestructura']);

// Compartidos y jobs: una nota por archivo
for (const f of lsFiles(`${API}/application/shared`, /\.ts$/)) {
  const t = rd(`${API}/application/shared/${f}`); const base = f.replace('.ts', '');
  const mods = MODULES.filter((m) => m.shared.includes(base));
  const exps = exportsOf(t);
  let body = `# Servicio compartido · \`${f}\`\n\nCapa de aplicación (\`apps/api/src/application/shared/${f}\`, ${t.split('\n').length} líneas). Lo usan varios casos de uso dentro de la misma transacción.\n\n`;
  if (mods.length) body += `**Módulos:** ${mods.map((m) => L(m.hub)).join(', ')}\n\n`;
  const d = fileDoc(t); if (d) body += `> [!quote] Comentario del código\n> ${d}\n\n`;
  body += `| Exportación | Tipo | Descripción |\n|---|---|---|\n${exps.map((e) => `| \`${e.name}\` | ${e.kind} | ${esc(e.doc)} |`).join('\n')}\n`;
  fileNote.set(`${API}/application/shared/${f}`, `Compartido - ${base}`);
  add(`${F.back}/Compartidos`, `Compartido - ${base}`, body, { tipo: 'backend', fuente: `apps/api/src/application/shared/${f}`, tags: ['backend/aplicacion', ...mods.map((m) => `modulo/${m.id}`)] });
}
for (const f of lsFiles(`${API}/application/jobs`, /\.ts$/)) {
  const t = rd(`${API}/application/jobs/${f}`); const base = f.replace('.ts', '');
  const mods = MODULES.filter((m) => m.jobs.includes(base));
  const exps = exportsOf(t);
  const docs = [...t.matchAll(/\/\*\*((?:(?!\*\/)[\s\S])*)\*\//g)].map((x) => x[1].split('\n').map((l) => l.replace(/^\s*\*\s?/, '')).join(' ').replace(/\s+/g, ' ').trim());
  let body = `# Job · \`${f}\`\n\nCapa de aplicación (\`apps/api/src/application/jobs/${f}\`). Lo ejecuta ${base === 'tick' ? 'el endpoint interno' : L('Job - tick')} y, si tiene alcance por usuario, el *catch-up* de la primera petición del día (ADR-01). Ver ${L('Flujo - Tick de jobs')}.\n\n`;
  if (mods.length) body += `**Módulos:** ${mods.map((m) => L(m.hub)).join(', ')}\n\n`;
  body += `## Comentarios del código\n\n${docs.map((d) => `- ${d}`).join('\n')}\n\n## Exportaciones\n\n${exps.map((e) => `- \`${e.name}\` (${e.kind})`).join('\n')}\n`;
  if (base === 'tick') body += `\n## Orden fijo de los jobs\n\n${code('ts', (t.match(/const JOBS = \[[\s\S]*?\] as const/) ?? [''])[0])}\n`;
  fileNote.set(`${API}/application/jobs/${f}`, `Job - ${base}`);
  add(`${F.back}/Jobs`, `Job - ${base}`, body, { tipo: 'job', fuente: `apps/api/src/application/jobs/${f}`, tags: ['backend/jobs', ...mods.map((m) => `modulo/${m.id}`)] });
}
// Integraciones
const INTEG = [
  ['paralelo.bo', ['paralelo-bo.ts', 'paralelo-bo.fake.ts'], 'Tipo de cambio paralelo por JSON-RPC (`https://paralelo.bo/mcp`): `get_current_rate`, `get_historical_rate` y `convert_currency` (oficial). "Venta" es el mayor de buy/sell y "compra" el menor (ADR-06). Atribución CC-BY-4.0.', 'M3'],
  ['BCB', ['bcb.ts', 'bcb.fake.ts'], 'Respaldo del tipo de cambio oficial (TCO) desde el widget público del Banco Central de Bolivia, consultado una vez al día.', 'M3'],
  ['Resend', ['resend.ts', 'resend.fake.ts', 'email-templates.ts'], 'Envío de los correos de la cuenta (confirmación, recuperación y seguridad) por la API de Resend, más las plantillas HTML/texto. El fake captura los correos en un buzón de prueba que lee E2E.', 'M1'],
];
for (const [n, files, desc, mod] of INTEG) {
  let body = `# Integración · ${n}\n\n${desc}\n\n- **Módulo:** ${L(MODULES.find((m) => m.id === mod).hub)}\n- **Puerto que implementa:** ver ${L('API - Puertos')}\n- **Fakes:** se activan con \`INTEGRATIONS=fake\` (prohibido en producción, ver ${L('API - Configuración env.ts')}).\n\n| Archivo | Líneas | Comentario |\n|---|---|---|\n`;
  for (const f of files) {
    const p = `${API}/infrastructure/integrations/${f}`; const t = rd(p);
    body += `| \`${f}\` | ${t.split('\n').length} | ${esc(fileDoc(t))} |\n`;
    fileNote.set(p, `Integración - ${n}`);
  }
  add(`${F.back}/Integraciones`, `Integración - ${n}`, body, { tipo: 'integracion', modulo: mod, tags: ['backend/integracion', `modulo/${mod}`] });
}
{
  const t = rd(`${API}/infrastructure/config/env.ts`);
  add(`${F.back}/Capas`, 'API - Configuración env.ts', `# Configuración del entorno (env.ts)\n\nEl API valida \`process.env\` con Zod al arrancar (\`main.ts\`). Si falta o es inválida una variable, nombra la variable (nunca su valor) y termina con código 1. Reglas: \`INTEGRATIONS=fake\` y \`DB_LATENCY_MS\` distinto de 0 están prohibidos en producción; \`RELEASE\` es 1.0, 1.1 o 1.2 (${L('ADR-18 - Entregas con RELEASE')}). Ver ${L('Variables de entorno')}.\n\n${code('ts', t)}\n`,
    { tipo: 'backend', fuente: 'apps/api/src/infrastructure/config/env.ts', tags: ['backend/infraestructura', 'devops/entorno'] });
  fileNote.set(`${API}/infrastructure/config/env.ts`, 'API - Configuración env.ts');
}

// ================================================================ 5. FRONTEND
const WEB = 'apps/web/src';
const routerTsx = rd(`${WEB}/app/router.tsx`);
const loaderToFeature = {};
for (const x of routerTsx.matchAll(/const (\w+) = \(\) => import\('@\/features\/(\w+)\/routes'\)/g)) loaderToFeature[x[1]] = x[2];
const webRoutes = [];
for (const x of routerTsx.matchAll(/\{ (?:path: '([^']*)'|index: true), \.\.\.screen\((\w+), '(\w+)'(?:, '([^']+)')?\)/g)) {
  webRoutes.push({ path: x[1] === undefined ? '/' : '/' + x[1], feature: loaderToFeature[x[2]], component: x[3], prefetch: !!x[4] });
}
const gates = {};
for (const x of routerTsx.matchAll(/releasedModule\('(M\d+)', \[([\s\S]*?)\]\);/g)) for (const p of x[2].matchAll(/path: '([^']+)'/g)) gates['/' + p[1]] = x[1];

for (const feat of ls(`${WEB}/features`)) {
  const dir = `${WEB}/features/${feat}`;
  const mod = MODULES.find((m) => m.web.includes(feat));
  const comps = lsFiles(`${dir}/components`, /\.tsx?$/).map((f) => ({ f, doc: fileDoc(rd(`${dir}/components/${f}`)), exps: exportsOf(rd(`${dir}/components/${f}`)) }));
  const hooks = lsFiles(`${dir}/hooks`, /\.tsx?$/).map((f) => ({ f, doc: fileDoc(rd(`${dir}/hooks/${f}`)), exps: exportsOf(rd(`${dir}/hooks/${f}`)) }));
  const apiTxt = ex(`${dir}/api.ts`) ? rd(`${dir}/api.ts`) : '';
  const calls = [...apiTxt.matchAll(/export const (\w+)[^=]*=\s*(?:\([^)]*\)\s*:\s*[^=]+=>\s*\()?\{\s*method: '(\w+)',\s*path: (?:\([^)]*\)\s*=>\s*)?[`']([^`']+)[`']/g)].map((x) => ({ name: x[1], method: x[2], path: x[3] }));
  const routes = webRoutes.filter((r) => r.feature === feat);
  const locale = ex(`${WEB}/locales/es-BO/${feat}.json`) ? `${WEB}/locales/es-BO/${feat}.json` : null;
  const name = `Web - ${feat}`;
  let body = `# Web · feature \`${feat}\`\n\nCarpeta \`apps/web/src/features/${feat}/\` de la ${L('Web - Visión general', 'SPA React')}.\n\n- **Módulo:** ${mod ? L(mod.hub) : '—'}\n`;
  if (locale) body += `- **Textos (i18n):** \`locales/es-BO/${feat}.json\` (${Object.keys(JSON.parse(fs.readFileSync(path.join(SRC, locale), 'utf8'))).length} claves de primer nivel) → ${L('Web - i18n y locales')}\n`;
  body += '\n';
  if (routes.length) body += `## Rutas\n\n| Ruta | Pantalla | Precarga datos | Entrega |\n|---|---|---|---|\n${routes.map((r) => `| \`${r.path}\` | \`${r.component}\` | ${r.prefetch ? '✅' : '—'} | ${gates[r.path] ? `solo si ${gates[r.path]} está liberado` : 'V1.0'} |`).join('\n')}\n\n`;
  if (calls.length) body += `## Endpoints que consume (\`api.ts\`)\n\n| Endpoint | Método | Ruta |\n|---|---|---|\n${calls.map((c) => `| \`${c.name}\` | \`${c.method}\` | \`${c.path}\` |`).join('\n')}\n\n`;
  if (hooks.length) body += `## Hooks (TanStack Query)\n\n${hooks.map((h) => `- \`${h.f}\` — ${h.exps.map((e) => `\`${e.name}\``).join(', ')}${h.doc ? `. ${h.doc}` : ''}`).join('\n')}\n\n`;
  if (comps.length) body += `## Componentes (${comps.length})\n\n| Archivo | Exporta | Descripción |\n|---|---|---|\n${comps.map((c) => `| \`${c.f}\` | ${c.exps.filter((e) => e.kind === 'function' || e.kind === 'const').map((e) => `\`${e.name}\``).join(', ')} | ${esc(c.doc || (c.exps.find((e) => e.doc)?.doc ?? ''))} |`).join('\n')}\n`;
  if (mod) body += `\n**Backend relacionado:** ${mod.routes.map((r) => L(`API ${r}`)).join(', ')}\n`;
  fileNote.set(dir, name);
  add(`${F.front}/Features`, name, body, { tipo: 'frontend', ...(mod ? { modulo: mod.id } : {}), fuente: `apps/web/src/features/${feat}`, tags: ['frontend/feature', ...(mod ? [`modulo/${mod.id}`] : [])] });
}
{
  let body = `# Web · Router y rutas\n\nDefinido en \`apps/web/src/app/router.tsx\` con React Router (${L('ADR-16 - Navegación con React Router')}). Cada pantalla se descarga solo al entrar (\`lazy\`), y algunas precargan sus datos mientras baja el código (RNF-29). Las guardas \`RequireSession\`, \`RequireOnboardingDone\` y \`ReleaseGate\` viven en \`app/guards.tsx\`.\n\n## Jerarquía\n\n${code('text', `/ (RootLayout)
├─ PublicLayout → registro, entrar, revisa-tu-correo, confirmar, olvide-mi-contrasena, restablecer
└─ RequireSession (precalienta la sesión)
   ├─ bienvenida (Onboarding)   ·  onboarding → redirige a /bienvenida
   └─ RequireOnboardingDone
      ├─ AppShell → Inicio, movimientos, registrar, cuentas, mas, categorias, tipo-de-cambio, perfil, ajustes
      └─ ReleaseGate(M11/M12/M14/M13) → AppShell → presupuestos, metas, recurrentes, deudas
* → NotFoundPage`)}\n\n## Todas las rutas (${webRoutes.length})\n\n| Ruta | Feature | Pantalla | Precarga | Entrega |\n|---|---|---|---|---|\n`;
  body += webRoutes.map((r) => `| \`${r.path}\` | ${L(`Web - ${r.feature}`, r.feature)} | \`${r.component}\` | ${r.prefetch ? '✅' : '—'} | ${gates[r.path] ?? 'V1.0'} |`).join('\n');
  body += `\n\nAdemás: \`/mas\` (\`MoreMenu\`) y \`/ajustes/recordatorios\` detrás de \`PreferencesGate\` (solo V1.2, RF-M15-07).\n`;
  fileNote.set(`${WEB}/app/router.tsx`, 'Web - Router y rutas');
  add(F.front, 'Web - Router y rutas', body, { tipo: 'frontend', fuente: 'apps/web/src/app/router.tsx', tags: ['frontend/router'] });
}
const webGroup = (dir, name, title, intro, tags) => {
  const files = lsFiles(dir, /\.(tsx?|css)$/);
  let body = `# ${title}\n\n${intro}\n\n| Archivo | Exporta | Descripción (comentario del código) |\n|---|---|---|\n`;
  body += files.map((f) => { const t = rd(`${dir}/${f}`); return `| \`${f}\` | ${exportsOf(t).map((e) => `\`${e.name}\``).join(', ')} | ${esc(fileDoc(t))} |`; }).join('\n') + '\n';
  for (const f of files) fileNote.set(`${dir}/${f}`, name);
  add(F.front, name, body, { tipo: 'frontend', fuente: dir, tags });
};
webGroup(`${WEB}/app/layout`, 'Web - Layout (AppShell)', 'Layout: AppShell y navegación', 'Estructura visible de la app (M2): cabecera con botón "Volver", barra de pestañas inferior (móvil), barra lateral (escritorio), menú "Más", overlay sin conexión, diálogo de sesión expirada y toast de "Deshacer".', ['frontend/layout', 'modulo/M2']);
webGroup(`${WEB}/app/providers`, 'Web - Providers', 'Providers de la app', 'Proveedores de React montados en `main.tsx`: i18next, TanStack Query (cliente y reintentos) y tema claro/oscuro.', ['frontend/providers']);
webGroup(`${WEB}/app`, 'Web - App (guards y prefetch)', 'App: guardas y precarga', 'Archivos sueltos de `app/`: guardas de sesión, Onboarding y entrega; precarga de rutas al elegir una pestaña; y el router (ver [[Web - Router y rutas]]).', ['frontend/router']);
webGroup(`${WEB}/lib`, 'Web - lib (utilidades)', 'Librería `lib/` de la web', `Utilidades transversales: cliente HTTP tipado con Zod, borradores en sessionStorage (${L('ADR-17 - Estado de cliente mínimo')}), formateadores, traducción de errores problem+json, detección de conexión, parámetros de búsqueda validados (\`useValidatedSearch\`) y el store de UI.`, ['frontend/lib']);
webGroup(`${WEB}/components/ui`, 'Web - Componentes UI (shadcn)', 'Componentes UI (shadcn/ui)', 'Primitivas de interfaz generadas con shadcn/ui sobre Radix UI y Tailwind. Las usan todas las features.', ['frontend/ui']);
webGroup(`${WEB}/components`, 'Web - Componentes compartidos', 'Componentes compartidos', 'Componentes reutilizados fuera de `ui/`, como la marca (`BrandMark`).', ['frontend/ui']);
{
  const files = lsFiles(`${WEB}/locales/es-BO`, /\.json$/);
  let body = `# Web · i18n y locales\n\nTodos los textos visibles viven en \`apps/web/src/locales/es-BO/\` (español de Bolivia) y se cargan con i18next por *namespace*: cada feature registra el suyo al cargarse. ESLint prohíbe textos literales en JSX (RNF-07). Los errores del API llegan como \`code\` (problem+json, ${L('ADR-09 - Errores problem+json')}) y se traducen con \`errors.json\`.\n\n| Namespace | Claves de primer nivel | Feature |\n|---|---|---|\n`;
  body += files.map((f) => { const j = JSON.parse(fs.readFileSync(path.join(SRC, WEB, 'locales/es-BO', f), 'utf8')); const n = f.replace('.json', ''); return `| \`${n}\` | ${Object.keys(j).length} | ${ex(`${WEB}/features/${n}`) ? L(`Web - ${n}`) : '—'} |`; }).join('\n');
  add(F.front, 'Web - i18n y locales', body, { tipo: 'frontend', fuente: 'apps/web/src/locales/es-BO', tags: ['frontend/i18n'] });
}

// ================================================================ 6. PRUEBAS
function testTable(dir, mapMod = () => null) {
  return lsFiles(dir, /\.ts$/).map((f) => {
    const t = rd(`${dir}/${f}`);
    const m = mapMod(f);
    return `| \`${f}\` | ${esc(firstDescribe(t))} | ${(t.match(/\b(it|test)\(/g) ?? []).length} | ${m ? L(MODULES.find((x) => x.id === m).hub, m) : '—'} |`;
  }).join('\n');
}
const e2eMod = (f) => { const m = f.match(/^m(\d+)-/); return m ? `M${m[1]}` : null; };
const hdr = '| Archivo | Primer describe | Casos | Módulo |\n|---|---|---|---|\n';
add(`${F.test}/Suites`, 'Pruebas E2E (Playwright)', `# Pruebas E2E con Playwright\n\nCarpeta \`e2e/\`. Corren en ${L('Workflow qa-e2e.yml')} contra un entorno efímero, en 3 navegadores × 2 anchos (ver ${L('Config - playwright.config.ts')}). Incluyen accesibilidad con axe (\`a11y-*\`), teclado, rendimiento (\`perf*\`), cobertura de escenarios Gherkin y control de entregas.\n\n- **fixtures/**: ${lsFiles('e2e/fixtures').map((f) => `\`${f}\``).join(', ')} (sesión, base y buzón de correos falso)\n- **support/**: ${lsFiles('e2e/support').map((f) => `\`${f}\``).join(', ')} (axe y perfiles de red)\n\n${hdr}${testTable('e2e', e2eMod)}\n`, { tipo: 'testing', fuente: 'e2e/', tags: ['testing/e2e'] });
const apiMod = (f) => { const b = f.split(/[.-]/)[0]; return ROUTE_MODULE[b] ?? ROUTE_MODULE[b + 's'] ?? null; };
add(`${F.test}/Suites`, 'Pruebas del API', `# Pruebas del API (Vitest)\n\nCarpeta \`apps/api/test/\`: unitarias, contratos HTTP con supertest e integración contra Postgres real (aislamiento entre usuarios, concurrencia, jobs, zonas horarias, rendimiento). Las *factories* de \`test/factories\` crean datos de prueba. El nombre de cada caso lleva el ID que verifica (\`RF-M4-04 …\`, \`TASK-038 …\`).\n\n## Unitarias (\`test/unit\`)\n\n${hdr}${testTable('apps/api/test/unit', apiMod)}\n\n## HTTP (\`test/http\`)\n\n${hdr}${testTable('apps/api/test/http', apiMod)}\n\n## Integración (\`test/integration\`)\n\n${hdr}${testTable('apps/api/test/integration', apiMod)}\n`, { tipo: 'testing', fuente: 'apps/api/test', tags: ['testing/api'] });
add(`${F.test}/Suites`, 'Pruebas de la web', `# Pruebas unitarias de la web\n\nCarpeta \`apps/web/test/\` (Vitest): cliente HTTP, borradores, formateadores, errores i18n, sesión, precarga de pestañas, presupuesto de tamaño del bundle y assets de marca.\n\n${hdr}${testTable('apps/web/test')}\n`, { tipo: 'testing', fuente: 'apps/web/test', tags: ['testing/web'] });
add(`${F.test}/Suites`, 'Pruebas de los paquetes', `# Pruebas de los paquetes compartidos\n\n## domain (\`packages/domain/test\`)\n\n${hdr}${testTable('packages/domain/test')}\n\n## contracts (\`packages/contracts/test\`)\n\n${hdr}${testTable('packages/contracts/test')}\n\n## db (\`packages/db/test\`)\n\nVerifican restricciones, triggers y cascadas del esquema contra Postgres.\n\n${hdr}${testTable('packages/db/test')}\n`, { tipo: 'testing', fuente: 'packages/*/test', tags: ['testing/paquetes'] });

// ================================================================ 7. DEVOPS y configuración
for (const f of lsFiles('.github/workflows', /\.yml$/)) {
  const t = rd(`.github/workflows/${f}`);
  const steps = [...t.matchAll(/- name: (.+)/g)].map((x) => x[1].replace(/^'|'$/g, ''));
  const body = `# Workflow \`${f}\`\n\n${WORKFLOW_DESC[f] ?? ''}\n\nVer también ${L('Flujo - Despliegue a producción')} y ${L('Plan 1.5 Integración y despliegue continuos (ADR-20)')}.\n\n## Pasos\n\n${steps.map((s) => `1. ${s}`).join('\n')}\n\n${collapsed(`Archivo completo .github/workflows/${f}`, 'yaml', t)}\n`;
  fileNote.set(`.github/workflows/${f}`, `Workflow ${f}`);
  add(`${F.devops}/Workflows`, `Workflow ${f}`, body, { tipo: 'devops', fuente: `.github/workflows/${f}`, tags: ['devops/ci'] });
}
for (const [p, cat, name, desc] of CONFIG_FILES) {
  if (!ex(p)) continue;
  const t = rd(p);
  const lang = { json: 'json', yaml: 'yaml', yml: 'yaml', cjs: 'js', js: 'js', ts: 'ts', sql: 'sql', html: 'html' }[p.split('.').pop()] ?? 'text';
  fileNote.set(p, name);
  const folder = { devops: `${F.devops}/Configuracion`, arq: `${F.arq}/Configuracion`, ia: `${F.ia}/Configuracion`, front: `${F.front}/Configuracion`, test: `${F.test}/Configuracion` }[cat];
  add(folder, name, `# \`${p}\`\n\n${desc}\n\n## Contenido\n\n${code(lang, t)}\n`, { tipo: 'configuracion', fuente: p, tags: ['config'] });
}
// tools/sdd
{
  const rows = (dir) => lsFiles(dir, /\.mjs$/).map((f) => { const t = rd(`${dir}/${f}`); return { f, doc: fileDoc(t), lines: t.split('\n').length }; });
  let body = `# Scripts del pipeline SDD (\`tools/sdd/\`)\n\nScripts Node (sin dependencias) que automatizan el ${L('Pipeline SDD con agentes')}: preparan la tarea, guardan el estado, aplican los gates deterministas, registran la auditoría, cierran con commit y coordinan a las personas en las ramas de grupo. Se prueban con \`node --test tools/sdd/test/\`.\n\n## Comandos\n\n| Script | Líneas | Qué hace (comentario del código) |\n|---|---|---|\n`;
  body += rows('tools/sdd').map((r) => `| \`${r.f}\` | ${r.lines} | ${esc(r.doc)} |`).join('\n');
  body += `\n\n## Librería (\`tools/sdd/lib\`)\n\n| Módulo | Líneas | Descripción |\n|---|---|---|\n` + rows('tools/sdd/lib').map((r) => `| \`${r.f}\` | ${r.lines} | ${esc(r.doc)} |`).join('\n');
  body += `\n\n**Pruebas:** ${lsFiles('tools/sdd/test').map((f) => `\`${f}\``).join(', ')}\n\n**Configuración:** ${L('Config - branch-groups.json')}, ${L('Config - .claude settings.json')}, ${L('Config - hook pre-push')}\n`;
  for (const r of rows('tools/sdd')) fileNote.set(`tools/sdd/${r.f}`, 'Scripts SDD (tools-sdd)');
  add(`${F.ia}`, 'Scripts SDD (tools-sdd)', body, { tipo: 'proceso-ia', fuente: 'tools/sdd', tags: ['ia/scripts'] });
}
// packages/db extras
{
  const seeds = lsFiles('packages/db/seed').map((f) => `| \`seed/${f}\` | ${esc(fileDoc(rd(`packages/db/seed/${f}`)))} |`);
  const scr = lsFiles('packages/db/scripts').map((f) => `| \`scripts/${f}\` | ${esc(fileDoc(rd(`packages/db/scripts/${f}`)))} |`);
  const src = lsFiles('packages/db/src').map((f) => `| \`src/${f}\` | ${esc(fileDoc(rd(`packages/db/src/${f}`)))} |`);
  add(F.datos, 'Seeds y scripts de base de datos', `# Seeds y scripts de \`packages/db\`\n\n| Archivo | Descripción (comentario del código) |\n|---|---|\n${[...src, ...seeds, ...scr].join('\n')}\n\n- \`seed:e2e\` lo usa ${L('Workflow qa-e2e.yml')} (usuarios de prueba, 5.000 movimientos y tasas fijas).\n- \`fx-backfill\` lo usa ${L('Workflow fx-backfill.yml')}.\n- \`preset-categories\` son las categorías precargadas del ${L('M10 - Onboarding')}.\n\n## Scripts del paquete\n\n${code('json', JSON.stringify(JSON.parse(rd('packages/db/package.json')).scripts, null, 2))}\n`, { tipo: 'datos', fuente: 'packages/db', tags: ['datos/seed'] });
}

// ================================================================ 8. HUBS de módulos
for (const mod of MODULES) {
  const d = moduleDocs[mod.id] ?? { tareas: [] };
  const e2e = lsFiles('e2e', /\.spec\.ts$/).filter((f) => e2eMod(f) === mod.id);
  let body = `# ${mod.id} · ${mod.name}\n\n> [!summary] Entrega ${mod.release}\n> ${mod.summary}\n\n`;
  body += `## 📄 Documentación SDD\n\n`;
  body += `- **Especificación (qué y porqué):** ${d.spec ? L(d.spec) : '—'}\n- **Plan técnico (cómo):** ${d.plan ? L(d.plan) : '—'}\n- **Tareas:** ${d.tareas.map((t) => L(t)).join(', ') || '—'}\n- **Coherencia con el código:** ${d.coherencia ? L(d.coherencia) : '—'}\n\n`;
  body += `## ⚙️ Backend\n\n- **Endpoints:** ${mod.routes.map((r) => L(`API ${r}`)).join(', ')}\n`;
  if (mod.shared.length) body += `- **Servicios compartidos:** ${mod.shared.map((x) => L(`Compartido - ${x}`)).join(', ')}\n`;
  if (mod.jobs.length) body += `- **Jobs:** ${mod.jobs.map((x) => L(`Job - ${x}`)).join(', ')}\n`;
  if (mod.integrations.length) body += `- **Integraciones:** ${mod.integrations.map((x) => L(`Integración - ${x}`)).join(', ')}\n`;
  body += `\n## 🖥️ Frontend\n\n- **Features:** ${mod.web.map((w) => L(`Web - ${w}`)).join(', ') || (mod.id === 'M2' ? `${L('Web - Layout (AppShell)')}, ${L('Web - Router y rutas')}, ${L('Web - App (guards y prefetch)')}` : '—')}\n\n`;
  body += `## 🗄️ Datos\n\n${mod.models.map((m) => `- ${L(`Entidad - ${m}`)}`).join('\n') || '- Sin tablas propias.'}\n\n`;
  body += `## 🧩 Paquetes compartidos\n\n- **Dominio:** ${mod.domain.map((x) => L(`Dominio - ${x}`)).join(', ') || '—'}\n- **Contratos:** ${mod.contracts.map((x) => L(`Contrato - ${x}`)).join(', ') || '—'}\n\n`;
  body += `## 🧪 Pruebas E2E\n\n${e2e.map((f) => `- \`e2e/${f}\` — ${firstDescribe(rd(`e2e/${f}`))}`).join('\n') || '- Ver ' + L('Pruebas E2E (Playwright)')}\n\nMás en ${L('Pruebas del API')} y ${L('Pruebas E2E (Playwright)')}.\n`;
  add(F.feat, mod.hub, body, { tipo: 'feature', modulo: mod.id, entrega: mod.release, aliases: [mod.id, mod.name], tags: ['feature', `modulo/${mod.id}`, `entrega/${mod.release.slice(0, 4).replace(' ', '')}`] });
}

// ================================================================ 9. NOTAS CURADAS (escritas a mano)
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p)); else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}
for (const p of walk(CURATED)) {
  const rel = path.relative(CURATED, p).split(path.sep);
  const name = rel.pop().replace(/\.md$/, '');
  const { fm, text } = stripFrontmatter(fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n'));
  const fmObj = {};
  if (fm) for (const line of fm.split('\n')) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) fmObj[m[1]] = m[2].startsWith('[') ? m[2].slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean) : m[2]; }
  add(rel.join('/'), name, text, fmObj);
}

// ================================================================ 10. ENLACES automáticos
for (const [name, file] of pendingRewrites) notes.get(name).body = rewriteLinks(notes.get(name).body, file);

const idx = { rnf: {}, task: {}, plan: {}, cons: {}, spec: {} };
for (const [name, n] of notes) {
  if (n.fm.tipo === 'spec') for (const x of n.body.matchAll(/\*\*RNF-(\d{2})/g)) idx.rnf[x[1]] ??= name;
  if (n.fm.tipo === 'tareas') for (const x of n.body.matchAll(/`TASK-(\d{3})`:/g)) idx.task[x[1]] ??= name;
  const num = name.match(/^(Plan|Constitución|Spec) (\d+(?:\.\d+)*)/);
  if (num) idx[{ Plan: 'plan', Constitución: 'cons', Spec: 'spec' }[num[1]]][num[2]] ??= name;
}
const rnNote = [...notes.keys()].find((n) => n.startsWith('Spec 1.6'));
const resolveSec = (map, ref) => { const parts = ref.split('.'); while (parts.length) { const k = parts.join('.'); if (map[k]) return map[k]; parts.pop(); } return null; };

function related(name, body) {
  const groups = { 'Módulos': new Set(), 'Decisiones (ADR)': new Set(), 'Requerimientos no funcionales': new Set(), 'Fases de tareas': new Set(), 'Spec / Plan / Constitución': new Set(), 'Entidades': new Set() };
  for (const x of body.matchAll(/\bM(1[0-5]|[1-9])\b/g)) groups['Módulos'].add(MODULES.find((m) => m.id === `M${x[1]}`).hub);
  for (const x of body.matchAll(/ADR-(\d{2})/g)) if (adrNotes[x[1]]) groups['Decisiones (ADR)'].add(adrNotes[x[1]]);
  for (const x of body.matchAll(/RNF-(\d{2})/g)) if (idx.rnf[x[1]]) groups['Requerimientos no funcionales'].add(idx.rnf[x[1]]);
  if (rnNote && /\bRN-\d{2}\b/.test(body)) groups['Spec / Plan / Constitución'].add(rnNote);
  for (const x of body.matchAll(/TASK-(\d{3})/g)) if (idx.task[x[1]]) groups['Fases de tareas'].add(idx.task[x[1]]);
  for (const x of body.matchAll(/plan §\s?(\d+(?:\.\d+)*)/gi)) { const n = resolveSec(idx.plan, x[1]); if (n) groups['Spec / Plan / Constitución'].add(n); }
  for (const x of body.matchAll(/spec §\s?(\d+(?:\.\d+)*)/gi)) { const n = resolveSec(idx.spec, x[1]); if (n) groups['Spec / Plan / Constitución'].add(n); }
  for (const x of body.matchAll(/constituci[oó]n §\s?(\d+)/gi)) { const n = idx.cons[x[1]]; if (n) groups['Spec / Plan / Constitución'].add(n); }
  for (const x of body.matchAll(/`([a-z_]+)`/g)) if (tableToModel[x[1]]) groups['Entidades'].add(tableToModel[x[1]]);
  const lines = [];
  for (const [g, set] of Object.entries(groups)) {
    const items = [...set].filter((n) => n !== name && !body.includes(`[[${n}]]`) && !body.includes(`[[${n}|`)).sort();
    if (items.length) lines.push(`- **${g}:** ${items.map((n) => `[[${n}]]`).join(' · ')}`);
  }
  return lines.length ? `\n\n---\n## 🔗 Relacionado\n\n${lines.join('\n')}\n` : '';
}
for (const [name, n] of notes) n.body = n.body.replace(/\s+$/, '') + related(name, n.body);

// ================================================================ 11. MOCs por carpeta
const MOC = [
  [F.spec, 'MOC Especificación', '📘 Especificación (SDD)', 'Todo lo que define el **qué**, el **porqué** y el **orden de trabajo**: la constitución, la especificación funcional, el plan por módulo y el backlog de tareas por fase.'],
  [F.arq, 'MOC Arquitectura', '🏛️ Arquitectura', 'Visión del sistema, capas, decisiones (ADR), flujos de punta a punta y los paquetes compartidos (`contracts`, `domain`, `config`).'],
  [F.back, 'MOC Backend', '⚙️ Backend (apps/api)', 'API Express en 4 capas: endpoints por módulo, servicios compartidos, jobs, integraciones y piezas de infraestructura.'],
  [F.front, 'MOC Frontend', '🖥️ Frontend (apps/web)', 'SPA React + Vite: router, layout, features por módulo, utilidades, componentes UI, i18n y dirección de diseño.'],
  [F.datos, 'MOC Datos', '🗄️ Datos (packages/db)', 'Esquema Prisma sobre PostgreSQL: entidades, enums, migraciones SQL y seeds.'],
  [F.feat, 'MOC Features', '🧭 Features (módulos M1–M15)', 'Un hub por módulo que une su spec, plan, tareas, endpoints, pantallas, tablas y pruebas.'],
  [F.test, 'MOC Testing', '🧪 Testing y QA', 'Estrategia de pruebas, suites (unitarias, HTTP, integración, E2E), informe de coherencia y la matriz de verificación.'],
  [F.devops, 'MOC DevOps', '🚀 DevOps', 'CI/CD con GitHub Actions, despliegue en Vercel + Render + Neon, entorno local con Docker, variables y configuración del repo.'],
  [F.ia, 'MOC Proceso IA', '🤖 Proceso con agentes de IA', 'El pipeline SDD con Claude Code: subagentes, skills, hooks, gates, scripts y las ejecuciones registradas.'],
];
for (const [folder, name, title, intro] of MOC) {
  const inFolder = [...notes].filter(([, n]) => n.folder === folder || n.folder.startsWith(folder + '/'));
  const bySub = {};
  for (const [nn, n] of inFolder) { const sub = n.folder.slice(folder.length + 1) || '(raíz)'; (bySub[sub] ??= []).push(nn); }
  let body = `# ${title}\n\n${intro}\n\n↑ [[Inicio]]\n\n`;
  if (folder === F.feat) {
    body += '| Módulo | Entrega | Hub |\n|---|---|---|\n' + MODULES.map((m) => `| ${m.id} | ${m.release} | ${L(m.hub)} |`).join('\n') + '\n\n';
  }
  for (const sub of Object.keys(bySub).sort()) {
    const pretty = sub.replace('Constitucion', 'Constitución').replace('Diseno', 'Diseño').replace('Configuracion', 'Configuración').replace(/\//g, ' › ');
    body += `## ${pretty}\n\n${bySub[sub].sort((a, b) => a.localeCompare(b, 'es', { numeric: true })).map((x) => `- [[${x}]]`).join('\n')}\n\n`;
  }
  add(F.inicio, name, body, { tipo: 'moc', tags: ['moc'] });
}

// ================================================================ 12. ESCRITURA
const yamlVal = (v) => (Array.isArray(v) ? `\n${v.map((x) => `  - ${JSON.stringify(String(x))}`).join('\n')}` : ` ${JSON.stringify(String(v))}`);
const manifestPath = path.join(VAULT, '.obsidian', 'generated-manifest.json');
fs.mkdirSync(path.join(VAULT, '.obsidian'), { recursive: true });
if (fs.existsSync(manifestPath)) for (const p of JSON.parse(fs.readFileSync(manifestPath, 'utf8'))) { try { fs.unlinkSync(path.join(VAULT, p)); } catch {} }
const written = [];
// En las tablas, el | del alias de un wikilink se escapa para no romper columnas.
const fixTables = (text) => {
  let fence = false;
  return text.split('\n').map((l) => {
    if (/^\s*(```|~~~)/.test(l)) fence = !fence;
    return !fence && /^\s*\|/.test(l) ? l.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '[[$1\\|$2]]') : l;
  }).join('\n');
};
for (const n of notes.values()) n.body = fixTables(n.body);
for (const [name, n] of notes) {
  const fm = { ...n.fm, actualizado: TODAY };
  const head = '---\n' + Object.entries(fm).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}:${yamlVal(v)}`).join('\n') + '\n---\n\n';
  const rel = path.join(n.folder, `${name}.md`);
  fs.mkdirSync(path.join(VAULT, n.folder), { recursive: true });
  fs.writeFileSync(path.join(VAULT, rel), head + n.body + '\n', 'utf8');
  written.push(rel.split(path.sep).join('/'));
}
// ================================================================ 13. CONFIGURACIÓN DE OBSIDIAN
const OBS = path.join(VAULT, '.obsidian');
const readJson = (f, def) => { try { return JSON.parse(fs.readFileSync(path.join(OBS, f), 'utf8')); } catch { return def; } };
const writeJson = (f, v) => fs.writeFileSync(path.join(OBS, f), JSON.stringify(v, null, 2));
const hexToInt = (h) => parseInt(h.slice(1), 16);

// Grafo: un grupo de color por carpeta, sin CLAUDE.md
const graph = readJson('graph.json', {});
graph.colorGroups = COLORS.map(([folder, hex]) => ({ query: `path:"${folder}"`, color: { a: 1, rgb: hexToInt(hex) } }));
graph.search = '-file:CLAUDE';
graph['collapse-color-groups'] = false;
writeJson('graph.json', graph);

// Explorador: snippet CSS con el color de cada carpeta
fs.mkdirSync(path.join(OBS, 'snippets'), { recursive: true });
let css = '/* Colores por categoría del segundo cerebro (generado). */\n';
for (const [folder, hex] of COLORS) {
  css += `.nav-folder-title[data-path^="${folder}"], .nav-file-title[data-path^="${folder}"] { color: ${hex}; }\n`;
  css += `.nav-folder-title[data-path="${folder}"] { font-weight: 700; }\n`;
  css += `.nav-folder-title[data-path="${folder}"] + .nav-folder-children { border-left: 2px solid ${hex}; }\n`;
}
const tagColors = { modulo: '#E74C3C', sdd: '#4A90E2', arquitectura: '#9B59B6', backend: '#27AE60', frontend: '#E67E22', datos: '#16A085', testing: '#FF6FB5', qa: '#FF6FB5', devops: '#A0522D', ia: '#A3E635', paquete: '#9B59B6', feature: '#E74C3C', moc: '#F5C542' };
for (const [t, hex] of Object.entries(tagColors)) css += `a.tag[href^="#${t}"] { background-color: ${hex}22; color: ${hex}; border: 1px solid ${hex}55; }\n`;
fs.writeFileSync(path.join(OBS, 'snippets', 'colores-carpetas.css'), css);
const appearance = readJson('appearance.json', {});
appearance.enabledCssSnippets = [...new Set([...(appearance.enabledCssSnippets ?? []), 'colores-carpetas'])];
writeJson('appearance.json', appearance);

// CLAUDE.md fuera de búsquedas y grafo
const app = readJson('app.json', {});
app.userIgnoreFilters = [...new Set([...(app.userIgnoreFilters ?? []), 'CLAUDE.md'])];
writeJson('app.json', app);

// Marcadores
const now = Date.now();
writeJson('bookmarks.json', {
  items: [
    { type: 'file', ctime: now, path: `${F.inicio}/Inicio.md`, title: '🧠 Inicio' },
    { type: 'file', ctime: now, path: `${F.inicio}/Mapa del proyecto.canvas`, title: '🧭 Mapa del proyecto' },
    { type: 'group', ctime: now, title: 'Mapas (MOC)', items: MOC.map(([, n, t]) => ({ type: 'file', ctime: now, path: `${F.inicio}/${n}.md`, title: t })) },
    { type: 'group', ctime: now, title: 'Módulos', items: MODULES.map((m) => ({ type: 'file', ctime: now, path: `${F.feat}/${sanitize(m.hub)}.md`, title: m.hub })) },
  ],
});

// Lienzo: Inicio al centro, MOCs alrededor y módulos agrupados por entrega
const nodes = []; const edges = [];
const colorOf = (folder) => COLORS.find(([f]) => f === folder)?.[1];
nodes.push({ id: 'inicio', type: 'file', file: `${F.inicio}/Inicio.md`, x: -200, y: -150, width: 400, height: 300, color: colorOf(F.inicio) });
MOC.forEach(([folder, n], i) => {
  const a = (i / MOC.length) * 2 * Math.PI - Math.PI / 2;
  const id = `moc${i}`;
  nodes.push({ id, type: 'file', file: `${F.inicio}/${n}.md`, x: Math.round(Math.cos(a) * 750) - 160, y: Math.round(Math.sin(a) * 550) - 110, width: 320, height: 220, color: colorOf(folder) });
  edges.push({ id: `e${i}`, fromNode: 'inicio', fromSide: 'right', toNode: id, toSide: 'left' });
});
const groups = [['V1.0', (m) => m.release === 'V1.0'], ['V1.1', (m) => m.release === 'V1.1'], ['V1.2', (m) => m.release.includes('V1.2')]];
let gx = -1100;
for (const [label, pred] of groups) {
  const mods = MODULES.filter(pred);
  const cols = 2; const w = 280, h = 90;
  const rows = Math.ceil(mods.length / cols);
  nodes.push({ id: `g${label}`, type: 'group', label: `Entrega ${label}`, x: gx, y: 800, width: cols * (w + 20) + 20, height: rows * (h + 20) + 40, color: colorOf(F.feat) });
  mods.forEach((m, i) => nodes.push({ id: `m${m.id}`, type: 'file', file: `${F.feat}/${sanitize(m.hub)}.md`, x: gx + 20 + (i % cols) * (w + 20), y: 830 + Math.floor(i / cols) * (h + 20), width: w, height: h, color: colorOf(F.feat) }));
  gx += cols * (w + 20) + 120;
}
fs.writeFileSync(path.join(VAULT, F.inicio, 'Mapa del proyecto.canvas'), JSON.stringify({ nodes, edges }, null, 2));
written.push(`${F.inicio}/Mapa del proyecto.canvas`);

fs.writeFileSync(manifestPath, JSON.stringify(written, null, 1));

// Comprobación de enlaces rotos
const names = new Set(notes.keys());
const broken = {};
for (const [name, n] of notes) for (const x of n.body.replace(/```[\s\S]*?```/g, '').matchAll(/\[\[([^\]|#\\]+)/g)) if (!names.has(x[1])) (broken[x[1]] ??= []).push(name);
console.log(`Notas: ${notes.size}`);
console.log(`Enlaces rotos: ${Object.keys(broken).length}`);
for (const [k, v] of Object.entries(broken)) console.log(`  ${k}  ← ${v.slice(0, 3).join(' | ')}`);
export { COLORS };
