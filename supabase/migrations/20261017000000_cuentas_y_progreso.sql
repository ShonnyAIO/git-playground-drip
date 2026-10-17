-- Cuentas de estudiante y progreso de GitPlayground.
-- Seguridad: RLS en todas las tablas; cada estudiante solo ve y modifica sus propias filas.

-- Perfil público mínimo: solo el nombre visible (el correo vive en auth.users).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  created_at timestamptz not null default now()
);

-- Progreso del estudiante: el mismo objeto que guarda el navegador (src/state/learnerStore.js).
create table public.learner_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  -- El estado real pesa pocos kB; el límite evita abusos de almacenamiento.
  constraint learner_progress_state_size check (pg_column_size(state) < 65536)
);

alter table public.profiles enable row level security;
alter table public.learner_progress enable row level security;

create policy "profiles: leer el propio" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles: editar el propio" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "progreso: leer el propio" on public.learner_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "progreso: crear el propio" on public.learner_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "progreso: actualizar el propio" on public.learner_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Los visitantes sin sesión no tocan estas tablas; los autenticados, solo vía RLS.
revoke all on public.profiles, public.learner_progress from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.learner_progress to authenticated;

-- Al registrarse, se crea el perfil con el nombre elegido en el formulario.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1)), 40)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at lo fija el servidor, no el cliente.
create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger learner_progress_touch
  before insert or update on public.learner_progress
  for each row execute function public.touch_updated_at();
