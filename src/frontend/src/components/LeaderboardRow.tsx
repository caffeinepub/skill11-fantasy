import { Trophy } from 'lucide-react';
import type { Participant } from '../backend';

interface LeaderboardRowProps {
  participant: Participant;
  rank: number;
  isCurrentUser: boolean;
  prizeAmount?: number;
}

export default function LeaderboardRow({ participant, rank, isCurrentUser, prizeAmount }: LeaderboardRowProps) {
  const getTrophyColor = () => {
    if (rank === 1) return 'text-trophy-gold-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-300';
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border-2 ${
        isCurrentUser
          ? 'border-cricket-green-500 bg-cricket-green-50 dark:bg-cricket-green-900/20'
          : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center justify-center w-10">
          {rank <= 3 ? (
            <Trophy className={`h-6 w-6 ${getTrophyColor()}`} />
          ) : (
            <span className="text-lg font-black text-muted-foreground">#{rank}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">Team {participant.teamId.slice(0, 8)}</div>
          <div className="text-xs text-muted-foreground">
            {participant.owner.toString().slice(0, 10)}...
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-black text-cricket-green-700 dark:text-cricket-green-300">
          {Number(participant.points)}
        </div>
        {prizeAmount && prizeAmount > 0 && (
          <div className="text-xs font-bold text-trophy-gold-600">₹{prizeAmount}</div>
        )}
      </div>
    </div>
  );
}
