'use client';

import { useState } from 'react';
import { GameState, CarColor, CAR_COLORS } from '@/types/game';
import { updateRoom } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

interface BettingFormProps {
  gameState: GameState;
  playerId: string;
}

const CAR_COLORS_STYLE: Record<CarColor, { bg: string; text: string }> = {
  black: { bg: 'bg-gray-800', text: 'text-white' },
  blue: { bg: 'bg-blue-600', text: 'text-white' },
  green: { bg: 'bg-green-600', text: 'text-white' },
  orange: { bg: 'bg-orange-500', text: 'text-white' },
  red: { bg: 'bg-red-600', text: 'text-white' },
  yellow: { bg: 'bg-yellow-400', text: 'text-gray-800' },
};

export default function BettingForm({ gameState, playerId }: BettingFormProps) {
  const t = useTranslations();
  const player = gameState.players[playerId];
  const betNumber = gameState.phase === 'betting1' ? 'bet1' : gameState.phase === 'betting2' ? 'bet2' : 'bet3';
  const currentBet = player?.bets[betNumber];
  
  const [submitted, setSubmitted] = useState(!!currentBet);
  const [currentPhase, setCurrentPhase] = useState(gameState.phase);

  // Reset submitted state when phase changes
  if (currentPhase !== gameState.phase) {
    setCurrentPhase(gameState.phase);
    setSubmitted(!!currentBet);
  }

  if (!gameState.positionsSet) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{t.betting.placeBet}</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800 font-semibold">{t.betting.waitingHost}</p>
        </div>
      </div>
    );
  }

  const handleCarClick = async (car: CarColor) => {
    const updatedPlayers = { ...gameState.players };
    updatedPlayers[playerId].bets[betNumber] = car;
    updatedPlayers[playerId].betPositions[betNumber] = gameState.cars[car].position;

    const updatedState: GameState = {
      ...gameState,
      players: updatedPlayers,
    };

    await updateRoom(gameState.roomCode, updatedState);
    setSubmitted(true);
  };

  if (submitted) {
    const allPlayersBet = Object.values(gameState.players).every(p => p.bets[betNumber]);
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{t.betting.yourBet}</h2>
        <div className={`${allPlayersBet ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border rounded-lg p-4 text-center`}>
          <p className={`${allPlayersBet ? 'text-blue-800' : 'text-green-800'} font-semibold`}>{t.betting.betSubmitted}</p>
          <p className={`text-sm ${allPlayersBet ? 'text-blue-600' : 'text-green-600'} mt-2`}>
            {allPlayersBet ? t.betting.allReady : t.betting.waitingPlayers}
          </p>
        </div>
      </div>
    );
  }

  const sortedCars = [...CAR_COLORS].sort((a, b) => gameState.cars[a].position - gameState.cars[b].position);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{t.betting.placeBet}</h2>
      <p className="text-sm text-gray-600 mb-4">{t.betting.clickCar}</p>
      
      <div className="grid grid-cols-2 gap-3">
        {sortedCars.map((car) => (
          <div
            key={car}
            onClick={() => handleCarClick(car)}
            className="p-4 rounded-lg border-2 border-gray-300 hover:border-indigo-500 cursor-pointer transition bg-gray-50 hover:bg-indigo-50"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-600">{gameState.cars[car].position}</span>
              <div className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} px-3 py-2 rounded font-semibold text-sm flex-1 text-center`}>
                {t.cars[car]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
