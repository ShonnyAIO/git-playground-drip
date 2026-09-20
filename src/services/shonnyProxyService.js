/**
 * Servicio de integración con ShonnyProxy (LLM Gateway) para GitPlayground
 * Proporciona soporte para cualquier LLM compatible con OpenAI Chat Completions (/v1/chat/completions)
 * con fallback local heurístico y socrático cuando el proxy está desconectado.
 */

const STORAGE_KEY = 'gitplayground_shonny_proxy_config';

const DEFAULT_CONFIG = {
  url: import.meta.env.VITE_SHONNY_PROXY_URL || 'http://localhost:8000/v1',
  model: import.meta.env.VITE_SHONNY_PROXY_MODEL || 'shonny-llm',
  apiKey: import.meta.env.VITE_SHONNY_PROXY_KEY || '',
  enabled: true
};

export function getShonnyProxyConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveShonnyProxyConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving ShonnyProxy config:', err);
  }
}

export async function testShonnyProxyConnection(config = null) {
  const cfg = config || getShonnyProxyConfig();
  const endpoint = `${cfg.url.replace(/\/+$/, '')}/chat/completions`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cfg.apiKey ? { 'Authorization': `Bearer ${cfg.apiKey}` } : {})
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Consulta a ShonnyProxy con inyección del estado actual de Git
 */
export async function askShonnyProxy(userQuery, gitContext = {}) {
  const config = getShonnyProxyConfig();

  // Construir contexto en texto estructurado
  const contextStr = `
[ESTADO ACTUAL DEL SIMULADOR GIT DEL ALUMNO]:
- Rama actual (HEAD): ${gitContext.currentBranch || 'main'}
- Ramas existentes: ${(gitContext.branches || ['main']).join(', ')}
- Commits en el Grafo: ${(gitContext.commits || []).map(c => `${c.id} (${c.message})`).join(' -> ') || 'Ninguno'}
- Archivos en Working Directory: ${(gitContext.workingDirectory || []).join(', ') || 'Limpio'}
- Archivos en Staging Area (preparados): ${(gitContext.stagingArea || []).join(', ') || 'Vacío'}
- Últimos comandos ejecutados: ${(gitContext.lastCommands || []).slice(-4).join(' | ') || 'Ninguno'}
`;

  const systemPrompt = `Eres Nova, la tutora virtual y pedagógica de GitPlayground, una plataforma educativa libre y abierta para que estudiantes de computación dominen Git y GitHub.
Tu misión:
1. Responde en español claro, amigable, riguroso y empático.
2. Utiliza el método socrático: si el estudiante cometió un error o pregunta cómo hacer algo, analiza su [ESTADO ACTUAL DEL SIMULADOR GIT], explícale qué está pasando en sus áreas de memoria o punteros de Git, y guíalo con una pregunta reflexiva o el comando exacto formateado en \`backticks\`.
3. Mantén respuestas concisas (máximo 2 párrafos cortos con viñetas si es necesario), fáciles de leer en una ventana de chat flotante.
4. Enseña buenas prácticas de la industria (ramas limpias, mensajes de commit convencionales, no rebase en ramas públicas).`;

  if (config.enabled && config.url) {
    try {
      const endpoint = `${config.url.replace(/\/+$/, '')}/chat/completions`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `${contextStr}\n\nPregunta del estudiante: ${userQuery}` }
          ],
          temperature: 0.6,
          max_tokens: 380
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return { text: reply, source: 'shonny-proxy' };
        }
      }
    } catch (err) {
      console.warn('ShonnyProxy unreachable, switching to intelligent local fallback:', err);
    }
  }

  // Fallback heurístico local avanzado
  return {
    text: getHeuristicLocalResponse(userQuery, gitContext),
    source: 'local-fallback'
  };
}

/**
 * Fallback heurístico contextual y socrático cuando el proxy está desconectado
 */
function getHeuristicLocalResponse(query, context) {
  const q = query.toLowerCase();

  if (q.includes('hola') || q.includes('buenos dias') || q.includes('buenas tardes')) {
    return `¡Hola! Soy Nova, tu tutora de Git. Veo que actualmente estás en la rama \`${context.currentBranch || 'main'}\`. ¿En qué comando o concepto te gustaría profundizar hoy?`;
  }

  if (q.includes('rebase')) {
    return '`git rebase` toma los commits de tu rama actual y los "vuelve a plantar" uno por uno sobre la punta de la rama destino, creando una historia 100% lineal sin merge commits.\n\n⚠️ **Regla de oro:** Nunca hagas rebase sobre ramas públicas compartidas (como `main`); úsalo únicamente en tus ramas de trabajo locales.';
  }

  if (q.includes('merge') || q.includes('fusionar')) {
    return '`git merge` une dos ramas creando un commit especial de fusión (*Merge Commit*). Conserva el historial real cronológico y es no destructivo. Es el método estándar cuando integras Pull Requests en equipo.';
  }

  if (q.includes('conflict') || q.includes('conflicto')) {
    return 'Un conflicto ocurre cuando Git encuentra modificaciones distintas en las mismas líneas de un archivo y no puede adivinar cuál conservar.\n\n1. Git marca el archivo con `<<<<<<< HEAD` (tus cambios) y `>>>>>>>` (los cambios entrantes).\n2. Eliges el código correcto y borras los delimitadores.\n3. Ejecutas `git add` y luego `git commit` para sellar la paz.';
  }

  if (q.includes('head')) {
    const current = context.currentBranch || 'main';
    return `\`HEAD\` es el puntero que le dice a Git dónde tienes puesto el foco en este momento. Actualmente tu \`HEAD -> ${current}\`. Si haces checkout a un commit hash específico en vez de a una rama, entrarás en el estado especial de "HEAD desasociado" (*detached HEAD*).`;
  }

  if (q.includes('staging') || q.includes('add')) {
    return 'El **Staging Area** (o Index) es la "sala de preparación". Te permite seleccionar con precisión quirúrgica qué archivos y cambios formarán parte de tu próxima fotografía histórica antes de sellarla con `git commit`.';
  }

  if (q.includes('push')) {
    return '`git push` transfiere tus commits locales hacia el servidor remoto (ej. GitHub). La sintaxis típica es `git push origin <nombre-de-rama>`. Si tu rama no existe aún en el remoto, se usa `-u` para crear el rastreo.';
  }

  if (q.includes('pull') || q.includes('fetch')) {
    return '`git pull` es en realidad la combinación de dos comandos automáticos: `git fetch` (descarga los nuevos objetos del remoto) seguido de `git merge` (fusiona esos cambios en tu rama actual).';
  }

  if (q.includes('stash')) {
    return '`git stash` es el "cajón secreto" de Git. Te permite apartar temporalmente los cambios en los que estás trabajando sin hacer commit, dejando tu directorio limpio para cambiar de rama o resolver una emergencia con `git stash pop`.';
  }

  return `Interesante consulta. Recuerda que en Git todo se resume en mover punteros y registrar instantáneas de tus archivos. Actualmente tienes ${context.commits?.length || 0} commits registrados en tu grafo. ¿Te gustaría explorar algún comando específico como \`rebase\`, \`stash\`, \`merge\` o \`reset\`?`;
}
