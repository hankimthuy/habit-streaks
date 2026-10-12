"use client";

import { useState, useEffect, useCallback } from "react";
import { localFetch } from "@/lib/local-api";
import type { ProfileData } from "@/lib/hooks/use-achievements";

export interface ProfileSummary extends ProfileData {
  username: string;
  total_checkins: number;
  rewards_earned: number;
  achievements_unlocked: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileSummary | null>(null);

  const refresh = useCallback(async () => {
    const res = await localFetch("/api/profile");
    if (res.ok) setProfile(await res.json());
  }, []);

  const save = useCallback(
    async (display_name: string, username: string) => {
      const res = await localFetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name, username }),
      });
      if (res.ok) await refresh();
      return res.ok;
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, refresh, save };
}
