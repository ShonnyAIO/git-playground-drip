import { layoutGraph } from '../engine/index.js';

/**
 * Convierte una escena en coordenadas de pantalla (1 unidad SVG = 1 px de ancho del contenedor).
 * Puro: el SceneView solo dibuja lo que esto devuelve, con `key` estables para animar.
 */
const GAP = 16;
const ZONE_HEADER = 44;
const FILE_H = 30;
const FILE_GAP = 8;
const TITLE_H = 40;
const TAG_STEP = 24;
const ROW_H = 64;
const LINE_H = 26;
export const NODE_R = 13;

export const ZONE_LABELS = {
  working: 'Working Directory',
  staging: 'Staging Area',
  repo: 'Repositorio (.git)',
};

const zoneRows = (zones) => Math.max(1, zones.working.length, zones.staging.length, zones.repo.length ? 1 : 0);

function layoutZones(zones, width, top, compact, files) {
  const names = ['working', 'staging', 'repo'];
  const boxes = [];
  const fileItems = [];
  const repoCommits = [];
  const boxW = compact ? width : (width - 2 * GAP) / 3;
  let y = top;
  let height = 0;

  names.forEach((name, i) => {
    const entries = name === 'repo' ? [] : zones[name];
    const rows = compact ? Math.max(1, name === 'repo' ? 1 : entries.length) : zoneRows(zones);
    const h = ZONE_HEADER + rows * (FILE_H + FILE_GAP) + 8;
    const x = compact ? 0 : i * (boxW + GAP);
    const boxY = compact ? y : top;
    boxes.push({ name, label: ZONE_LABELS[name], x, y: boxY, w: boxW, h });
    entries.forEach((e, j) => {
      fileItems.push({
        key: e.file,
        name: files[e.file]?.name ?? e.file,
        status: e.status,
        zone: name,
        x: x + 12,
        y: boxY + ZONE_HEADER + j * (FILE_H + FILE_GAP),
        w: Math.min(boxW - 24, 220),
      });
    });
    if (name === 'repo') {
      zones.repo.forEach((id, j) => {
        repoCommits.push({ key: id, id, x: x + 28 + j * 64, y: boxY + ZONE_HEADER + FILE_H / 2 });
      });
    }
    if (compact) y += h + 10;
    else height = Math.max(height, h);
  });

  return { boxes, files: fileItems, repoCommits, height: compact ? y - top - 10 : height };
}

function layoutGraphPanel(graph, x, top, width, title, prefix) {
  const l = layoutGraph(graph);
  // Espacio sobre la primera fila para las etiquetas apiladas (ramas + HEAD) del commit más cargado.
  const tagsOnCommit = new Map();
  l.labels.forEach(lb => tagsOnCommit.set(lb.commitId, (tagsOnCommit.get(lb.commitId) ?? 0) + 1));
  const maxTags = Math.max(0, ...[...tagsOnCommit.entries()].map(([id, n]) => n + (id === l.head.commitId ? 1 : 0)), 1);
  const graphTop = TITLE_H + NODE_R + 4 + maxTags * TAG_STEP;
  const colW = Math.min(104, (width - 120) / Math.max(l.columns - 1, 1));
  // Centrado: al crecer la historia, todo se desplaza como un paneo de cámara.
  const left = x + Math.max(60, (width - (l.columns - 1) * colW) / 2);
  const px = (col) => left + col * colW;
  const py = (row) => top + graphTop + row * ROW_H;
  const nodes = l.nodes.map(n => ({ ...n, key: `${prefix}c:${n.id}`, cx: px(n.x), cy: py(n.y) }));
  const at = new Map(nodes.map(n => [n.id, n]));
  const edges = l.edges.map(e => {
    const a = at.get(e.from);
    const b = at.get(e.to);
    const d = a.cy === b.cy
      ? `M ${a.cx} ${a.cy} L ${b.cx} ${b.cy}`
      : `M ${a.cx} ${a.cy} C ${a.cx + colW * 0.6} ${a.cy} ${b.cx - colW * 0.6} ${b.cy} ${b.cx} ${b.cy}`;
    return { key: `${prefix}e:${e.from}>${e.to}`, d, ghost: a.ghost || b.ghost };
  });
  const labels = l.labels.map(lb => {
    const n = at.get(lb.commitId);
    return { ...lb, key: `${prefix}b:${lb.branch}`, cx: n.cx, cy: n.cy - NODE_R - 14 - lb.stack * TAG_STEP };
  });
  const headLabel = l.head.branch ? labels.find(lb => lb.branch === l.head.branch) : null;
  const headNode = at.get(l.head.commitId);
  const stackTop = labels.filter(lb => lb.commitId === l.head.commitId).length;
  const head = {
    key: `${prefix}head`,
    cx: headNode.cx,
    cy: headNode.cy - NODE_R - 14 - stackTop * TAG_STEP,
    attachedTo: headLabel?.branch ?? null,
  };
  const height = graphTop + (l.rows - 1) * ROW_H + NODE_R + 30;
  return { title, x, y: top, w: width, h: height, nodes, edges, labels, head };
}

function layoutCode(code, width, top) {
  const lines = code.lines.map((ln, i) => ({ ...ln, key: `l:${ln.id}`, x: 12, y: top + 40 + i * LINE_H, w: width - 24 }));
  return { file: code.file, x: 0, y: top, w: width, h: 48 + code.lines.length * LINE_H, lines };
}

export function layoutScene(scene, width, files = {}) {
  const compact = width < 640;
  const out = { width, compact, zones: null, graphs: [], code: null, height: 0 };
  let y = 0;

  if (scene.zones) {
    out.zones = layoutZones(scene.zones, width, y, compact, files);
    y += out.zones.height + GAP;
  }

  const panels = [];
  if (scene.graph) panels.push({ graph: scene.graph, title: scene.remote ? 'Tu repositorio (local)' : 'Historia de commits', prefix: 'L' });
  if (scene.remote) panels.push({ graph: scene.remote, title: 'origin (GitHub)', prefix: 'R', remote: true });
  if (panels.length) {
    const sideBySide = panels.length === 2 && !compact;
    const panelW = sideBySide ? (width - GAP) / 2 : width;
    let rowH = 0;
    panels.forEach((p, i) => {
      const x = sideBySide ? i * (panelW + GAP) : 0;
      const g = { ...layoutGraphPanel(p.graph, x, y, panelW, p.title, p.prefix), remote: !!p.remote };
      out.graphs.push(g);
      if (sideBySide) rowH = Math.max(rowH, g.h);
      else y += g.h + GAP;
    });
    if (sideBySide) {
      out.graphs.forEach(g => { g.h = rowH; });
      y += rowH + GAP;
    }
  }

  if (scene.code) {
    out.code = layoutCode(scene.code, width, y);
    y += out.code.h + GAP;
  }
  out.height = Math.max(y - GAP, 120);
  return out;
}
