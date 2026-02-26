-- Add last_checkin_date column to track per-day check-in for Today's Grind
ALTER TABLE goal_streaks
  ADD COLUMN IF NOT EXISTS last_checkin_date date;
