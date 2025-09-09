"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const formData = await request.formData();

  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  // Basic input validation to ensure question and options are not empty and there are at least two options.
  if (!question || question.trim() === "") {
    return NextResponse.json({ error: "Poll question cannot be empty." }, { status: 400 });
  }
  if (options.length < 2) {
    return NextResponse.json({ error: "Please provide at least two options." }, { status: 400 });
  }
  if (options.some(option => option.trim() === "")) {
    return NextResponse.json({ error: "Options cannot be empty." }, { status: 400 });
  }

  // Get user from session to associate the poll with the creator.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 401 });
  }
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to create a poll." }, { status: 401 });
  }

  // Insert the new poll into the 'polls' table.
  const { data, error } = await supabase.from("polls").insert([
    {
      user_id: user.id,
      question,
      options,
    },
  ]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Revalidate the '/polls' path to show the new poll immediately.
  revalidatePath("/polls");
  return NextResponse.json(data);
}


export async function GET(request: Request) {
    const supabase = await createClient();
    // Get user from session to filter polls by user ID.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ polls: [], error: "Not authenticated" }, { status: 401 });
  
    // Fetch polls from the 'polls' table where user_id matches the current user's ID.
    const { data, error } = await supabase
      .from("polls")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
  
    if (error) return NextResponse.json({ polls: [], error: error.message }, { status: 500 });
    return NextResponse.json({ polls: data ?? [], error: null });
}