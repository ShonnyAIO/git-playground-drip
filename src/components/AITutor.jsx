import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Settings, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import { 
  askShonnyProxy, 
  getShonnyProxyConfig, 
  saveShonnyProxyConfig, 
  testShonnyProxyConnection 
} from '../services/shonnyProxyService';

export default function AITutor({ tutorMessages, addTutorMessage, xp, level, gitContext = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [proxyConfig, setProxyConfig] = useState(getShonnyProxyConfig());
  const [testStatus, setTestStatus] = useState(null); // 'testing' | 'success' | 'failed'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tutorMessages, isOpen, isLoading]);

  useEffect(() => {
    if (tutorMessages.length > 1) {
      setIsOpen(true);
    }
  }, [tutorMessages.length]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setShowSettings(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query || isLoading) return;

    // Add user message
    addTutorMessage(query, 'user');
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await askShonnyProxy(query, gitContext);
      addTutorMessage(response.text, 'bot', response.source);
    } catch (err) {
      addTutorMessage('Ocurrió una anomalía temporal consultando al tutor. Intenta de nuevo.', 'bot', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = async (topicText, queryText) => {
    const query = queryText || topicText;
    addTutorMessage(topicText, 'user');
    setIsLoading(true);

    try {
      const response = await askShonnyProxy(query, gitContext);
      addTutorMessage(response.text, 'bot', response.source);
    } catch {
      addTutorMessage('Error al consultar. Por favor reintenta.', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = () => {
    saveShonnyProxyConfig(proxyConfig);
    setShowSettings(false);
    addTutorMessage('⚙️ Configuración de ShonnyProxy actualizada correctamente.', 'bot');
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    const ok = await testShonnyProxyConnection(proxyConfig);
    setTestStatus(ok ? 'success' : 'failed');
    setTimeout(() => setTestStatus(null), 3500);
  };

  const chips = [
    { label: 'Rebase vs Merge', query: 'Explicar la diferencia entre rebase y merge con ejemplos' },
    { label: '¿Qué es HEAD?', query: 'Explícame qué es el puntero HEAD en Git' },
    { label: 'Resolver Conflicto', query: 'Cómo resolver un conflicto de merge paso a paso' },
    { label: '¿Qué hace git stash?', query: 'Para qué sirve git stash y cómo se usa' }
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
        <section className="tutor-window" aria-label="Asistente de tutoría de Git" style={{ width: '380px', maxHeight: '560px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div className="tutor-header" style={{
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.15), transparent)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0.65rem 0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, fontSize: '0.88rem' }}>
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              <span>Nova AI Tutor</span>
              <span style={{
                fontSize: '0.62rem',
                padding: '0.15rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: proxyConfig.enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                color: proxyConfig.enabled ? '#10b981' : 'var(--text-tertiary)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Cpu size={10} />
                {proxyConfig.enabled ? 'ShonnyProxy' : 'Local'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: showSettings ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Configuración de ShonnyProxy LLM"
              >
                <Settings size={15} />
              </button>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)' }}>
                {xp} XP
              </span>
            </div>
          </div>

          {/* Settings Panel (Modal inside window) */}
          {showSettings && (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-color)',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Configuración de ShonnyProxy</strong>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={proxyConfig.enabled}
                    onChange={(e) => setProxyConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                  <span>Habilitar LLM</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginBottom: '0.2rem' }}>
                  Endpoint Base URL
                </label>
                <input
                  type="text"
                  className="tutor-input"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                  value={proxyConfig.url}
                  onChange={(e) => setProxyConfig(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="http://localhost:8000/v1"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginBottom: '0.2rem' }}>
                    Modelo
                  </label>
                  <input
                    type="text"
                    className="tutor-input"
                    style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                    value={proxyConfig.model}
                    onChange={(e) => setProxyConfig(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="gpt-4o-mini"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginBottom: '0.2rem' }}>
                    API Key (Opcional)
                  </label>
                  <input
                    type="password"
                    className="tutor-input"
                    style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                    value={proxyConfig.apiKey}
                    onChange={(e) => setProxyConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="sk-..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
                <button
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing'}
                  className="btn"
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.3rem 0.6rem',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer'
                  }}
                >
                  {testStatus === 'testing' ? <RefreshCw size={12} className="animate-spin" /> : null}
                  {testStatus === 'success' ? <Check size={12} style={{ color: '#10b981' }} /> : null}
                  {testStatus === 'failed' ? <AlertCircle size={12} style={{ color: '#ef4444' }} /> : null}
                  <span>
                    {testStatus === 'testing' ? 'Probando...' : testStatus === 'success' ? '¡Conectado!' : testStatus === 'failed' ? 'Sin conexión' : 'Test Endpoint'}
                  </span>
                </button>

                <button
                  onClick={handleSaveConfig}
                  className="btn btn-primary"
                  style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }}
                >
                  Guardar
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="tutor-messages" style={{ flex: 1, overflowY: 'auto', padding: '0.85rem' }}>
            {tutorMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`tutor-msg ${msg.sender}`}
                style={{
                  lineHeight: 1.45,
                  fontSize: '0.82rem',
                  marginBottom: '0.6rem',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="tutor-msg bot" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                <RefreshCw size={13} className="animate-spin" style={{ color: 'var(--primary)' }} />
                <span>Nova está analizando tu grafo con ShonnyProxy...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', padding: '0.45rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
            {chips.map((c, i) => (
              <button
                key={i}
                id={`tutor-chip-btn-${i}`}
                onClick={() => handleChipClick(c.label, c.query)}
                disabled={isLoading}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSend} className="tutor-input-area" style={{ padding: '0.6rem 0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <input
              id="tutor-chat-input"
              type="text"
              className="tutor-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Pregúntale a Nova sobre tu grafo..."
              aria-label="Escribe tu mensaje para el tutor de Git"
              disabled={isLoading}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.6rem' }}
            />
            <button 
              id="btn-tutor-send" 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading || !inputVal.trim()}
              style={{ padding: '0.45rem 0.65rem' }}
            >
              <Send size={14} />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
