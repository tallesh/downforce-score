'use client';

import { useState } from 'react';
import { GameState, CarColor, CAR_COLORS } from '@/types/game';
import { updateRoom } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

interface FinalPositionControlsProps {
  gameState: GameState;
}

const CAR_COLORS_STYLE: Record<CarColor, { bg: string; text: string }> = {
  black: { bg: 'bg-gray-800', text: 'text-white' },
  blue: { bg: 'bg-blue-600', text: 'text-white' },
  green: { bg: 'bg-green-600', text: 'text-white' },
  orange: { bg: 'bg-orange-500', text: 'text-white' },
  red: { bg: 'bg-red-600', text: 'text-white' },
  yellow: { bg: 'bg-yellow-400', text: 'text-gray-800' },
};

export default function FinalPositionControls({ gameState }: FinalPositionControlsProps) {
  const t = useTranslations();
  const [orderedCars, setOrderedCars] = useState<CarColor[]>(() => {
    return [...CAR_COLORS].sort((a, b) => gameState.cars[a].position - gameState.cars[b].position);
  });

  const allPlayersBet = Object.values(gameState.players).every(player => player.bets.bet3);

  const moveCar = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === orderedCars.length - 1) return;

    const newOrder = [...orderedCars];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setOrderedCars(newOrder);
  };

  const handleFinish = async () => {
    const finalPositions = orderedCars.reduce((acc, color, index) => {
      acc[color] = index + 1;
      return acc;
    }, {} as Record<CarColor, number>);

    const updatedState: GameState = {
      ...gameState,
      finalPositions,
      phase: 'finished',
    };

    await updateRoom(gameState.roomCode, updatedState);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{t.final.title}</h2>
      
      <div className="space-y-2 mb-6">
        {orderedCars.map((car, index) => (
          <div key={car} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <span className="text-lg font-bold text-gray-600 w-8">{index + 1}.</span>
            <div className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} px-3 py-2 rounded font-semibold text-sm flex-1`}>
              {t.cars[car]}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => moveCar(index, 'up')}
                disabled={index === 0}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-30 rounded text-sm font-semibold"
              >
                ↑
              </button>
              <button
                onClick={() => moveCar(index, 'down')}
                disabled={index === orderedCars.length - 1}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-30 rounded text-sm font-semibold"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      {!allPlayersBet && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-center">
          <p className="text-sm text-yellow-800">{t.final.waitingBets}</p>
        </div>
      )}

      <button
        onClick={handleFinish}
        disabled={!allPlayersBet}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition"
      >
        {t.final.finishRace}
      </button>
    </div>
  );
}
