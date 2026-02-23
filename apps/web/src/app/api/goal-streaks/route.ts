import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// GET /api/goal-streaks — list all goal streaks for current user
export async function GET() {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("goal_streaks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/goal-streaks — create a new goal streak
export async function POST(request: NextRequest) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const body = await request.json();
  const { title, subtitle, icon, color, target_days, reward_title } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("goal_streaks")
    .insert({
      user_id: userId,
      title,
      subtitle: subtitle ?? "",
      icon: icon ?? "local_fire_department",
      color: color ?? "primary",
      target_days: target_days ?? 7,
      reward_title: reward_title ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
