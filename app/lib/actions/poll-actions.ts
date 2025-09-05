"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Creates a new poll in the database.
 * This function is a Server Action, meaning it runs on the server and can be directly called from client components.
 * It handles input validation, user authentication, and database insertion.
 *
 * @param formData - A FormData object containing the poll question and options.
 * @returns An object with an `error` property if an error occurs, otherwise `null` on success.
 */
export async function createPoll(formData: FormData) {
  const supabase = await createClient();

  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  // Basic input validation to ensure question and options are not empty and there are at least two options.
  if (!question || question.trim() === "") {
    return { error: "Poll question cannot be empty." };
  }
  if (options.length < 2) {
    return { error: "Please provide at least two options." };
  }
  if (options.some(option => option.trim() === "")) {
    return { error: "Options cannot be empty." };
  }

  // Get user from session to associate the poll with the creator.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to create a poll." };
  }

  // Insert the new poll into the 'polls' table.
  const { error } = await supabase.from("polls").insert([
    {
      user_id: user.id,
      question,
      options,
    },
  ]);

  if (error) {
    return { error: error.message };
  }

  // Revalidate the '/polls' path to show the new poll immediately.
  revalidatePath("/polls");
  return { error: null };
}

/**
 * Retrieves all polls created by the currently authenticated user.
 * This function is a Server Action and fetches data directly from Supabase.
 *
 * @returns An object containing a list of `polls` or an `error` message if authentication fails or a database error occurs.
 */
export async function getUserPolls() {
  const supabase = await createClient();
  // Get user from session to filter polls by user ID.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { polls: [], error: "Not authenticated" };

  // Fetch polls from the 'polls' table where user_id matches the current user's ID.
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { polls: [], error: error.message };
  return { polls: data ?? [], error: null };
}

/**
 * Retrieves a single poll by its ID.
 * This function is a Server Action and fetches data directly from Supabase.
 *
 * @param id - The ID of the poll to retrieve.
 * @returns An object containing the `poll` data or an `error` message if the poll is not found or a database error occurs.
 */
export async function getPollById(id: string) {
  const supabase = await createClient();
  // Fetch a single poll from the 'polls' table by its ID.
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { poll: null, error: error.message };
  return { poll: data, error: null };
}

/**
 * Submits a vote for a specific poll option.
 * This function is a Server Action and handles vote insertion and validation.
 *
 * @param pollId - The ID of the poll being voted on.
 * @param optionIndex - The index of the option that was selected.
 * @returns An object with an `error` property if an error occurs, otherwise `null` on success.
 */
export async function submitVote(pollId: string, optionIndex: number) {
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
    return { error: pollError?.message || "Poll not found." };
  }

  // Validate that the optionIndex is within the bounds of the poll's options.
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return { error: "Invalid option selected." };
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

  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Deletes a poll from the database.
 * This function is a Server Action and includes authorization checks to ensure only the poll owner can delete it.
 *
 * @param id - The ID of the poll to delete.
 * @returns An object with an `error` property if an error occurs, otherwise `null` on success.
 */
export async function deletePoll(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ensure the user is logged in before attempting to delete a poll.
  if (!user) {
    return { error: "You must be logged in to delete a poll." };
  }

  // Verify that the user owns the poll before deleting to prevent unauthorized deletions.
  const { data: poll, error: fetchError } = await supabase
    .from("polls")
    .select("user_id")
    .eq("id", id)
    .single();

  if (fetchError || !poll) {
    return { error: fetchError?.message || "Poll not found." };
  }

  // Compare the poll's user_id with the current user's ID.
  if (poll.user_id !== user.id) {
    return { error: "You are not authorized to delete this poll." };
  }

  // Delete the poll from the 'polls' table.
  const { error } = await supabase.from("polls").delete().eq("id", id);
  if (error) return { error: error.message };
  // Revalidate the '/polls' path to reflect the deletion.
  revalidatePath("/polls");
  return { error: null };
}

/**
 * Updates an existing poll in the database.
 * This function is a Server Action and includes input validation and authorization checks.
 *
 * @param pollId - The ID of the poll to update.
 * @param formData - A FormData object containing the updated poll question and options.
 * @returns An object with an `error` property if an error occurs, otherwise `null` on success.
 */
export async function updatePoll(pollId: string, formData: FormData) {
  const supabase = await createClient();

  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  // Basic input validation for updated question and options.
  if (!question || question.trim() === "") {
    return { error: "Poll question cannot be empty." };
  }
  if (options.length < 2) {
    return { error: "Please provide at least two options." };
  }
  if (options.some(option => option.trim() === "")) {
    return { error: "Options cannot be empty." };
  }

  // Get user from session to verify authorization for updating the poll.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to update a poll." };
  }

  // Only allow updating polls owned by the user by checking user_id.
  const { error } = await supabase
    .from("polls")
    .update({ question, options })
    .eq("id", pollId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
