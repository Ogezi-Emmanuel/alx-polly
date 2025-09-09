import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = await createClient();
    // Fetch a single poll from the 'polls' table by its ID.
    const { data, error } = await supabase
      .from("polls")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error) return NextResponse.json({ poll: null, error: error.message }, { status: 404 });
    return NextResponse.json({ poll: data, error: null });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    // Ensure the user is logged in before attempting to delete a poll.
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to delete a poll." }, { status: 401 });
    }
  
    // Verify that the user owns the poll before deleting to prevent unauthorized deletions.
    const { data: poll, error: fetchError } = await supabase
      .from("polls")
      .select("user_id")
      .eq("id", id)
      .single();
  
    if (fetchError || !poll) {
      return NextResponse.json({ error: fetchError?.message || "Poll not found." }, { status: 404 });
    }
  
    // Compare the poll's user_id with the current user's ID.
    if (poll.user_id !== user.id) {
      return NextResponse.json({ error: "You are not authorized to delete this poll." }, { status: 403 });
    }
  
    // Delete the poll from the 'polls' table.
    const { error } = await supabase.from("polls").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    // Revalidate the '/polls' path to reflect the deletion.
    revalidatePath("/polls");
    return new NextResponse(null, { status: 204 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id: pollId } = params;
    const supabase = await createClient();
    const formData = await request.formData();

    const question = formData.get("question") as string;
    const options = formData.getAll("options").filter(Boolean) as string[];
  
    // Basic input validation for updated question and options.
    if (!question || question.trim() === "") {
      return NextResponse.json({ error: "Poll question cannot be empty." }, { status: 400 });
    }
    if (options.length < 2) {
      return NextResponse.json({ error: "Please provide at least two options." }, { status: 400 });
    }
    if (options.some(option => option.trim() === "")) {
      return NextResponse.json({ error: "Options cannot be empty." }, { status: 400 });
    }
  
    // Get user from session to verify authorization for updating the poll.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to update a poll." }, { status: 401 });
    }
  
    // Only allow updating polls owned by the user by checking user_id.
    const { data, error } = await supabase
      .from("polls")
      .update({ question, options })
      .eq("id", pollId)
      .eq("user_id", user.id)
      .select()
      .single();
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
    return NextResponse.json(data);
}