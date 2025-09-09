import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id: pollId } = params;
    const { optionIndex } = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    // Fetch the poll to validate pollId and optionIndex against existing poll data.
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("options")
      .eq("id", pollId)
      .single();
  
    if (pollError || !poll) {
      return NextResponse.json({ error: pollError?.message || "Poll not found." }, { status: 404 });
    }
  
    // Validate that the optionIndex is within the bounds of the poll's options.
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json({ error: "Invalid option selected." }, { status: 400 });
    }
  
    // Optionally require login to vote (currently commented out, allowing anonymous votes).
    // if (!user) return { error: 'You must be logged in to vote.' };
  
    // Insert the vote into the 'votes' table.
    const { error } = await supabase.from("votes").insert([
      {
        poll_id: pollId,
        user_id: user?.id ?? null, // Associate vote with user if logged in, otherwise null for anonymous.
        option_index: optionIndex,
      },
    ]);
  
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}