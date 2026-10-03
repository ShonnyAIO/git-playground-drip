// Atajos para escribir escenas sin repetir estructura. Solo construyen datos.
export const commit = (id, parents = [], msg = id, extra = {}) => ({ id, parents, msg, ...extra });
export const graph = (commits, branches, head = 'main') => ({
  commits,
  branches,
  head: typeof head === 'string' ? { branch: head } : head,
});

export const PRO_GIT_AUTHORS = 'Scott Chacon y Ben Straub (Pro Git)';
export const proGit = (title, slug) => ({ title, author: PRO_GIT_AUTHORS, url: `https://git-scm.com/book/es/v2/${slug}` });
