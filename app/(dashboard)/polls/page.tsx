import { getUserPolls } from '@/app/lib/actions/poll-actions';
import PollsList from './PollsList';

export default async function PollsPage() {
  const { polls, error } = await getUserPolls();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Polls</h1>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <PollsList polls={polls} />
    </div>
  );
}