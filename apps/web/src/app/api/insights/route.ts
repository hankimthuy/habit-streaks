import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// GET /api/stats?date=2024-02-24
// Returns completion stats for day/week/month/year based on actual last_checkin_date data
export async function GET(request: NextRequest) {
    const supabase = createApiSupabaseClient();
    const userId = await getDefaultUserId(supabase);

    if (!userId) {
        return NextResponse.json({ day: null, week: null, month: null, year: null });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

    const [yearStr, monthStr, dayStr] = date.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // 0-indexed
    const day = parseInt(dayStr, 10);

    const dateObj = new Date(Date.UTC(year, month, day));

    // Week boundaries (Mon-Sun)
    const dayOfWeek = dateObj.getUTCDay(); // 0=Sun
    const diffToMon = (dayOfWeek + 6) % 7;
    const weekStart = new Date(dateObj);
    weekStart.setUTCDate(dateObj.getUTCDate() - diffToMon);
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
    const weekStartStr = weekStart.toISOString().split("T")[0];
    const weekEndStr = weekEnd.toISOString().split("T")[0];

    // Month boundaries
    const monthStart = `${yearStr}-${monthStr}-01`;
    const endOfMonth = new Date(Date.UTC(year, month + 1, 0));
    const monthEnd = endOfMonth.toISOString().split("T")[0];

    // Year boundaries
    const yearStart = `${yearStr}-01-01`;
    const yearEnd = `${yearStr}-12-31`;

    // Fetch all daily mode streaks for user
    const { data: allStreaks } = await supabase
        .from("goal_streaks")
        .select("id, mode, start_date, end_date, last_checkin_date, target_days, current_streak")
        .eq("user_id", userId)
        .eq("mode", "daily");

    const streaks = allStreaks ?? [];

    const computeStats = (rangeStart: string, rangeEnd: string) => {
        // Only active streaks that overlap with this range
        const active = streaks.filter((s) => {
            if (!s.start_date || !s.end_date) return false;
            return s.start_date <= rangeEnd && s.end_date >= rangeStart;
        });
        const total = active.length;
        // A streak is "completed" for a period if it has checked in within that range
        const completed = active.filter(
            (s) => s.last_checkin_date && s.last_checkin_date >= rangeStart && s.last_checkin_date <= rangeEnd
        ).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, failed: total - completed, percentage };
    };

    return NextResponse.json({
        day: computeStats(date, date),
        week: computeStats(weekStartStr, weekEndStr),
        month: computeStats(monthStart, monthEnd),
        year: computeStats(yearStart, yearEnd),
    });
}
