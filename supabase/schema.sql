-- Run this once in the Supabase SQL Editor for the SupportAI project.
create table if not exists public.business_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  business_name text not null default '',
  business_info text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.business_profiles enable row level security;

drop policy if exists "Users can read their own business profile" on public.business_profiles;
create policy "Users can read their own business profile"
  on public.business_profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own business profile" on public.business_profiles;
create policy "Users can insert their own business profile"
  on public.business_profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own business profile" on public.business_profiles;
create policy "Users can update their own business profile"
  on public.business_profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.business_profiles to authenticated;
