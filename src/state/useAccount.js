import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { accountsConfigured, getSupabase } from '../services/supabaseClient.js';
import { mergeLearnerStates } from './learnerStore.js';

const SAVE_DELAY_MS = 1200;
// Pestaña y tema son del dispositivo; a la cuenta solo va el progreso.
const toRemote = (state) => {
  const progress = { ...state };
  delete progress.currentTab;
  delete progress.theme;
  return progress;
};

const redirectTo = () => (typeof window !== 'undefined' ? window.location.origin : undefined);

// Acciones estables (no dependen del estado): el diálogo no se reinicia en cada render.
const ACTIONS = {
  signUp: async ({ email, password, name }) => (await getSupabase()).auth.signUp({
    email,
    password,
    options: { data: { display_name: name }, emailRedirectTo: redirectTo() },
  }),
  signIn: async ({ email, password }) => (await getSupabase()).auth.signInWithPassword({ email, password }),
  requestPasswordReset: async (email) => (await getSupabase()).auth.resetPasswordForEmail(email, { redirectTo: redirectTo() }),
};

/**
 * Único dueño de la sesión y de la sincronización del progreso con Supabase.
 * - Al iniciar sesión: fusiona el progreso local con el de la cuenta (no se pierde nada).
 * - Con sesión: guarda los cambios en la cuenta (agrupados cada ~1 s).
 * - Al cerrar sesión: avisa para borrar el progreso local (computadoras compartidas).
 * Sin Supabase configurado, `status` es 'disabled' y nada de esto se ejecuta.
 */
export function useAccount({ learner, onHydrate, onSignedOut }) {
  const [status, setStatus] = useState(accountsConfigured ? 'loading' : 'disabled');
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [sync, setSync] = useState('idle'); // idle | saving | saved | error
  const [recovery, setRecovery] = useState(false);

  const learnerRef = useRef(learner);
  const hydratedFor = useRef(null);
  const lastSaved = useRef('');
  useEffect(() => {
    learnerRef.current = learner;
  }, [learner]);

  /** Guarda en la cuenta; devuelve false si no se pudo (sin conexión, sesión vencida…). */
  const save = useCallback(async (userId, state) => {
    const payload = JSON.stringify(toRemote(state));
    if (payload === lastSaved.current) return true;
    setSync('saving');
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('learner_progress')
      .upsert({ user_id: userId, state: JSON.parse(payload) });
    if (error) {
      setSync('error');
      return false;
    }
    lastSaved.current = payload;
    setSync('saved');
    return true;
  }, []);

  const hydrate = useCallback(async (sessionUser) => {
    if (hydratedFor.current === sessionUser.id) return;
    hydratedFor.current = sessionUser.id;
    const supabase = await getSupabase();
    const [{ data: row, error }, { data: profile }] = await Promise.all([
      supabase.from('learner_progress').select('state').eq('user_id', sessionUser.id).maybeSingle(),
      supabase.from('profiles').select('display_name').eq('id', sessionUser.id).maybeSingle(),
    ]);
    if (error) {
      // Sin leer la cuenta no se fusiona ni se guarda: se sobrescribiría el progreso de la nube.
      // Se reintenta en el próximo evento de sesión (p. ej. al renovar el token o recargar).
      hydratedFor.current = null;
      setSync('error');
      return;
    }
    setDisplayName(profile?.display_name || sessionUser.email);
    const merged = mergeLearnerStates(learnerRef.current, row?.state ?? null);
    onHydrate(merged);
    setStatus('signedIn');
    await save(sessionUser.id, merged);
  }, [onHydrate, save]);

  useEffect(() => {
    if (!accountsConfigured) return undefined;
    let active = true;
    let subscription = null;

    const onAuthEvent = (event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      if (session?.user) {
        setUser(session.user);
        // Fuera del callback: Supabase recomienda no esperar otras llamadas dentro de él.
        setTimeout(() => hydrate(session.user), 0);
      } else if (event === 'SIGNED_OUT') {
        hydratedFor.current = null;
        lastSaved.current = '';
        setUser(null);
        setDisplayName('');
        setSync('idle');
        setStatus('guest');
        onSignedOut();
      }
    };

    getSupabase().then(async (supabase) => {
      if (!active) return;
      subscription = supabase.auth.onAuthStateChange(onAuthEvent).data.subscription;
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session) {
        setUser(data.session.user);
        hydrate(data.session.user);
      } else {
        setStatus('guest');
      }
    });
    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [hydrate, onSignedOut]);

  // Guardado automático mientras hay sesión.
  useEffect(() => {
    if (status !== 'signedIn' || !user) return undefined;
    const timer = setTimeout(() => save(user.id, learner), SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [learner, status, user, save]);

  // Al ocultar o cerrar la pestaña se guarda lo pendiente sin esperar la espera de agrupación.
  useEffect(() => {
    if (status !== 'signedIn' || !user) return undefined;
    const flush = () => {
      if (document.visibilityState === 'hidden') save(user.id, learnerRef.current);
    };
    document.addEventListener('visibilitychange', flush);
    return () => document.removeEventListener('visibilitychange', flush);
  }, [status, user, save]);

  // Cerrar sesión guarda primero lo pendiente: si no, un avance de hace menos de un segundo se perdería.
  // Si no se puede guardar, no sale (devuelve { unsaved: true }) salvo que se fuerce.
  const signOut = useCallback(async ({ force = false } = {}) => {
    const saved = user && status === 'signedIn' ? await save(user.id, learnerRef.current) : true;
    if (!saved && !force) return { unsaved: true };
    return (await getSupabase()).auth.signOut();
  }, [user, status, save]);

  const updatePassword = useCallback(async (password) => {
    const result = await (await getSupabase()).auth.updateUser({ password });
    if (!result.error) setRecovery(false);
    return result;
  }, []);
  const dismissRecovery = useCallback(() => setRecovery(false), []);

  return useMemo(() => ({
    status, user, displayName, sync, recovery, ...ACTIONS, signOut, updatePassword, dismissRecovery,
  }), [status, user, displayName, sync, recovery, signOut, updatePassword, dismissRecovery]);
}
