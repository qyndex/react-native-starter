-- Initial schema: profiles + todos with RLS
-- Run via: npx supabase db push

-- Profiles table (auto-created on signup via trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (for trigger)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to make migration idempotent
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Todos table
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  description text,
  completed boolean not null default false,
  due_date timestamptz,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

-- Users can only see their own todos
create policy "Users can read own todos"
  on public.todos for select
  using (auth.uid() = user_id);

-- Users can create their own todos
create policy "Users can create own todos"
  on public.todos for insert
  with check (auth.uid() = user_id);

-- Users can update their own todos
create policy "Users can update own todos"
  on public.todos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own todos
create policy "Users can delete own todos"
  on public.todos for delete
  using (auth.uid() = user_id);

-- Index for faster todo lookups by user
create index if not exists idx_todos_user_id on public.todos (user_id);
create index if not exists idx_todos_user_completed on public.todos (user_id, completed);
