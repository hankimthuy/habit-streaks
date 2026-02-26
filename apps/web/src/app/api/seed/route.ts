import { NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/constants/leveling";

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

  // Generate gym dates: Mon(1), Wed(3), Fri(5), Sun(0) for the last 5 weeks
  // Uses relative dates so data always falls within all timeframe ranges
  const gymDays = [0, 1, 3, 5]; // JS day indices: Sun=0, Mon=1, Wed=3, Fri=5
  const nowLocal = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const gymEnd = new Date(nowLocal);
  gymEnd.setDate(gymEnd.getDate() - 1); // yesterday (so we don't seed future)
  const gymStart = new Date(gymEnd);
  gymStart.setDate(gymEnd.getDate() - 34); // ~5 weeks back
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

  // Delete old habit logs for this habit so stale data doesn't accumulate
  await supabase
    .from("habit_logs")
    .delete()
    .eq("habit_id", gymHabitId)
    .eq("user_id", userId);

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

  // ============================================================
  // 3. Achievements — seed all achievement definitions
  // ============================================================
  const { data: existingAchievements } = await supabase
    .from("achievements")
    .select("name")
    .eq("user_id", userId);

  const existingNames = new Set((existingAchievements ?? []).map((a) => a.name));
  const newAchievements = ACHIEVEMENT_DEFINITIONS.filter(
    (a) => !existingNames.has(a.name)
  );

  if (newAchievements.length > 0) {
    // Unlock some achievements for demo purposes
    const unlockedNames = new Set(["First Step", "3-Day Spark", "Week Warrior", "Goal Setter", "Early Bird"]);
    const achievementRows = newAchievements.map((a) => ({
      user_id: userId,
      name: a.name,
      icon: a.icon,
      description: a.description,
      unlocked: unlockedNames.has(a.name),
      unlocked_at: unlockedNames.has(a.name) ? new Date().toISOString() : null,
    }));

    const { error: achErr } = await supabase
      .from("achievements")
      .insert(achievementRows);

    if (achErr) {
      results.push(`Failed to seed achievements: ${achErr.message}`);
    } else {
      results.push(
        `Seeded ${achievementRows.length} achievements (${unlockedNames.size} unlocked).`
      );
    }
  } else {
    results.push("Achievements already seeded, skipping.");
  }

  // ============================================================
  // 4. Rewards — seed sample rewards
  // ============================================================
  const { data: existingRewards } = await supabase
    .from("rewards")
    .select("title")
    .eq("user_id", userId);

  const existingRewardTitles = new Set((existingRewards ?? []).map((r) => r.title));
  const rewardDefs = [
    {
      title: "Free Milk Coffee",
      description: "You hit your 7-day Americano goal!",
      icon: "local_cafe",
      unlocked: true,
      redeemed: false,
      valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Premium Dark Theme",
      description: "Reach Level 5 to unlock this exclusive theme",
      icon: "palette",
      unlocked: false,
      redeemed: false,
      valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Streak Shield",
      description: "Protect your streak for 1 day if you miss",
      icon: "shield",
      unlocked: false,
      redeemed: false,
      valid_until: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const newRewards = rewardDefs.filter((r) => !existingRewardTitles.has(r.title));
  if (newRewards.length > 0) {
    const rewardRows = newRewards.map((r) => ({
      user_id: userId,
      ...r,
    }));

    const { error: rewErr } = await supabase.from("rewards").insert(rewardRows);
    if (rewErr) {
      results.push(`Failed to seed rewards: ${rewErr.message}`);
    } else {
      results.push(`Seeded ${rewardRows.length} rewards.`);
    }
  } else {
    results.push("Rewards already seeded, skipping.");
  }

  // ============================================================
  // 5. Profile XP — set sample XP for demo
  // ============================================================
  const { error: xpErr } = await supabase
    .from("profiles")
    .update({ xp: 1350, level: 3 })
    .eq("id", userId);

  if (xpErr) {
    results.push(`Failed to update profile XP: ${xpErr.message}`);
  } else {
    results.push("Set profile XP to 1350 (Level 3).");
  }

  return NextResponse.json({
    success: true,
    results,
    gymDates,
  });
}
