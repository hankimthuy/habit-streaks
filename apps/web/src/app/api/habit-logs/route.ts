import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// GET /api/habit-logs?date=2024-02-24  — get all logs for a date (or today)
export async function GET(request: NextRequest) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  let query = supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId);

  if (date) {
    query = query.eq("date", date);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/habit-logs — toggle a habit log (upsert)
export async function POST(request: NextRequest) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const body = await request.json();
  const { habit_id, date, completed } = body;

  if (!habit_id || !date) {
    return NextResponse.json(
      { error: "habit_id and date are required" },
      { status: 400 }
    );
  }

  // Check if a log already exists for this habit+date
  const { data: existing } = await supabase
    .from("habit_logs")
    .select("id, completed")
    .eq("habit_id", habit_id)
    .eq("date", date)
    .single();

  if (existing) {
    // Toggle or set the completed status
    const newCompleted = completed !== undefined ? completed : !existing.completed;
    const { data, error } = await supabase
      .from("habit_logs")
      .update({ completed: newCompleted })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  // Create new log
  const { data, error } = await supabase
    .from("habit_logs")
    .insert({
      habit_id,
      user_id: userId,
      date,
      completed: completed ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
