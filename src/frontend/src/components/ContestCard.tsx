import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Trophy, Users, IndianRupee } from 'lucide-react';
import { Progress } from './ui/progress';
import type { Contest } from '../backend';

interface ContestCardProps {
  contest: Contest;
  onJoin: () => void;
  onViewLeaderboard: () => void;
  hasJoined: boolean;
}

export default function ContestCard({ contest, onJoin, onViewLeaderboard, hasJoined }: ContestCardProps) {
  const fillPercentage = (Number(contest.spotsFilled) / Number(contest.totalSpots)) * 100;
  const isFull = contest.spotsFilled >= contest.totalSpots;

  return (
    <Card className="border-2 border-energy-orange-200 dark:border-energy-orange-700 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src="/assets/generated/trophy-icon.dim_128x128.png" alt="Trophy" className="h-8 w-8" />
            <div>
              <div className="text-2xl font-black text-trophy-gold-600">₹{Number(contest.prizePool)}</div>
              <div className="text-xs text-muted-foreground font-semibold">Prize Pool</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-cricket-green-600 flex items-center gap-1">
              <IndianRupee className="h-4 w-4" />
              {Number(contest.entryFee)}
            </div>
            <div className="text-xs text-muted-foreground font-semibold">Entry Fee</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-bold text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              Spots
            </span>
            <span className="font-black text-cricket-green-700">
              {Number(contest.spotsFilled)}/{Number(contest.totalSpots)}
            </span>
          </div>
          <Progress value={fillPercentage} className="h-2" />
        </div>

        <div className="flex gap-2">
          {hasJoined ? (
            <Button
              onClick={onViewLeaderboard}
              className="flex-1 bg-cricket-green-600 hover:bg-cricket-green-700 text-white font-bold"
            >
              View Leaderboard
            </Button>
          ) : (
            <Button
              onClick={onJoin}
              disabled={isFull}
              className="flex-1 bg-energy-orange-500 hover:bg-energy-orange-600 text-white font-bold"
            >
              {isFull ? 'Contest Full' : 'Join Contest'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
