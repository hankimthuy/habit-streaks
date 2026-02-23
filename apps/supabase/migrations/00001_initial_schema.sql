-- Habit Streaks: Initial Supabase/PostgreSQL Schema
-- Run this migration via the Supabase Dashboard SQL Editor or CLI.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Custom enum for habit type
create type habit_type as enum ('positive', 'negative');

-- ============================================================
-- Profiles (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  email       text not null default '',
  avatar_url  text,
  level       integer not null default 1,
  xp          integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Habits
-- ============================================================
create table public.habits (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  subtitle    text not null default '',
  icon        text not null default 'check_circle',
  type        habit_type not null default 'positive',
  category    text not null default '',
  created_at  timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "Users can CRUD own habits"
  on public.habits for all
  using (auth.uid() = user_id);

create index idx_habits_user on public.habits(user_id);

-- ============================================================
-- Habit Logs
-- ============================================================
create table public.habit_logs (
  id          uuid primary key default uuid_generate_v4(),
  habit_id    uuid not null references public.habits(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  date        date not null,
  completed   boolean not null default false,
  created_at  timestamptz not null default now(),

  unique (habit_id, date)
);

alter table public.habit_logs enable row level security;

create policy "Users can CRUD own habit logs"
  on public.habit_logs for all
  using (auth.uid() = user_id);

create index idx_habit_logs_user_date on public.habit_logs(user_id, date);
create index idx_habit_logs_habit_date on public.habit_logs(habit_id, date desc);

-- ============================================================
-- Goal Streaks
-- ============================================================
create table public.goal_streaks (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  subtitle        text not null default '',
  icon            text not null default 'local_fire_department',
  color           text not null default 'primary',
  target_days     integer not null default 7,
  current_streak  integer not null default 0,
  longest_streak  integer not null default 0,
  reward_title    text,
  created_at      timestamptz not null default now()
);

alter table public.goal_streaks enable row level security;

create policy "Users can CRUD own goal streaks"
  on public.goal_streaks for all
  using (auth.uid() = user_id);

create index idx_goal_streaks_user on public.goal_streaks(user_id);

-- ============================================================
-- Achievements
-- ============================================================
create table public.achievements (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  icon        text not null default 'emoji_events',
  description text not null default '',
  unlocked    boolean not null default false,
  unlocked_at timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.achievements enable row level security;

create policy "Users can read own achievements"
  on public.achievements for select
  using (auth.uid() = user_id);

create index idx_achievements_user on public.achievements(user_id);

-- ============================================================
-- Rewards
-- ============================================================
create table public.rewards (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text not null default '',
  icon        text not null default 'redeem',
  unlocked    boolean not null default false,
  redeemed    boolean not null default false,
  valid_until timestamptz not null,
  created_at  timestamptz not null default now()
);

alter table public.rewards enable row level security;

create policy "Users can read own rewards"
  on public.rewards for select
  using (auth.uid() = user_id);

create policy "Users can redeem own rewards"
  on public.rewards for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_rewards_user on public.rewards(user_id);

-- ============================================================
-- XP Award Function (called via Supabase Edge Function or RPC)
-- ============================================================
create or replace function public.award_xp(p_user_id uuid, p_amount integer)
returns void
language plpgsql
security definer
as $$
declare
  v_new_xp integer;
  v_new_level integer;
begin
  update public.profiles
  set xp = xp + p_amount,
      updated_at = now()
  where id = p_user_id
  returning xp into v_new_xp;

  v_new_level := (v_new_xp / 500) + 1;

  update public.profiles
  set level = v_new_level,
      updated_at = now()
  where id = p_user_id;
end;
$$;
