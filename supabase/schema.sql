-- ─────────────────────────────────────────────────────────────
--  Comments for the expedition logs.
--  Paste this whole file into Supabase → SQL Editor → Run.
--  Safe to run again; it only creates what's missing.
-- ─────────────────────────────────────────────────────────────

-- The name each hunter shows next to their comments.
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 40),
  created_at   timestamptz not null default now()
);

create table if not exists public.comments (
  id         bigint generated always as identity primary key,
  post       text not null,   -- the entry's address, e.g. /logs/2026/10/17/the-first-expedition/
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body       text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments (post, created_at);

alter table public.profiles enable row level security;
alter table public.comments enable row level security;

-- Signed-in = clicked the link in their email. Anonymous sign-ins
-- (off by default in Supabase) are refused even if switched on.
create or replace function public.is_verified_user() returns boolean
language sql stable as $$
  select auth.uid() is not null
     and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false)
$$;

-- Anyone can read names and comments.
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles
  for select using (true);

drop policy if exists "comments are public" on public.comments;
create policy "comments are public" on public.comments
  for select using (true);

-- Verified users manage their own name...
drop policy if exists "set own name" on public.profiles;
create policy "set own name" on public.profiles
  for insert with check (public.is_verified_user() and id = auth.uid());

drop policy if exists "change own name" on public.profiles;
create policy "change own name" on public.profiles
  for update using (id = auth.uid()) with check (public.is_verified_user() and id = auth.uid());

-- ...and post or delete their own comments. Editing isn't allowed.
drop policy if exists "post as yourself" on public.comments;
create policy "post as yourself" on public.comments
  for insert with check (public.is_verified_user() and user_id = auth.uid());

drop policy if exists "delete own comments" on public.comments;
create policy "delete own comments" on public.comments
  for delete using (user_id = auth.uid());
