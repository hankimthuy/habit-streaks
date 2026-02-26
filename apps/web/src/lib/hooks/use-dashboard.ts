"use client";

import { useState, useEffect, useCallback } from "react";
import { vnToday, getVNWeek } from "@/lib/date-utils";

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
  start_date: string | null;
  end_date: string | null;
  mode: "daily" | "free";
  last_checkin_date: string | null;
  created_at: string;
}

export interface DashboardStats {
  currentStreak: number;
  completionRate: number;
  completedToday: number;
  totalToday: number;
}

export interface WeekSummary {
  [date: string]: { total: number; completed: number };
}

interface DashboardData {
  todayStreaks: DashboardGoalStreak[];
  goalStreaks: DashboardGoalStreak[];
  stats: DashboardStats;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [weekSummary, setWeekSummary] = useState<WeekSummary>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingGoals, setLoadingGoals] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
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
    async (goalId: string, action: "increment" | "decrement" = "increment", isTodayGrind = false) => {
      // For today's grind, prevent multiple clicks on the same goal
      // For goal streaks, allow multiple checkins (catch up for missed days)
      if (isTodayGrind && loadingGoals.has(goalId)) return;
      
      setLoadingGoals(prev => new Set(prev).add(goalId));
      
      try {
        const res = await fetch(`/api/goal-streaks/${goalId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, date: today }),
        });
        
        if (res.ok) {
          await fetchDashboard();
          const goal = data?.todayStreaks.find(g => g.id === goalId) || data?.goalStreaks.find(g => g.id === goalId);
          const goalTitle = goal?.title || "Goal";
          
          setNotification({
            type: 'success',
            message: action === 'increment' 
              ? `${goalTitle} checked in successfully!` 
              : `${goalTitle} checked out successfully!`
          });
        } else {
          const err = await res.json();
          throw new Error(err.error || "Failed to update goal");
        }
      } catch (e: any) {
        setNotification({
          type: 'error',
          message: e.message || "Failed to update goal. Please try again."
        });
      } finally {
        setLoadingGoals(prev => {
          const newSet = new Set(prev);
          newSet.delete(goalId);
          return newSet;
        });
        
        // Auto-clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      }
    },
    [fetchDashboard, today, data, loadingGoals]
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
    logGoalStreak,
    deleteGoalStreak,
    editGoalStreak,
    refresh: fetchDashboard,
    loadingGoals,
    notification,
    clearNotification: () => setNotification(null),
  };
}
