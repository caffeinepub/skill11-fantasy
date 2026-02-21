import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetMatch, useCreateFantasyTeam } from '../hooks/useQueries';
import TeamBuilder from '../components/TeamBuilder';
import { Button } from '../components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateTeamPage() {
  const { matchId } = useParams({ from: '/matches/$matchId/create-team' });
  const navigate = useNavigate();
  const { data: match, isLoading } = useGetMatch(matchId);
  const createTeam = useCreateFantasyTeam();

  const handleTeamComplete = async (playerIds: string[], captainId: string, viceCaptainId: string) => {
    try {
      await createTeam.mutateAsync({ matchId, playerIds, captainId, viceCaptainId });
      toast.success('Team created successfully!');
      navigate({ to: '/matches/$matchId/contests', params: { matchId } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cricket-green-600" />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg text-muted-foreground">Match not found</p>
      </div>
    );
  }

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

      <div className="bg-cricket-green-100 dark:bg-cricket-green-900/20 rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-black text-cricket-green-700 dark:text-cricket-green-300 mb-2">
          Create Your Team
        </h1>
        <p className="font-bold text-muted-foreground">
          {match.team1} vs {match.team2}
        </p>
      </div>

      <TeamBuilder onTeamComplete={handleTeamComplete} />
    </div>
  );
}
