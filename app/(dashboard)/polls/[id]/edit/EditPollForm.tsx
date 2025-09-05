'use client';

import { useState } from 'react';
import { updatePoll } from '@/app/lib/actions/poll-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditPollForm({ poll }: { poll: any }) {
  /**
   * EditPollForm component allows users to edit an existing poll's question and options.
   * It pre-fills the form with existing poll data and handles the submission of updates
   * via a server action.
   *
   * @param {Object} props - The component props.
   * @param {any} props.poll - The poll object containing the question and options to be edited.
   */
  const [question, setQuestion] = useState(poll.question);
  const [options, setOptions] = useState<string[]>(poll.options || []);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOptionChange = (idx: number, value: string) => {
    /**
     * Handles changes to an individual poll option.
     * Updates the options array state with the new value for the specified index.
     * @param {number} idx - The index of the option to be updated.
     * @param {string} value - The new value for the option.
     */
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const addOption = () => {
    /**
     * Adds a new empty option field to the poll.
     * Appends an empty string to the options array state.
     */
    setOptions((opts) => [...opts, ""]);
  };

  const removeOption = (idx: number) => {
    /**
     * Removes an option field from the poll.
     * Filters out the option at the specified index from the options array state.
     * @param {number} idx - The index of the option to be removed.
     */
    setOptions((opts) => opts.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * Handles the form submission for updating a poll.
     * Prevents default form submission, performs client-side validation,
     * and calls the `updatePoll` server action.
     * Displays success or error messages based on the server action's result.
     * @param {React.FormEvent} e - The form event.
     */
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Client-side validation
    if (!question.trim()) {
      setError("Poll question cannot be empty.");
      return;
    }
    const filteredOptions = options.filter((opt) => opt.trim() !== "");
    if (filteredOptions.length < 2) {
      setError("Please provide at least two non-empty options.");
      return;
    }

    const formData = new FormData();
    formData.append("question", question);
    filteredOptions.forEach((option) => formData.append("options", option));

    const result = await updatePoll(poll.id, formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Optionally, redirect or show a success message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Poll Question</Label>
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What's your favorite color?"
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        {options.map((option, idx) => (
          <div key={idx} className="flex space-x-2">
            <Input
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
        <p className="text-green-500 text-sm">Poll updated successfully!</p>
      )}

      <Button type="submit">Update Poll</Button>
    </form>
  );
}