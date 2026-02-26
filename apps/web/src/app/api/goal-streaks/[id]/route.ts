import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// PATCH /api/goal-streaks/[id] — increment or update a goal streak
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const body = await request.json();
  const { action, current_streak, date } = body;

  // Fetch current goal streak
  const { data: goal, error: fetchErr } = await supabase
    .from("goal_streaks")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", userId)
    .single();

  if (fetchErr || !goal) {
    return NextResponse.json({ error: "Goal streak not found" }, { status: 404 });
  }

  let newStreak = goal.current_streak;
  let newLastCheckinDate = goal.last_checkin_date;

  if (action === "increment") {
    // For daily-mode streaks, enforce one check-in per day
    if (goal.mode === "daily" && date && goal.last_checkin_date === date) {
      return NextResponse.json({ error: "Already checked in today" }, { status: 409 });
    }
    newStreak = Math.min(goal.current_streak + 1, goal.target_days);
    if (date) newLastCheckinDate = date;
  } else if (action === "decrement") {
    newStreak = Math.max(goal.current_streak - 1, 0);
    // Clear last_checkin_date when reverting today's check-in
    if (date && goal.last_checkin_date === date) {
      newLastCheckinDate = null;
    }
  } else if (typeof current_streak === "number") {
    newStreak = Math.max(0, Math.min(current_streak, goal.target_days));
  }

  const newLongest = Math.max(goal.longest_streak, newStreak);

  const { data, error } = await supabase
    .from("goal_streaks")
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_checkin_date: newLastCheckinDate,
    })
    .eq("id", params.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT /api/goal-streaks/[id] — update goal streak fields
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("goal_streaks")
    .update(body)
    .eq("id", params.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/goal-streaks/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("goal_streaks")
    .delete()
    .eq("id", params.id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
