import { useGetContest } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LeaderboardRow from './LeaderboardRow';
import { Loader2, Trophy } from 'lucide-react';
import { useMemo } from 'react';

interface LeaderboardProps {
  contestId: string;
}

export default function Leaderboard({ contestId }: LeaderboardProps) {
  const { data: contest, isLoading } = useGetContest(contestId);
  const { identity } = useInternetIdentity();

  const sortedParticipants = useMemo(() => {
    if (!contest) return [];
    return [...contest.participants].sort((a, b) => Number(b.points) - Number(a.points));
  }, [contest]);

  const currentUserRank = useMemo(() => {
    if (!identity) return null;
    const userPrincipal = identity.getPrincipal().toString();
    return sortedParticipants.findIndex((p) => p.owner.toString() === userPrincipal) + 1;
  }, [sortedParticipants, identity]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cricket-green-600" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Contest not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-trophy-gold-400 to-energy-orange-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-8 w-8" />
              <h2 className="text-3xl font-black">Prize Pool</h2>
            </div>
            <div className="text-4xl font-black">₹{Number(contest.prizePool)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold opacity-90">Entry Fee</div>
            <div className="text-2xl font-black">₹{Number(contest.entryFee)}</div>
            <div className="text-sm font-semibold opacity-90 mt-2">
              {Number(contest.spotsFilled)}/{Number(contest.totalSpots)} Spots
            </div>
          </div>
        </div>
      </div>

      {currentUserRank && currentUserRank > 0 && (
        <div className="bg-cricket-green-100 dark:bg-cricket-green-900/20 rounded-lg p-4">
          <div className="text-center">
            <div className="text-sm font-bold text-muted-foreground">Your Rank</div>
            <div className="text-4xl font-black text-cricket-green-700 dark:text-cricket-green-300">
              #{currentUserRank}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sortedParticipants.map((participant, index) => {
          const rank = index + 1;
          const isCurrentUser =
            identity && participant.owner.toString() === identity.getPrincipal().toString();
          return (
            <LeaderboardRow
              key={participant.teamId}
              participant={participant}
              rank={rank}
              isCurrentUser={!!isCurrentUser}
            />
          );
        })}
      </div>
    </div>
  );
}
