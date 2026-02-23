import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

type Client = SupabaseClient<Database>;

export async function getMonthlyCompletion(supabase: Client, userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("habit_logs")
    .select("completed")
    .eq("user_id", userId)
    .gte("date", startOfMonth)
    .lte("date", endOfMonth);

  if (error) throw error;

  const total = data?.length ?? 0;
  const completed = data?.filter((l) => l.completed).length ?? 0;
  const failed = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { percentage, completed, failed };
}

export async function getWeeklyDoVsDont(supabase: Client, userId: string) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startDate = monday.toISOString().split("T")[0];
  const endDate = sunday.toISOString().split("T")[0];

  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("date, completed, habit_id")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);

  if (logsError) throw logsError;

  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("id, type")
    .eq("user_id", userId);

  if (habitsError) throw habitsError;

  const habitTypeMap = new Map(habits?.map((h) => [h.id, h.type]) ?? []);
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return dayLabels.map((label, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const dayLogs = logs?.filter((l) => l.date === dateStr) ?? [];
    const doLogs = dayLogs.filter(
      (l) => habitTypeMap.get(l.habit_id) === "positive"
    );
    const dontLogs = dayLogs.filter(
      (l) => habitTypeMap.get(l.habit_id) === "negative"
    );

    const doTotal = doLogs.length || 1;
    const dontTotal = dontLogs.length || 1;
    const doCompleted = doLogs.filter((l) => l.completed).length;
    const dontCompleted = dontLogs.filter((l) => l.completed).length;

    return {
      label,
      doPercent: Math.round((doCompleted / doTotal) * 100),
      dontPercent: Math.round(((dontTotal - dontCompleted) / dontTotal) * 100),
    };
  });
}

export async function getLongestStreaks(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("goal_streaks")
    .select("*")
    .eq("user_id", userId)
    .order("longest_streak", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data ?? [];
}
