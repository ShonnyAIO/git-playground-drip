import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { authErrorMessage } from '../services/authErrors.js';
import './AccountDialog.css';

const TITLES = {
  signin: 'Inicia sesión',
  signup: 'Crea tu cuenta',
  reset: 'Recupera tu contraseña',
  recovery: 'Elige una contraseña nueva',
  checkEmail: 'Revisa tu correo',
};

/**
 * Diálogo de cuenta: ingreso, registro, recuperación y nueva contraseña.
 * Recibe las acciones de useAccount; no llama a Supabase directamente.
 */
export default function AccountDialog({ account, initialView = 'signin', onClose }) {
  const [view, setView] = useState(account.recovery ? 'recovery' : initialView);
  const [form, setForm] = useState({ name: '', email: '', password: '', consent: false });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const dialogRef = useRef(null);
  const openerRef = useRef(null);

  // Foco: entra al primer campo, queda atrapado en el diálogo y vuelve al botón que lo abrió.
  useEffect(() => {
    openerRef.current = document.activeElement;
    const dialog = dialogRef.current;
    const focusables = () => [...dialog.querySelectorAll('input, button, a[href]')].filter(el => !el.disabled);
    focusables()[0]?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab') return;
      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    // El resto de la app queda inerte: ni el teclado ni el lector de pantalla salen del diálogo.
    const background = [...document.querySelectorAll('#app-root-container > :not(.account-backdrop)')];
    background.forEach(el => el.setAttribute('inert', ''));
    const opener = openerRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      background.forEach(el => el.removeAttribute('inert'));
      opener?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.querySelector('input')?.focus();
  }, [view]);

  const go = (next) => {
    setView(next);
    setError('');
    setNotice('');
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (view === 'signup' && !form.consent) {
      setError('Para crear la cuenta debes aceptar cómo se guardan tus datos.');
      return;
    }
    setPending(true);
    let result;
    try {
      if (view === 'signin') result = await account.signIn(form);
      if (view === 'signup') result = await account.signUp({ ...form, name: form.name.trim() });
      if (view === 'reset') result = await account.requestPasswordReset(form.email);
      if (view === 'recovery') result = await account.updatePassword(form.password);
    } catch (err) {
      result = { error: err };
    }
    setPending(false);
    if (result?.error) {
      setError(authErrorMessage(result.error));
      return;
    }
    if (view === 'signin' || view === 'recovery') {
      onClose();
    } else if (view === 'signup' && result.data?.session) {
      onClose(); // proyecto sin confirmación de correo: la sesión ya está abierta
    } else {
      setNotice(view === 'signup'
        ? `Te enviamos un enlace a ${form.email} para confirmar tu cuenta. Ábrelo y luego inicia sesión aquí.`
        : `Si existe una cuenta con ${form.email}, te llegará un enlace para elegir una contraseña nueva.`);
      setView('checkEmail');
    }
  };

  const busyLabel = { signin: 'Entrando…', signup: 'Creando cuenta…', reset: 'Enviando…', recovery: 'Guardando…' }[view];
  const actionLabel = { signin: 'Entrar', signup: 'Crear cuenta', reset: 'Enviar enlace', recovery: 'Guardar contraseña' }[view];

  return (
    <div className="account-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title" ref={dialogRef} id="account-dialog">
        <button className="account-close" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>
        <h2 id="account-title">{TITLES[view]}</h2>

        {view === 'checkEmail' ? (
          <>
            <p className="account-notice" role="status">{notice}</p>
            <button className="btn btn-primary account-submit" onClick={() => go('signin')}>Ir a iniciar sesión</button>
          </>
        ) : (
          <form onSubmit={submit} noValidate>
            {(view === 'signin' || view === 'signup') && (
              <p className="account-lead">
                {view === 'signin'
                  ? 'Recupera tu progreso en cualquier computadora.'
                  : 'Guarda tu XP, medallas, lecciones y racha para seguir desde cualquier computadora.'}
              </p>
            )}
            {view === 'signup' && (
              <div className="account-field">
                <label htmlFor="account-name">Nombre visible</label>
                <input id="account-name" type="text" name="name" autoComplete="nickname" required maxLength={40} {...field('name')} />
              </div>
            )}
            {view !== 'recovery' && (
              <div className="account-field">
                <label htmlFor="account-email">Correo</label>
                <input id="account-email" type="email" name="email" autoComplete="email" required {...field('email')} />
              </div>
            )}
            {view !== 'reset' && (
              <div className="account-field">
                <label htmlFor="account-password">{view === 'recovery' ? 'Contraseña nueva' : 'Contraseña'}</label>
                <span className="account-password">
                  <input
                    id="account-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete={view === 'signin' ? 'current-password' : 'new-password'}
                    required
                    minLength={8}
                    aria-describedby={view === 'signin' ? undefined : 'password-hint'}
                    {...field('password')}
                  />
                  <button type="button" className="account-eye" onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
                {view !== 'signin' && <small id="password-hint">Mínimo 8 caracteres.</small>}
              </div>
            )}
            {view === 'signup' && (
              <label className="account-consent">
                <input type="checkbox" checked={form.consent} onChange={(e) => setForm(f => ({ ...f, consent: e.target.checked }))} />
                <span>
                  Acepto que GitPlayground guarde mi correo, mi nombre visible y mi progreso para recuperarlo en otros
                  dispositivos. Es un proyecto académico de la UCV: los datos no se comparten con terceros y puedo
                  pedir que se borren.
                </span>
              </label>
            )}

            <p className="account-error" role="alert">{error}</p>

            <button type="submit" className="btn btn-primary account-submit" disabled={pending}>
              {pending ? busyLabel : actionLabel}
            </button>

            <div className="account-links">
              {view === 'signin' && (
                <>
                  <button type="button" onClick={() => go('reset')}>¿Olvidaste tu contraseña?</button>
                  <button type="button" onClick={() => go('signup')}>Crear una cuenta</button>
                </>
              )}
              {(view === 'signup' || view === 'reset') && (
                <button type="button" onClick={() => go('signin')}>Ya tengo cuenta: iniciar sesión</button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
