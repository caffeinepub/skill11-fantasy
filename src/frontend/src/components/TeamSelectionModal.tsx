import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useGetMyFantasyTeams, useJoinContest, useGetWalletBalance, useGetContest } from '../hooks/useQueries';
import { Loader2, Crown, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface TeamSelectionModalProps {
  contestId: string;
  matchId: string;
  onClose: () => void;
}

export default function TeamSelectionModal({ contestId, matchId, onClose }: TeamSelectionModalProps) {
  const { data: teams, isLoading: teamsLoading } = useGetMyFantasyTeams();
  const { data: balance } = useGetWalletBalance();
  const { data: contest } = useGetContest(contestId);
  const joinContest = useJoinContest();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  const matchTeams = teams?.filter((t) => t.matchId === matchId);
  const entryFee = Number(contest?.entryFee || 0);
  const hasSufficientBalance = Number(balance || 0) >= entryFee;

  const handleJoin = async () => {
    if (!selectedTeamId) {
      toast.error('Please select a team');
      return;
    }

    if (!hasSufficientBalance) {
      toast.error('Insufficient balance. Please add funds to your wallet.');
      return;
    }

    try {
      await joinContest.mutateAsync({ contestId, teamId: selectedTeamId });
      toast.success('Successfully joined contest!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to join contest');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-cricket-green-700">Select Your Team</DialogTitle>
        </DialogHeader>

        {teamsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-cricket-green-600" />
          </div>
        ) : !matchTeams || matchTeams.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't created a team for this match yet.</p>
            <Button onClick={onClose} variant="outline">
              Create Team First
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-energy-orange-50 dark:bg-energy-orange-900/20 rounded-lg p-3">
              <div className="text-sm font-bold text-muted-foreground">Entry Fee</div>
              <div className="text-2xl font-black text-energy-orange-600">₹{entryFee}</div>
              <div className="text-sm font-semibold text-muted-foreground mt-1">
                Your Balance: ₹{Number(balance || 0)}
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matchTeams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTeamId === team.id
                      ? 'border-cricket-green-500 bg-cricket-green-50 dark:bg-cricket-green-900/20'
                      : 'border-gray-200 hover:border-cricket-green-300'
                  }`}
                >
                  <div className="font-bold text-sm mb-2">Team {team.id.slice(0, 8)}</div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-trophy-gold-500" />
                      <span className="font-semibold">
                        Captain: {team.players.find((p) => p.id === team.captain)?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-trophy-gold-400" />
                      <span className="font-semibold">
                        Vice-Captain: {team.players.find((p) => p.id === team.viceCaptain)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleJoin}
              disabled={!selectedTeamId || !hasSufficientBalance || joinContest.isPending}
              className="w-full bg-energy-orange-500 hover:bg-energy-orange-600 text-white font-bold"
            >
              {joinContest.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Joining...
                </>
              ) : (
                'Join Contest'
              )}
            </Button>

            {!hasSufficientBalance && (
              <p className="text-sm text-destructive text-center font-semibold">
                Insufficient balance. Please add funds to your wallet.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
