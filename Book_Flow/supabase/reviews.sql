-- Tabla de reseñas de BookFlow (clase 4). Ejecutar en Supabase > SQL Editor.
-- Datos de práctica: se pueden eliminar sin afectar información real.
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  book_id     text not null,
  author_name text not null check (char_length(btrim(author_name)) > 0),
  rating      smallint not null check (rating between 1 and 5),
  comment     text not null check (char_length(btrim(comment)) between 10 and 300),
  recommend   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists reviews_book_idx on public.reviews (book_id, created_at desc);

alter table public.reviews enable row level security;

-- Las reseñas son públicas para leer (se muestran a todos los lectores del libro)...
create policy "reviews_select_all" on public.reviews
  for select to anon, authenticated using (true);
-- ...pero solo el dueño puede crear, cambiar o borrar las suyas.
create policy "reviews_insert_own" on public.reviews
  for insert to authenticated with check (auth.uid() = user_id);
create policy "reviews_update_own" on public.reviews
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews_delete_own" on public.reviews
  for delete to authenticated using (auth.uid() = user_id);

-- Impide cambiar el dueño de una fila aunque la política lo permitiera.
revoke update on public.reviews from authenticated;
grant  update (rating, comment, recommend) on public.reviews to authenticated;
