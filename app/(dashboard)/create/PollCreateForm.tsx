"use client";

import { useState } from "react";
import { createPoll } from "@/app/lib/actions/poll-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PollCreateForm() {
  /**
   * PollCreateForm component provides a form for users to create new polls.
   * It manages the state for the poll question and options, handles input changes,
   * and submits the new poll data via a server action.
   */
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOptionChange = (idx: number, value: string) => {
    /**
     * Handles changes to an individual poll option input field.
     * Updates the options array state with the new value for the specified index.
     * @param {number} idx - The index of the option to be updated.
     * @param {string} value - The new value for the option.
     */
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const addOption = () => {
    /**
     * Adds a new empty option field to the poll creation form.
     * Appends an empty string to the options array state, allowing users to add more choices.
     */
    setOptions((opts) => [...opts, ""]);
  };

  const removeOption = (idx: number) => {
    /**
     * Removes an option field from the poll creation form.
     * Filters out the option at the specified index from the options array state.
     * Ensures that there are always at least two options remaining.
     * @param {number} idx - The index of the option to be removed.
     */
    if (options.length > 2) {
      setOptions((opts) => opts.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    /**
     * Handles the form submission for creating a new poll.
     * Prevents default form submission, performs client-side validation,
     * and calls the `createPoll` server action.
     * Displays success or error messages based on the server action's result.
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const question = formData.get("question") as string;
    const rawOptions = formData.getAll("options") as string[];

    // Client-side validation
    if (!question.trim()) {
      setError("Poll question cannot be empty.");
      return;
    }
    const filteredOptions = rawOptions.filter((opt) => opt.trim() !== "");
    if (filteredOptions.length < 2) {
      setError("Please provide at least two non-empty options.");
      return;
    }

    // The createPoll function expects a FormData object.
    // The existing formData object already contains the question and options.
    const result = await createPoll(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Clear form fields after successful submission
      (e.target as HTMLFormElement).reset();
      setOptions(["", ""]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Poll Question</Label>
        <Input
          id="question"
          name="question"
          placeholder="e.g., What's your favorite color?"
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        {options.map((option, idx) => (
          <div key={idx} className="flex space-x-2">
            <Input
              name="options"
              value={option}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeOption(idx)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addOption}>
          Add Option
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm">Poll created successfully!</p>
      )}

      <Button type="submit">Create Poll</Button>
    </form>
  );
}