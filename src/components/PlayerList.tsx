'use client';

import { GameState, CarColor } from '@/types/game';
import { useTranslations } from '@/lib/i18n';

interface PlayerListProps {
  gameState: GameState;
  currentPlayerId: string;
}

const CAR_DISPLAY_COLORS: Record<CarColor, { bg: string; text: string }> = {
  black: { bg: 'bg-gray-800', text: 'text-white' },
  blue: { bg: 'bg-blue-600', text: 'text-white' },
  green: { bg: 'bg-green-600', text: 'text-white' },
  orange: { bg: 'bg-orange-500', text: 'text-white' },
  red: { bg: 'bg-red-600', text: 'text-white' },
  yellow: { bg: 'bg-yellow-400', text: 'text-gray-800' },
};

export default function PlayerList({ gameState, currentPlayerId }: PlayerListProps) {
  const t = useTranslations();
  const players = Object.values(gameState.players);
  const isBettingPhase = gameState.phase === 'betting1' || gameState.phase === 'betting2' || gameState.phase === 'betting3';
  const betNumber = gameState.phase === 'betting1' ? 'bet1' : gameState.phase === 'betting2' ? 'bet2' : 'bet3';

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">{t.players.title}</h2>
      <div className="space-y-3">
        {players.map((player) => {
          const hasBet = isBettingPhase && gameState.positionsSet && player.bets[betNumber];
          const isPending = isBettingPhase && gameState.positionsSet && !player.bets[betNumber];
          
          return (
            <div
              key={player.id}
              className={`p-3 rounded ${
                player.id === currentPlayerId ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">
                  {player.name}
                  {player.id === currentPlayerId && ' (You)'}
                </span>
                <div className="flex items-center gap-2">
                  {player.isHost && (
                    <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">{t.players.host}</span>
                  )}
                  {hasBet && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">{t.players.hasBet}</span>
                  )}
                  {isPending && (
                    <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">{t.players.pending}</span>
                  )}
                </div>
              </div>
              
              {player.ownedCars.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {player.ownedCars.map((car) => (
                    <span
                      key={car}
                      className={`${CAR_DISPLAY_COLORS[car].bg} ${CAR_DISPLAY_COLORS[car].text} text-xs px-2 py-0.5 rounded font-semibold`}
                      title={`$${player.auctionPrices[car] || 0}M`}
                    >
                      {t.cars[car]} ${player.auctionPrices[car] || 0}M
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
