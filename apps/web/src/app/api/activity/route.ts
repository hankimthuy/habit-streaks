import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// GET /api/activity?timeframe=week|month|year
// Returns activity data for the heatmap based on habit_logs completion rates
export async function GET(request: NextRequest) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe") || "month";

  const now = new Date();
  let startDate: string;
  let endDate: string;

  // Calculate date range based on timeframe
  if (timeframe === "week") {
    // Current week (Mon–Sun)
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    startDate = toDateStr(monday);
    endDate = toDateStr(sunday);
  } else if (timeframe === "year") {
    // Last 365 days
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);
    yearAgo.setDate(yearAgo.getDate() + 1);
    startDate = toDateStr(yearAgo);
    endDate = toDateStr(now);
  } else {
    // month: current month
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    startDate = toDateStr(firstDay);
    endDate = toDateStr(lastDay);
  }

  // Fetch total number of habits the user has (denominator for completion rate)
  const { count: totalHabits } = await supabase
    .from("habits")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const habitsCount = totalHabits ?? 1;

  // Fetch habit_logs in range
  const { data: logs, error } = await supabase
    .from("habit_logs")
    .select("date, completed")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aggregate by date: { date -> completed count }
  const dailyMap: Record<string, { completed: number; logged: number }> = {};
  for (const log of logs ?? []) {
    if (!dailyMap[log.date]) {
      dailyMap[log.date] = { completed: 0, logged: 0 };
    }
    dailyMap[log.date].logged++;
    if (log.completed) {
      dailyMap[log.date].completed++;
    }
  }

  // Build activity array: each day gets a level 0–3
  // Level is based on completed / totalHabits (not just logged habits)
  const days: { date: string; level: number; total: number; completed: number }[] = [];
  const current = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  while (current <= end) {
    const dateStr = toDateStr(current);
    const stats = dailyMap[dateStr];
    const completed = stats?.completed ?? 0;
    let level = 0;
    if (completed > 0) {
      const ratio = completed / habitsCount;
      if (ratio >= 1) level = 3;
      else if (ratio >= 0.5) level = 2;
      else level = 1;
    }
    days.push({
      date: dateStr,
      level,
      total: habitsCount,
      completed,
    });
    current.setDate(current.getDate() + 1);
  }

  // Also compute coverage rate
  const totalDays = days.length;
  const activeDays = days.filter((d) => d.level > 0).length;
  const perfectDays = days.filter((d) => d.level === 3).length;
  const coverageRate = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

  return NextResponse.json({
    timeframe,
    startDate,
    endDate,
    days,
    stats: {
      totalDays,
      activeDays,
      perfectDays,
      coverageRate,
    },
  });
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
