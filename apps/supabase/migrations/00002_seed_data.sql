-- ============================================================
-- DEV SETUP: Disable RLS + Create default profile + Seed data
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Disable RLS on all tables for development
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards DISABLE ROW LEVEL SECURITY;

-- 2. Create a default dev user via auth.users (needed for FK on profiles)
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'dev@habit-streaks.local',
  crypt('dev123456', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Dev User"}'::jsonb,
  now(), now(), ''
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create profile for dev user (trigger may have already done this)
INSERT INTO public.profiles (id, display_name, email)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Dev User',
  'dev@habit-streaks.local'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. Seed: Gym Workout Habit + Logs
--    4 days/week (Mon, Wed, Fri, Sun), 24 Feb – 30 Mar 2025
-- ============================================================
DO $$
DECLARE
  v_user_id uuid := '00000000-0000-0000-0000-000000000001';
  v_habit_id uuid;
BEGIN
  -- Insert habit
  INSERT INTO public.habits (user_id, title, subtitle, icon, type, category)
  VALUES (
    v_user_id,
    'Gym Workout',
    '4 days/week — Mon, Wed, Fri, Sun',
    'fitness_center',
    'positive',
    'Health'
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_habit_id;

  -- If already existed, fetch id
  IF v_habit_id IS NULL THEN
    SELECT id INTO v_habit_id
    FROM public.habits
    WHERE user_id = v_user_id AND title = 'Gym Workout'
    LIMIT 1;
  END IF;

  -- Insert logs: Mon(1), Wed(3), Fri(5), Sun(0)
  -- Past/today = completed, future = not completed
  INSERT INTO public.habit_logs (habit_id, user_id, date, completed)
  SELECT
    v_habit_id,
    v_user_id,
    d::date,
    (d::date <= CURRENT_DATE) AS completed
  FROM generate_series('2025-02-24'::date, '2025-03-30'::date, '1 day'::interval) AS d
  WHERE EXTRACT(DOW FROM d) IN (0, 1, 3, 5)
  ON CONFLICT (habit_id, date) DO UPDATE SET completed = EXCLUDED.completed;

  RAISE NOTICE 'Gym habit seeded: % logs', (
    SELECT count(*) FROM public.habit_logs WHERE habit_id = v_habit_id
  );
END;
$$;

-- ============================================================
-- 5. Seed: Goal Streak — 7 Americanos → 1 Milk Coffee
--    Started 23 Feb 2025, current_streak = 1
-- ============================================================
INSERT INTO public.goal_streaks (
  user_id, title, subtitle, icon, color,
  target_days, current_streak, longest_streak, reward_title
)
SELECT
  '00000000-0000-0000-0000-000000000001',
  'Drink Americano',
  '7 times → Drink Milk Coffee',
  'local_cafe',
  'amber',
  7, 1, 1,
  'Drink Milk Coffee'
WHERE NOT EXISTS (
  SELECT 1 FROM public.goal_streaks
  WHERE user_id = '00000000-0000-0000-0000-000000000001'
    AND title = 'Drink Americano'
);
