import { useGetAllMatches } from '../hooks/useQueries';
import MatchCard from './MatchCard';
import { Loader2 } from 'lucide-react';

export default function MatchList() {
  const { data: matches, isLoading } = useGetAllMatches();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cricket-green-600" />
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No matches available at the moment</p>
      </div>
    );
  }

  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const completedMatches = matches.filter((m) => m.status === 'completed');

  return (
    <div className="space-y-8">
      {liveMatches.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-vibrant-red-600 mb-4 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-vibrant-red-500 rounded-full animate-pulse" />
            LIVE MATCHES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {upcomingMatches.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-cricket-green-700 dark:text-cricket-green-300 mb-4">
            UPCOMING MATCHES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {completedMatches.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-gray-600 mb-4">COMPLETED MATCHES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
