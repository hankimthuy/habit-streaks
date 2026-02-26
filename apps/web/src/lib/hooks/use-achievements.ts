"use client";

import { useState, useEffect, useCallback } from "react";

export interface AchievementData {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlocked_at: string | null;
  created_at: string;
}

export interface RewardData {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  redeemed: boolean;
  valid_until: string;
  created_at: string;
}

export interface ProfileData {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  created_at: string;
}

export interface ActivityDay {
  date: string;
  level: number;
  total: number;
  completed: number;
}

export interface ActivityData {
  timeframe: string;
  startDate: string;
  endDate: string;
  days: ActivityDay[];
  stats: {
    totalDays: number;
    activeDays: number;
    perfectDays: number;
    coverageRate: number;
  };
}

export type Timeframe = "Week" | "Month" | "Year";

export function useAchievements() {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("Month");
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    try {
      const res = await fetch("/api/achievements");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch achievements");
      }
      const json: AchievementData[] = await res.json();
      setAchievements(json);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const fetchRewards = useCallback(async () => {
    try {
      const res = await fetch("/api/rewards");
      if (!res.ok) return;
      const json: RewardData[] = await res.json();
      setRewards(json);
    } catch {
      // silently fail for rewards
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const json: ProfileData = await res.json();
      setProfile(json);
    } catch {
      // silently fail for profile
    }
  }, []);

  const fetchCurrentStreak = useCallback(async () => {
    try {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const res = await fetch(`/api/dashboard?date=${dateStr}`);
      if (!res.ok) return;
      const json = await res.json();
      setCurrentStreak(json.stats?.currentStreak ?? 0);
    } catch {
      // silently fail
    }
  }, []);

  const fetchActivity = useCallback(async (tf: Timeframe) => {
    try {
      const res = await fetch(`/api/activity?timeframe=${tf.toLowerCase()}`);
      if (!res.ok) return;
      const json: ActivityData = await res.json();
      setActivity(json);
    } catch {
      // silently fail for activity
    }
  }, []);

  const changeTimeframe = useCallback((tf: Timeframe) => {
    setTimeframe(tf);
    fetchActivity(tf);
  }, [fetchActivity]);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchAchievements(),
        fetchRewards(),
        fetchProfile(),
        fetchActivity(timeframe),
        fetchCurrentStreak(),
      ]);
      setLoading(false);
    };
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return {
    achievements,
    rewards,
    profile,
    activity,
    currentStreak,
    timeframe,
    changeTimeframe,
    loading,
    error,
    unlockedCount,
    totalCount,
    refresh: async () => {
      await Promise.all([
        fetchAchievements(),
        fetchRewards(),
        fetchProfile(),
        fetchActivity(timeframe),
      ]);
    },
  };
}
