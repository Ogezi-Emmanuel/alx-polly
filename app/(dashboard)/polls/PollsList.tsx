"use client";

import { useOptimistic, useState } from "react";
import { createPoll } from "@/app/lib/actions/poll-actions";
import PollCreateForm from "@/app/(dashboard)/create/PollCreateForm";
import PollActions from "./PollActions";
import { type Poll } from "@/app/lib/types";

export default function PollsList({ polls }: { polls: Poll[] }) {
  const [optimisticPolls, addOptimisticPoll] = useOptimistic(
    polls,
    (state: Poll[], newPoll: Poll) => {
      return [...state, newPoll];
    }
  );

  async function handleCreatePoll(formData: FormData) {
    const question = formData.get("question") as string;
    const options = formData.getAll("options").filter(Boolean) as string[];
    
    // Create a temporary poll object for the optimistic update.
    // A proper ID will be assigned by the database.
    const tempId = Math.random().toString(36).substring(2, 9);
    const newPoll: Poll = {
      id: tempId,
      created_at: new Date().toISOString(),
      question,
      options,
      user_id: "", // This will be set on the server
    };

    addOptimisticPoll(newPoll);
    await createPoll(formData);
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create a New Poll</h2>
        <PollCreateForm action={handleCreatePoll} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {optimisticPolls.map((poll) => (
          <PollActions key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
}
