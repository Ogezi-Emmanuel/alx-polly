'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PollCreateForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [options, setOptions] = useState(['', '']);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const addOption = () => {
    setOptions((opts) => [...opts, '']);
  };

  const removeOption = (idx: number) => {
    if (options.length > 2) {
      setOptions((opts) => opts.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    await action(formData);
    form.reset();
    setOptions(['', '']);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Poll Question</Label>
        <Input
          id="question"
          name="question"
          placeholder="e.g., What's your favorite programming language?"
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

      <Button type="submit">Create Poll</Button>
    </form>
  );
}
