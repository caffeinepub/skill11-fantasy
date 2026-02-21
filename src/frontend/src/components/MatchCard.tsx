import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { Match } from '../backend';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();
  const matchDate = new Date(Number(match.dateTime) / 1000000);
  const isUpcoming = match.status === 'upcoming';
  const isLive = match.status === 'live';
  const hasStarted = match.status !== 'upcoming';

  return (
    <Card className="overflow-hidden border-2 border-cricket-green-200 dark:border-cricket-green-700 hover:shadow-xl transition-shadow relative">
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/stadium-bg.dim_800x600.png)' }}
      />
      <CardContent className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
              isLive
                ? 'bg-vibrant-red-500 text-white animate-pulse'
                : isUpcoming
                ? 'bg-trophy-gold-400 text-cricket-green-900'
                : 'bg-gray-400 text-white'
            }`}
          >
            {match.status}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="text-xl font-black text-cricket-green-700 dark:text-cricket-green-300">
              {match.team1}
            </div>
          </div>
          <div className="px-4 text-2xl font-black text-energy-orange-500">VS</div>
          <div className="text-center flex-1">
            <div className="text-xl font-black text-cricket-green-700 dark:text-cricket-green-300">
              {match.team2}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-energy-orange-500" />
            <span className="font-semibold">{match.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-energy-orange-500" />
            <span className="font-semibold">{matchDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-energy-orange-500" />
            <span className="font-semibold">{matchDate.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => navigate({ to: '/matches/$matchId/create-team', params: { matchId: match.id } })}
            disabled={hasStarted}
            className="flex-1 bg-cricket-green-600 hover:bg-cricket-green-700 text-white font-bold"
          >
            {hasStarted ? 'Match Started' : 'Create Team'}
          </Button>
          <Button
            onClick={() => navigate({ to: '/matches/$matchId/contests', params: { matchId: match.id } })}
            variant="outline"
            className="flex-1 border-2 border-energy-orange-500 text-energy-orange-600 hover:bg-energy-orange-50 font-bold"
          >
            View Contests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
