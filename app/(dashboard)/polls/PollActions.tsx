"use client";

import Link from "next/link";
import { useAuth } from "@/app/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { deletePoll } from "@/app/lib/actions/poll-actions";

interface Poll {
  id: string;
  question: string;
  options: any[];
  user_id: string;
}

interface PollActionsProps {
  poll: Poll;
}

export default function PollActions({ poll }: PollActionsProps) {
  /**
   * PollActions component displays a single poll with options to view, edit, and delete.
   * It conditionally renders edit and delete buttons based on whether the current user is the poll owner.
   *
   * @param {Object} props - The component props.
   * @param {Poll} props.poll - The poll object to display and manage.
   */
  const { user } = useAuth();
  const handleDelete = async () => {
    /**
     * Handles the deletion of a poll.
     * Prompts the user for confirmation before calling the deletePoll server action.
     * Reloads the page upon successful deletion.
     */
    if (confirm("Are you sure you want to delete this poll?")) {
      await deletePoll(poll.id);
      // Reload the page to reflect the deletion.
      window.location.reload();
    }
  };

  return (
    <div className="border rounded-md shadow-md hover:shadow-lg transition-shadow bg-white">
      <Link href={`/polls/${poll.id}`}>
        <div className="group p-4">
          <div className="h-full">
            <div>
              <h2 className="group-hover:text-blue-600 transition-colors font-bold text-lg">
                {poll.question}
              </h2>
              <p className="text-slate-500">{poll.options.length} options</p>
            </div>
          </div>
        </div>
      </Link>
      {user && user.id === poll.user_id && (
        <div className="flex gap-2 p-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/polls/${poll.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
