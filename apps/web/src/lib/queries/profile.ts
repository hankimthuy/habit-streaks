import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

type Client = SupabaseClient<Database>;

export async function getProfile(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  supabase: Client,
  userId: string,
  updates: Database["public"]["Tables"]["profiles"]["Update"]
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfileStats(supabase: Client, userId: string) {
  const [streaksResult, rewardsResult] = await Promise.all([
    supabase
      .from("goal_streaks")
      .select("current_streak")
      .eq("user_id", userId),
    supabase
      .from("rewards")
      .select("id")
      .eq("user_id", userId)
      .eq("unlocked", true),
  ]);

  const totalStreaks =
    streaksResult.data?.reduce((sum, s) => sum + s.current_streak, 0) ?? 0;
  const giftsEarned = rewardsResult.data?.length ?? 0;

  return { totalStreaks, giftsEarned };
}
