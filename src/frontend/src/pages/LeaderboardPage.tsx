import { useParams, useNavigate } from '@tanstack/react-router';
import Leaderboard from '../components/Leaderboard';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function LeaderboardPage() {
  const { contestId } = useParams({ from: '/contests/$contestId/leaderboard' });
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/matches' })}
        className="mb-4 font-bold"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Matches
      </Button>

      <h1 className="text-3xl font-black text-cricket-green-700 dark:text-cricket-green-300 mb-6">
        Contest Leaderboard
      </h1>

      <Leaderboard contestId={contestId} />
    </div>
  );
}
