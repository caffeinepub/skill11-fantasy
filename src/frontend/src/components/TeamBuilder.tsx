import { useState, useMemo } from 'react';
import { useGetAllPlayers } from '../hooks/useQueries';
import PlayerCard from './PlayerCard';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, Users, TrendingUp } from 'lucide-react';
import type { Player } from '../backend';

interface TeamBuilderProps {
  onTeamComplete: (playerIds: string[], captainId: string, viceCaptainId: string) => void;
}

export default function TeamBuilder({ onTeamComplete }: TeamBuilderProps) {
  const { data: allPlayers, isLoading } = useGetAllPlayers();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [captainId, setCaptainId] = useState<string>('');
  const [viceCaptainId, setViceCaptainId] = useState<string>('');

  const playersByPosition = useMemo(() => {
    if (!allPlayers) return { wicketkeeper: [], batsman: [], allrounder: [], bowler: [] };
    return {
      wicketkeeper: allPlayers.filter((p) => p.position === 'wicketkeeper'),
      batsman: allPlayers.filter((p) => p.position === 'batsman'),
      allrounder: allPlayers.filter((p) => p.position === 'allrounder'),
      bowler: allPlayers.filter((p) => p.position === 'bowler')
    };
  }, [allPlayers]);

  const stats = useMemo(() => {
    const counts = {
      wicketkeeper: 0,
      batsman: 0,
      allrounder: 0,
      bowler: 0
    };
    let totalCredits = 0;

    selectedPlayers.forEach((p) => {
      counts[p.position as keyof typeof counts]++;
      totalCredits += Number(p.credits);
    });

    return { ...counts, totalCredits, totalPlayers: selectedPlayers.length };
  }, [selectedPlayers]);

  const canAddPlayer = (position: string) => {
    if (stats.totalPlayers >= 11) return false;
    const count = stats[position as keyof typeof stats] as number;
    if (position === 'wicketkeeper') return count < 4;
    if (position === 'batsman') return count < 6;
    if (position === 'allrounder') return count < 4;
    if (position === 'bowler') return count < 6;
    return false;
  };

  const handlePlayerSelect = (player: Player) => {
    const isSelected = selectedPlayers.some((p) => p.id === player.id);
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
      if (captainId === player.id) setCaptainId('');
      if (viceCaptainId === player.id) setViceCaptainId('');
    } else {
      if (canAddPlayer(player.position) && stats.totalCredits + Number(player.credits) <= 100) {
        setSelectedPlayers([...selectedPlayers, player]);
      }
    }
  };

  const isValid =
    stats.totalPlayers === 11 &&
    stats.wicketkeeper >= 1 &&
    stats.wicketkeeper <= 4 &&
    stats.batsman >= 3 &&
    stats.batsman <= 6 &&
    stats.allrounder >= 1 &&
    stats.allrounder <= 4 &&
    stats.bowler >= 3 &&
    stats.bowler <= 6 &&
    stats.totalCredits <= 100 &&
    captainId &&
    viceCaptainId &&
    captainId !== viceCaptainId;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cricket-green-600" />
      </div>
    );
  }

  if (selectedPlayers.length === 0) {
    return (
      <div className="text-center py-12">
        <img
          src="/assets/generated/empty-team.dim_400x400.png"
          alt="Empty team"
          className="w-48 h-48 mx-auto mb-4 opacity-50"
        />
        <p className="text-lg font-bold text-muted-foreground">Select 11 players to build your team</p>
        <div className="mt-8">
          <Tabs defaultValue="wicketkeeper" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="wicketkeeper" className="font-bold">
                WK
              </TabsTrigger>
              <TabsTrigger value="batsman" className="font-bold">
                BAT
              </TabsTrigger>
              <TabsTrigger value="allrounder" className="font-bold">
                AR
              </TabsTrigger>
              <TabsTrigger value="bowler" className="font-bold">
                BOWL
              </TabsTrigger>
            </TabsList>
            {Object.entries(playersByPosition).map(([position, players]) => (
              <TabsContent key={position} value={position} className="space-y-2">
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isSelected={false}
                    isCaptain={false}
                    isViceCaptain={false}
                    onSelect={() => handlePlayerSelect(player)}
                  />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cricket-green-500 to-energy-orange-500 rounded-lg p-4 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs font-semibold opacity-90">Players</div>
            <div className="text-2xl font-black">{stats.totalPlayers}/11</div>
          </div>
          <div>
            <div className="text-xs font-semibold opacity-90">Credits</div>
            <div className="text-2xl font-black">{stats.totalCredits}/100</div>
          </div>
          <div>
            <div className="text-xs font-semibold opacity-90">WK-BAT-AR-BOWL</div>
            <div className="text-lg font-black">
              {stats.wicketkeeper}-{stats.batsman}-{stats.allrounder}-{stats.bowler}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold opacity-90">Captain/VC</div>
            <div className="text-lg font-black">
              {captainId && viceCaptainId ? '✓' : '✗'}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black text-cricket-green-700 dark:text-cricket-green-300 mb-3 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Selected Players
        </h3>
        <div className="space-y-2">
          {selectedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isSelected={true}
              isCaptain={captainId === player.id}
              isViceCaptain={viceCaptainId === player.id}
              onSelect={() => handlePlayerSelect(player)}
            />
          ))}
        </div>
      </div>

      {stats.totalPlayers === 11 && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-cricket-green-700 dark:text-cricket-green-300 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Select Captain & Vice-Captain
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Captain (2x points)</label>
              <select
                value={captainId}
                onChange={(e) => setCaptainId(e.target.value)}
                className="w-full p-2 border-2 border-cricket-green-300 rounded-lg font-semibold"
              >
                <option value="">Select Captain</option>
                {selectedPlayers.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === viceCaptainId}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Vice-Captain (1.5x points)</label>
              <select
                value={viceCaptainId}
                onChange={(e) => setViceCaptainId(e.target.value)}
                className="w-full p-2 border-2 border-cricket-green-300 rounded-lg font-semibold"
              >
                <option value="">Select Vice-Captain</option>
                {selectedPlayers.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === captainId}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {stats.totalPlayers < 11 && (
        <div>
          <h3 className="text-xl font-black text-cricket-green-700 dark:text-cricket-green-300 mb-3">
            Add More Players
          </h3>
          <Tabs defaultValue="wicketkeeper" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="wicketkeeper" className="font-bold">
                WK ({stats.wicketkeeper}/4)
              </TabsTrigger>
              <TabsTrigger value="batsman" className="font-bold">
                BAT ({stats.batsman}/6)
              </TabsTrigger>
              <TabsTrigger value="allrounder" className="font-bold">
                AR ({stats.allrounder}/4)
              </TabsTrigger>
              <TabsTrigger value="bowler" className="font-bold">
                BOWL ({stats.bowler}/6)
              </TabsTrigger>
            </TabsList>
            {Object.entries(playersByPosition).map(([position, players]) => (
              <TabsContent key={position} value={position} className="space-y-2">
                {players.map((player) => {
                  const isSelected = selectedPlayers.some((p) => p.id === player.id);
                  const wouldExceedCredits = stats.totalCredits + Number(player.credits) > 100;
                  return (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      isSelected={isSelected}
                      isCaptain={captainId === player.id}
                      isViceCaptain={viceCaptainId === player.id}
                      onSelect={() => handlePlayerSelect(player)}
                      disabled={!isSelected && (!canAddPlayer(position) || wouldExceedCredits)}
                    />
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      <Button
        onClick={() => onTeamComplete(selectedPlayers.map((p) => p.id), captainId, viceCaptainId)}
        disabled={!isValid}
        className="w-full bg-energy-orange-500 hover:bg-energy-orange-600 text-white font-black text-lg py-6"
      >
        Save Team
      </Button>
    </div>
  );
}
