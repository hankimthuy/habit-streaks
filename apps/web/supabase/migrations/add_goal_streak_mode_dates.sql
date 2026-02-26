-- Add mode, start_date, end_date columns to goal_streaks table
-- Run this migration in your Supabase SQL editor

ALTER TABLE goal_streaks
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS end_date date,
  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'daily';
