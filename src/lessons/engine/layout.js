import { isRemoteTracking } from './schema.js';

/**
 * Coloca un grafo en una rejilla abstracta (columna = generación, fila = carril).
 * Determinista: el mismo grafo produce siempre la misma salida.
 *
 * Carriles: cada rama (en orden de declaración, `main` primero, las `origin/*` al final)
 * reclama los commits de su cadena de primeros padres que nadie reclamó antes. Una cadena
 * que parte de la punta de un carril lo continúa; si parte de un commit con hijos ya
 * dibujados en su carril, abre uno nuevo. Los commits que ninguna rama alcanza (los
 * `ghost` de un rebase, un HEAD detached huérfano) forman cadenas propias, de modo que
 * la historia reescrita queda a la vista junto a la nueva.
 */
export function layoutGraph(graph) {
  const byId = new Map(graph.commits.map(c => [c.id, c]));

  const generation = new Map();
  const gen = (id) => {
    if (!generation.has(id)) {
      const parents = byId.get(id).parents;
      generation.set(id, parents.length ? Math.max(...parents.map(gen)) + 1 : 0);
    }
    return generation.get(id);
  };

  const lane = new Map();
  const laneTip = [];
  const claimChain = (tip) => {
    const chain = [];
    let id = tip;
    for (; id && !lane.has(id); id = byId.get(id).parents[0]) chain.push(id);
    if (!chain.length) return;
    // Si la cadena sale de la punta de un carril, lo continúa (p. ej. origin/main adelantada,
    // o un rebase ya integrado); si sale de un commit que ya tiene hijo en su carril, bifurca.
    const fork = id;
    const forkLane = fork ? lane.get(fork) : undefined;
    const target = forkLane !== undefined && laneTip[forkLane] === fork ? forkLane : laneTip.length;
    chain.forEach(c => lane.set(c, target));
    laneTip[target] = tip;
  };

  const rank = (b) => (b === 'main' ? 0 : isRemoteTracking(b) ? 2 : 1);
  const branchNames = Object.keys(graph.branches).sort((a, b) => rank(a) - rank(b));
  branchNames.forEach(b => claimChain(graph.branches[b]));
  if ('detached' in graph.head) claimChain(graph.head.detached);
  // Restantes: de la punta de cada cadena huérfana (commits sin hijos sin carril) hacia atrás.
  const hasChild = new Set(graph.commits.flatMap(c => c.parents));
  graph.commits.filter(c => !lane.has(c.id) && !hasChild.has(c.id)).forEach(c => claimChain(c.id));
  graph.commits.filter(c => !lane.has(c.id)).forEach(c => claimChain(c.id));

  const nodes = graph.commits.map(c => ({ id: c.id, x: gen(c.id), y: lane.get(c.id), lane: lane.get(c.id), ghost: !!c.ghost }));
  const pos = new Map(nodes.map(n => [n.id, n]));
  const edges = graph.commits.flatMap(c => c.parents.map(p => ({ from: p, to: c.id })));

  const headBranch = 'branch' in graph.head ? graph.head.branch : null;
  // La rama de HEAD va arriba de su pila, pegada a la etiqueta HEAD que se dibuja encima.
  const ordered = Object.entries(graph.branches).sort(([a], [b]) => (a === headBranch) - (b === headBranch));
  const stackCount = new Map();
  const labels = ordered.map(([branch, commitId]) => {
    const stack = stackCount.get(commitId) ?? 0;
    stackCount.set(commitId, stack + 1);
    const { x, y } = pos.get(commitId);
    return { branch, commitId, x, y, stack, isHead: branch === headBranch, remoteTracking: isRemoteTracking(branch) };
  });

  const headCommit = headBranch ? graph.branches[headBranch] : graph.head.detached;
  const { x, y } = pos.get(headCommit);
  const head = { commitId: headCommit, branch: headBranch, x, y };

  return { nodes, edges, labels, head, columns: Math.max(0, ...nodes.map(n => n.x)) + 1, rows: laneTip.length };
}
