import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// GET /api/habits — list all habits for current user
export async function GET() {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/habits — create a new habit
export async function POST(request: NextRequest) {
  const supabase = createApiSupabaseClient();
  const userId = await getDefaultUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const body = await request.json();
  const { title, subtitle, icon, type, category } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: userId,
      title,
      subtitle: subtitle ?? "",
      icon: icon ?? "check_circle",
      type: type ?? "positive",
      category: category ?? "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
