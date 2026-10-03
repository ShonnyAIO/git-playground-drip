import { isRemoteTracking, LEVELS, LINE_KINDS, PRACTICE_TABS, ZONE_NAMES } from './schema.js';

function validateGraph(graph, where, errors) {
  const ids = new Set();
  for (const c of graph.commits) {
    if (ids.has(c.id)) errors.push(`${where}: commit duplicado "${c.id}"`);
    ids.add(c.id);
  }
  for (const c of graph.commits) {
    for (const p of c.parents) {
      if (!ids.has(p)) errors.push(`${where}: el commit "${c.id}" tiene un padre inexistente "${p}"`);
    }
  }
  for (const [branch, target] of Object.entries(graph.branches)) {
    if (!ids.has(target)) errors.push(`${where}: la rama "${branch}" apunta a un commit inexistente "${target}"`);
  }
  if ('branch' in graph.head) {
    if (!(graph.head.branch in graph.branches)) errors.push(`${where}: HEAD apunta a una rama inexistente "${graph.head.branch}"`);
    else if (isRemoteTracking(graph.head.branch)) errors.push(`${where}: HEAD no puede apuntar a la rama remota "${graph.head.branch}"`);
  } else if (!ids.has(graph.head.detached)) {
    errors.push(`${where}: HEAD detached apunta a un commit inexistente "${graph.head.detached}"`);
  }
  return ids;
}

/** Ids que un `focus` puede referenciar en una escena. */
function focusTargets(scene) {
  const t = new Set(['head']);
  if (scene.zones) {
    ZONE_NAMES.forEach(z => t.add(`zone:${z}`));
    [...scene.zones.working, ...scene.zones.staging].forEach(e => t.add(`file:${e.file}`));
    scene.zones.repo.forEach(id => t.add(`commit:${id}`));
  }
  for (const g of [scene.graph, scene.remote]) {
    if (!g) continue;
    g.commits.forEach(c => t.add(`commit:${c.id}`));
    Object.keys(g.branches).forEach(b => t.add(`branch:${b}`));
  }
  scene.code?.lines.forEach(l => t.add(`line:${l.id}`));
  return t;
}

/** Devuelve la lista de errores de una lección; vacía si es válida. */
export function validateLesson(lesson) {
  const errors = [];
  const at = (msg) => errors.push(`[${lesson.id ?? '?'}] ${msg}`);

  if (!lesson.id) at('falta id');
  if (!lesson.title) at('falta title');
  if (!LEVELS.includes(lesson.level)) at(`nivel inválido "${lesson.level}"`);
  if (!lesson.objectives?.length) at('faltan objectives');
  if (!PRACTICE_TABS.includes(lesson.practice?.tab)) at(`practice.tab inválido "${lesson.practice?.tab}"`);
  for (const r of lesson.furtherReading ?? []) {
    if (!r.url?.startsWith('https://')) at(`furtherReading sin https: "${r.url}"`);
    if (!r.title || !r.author) at(`furtherReading sin título o autor: "${r.url}"`);
  }
  if (!lesson.steps?.length) {
    at('la lección no tiene pasos');
    return errors;
  }

  const files = lesson.files ?? {};
  const stepIds = new Set();
  lesson.steps.forEach((step, i) => {
    const where = `paso ${i + 1} (${step.id})`;
    if (stepIds.has(step.id)) at(`${where}: id de paso duplicado`);
    stepIds.add(step.id);
    if (!step.caption?.trim()) at(`${where}: caption vacío`);
    const scene = step.scene ?? {};
    if (!scene.zones && !scene.graph && !scene.remote && !scene.code) at(`${where}: escena vacía`);

    let graphIds = null;
    if (scene.graph) graphIds = validateGraph(scene.graph, `${where} graph`, errors);
    if (scene.remote) validateGraph(scene.remote, `${where} remote`, errors);

    if (scene.zones) {
      for (const e of [...scene.zones.working, ...scene.zones.staging]) {
        if (!(e.file in files)) at(`${where}: archivo no declarado "${e.file}"`);
      }
      if (graphIds) {
        for (const id of scene.zones.repo) {
          if (!graphIds.has(id)) at(`${where}: zones.repo referencia el commit "${id}" que no está en graph`);
        }
      }
    }
    if (scene.code) {
      const lineIds = new Set();
      for (const l of scene.code.lines) {
        if (lineIds.has(l.id)) at(`${where}: línea duplicada "${l.id}"`);
        lineIds.add(l.id);
        if (!LINE_KINDS.includes(l.kind)) at(`${where}: tipo de línea inválido "${l.kind}"`);
      }
    }
    const targets = focusTargets(scene);
    for (const f of step.focus ?? []) {
      if (!targets.has(f)) at(`${where}: focus "${f}" no está en la escena`);
    }
  });
  return errors;
}
