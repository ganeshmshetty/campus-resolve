-- ============================================================
-- CampusResolve — NEW TABLES MIGRATION
-- Run this in Supabase SQL Editor.
-- The tables: profiles, reports, report_images, report_updates
-- and the storage bucket are already created.
-- This adds: report_votes and report_comments.
-- ============================================================

-- 1) report_votes
--    One row per user per report. The UNIQUE constraint prevents duplicate votes.
create table if not exists public.report_votes (
  id          uuid        primary key default gen_random_uuid(),
  report_id   uuid        not null references public.reports(id) on delete cascade,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (report_id, user_id)
);

create index if not exists idx_report_votes_report_id on public.report_votes(report_id);
create index if not exists idx_report_votes_user_id   on public.report_votes(user_id);

-- 2) report_comments
create table if not exists public.report_comments (
  id          uuid        primary key default gen_random_uuid(),
  report_id   uuid        not null references public.reports(id) on delete cascade,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  content     text        not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_report_comments_report_id  on public.report_comments(report_id);
create index if not exists idx_report_comments_created_at on public.report_comments(created_at desc);

-- 3) Enable Row Level Security
alter table public.report_votes    enable row level security;
alter table public.report_comments enable row level security;

-- 4) RLS — report_votes
--    Anyone can read vote counts (for display on feed).
--    Only the owning user can insert or delete their own vote.
create policy "Votes are publicly readable"
  on public.report_votes for select
  using (true);

create policy "Authenticated users can vote"
  on public.report_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own vote"
  on public.report_votes for delete
  using (auth.uid() = user_id);

-- 5) RLS — report_comments
--    Anyone can read comments.
--    Authenticated users can add comments.
--    Only the author can delete their own comment.
create policy "Comments are publicly readable"
  on public.report_comments for select
  using (true);

create policy "Authenticated users can comment"
  on public.report_comments for insert
  with check (auth.uid() = user_id);

create policy "Authors can delete their own comments"
  on public.report_comments for delete
  using (auth.uid() = user_id);
