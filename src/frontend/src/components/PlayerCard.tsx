import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Crown, Star } from 'lucide-react';
import type { Player } from '../backend';

interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  isCaptain: boolean;
  isViceCaptain: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export default function PlayerCard({
  player,
  isSelected,
  isCaptain,
  isViceCaptain,
  onSelect,
  disabled
}: PlayerCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all border-2 ${
        isSelected
          ? 'border-cricket-green-500 bg-cricket-green-50 dark:bg-cricket-green-900/20'
          : 'border-gray-200 hover:border-cricket-green-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onSelect()}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-black text-sm text-cricket-green-700 dark:text-cricket-green-300">
                {player.name}
              </h3>
              {isCaptain && <Crown className="h-4 w-4 text-trophy-gold-500" />}
              {isViceCaptain && <Star className="h-4 w-4 text-trophy-gold-400" />}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-bold">
                {player.team}
              </Badge>
              <Badge variant="secondary" className="text-xs font-bold">
                {player.position}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-semibold">Credits</div>
              <div className="text-lg font-black text-energy-orange-600">{Number(player.credits)}</div>
            </div>
            {isSelected && (
              <div className="w-6 h-6 rounded-full bg-cricket-green-500 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
