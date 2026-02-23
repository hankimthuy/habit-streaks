import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// GET /api/dashboard?date=2024-02-24
// Returns habits + logs for the given date, plus streak stats
export async function GET(request: NextRequest) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({
      tasks: [],
      goalStreaks: [],
      stats: { currentStreak: 0, completionRate: 0, completedToday: 0, totalHabits: 0 },
    });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date param required" }, { status: 400 });
  }

  // Fetch habits, today's logs, goal streaks in parallel
  const [habitsRes, logsRes, streaksRes] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at"),
    supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date),
    supabase
      .from("goal_streaks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at"),
  ]);

  if (habitsRes.error) {
    return NextResponse.json({ error: habitsRes.error.message }, { status: 500 });
  }

  const habits = habitsRes.data ?? [];
  const logs = logsRes.data ?? [];
  const goalStreaks = streaksRes.data ?? [];

  // Build a log lookup: habit_id -> log
  const logMap = new Map(logs.map((l) => [l.habit_id, l]));

  // Merge habits with their log status for today
  const tasks = habits.map((h) => {
    const log = logMap.get(h.id);
    return {
      ...h,
      completed: log?.completed ?? false,
      log_id: log?.id ?? null,
    };
  });

  // Calculate stats
  const totalHabits = habits.length;
  const completedToday = tasks.filter((t) => t.completed).length;
  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Current streak: count consecutive days backwards from yesterday where all habits were completed
  // (simplified — uses goal_streaks max current_streak)
  const currentStreak =
    goalStreaks.length > 0
      ? Math.max(...goalStreaks.map((s) => s.current_streak))
      : 0;

  return NextResponse.json({
    tasks,
    goalStreaks,
    stats: {
      currentStreak,
      completionRate,
      completedToday,
      totalHabits,
    },
  });
}
