create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique,
  email text unique,
  password_hash text,
  auth_provider text not null default 'password',
  google_name text,
  google_picture text,
  patreon_id text,
  patreon_tier text,
  is_patron boolean not null default false,
  character_limit integer not null default 100,
  created_at timestamptz not null default now()
);

alter table public.users add column if not exists username text;
alter table public.users add column if not exists email text;
alter table public.users add column if not exists password_hash text;
alter table public.users add column if not exists auth_provider text not null default 'password';
alter table public.users add column if not exists google_name text;
alter table public.users add column if not exists google_picture text;
alter table public.users add column if not exists patreon_id text;
alter table public.users add column if not exists patreon_tier text;
alter table public.users add column if not exists is_patron boolean not null default false;
alter table public.users add column if not exists character_limit integer not null default 100;
alter table public.users add column if not exists created_at timestamptz not null default now();

create unique index if not exists users_username_unique_idx
  on public.users(username)
  where username is not null;

create unique index if not exists users_email_unique_idx
  on public.users(email)
  where email is not null;

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  preset text not null default '',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.characters add column if not exists user_id uuid references public.users(id) on delete cascade;
alter table public.characters add column if not exists name text not null default 'Unnamed character';
alter table public.characters add column if not exists preset text not null default '';
alter table public.characters add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.characters add column if not exists created_at timestamptz not null default now();
alter table public.characters add column if not exists updated_at timestamptz not null default now();

create table if not exists public.sheets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null default 'Unnamed character',
  preset text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sheet_data (
  sheet_id uuid primary key references public.sheets(id) on delete cascade,
  data jsonb not null default '{}'::jsonb
);

insert into public.sheets (id, user_id, name, preset, created_at, updated_at)
select
  id,
  user_id,
  coalesce(nullif(name, ''), 'Unnamed character'),
  coalesce(preset, ''),
  coalesce(created_at, now()),
  coalesce(updated_at, created_at, now())
from public.characters
where user_id is not null
on conflict (id) do nothing;

insert into public.sheet_data (sheet_id, data)
select id, coalesce(data, '{}'::jsonb)
from public.characters
where user_id is not null
on conflict (sheet_id) do nothing;

create index if not exists characters_user_id_idx
  on public.characters(user_id);

create index if not exists characters_user_updated_at_idx
  on public.characters(user_id, updated_at desc);

create index if not exists characters_user_name_idx
  on public.characters(user_id, name);

create index if not exists sheets_user_id_idx
  on public.sheets(user_id);

create index if not exists sheets_user_updated_at_idx
  on public.sheets(user_id, updated_at desc);

create index if not exists sheets_user_name_idx
  on public.sheets(user_id, name);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists characters_set_updated_at on public.characters;
drop trigger if exists sheets_set_updated_at on public.sheets;

create trigger characters_set_updated_at
before update on public.characters
for each row
execute function public.set_updated_at();

create trigger sheets_set_updated_at
before update on public.sheets
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.characters enable row level security;
alter table public.sheets enable row level security;
alter table public.sheet_data enable row level security;

-- The app writes through Netlify Functions with SUPABASE_SERVICE_ROLE_KEY.
-- Keep direct anonymous/client access closed unless you later add Supabase Auth policies.
