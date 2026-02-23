"use client";

import { useState, useEffect, useCallback } from "react";
import { vnToday, getVNWeek, formatDateISO } from "@/lib/date-utils";

export interface DashboardTask {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: "positive" | "negative";
  category: string;
  created_at: string;
  completed: boolean;
  log_id: string | null;
}

export interface DashboardGoalStreak {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  target_days: number;
  current_streak: number;
  longest_streak: number;
  reward_title: string | null;
  created_at: string;
}

export interface DashboardStats {
  currentStreak: number;
  completionRate: number;
  completedToday: number;
  totalHabits: number;
}

export interface WeekSummary {
  [date: string]: { total: number; completed: number };
}

interface DashboardData {
  tasks: DashboardTask[];
  goalStreaks: DashboardGoalStreak[];
  stats: DashboardStats;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [weekSummary, setWeekSummary] = useState<WeekSummary>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = vnToday();

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard?date=${today}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch dashboard");
      }
      const json: DashboardData = await res.json();
      setData(json);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [today]);

  const fetchWeekSummary = useCallback(async () => {
    const week = getVNWeek();
    const start = week[0].date;
    const end = week[6].date;
    try {
      const res = await fetch(`/api/habit-logs/week?start=${start}&end=${end}`);
      if (res.ok) {
        const json: WeekSummary = await res.json();
        setWeekSummary(json);
      }
    } catch {
      // non-critical
    }
  }, []);

  const logGoalStreak = useCallback(
    async (goalId: string, action: "increment" | "decrement" = "increment") => {
      try {
        const res = await fetch(`/api/goal-streaks/${goalId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        if (res.ok) {
          await fetchDashboard();
        }
      } catch {
        // silent
      }
    },
    [fetchDashboard]
  );

  const deleteHabit = useCallback(
    async (habitId: string) => {
      try {
        const res = await fetch(`/api/habits/${habitId}`, { method: "DELETE" });
        if (res.ok) {
          await fetchDashboard();
          await fetchWeekSummary();
        }
      } catch { /* silent */ }
    },
    [fetchDashboard, fetchWeekSummary]
  );

  const editHabit = useCallback(
    async (habitId: string, fields: Record<string, unknown>) => {
      try {
        const res = await fetch(`/api/habits/${habitId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        if (res.ok) await fetchDashboard();
      } catch { /* silent */ }
    },
    [fetchDashboard]
  );

  const deleteGoalStreak = useCallback(
    async (goalId: string) => {
      try {
        const res = await fetch(`/api/goal-streaks/${goalId}`, { method: "DELETE" });
        if (res.ok) await fetchDashboard();
      } catch { /* silent */ }
    },
    [fetchDashboard]
  );

  const editGoalStreak = useCallback(
    async (goalId: string, fields: Record<string, unknown>) => {
      try {
        const res = await fetch(`/api/goal-streaks/${goalId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        if (res.ok) await fetchDashboard();
      } catch { /* silent */ }
    },
    [fetchDashboard]
  );

  const toggleHabit = useCallback(
    async (habitId: string) => {
      try {
        const res = await fetch("/api/habit-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ habit_id: habitId, date: today }),
        });
        if (res.ok) {
          // Refresh dashboard data
          await fetchDashboard();
          await fetchWeekSummary();
        }
      } catch {
        // silent
      }
    },
    [today, fetchDashboard, fetchWeekSummary]
  );

  useEffect(() => {
    fetchDashboard();
    fetchWeekSummary();
  }, [fetchDashboard, fetchWeekSummary]);

  return {
    data,
    weekSummary,
    loading,
    error,
    today,
    toggleHabit,
    logGoalStreak,
    deleteHabit,
    editHabit,
    deleteGoalStreak,
    editGoalStreak,
    refresh: fetchDashboard,
  };
}
