import { useGetContestsForMatch, useGetWalletBalance } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ContestCard from './ContestCard';
import { Loader2, Wallet } from 'lucide-react';
import { useState } from 'react';
import TeamSelectionModal from './TeamSelectionModal';
import { useNavigate } from '@tanstack/react-router';

interface ContestListProps {
  matchId: string;
}

export default function ContestList({ matchId }: ContestListProps) {
  const { data: contests, isLoading } = useGetContestsForMatch(matchId);
  const { data: balance } = useGetWalletBalance();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);

  const filteredContests = contests?.filter(
    (c) => Number(c.entryFee) >= 10 && Number(c.entryFee) <= 100
  );

  const hasJoinedContest = (contestId: string) => {
    const contest = contests?.find((c) => c.id === contestId);
    if (!contest || !identity) return false;
    return contest.participants.some((p) => p.owner.toString() === identity.getPrincipal().toString());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cricket-green-600" />
      </div>
    );
  }

  if (!filteredContests || filteredContests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No contests available for this match</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 bg-cricket-green-100 dark:bg-cricket-green-900/20 rounded-lg p-4">
        <div className="flex items-center gap-2 text-cricket-green-700 dark:text-cricket-green-300">
          <Wallet className="h-5 w-5" />
          <span className="font-bold">Your Balance:</span>
          <span className="text-xl font-black">₹{Number(balance || 0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContests.map((contest) => (
          <ContestCard
            key={contest.id}
            contest={contest}
            onJoin={() => setSelectedContestId(contest.id)}
            onViewLeaderboard={() =>
              navigate({ to: '/contests/$contestId/leaderboard', params: { contestId: contest.id } })
            }
            hasJoined={hasJoinedContest(contest.id)}
          />
        ))}
      </div>

      {selectedContestId && (
        <TeamSelectionModal
          contestId={selectedContestId}
          matchId={matchId}
          onClose={() => setSelectedContestId(null)}
        />
      )}
    </>
  );
}
