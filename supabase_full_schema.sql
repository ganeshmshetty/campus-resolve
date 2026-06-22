-- ============================================================
-- FULL RESET & SCHEMA SETUP FOR CAMPUSRESOLVE
-- Drops all tables, sets up Auth.js schema, Public schema, 
-- Storage buckets, and RLS policies in one go.
-- ============================================================

-- 1. DROP EXISTING TABLES & SCHEMAS TO START FRESH
drop schema if exists next_auth cascade;
drop table if exists public.report_comments cascade;
drop table if exists public.report_votes cascade;
drop table if exists public.report_images cascade;
drop table if exists public.report_updates cascade;
drop table if exists public.reports cascade;
drop table if exists public.profiles cascade;

-- ============================================================
-- NEXT_AUTH SCHEMA (Auth.js Adapter)
-- ============================================================
create schema next_auth;

grant usage on schema next_auth to service_role;
grant all on schema next_auth to service_role;

create table next_auth.users (
  id uuid not null default gen_random_uuid(),
  name text,
  email text,
  "emailVerified" timestamp with time zone,
  image text,
  password text,
  role text default 'user',
  constraint users_pkey primary key (id),
  constraint email_unique unique (email)
);

create table next_auth.accounts (
  id uuid not null default gen_random_uuid(),
  "userId" uuid not null,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  constraint accounts_pkey primary key (id),
  constraint accounts_provider_providerAccountId_key unique (provider, "providerAccountId"),
  constraint accounts_userId_fkey foreign key ("userId") references next_auth.users(id) on delete cascade
);

create table next_auth.sessions (
  id uuid not null default gen_random_uuid(),
  expires timestamp with time zone not null,
  "sessionToken" text not null,
  "userId" uuid not null,
  constraint sessions_pkey primary key (id),
  constraint sessionToken_unique unique ("sessionToken"),
  constraint sessions_userId_fkey foreign key ("userId") references next_auth.users(id) on delete cascade
);

create table next_auth.verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamp with time zone not null,
  constraint verification_tokens_pkey primary key (token),
  constraint token_identifier_unique unique (token, identifier)
);

grant all on table next_auth.users to service_role;
grant all on table next_auth.accounts to service_role;
grant all on table next_auth.sessions to service_role;
grant all on table next_auth.verification_tokens to service_role;

-- ============================================================
-- PUBLIC SCHEMA
-- ============================================================

create table public.profiles (
  id uuid primary key,
  name text,
  email text,
  role text default 'user',
  created_at timestamptz default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  status text not null default 'OPEN',
  address text not null,
  latitude float8,
  longitude float8,
  created_by uuid not null references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.report_images (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  image_path text not null,
  image_url text not null,
  image_type text not null,
  created_at timestamptz default now()
);

create table public.report_updates (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  status text not null,
  notes text,
  created_at timestamptz default now()
);

create table public.report_votes (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (report_id, user_id)
);

create table public.report_comments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

insert into storage.buckets (id, name, public)
values ('report-images', 'report-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'report-images' );

drop policy if exists "Authenticated users can upload images" on storage.objects;
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'report-images' );

drop policy if exists "Users can update own images" on storage.objects;
create policy "Users can update own images"
  on storage.objects for update
  using ( bucket_id = 'report-images' );

drop policy if exists "Users can delete own images" on storage.objects;
create policy "Users can delete own images"
  on storage.objects for delete
  using ( bucket_id = 'report-images' );
