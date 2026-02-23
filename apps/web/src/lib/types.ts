import type { Database } from "./database.types";

// Convenience type aliases derived from the Supabase-generated Database type
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
export type HabitUpdate = Database["public"]["Tables"]["habits"]["Update"];

export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];
export type HabitLogInsert = Database["public"]["Tables"]["habit_logs"]["Insert"];
export type HabitLogUpdate = Database["public"]["Tables"]["habit_logs"]["Update"];

export type GoalStreak = Database["public"]["Tables"]["goal_streaks"]["Row"];
export type GoalStreakInsert = Database["public"]["Tables"]["goal_streaks"]["Insert"];
export type GoalStreakUpdate = Database["public"]["Tables"]["goal_streaks"]["Update"];

export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type AchievementInsert = Database["public"]["Tables"]["achievements"]["Insert"];

export type Reward = Database["public"]["Tables"]["rewards"]["Row"];
export type RewardInsert = Database["public"]["Tables"]["rewards"]["Insert"];
export type RewardUpdate = Database["public"]["Tables"]["rewards"]["Update"];
