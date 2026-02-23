import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, getDefaultUserId } from "@/lib/supabase-server";

// PUT /api/habits/[id] — update a habit
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
    .from("habits")
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

// DELETE /api/habits/[id] — delete a habit
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
    .from("habits")
    .delete()
    .eq("id", params.id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
