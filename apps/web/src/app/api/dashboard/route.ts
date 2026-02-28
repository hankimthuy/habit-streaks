import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// GET /api/dashboard?date=2024-02-24
// Returns goal streaks (split into todayStreaks + all goalStreaks) plus stats
export async function GET(request: NextRequest) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({
      todayStreaks: [],
      goalStreaks: [],
      doDonts: [],
      stats: { currentStreak: 0, completionRate: 0, completedToday: 0, totalToday: 0 },
    });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date param required" }, { status: 400 });
  }

  // Fetch goal streaks
  const { data: allStreaks, error: streaksErr } = await supabase
    .from("goal_streaks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at");

  if (streaksErr) {
    return NextResponse.json({ error: streaksErr.message }, { status: 500 });
  }

  const goalStreaks = allStreaks ?? [];

  // Today's Grind: daily-mode streaks where today falls within [start_date, end_date]
  const todayStreaks = goalStreaks.filter((s) => {
    if (s.mode !== "daily") return false;
    if (!s.start_date || !s.end_date) return false;
    return date >= s.start_date && date <= s.end_date;
  });

  // Do's & Don'ts: active rules
  const doDonts = goalStreaks.filter((s) => {
    if (s.mode !== "do_dont") return false;
    if (s.start_date && date < s.start_date) return false;
    if (s.end_date && date > s.end_date) return false;
    return true;
  });

  // Stats
  const totalToday = todayStreaks.length;
  const completedToday = todayStreaks.filter(
    (s) => s.current_streak >= s.target_days
  ).length;
  const completionRate =
    totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const currentStreak =
    goalStreaks.length > 0
      ? Math.max(...goalStreaks.map((s) => s.current_streak))
      : 0;

  return NextResponse.json({
    todayStreaks,
    goalStreaks: goalStreaks.filter((s) => s.mode === "free"),
    doDonts,
    stats: {
      currentStreak,
      completionRate,
      completedToday,
      totalToday,
    },
  });
}
