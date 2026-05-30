import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  CornerDownLeft, 
  HelpCircle 
} from 'lucide-react';

export default function AITutor({ tutorMessages, addTutorMessage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tutorMessages, isOpen]);

  // Open the window automatically when a new message is received from other modules
  useEffect(() => {
    if (tutorMessages.length > 1) {
      setIsOpen(true);
    }
  }, [tutorMessages.length]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query) return;

    // Add user message
    addTutorMessage(query, 'user');
    setInputVal('');

    // Generate bot reply after a small simulated typing latency
    setTimeout(() => {
      const response = getBotResponse(query);
      addTutorMessage(response, 'bot');
    }, 450);
  };

  const handleChipClick = (topicText, queryText) => {
    addTutorMessage(topicText, 'user');
    setTimeout(() => {
      const response = getBotResponse(queryText || topicText);
      addTutorMessage(response, 'bot');
    }, 300);
  };

  const getBotResponse = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('hola') || q.includes('buenos dias') || q.includes('buenas tardes')) {
      return '¡Hola! Soy tu Tutor Git/GitHub. Estoy aquí para guiarte en el diseño de tu repositorio y resolver tus dudas teóricas o de comandos. ¿Qué concepto te gustaría explorar?';
    }
    if (q.includes('rebase')) {
      return '`git rebase` es un comando que reescribe la historia del proyecto. En lugar de crear un commit de fusión (como `git merge`), rebase toma tus commits de la rama actual y los aplica uno por uno sobre la punta de la rama de destino. \n\n**Buenas prácticas:** Nunca uses rebase en ramas públicas compartidas (como `main`), ya que alteras la historia para otros desarrolladores. Úsalo solo para mantener limpia tu rama local antes de integrarla.';
    }
    if (q.includes('merge') || q.includes('fusionar')) {
      return '`git merge` unifica dos ramas creando un commit especial de fusión ("merge commit"). Conserva el historial real exacto y es no destructivo. Es el método más seguro cuando colaboras con otros en ramas comunes, ya que no reescribe el historial de commits pasados.';
    }
    if (q.includes('conflict') || q.includes('conflicto')) {
      return 'Un conflicto ocurre cuando dos ramas modifican la misma línea en un archivo o cuando un archivo es eliminado por un desarrollador y modificado por otro. \n\nPara resolverlo:\n1. Git inserta marcas como `<<<<<<< HEAD` (tus cambios locales) y `=======` y `>>>>>>> [rama]` (los cambios externos).\n2. Abres el archivo, eliges qué versión conservar, borras las marcas de Git y guardas.\n3. Añades el archivo (`git add`) y creas el commit (`git commit`).';
    }
    if (q.includes('head')) {
      return 'En Git, `HEAD` es un puntero especial que apunta al commit activo actual en tu área de trabajo. Casi siempre apunta a la punta de la rama en la que te encuentras (`HEAD -> main`). Si haces `git checkout [commit_hash]`, moverás el HEAD a ese commit específico, entrando en un estado llamado "detached HEAD" (HEAD desasociado).';
    }
    if (q.includes('push')) {
      return '`git push` copia el historial de commits locales del repositorio local al repositorio remoto (ej. GitHub). Su sintaxis estándar es `git push origin [nombre_rama]`.';
    }
    if (q.includes('pull')) {
      return '`git pull` descarga el historial de la rama remota y la unifica con tu rama local actual de inmediato. En el fondo, es un atajo que hace dos operaciones: `git fetch` (descargar datos remotos) y luego `git merge` (fusionar localmente).';
    }
    if (q.includes('git status')) {
      return '`git status` te dice en qué rama estás, qué archivos han sido modificados pero no preparados (Working Directory, en rojo), qué archivos están preparados en el Staging Area (en amarillo) y qué archivos están listos para ser guardados.';
    }
    if (q.includes('git init')) {
      return '`git init` inicializa un repositorio local de Git en la carpeta actual. Crea una subcarpeta oculta llamada `.git` donde Git registrará todo el historial del proyecto a partir de ese momento.';
    }

    return 'Entiendo tu duda. Git es una herramienta visual en el fondo. Recuerda que puedes escribir términos como "rebase vs merge", "conflictos", "push y pull", o "HEAD" para darte una explicación detallada.';
  };

  const chips = [
    { label: 'Rebase vs Merge', query: 'Explicar la diferencia entre rebase y merge' },
    { label: '¿Qué es HEAD?', query: 'head' },
    { label: 'Resolver Conflicto', query: 'conflictos' },
    { label: 'git pull', query: 'pull' }
  ];

  return (
    <div className="ai-tutor-bubble" id="ai-tutor-root">
      {/* Floating Toggle Button */}
      <button 
        id="btn-tutor-toggle"
        className="tutor-toggle" 
        onClick={handleToggle}
        title="Mostrar Tutor Git"
        aria-label="Abrir asistente de tutor de IA"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      {/* Tutor Window */}
      {isOpen && (
        <section className="tutor-window" aria-label="Asistente de tutoría de Git">
          <div className="tutor-header">
            <div className="tutor-header-title">
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              <span>Tutor Git Invisible</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Simulación IA</span>
          </div>

          {/* Messages */}
          <div className="tutor-messages">
            {tutorMessages.map((msg, idx) => (
              <div key={idx} className={`tutor-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0.5rem 0.85rem', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
            {chips.map((c, i) => (
              <button
                key={i}
                id={`tutor-chip-btn-${i}`}
                onClick={() => handleChipClick(c.label, c.query)}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSend} className="tutor-input-area">
            <input
              id="tutor-chat-input"
              type="text"
              className="tutor-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Pregúntame sobre comandos..."
              aria-label="Escribe tu mensaje para el tutor de Git"
            />
            <button id="btn-tutor-send" type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>
              <Send size={14} />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
