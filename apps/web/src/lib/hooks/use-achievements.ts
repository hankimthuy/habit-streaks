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

export function useAchievements() {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
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
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return {
    achievements,
    loading,
    error,
    unlockedCount,
    totalCount,
    refresh: fetchAchievements,
  };
}
