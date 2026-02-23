import { NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// POST /api/seed — seed default data for the current dev user
// Requires: RLS disabled + dev user created via SQL migration (00002_seed_data.sql)
// This endpoint is idempotent: it checks for existing data before inserting.
export async function POST() {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json(
      { error: "No user found. Run the SQL migration 00002_seed_data.sql first." },
      { status: 404 }
    );
  }

  const results: string[] = [];

  // ============================================================
  // 1. Gym Habit — 4 days/week (Mon, Wed, Fri, Sun)
  //    Period: 24 Feb 2025 – 30 Mar 2025 (Vietnam time)
  // ============================================================

  // Check if gym habit already exists
  const { data: existingGym } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", userId)
    .eq("title", "Gym Workout")
    .single();

  let gymHabitId: string;

  if (existingGym) {
    gymHabitId = existingGym.id;
    results.push("Gym habit already exists, skipping creation.");
  } else {
    const { data: gymHabit, error: gymErr } = await supabase
      .from("habits")
      .insert({
        user_id: userId,
        title: "Gym Workout",
        subtitle: "4 days/week — Mon, Wed, Fri, Sun",
        icon: "fitness_center",
        type: "positive" as const,
        category: "Health",
      })
      .select()
      .single();

    if (gymErr || !gymHabit) {
      return NextResponse.json(
        { error: `Failed to create gym habit: ${gymErr?.message}` },
        { status: 500 }
      );
    }

    gymHabitId = gymHabit.id;
    results.push("Created Gym Workout habit.");
  }

  // Generate gym dates: Mon(1), Wed(3), Fri(5), Sun(0) from 2025-02-24 to 2025-03-30
  const gymDays = [0, 1, 3, 5]; // JS day indices: Sun=0, Mon=1, Wed=3, Fri=5
  const gymStart = new Date("2025-02-24T00:00:00+07:00");
  const gymEnd = new Date("2025-03-30T23:59:59+07:00");
  const gymDates: string[] = [];

  for (
    let d = new Date(gymStart);
    d <= gymEnd;
    d.setDate(d.getDate() + 1)
  ) {
    if (gymDays.includes(d.getDay())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      gymDates.push(`${y}-${m}-${day}`);
    }
  }

  // Insert habit logs for all gym dates (only past/today dates as completed, future as not completed)
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const gymLogs = gymDates.map((date) => ({
    habit_id: gymHabitId,
    user_id: userId,
    date,
    completed: date <= todayISO, // past & today = completed, future = not completed
  }));

  if (gymLogs.length > 0) {
    const { error: logsErr } = await supabase
      .from("habit_logs")
      .upsert(gymLogs, { onConflict: "habit_id,date" });

    if (logsErr) {
      results.push(`Failed to insert gym logs: ${logsErr.message}`);
    } else {
      results.push(
        `Inserted/updated ${gymLogs.length} gym log entries (${gymDates[0]} to ${gymDates[gymDates.length - 1]}).`
      );
    }
  }

  // ============================================================
  // 2. Goal Streak — 7 Americanos → 1 Milk Coffee
  //    Started 23 Feb 2025, current_streak = 1
  // ============================================================

  const { data: existingStreak } = await supabase
    .from("goal_streaks")
    .select("id")
    .eq("user_id", userId)
    .eq("title", "Drink Americano")
    .single();

  if (existingStreak) {
    results.push("Americano goal streak already exists, skipping creation.");
  } else {
    const { error: streakErr } = await supabase
      .from("goal_streaks")
      .insert({
        user_id: userId,
        title: "Drink Americano",
        subtitle: "7 times → Drink Milk Coffee",
        icon: "local_cafe",
        color: "amber",
        target_days: 7,
        current_streak: 1,
        longest_streak: 1,
        reward_title: "Drink Milk Coffee",
      });

    if (streakErr) {
      results.push(`Failed to create goal streak: ${streakErr.message}`);
    } else {
      results.push(
        "Created goal streak: 7 Americanos → 1 Milk Coffee (1/7 completed from 23 Feb)."
      );
    }
  }

  return NextResponse.json({
    success: true,
    results,
    gymDates,
  });
}
