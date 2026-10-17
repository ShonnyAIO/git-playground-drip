#!/usr/bin/env node
/**
 * Prueba de aislamiento (RLS) contra Supabase LOCAL: un estudiante no puede leer ni modificar
 * el progreso o el perfil de otro, y un visitante sin sesión no ve nada.
 * Uso: npx supabase start && node scripts/rls_check.mjs
 * Lee URL y claves de `npx supabase status -o json` (solo existen en local).
 */
import { execSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const status = JSON.parse(execSync('npx supabase status -o json', { stdio: ['ignore', 'pipe', 'ignore'] }).toString());
const URL = status.API_URL;
const ANON = status.PUBLISHABLE_KEY || status.ANON_KEY;
const SERVICE = status.SECRET_KEY || status.SERVICE_ROLE_KEY;
if (!URL || !ANON || !SERVICE) throw new Error('No se encontraron las claves locales; ¿está corriendo `npx supabase start`?');

const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });
const stamp = Date.now();
const password = 'clave-de-prueba-123';
let failures = 0;
const check = (name, ok) => {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${name}`);
  if (!ok) failures += 1;
};

async function student(tag, name) {
  const email = `rls-${tag}-${stamp}@example.test`;
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: name } });
  if (error) throw error;
  const client = createClient(URL, ANON, { auth: { persistSession: false } });
  const { error: e2 } = await client.auth.signInWithPassword({ email, password });
  if (e2) throw e2;
  return { id: data.user.id, client };
}

const a = await student('a', 'Ana');
const b = await student('b', 'Beto');

const { data: profileA } = await a.client.from('profiles').select('display_name').eq('id', a.id).maybeSingle();
check('el registro crea el perfil con el nombre elegido', profileA?.display_name === 'Ana');

const stateA = { version: 1, unlockedBadges: ['init'], completedLessons: ['estados'], activeDays: ['2026-10-17'] };
const { error: upA } = await a.client.from('learner_progress').upsert({ user_id: a.id, state: stateA });
check('un estudiante guarda su propio progreso', !upA);

const { data: ownRead } = await a.client.from('learner_progress').select('state').eq('user_id', a.id).maybeSingle();
check('y lo vuelve a leer', ownRead?.state?.unlockedBadges?.[0] === 'init');

const { data: spy } = await b.client.from('learner_progress').select('state').eq('user_id', a.id);
check('otro estudiante NO puede leer ese progreso', Array.isArray(spy) && spy.length === 0);

const { data: tampered } = await b.client.from('learner_progress').update({ state: { hacked: true } }).eq('user_id', a.id).select();
check('otro estudiante NO puede modificarlo', !tampered || tampered.length === 0);

const { error: forge } = await b.client.from('learner_progress').insert({ user_id: a.id, state: {} });
check('otro estudiante NO puede crear progreso a nombre ajeno', Boolean(forge));

const { data: spyProfile } = await b.client.from('profiles').select('display_name').eq('id', a.id);
check('otro estudiante NO puede leer el perfil ajeno', Array.isArray(spyProfile) && spyProfile.length === 0);

const visitor = createClient(URL, ANON, { auth: { persistSession: false } });
const { data: anonRows, error: anonErr } = await visitor.from('learner_progress').select('state');
check('un visitante sin sesión no ve ningún progreso', Boolean(anonErr) || (anonRows ?? []).length === 0);

const { data: intact } = await a.client.from('learner_progress').select('state').eq('user_id', a.id).maybeSingle();
check('el progreso original quedó intacto', intact?.state?.completedLessons?.[0] === 'estados' && !intact?.state?.hacked);

// Contenido aleatorio: Postgres comprime el JSON y un texto repetido pasaría el límite.
const big = { version: 1, junk: randomBytes(100000).toString('hex') };
const { error: tooBig } = await a.client.from('learner_progress').upsert({ user_id: a.id, state: big });
check('se rechaza un progreso desproporcionadamente grande', Boolean(tooBig));

await admin.auth.admin.deleteUser(a.id);
await admin.auth.admin.deleteUser(b.id);
const { data: gone } = await admin.from('learner_progress').select('user_id').eq('user_id', a.id);
check('borrar la cuenta borra su progreso (cascada)', (gone ?? []).length === 0);

console.log(failures ? `\n${failures} fallas` : '\nRLS: todo en orden');
process.exit(failures ? 1 : 0);
