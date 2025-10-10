import { GameState, CarColor } from '@/types/game';

interface MyBetsProps {
  gameState: GameState;
  playerId: string;
}

const CAR_DISPLAY: Record<CarColor, { name: string; bg: string; text: string }> = {
  black: { name: 'Black', bg: 'bg-gray-800', text: 'text-white' },
  blue: { name: 'Blue', bg: 'bg-blue-600', text: 'text-white' },
  green: { name: 'Green', bg: 'bg-green-600', text: 'text-white' },
  orange: { name: 'Orange', bg: 'bg-orange-500', text: 'text-white' },
  red: { name: 'Red', bg: 'bg-red-600', text: 'text-white' },
  yellow: { name: 'Yellow', bg: 'bg-yellow-400', text: 'text-gray-800' },
};

export default function MyBets({ gameState, playerId }: MyBetsProps) {
  const player = gameState.players[playerId];
  if (!player) return null;

  const bets = [
    { round: 1, car: player.bets.bet1, position: player.betPositions.bet1 },
    { round: 2, car: player.bets.bet2, position: player.betPositions.bet2 },
    { round: 3, car: player.bets.bet3, position: player.betPositions.bet3 },
  ].filter((bet) => bet.car);

  if (bets.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">My Bets</h3>
      <div className="space-y-2">
        {bets.map((bet) => (
          <div key={bet.round} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-700">Bet {bet.round}:</span>
            <div className="flex items-center gap-2">
              <span className={`${CAR_DISPLAY[bet.car!].bg} ${CAR_DISPLAY[bet.car!].text} px-2 py-1 rounded text-xs font-semibold`}>
                {CAR_DISPLAY[bet.car!].name}
              </span>
              <span className="text-xs text-gray-600">(Pos {bet.position})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
