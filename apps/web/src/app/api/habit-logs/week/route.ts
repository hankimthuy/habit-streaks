import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// GET /api/habit-logs/week?start=2024-02-19&end=2024-02-25
// Returns a map of date -> { total, completed } for the week
export async function GET(request: NextRequest) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({});
  }

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "start and end query params required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("habit_logs")
    .select("date, completed")
    .eq("user_id", userId)
    .gte("date", start)
    .lte("date", end);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aggregate by date
  const summary: Record<string, { total: number; completed: number }> = {};
  for (const log of data ?? []) {
    if (!summary[log.date]) {
      summary[log.date] = { total: 0, completed: 0 };
    }
    summary[log.date].total++;
    if (log.completed) {
      summary[log.date].completed++;
    }
  }

  return NextResponse.json(summary);
}
