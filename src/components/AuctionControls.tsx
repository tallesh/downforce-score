'use client';

import { useState } from 'react';
import { GameState, CarColor, CAR_COLORS } from '@/types/game';
import { updateRoom } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

interface AuctionControlsProps {
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

export default function AuctionControls({ gameState }: AuctionControlsProps) {
  const t = useTranslations();
  const [showManual, setShowManual] = useState(false);
  
  const loadCurrentState = () => {
    return CAR_COLORS.reduce((acc, color) => {
      const owner = gameState.carOwners[color];
      acc[color] = { 
        playerId: owner || '', 
        price: owner ? gameState.players[owner]?.auctionPrices[color] || 0 : 0 
      };
      return acc;
    }, {} as Record<CarColor, { playerId: string; price: number }>);
  };
  
  const [assignments, setAssignments] = useState<Record<CarColor, { playerId: string; price: number }>>(loadCurrentState());

  const players = Object.values(gameState.players);

  const handleAssignment = (car: CarColor, playerId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [car]: { ...prev[car], playerId },
    }));
  };

  const handlePrice = (car: CarColor, price: number) => {
    setAssignments((prev) => ({
      ...prev,
      [car]: { ...prev[car], price },
    }));
  };

  const handleManualOverride = async () => {
    // Apply manual assignments and stay in auction phase
    const updatedCarOwners = { ...gameState.carOwners };
    const updatedPlayers = { ...gameState.players };

    // Reset all car assignments first
    CAR_COLORS.forEach(color => {
      updatedCarOwners[color] = null;
    });
    Object.values(updatedPlayers).forEach(player => {
      player.ownedCars = [];
      player.auctionPrices = {};
    });

    // Apply new assignments
    CAR_COLORS.forEach(color => {
      const assignment = assignments[color];
      if (assignment.playerId) {
        updatedCarOwners[color] = assignment.playerId;
        updatedPlayers[assignment.playerId].ownedCars.push(color);
        updatedPlayers[assignment.playerId].auctionPrices[color] = assignment.price;
      }
    });

    const updatedState: GameState = {
      ...gameState,
      carOwners: updatedCarOwners,
      players: updatedPlayers,
    };

    await updateRoom(gameState.roomCode, updatedState);
    setShowManual(false);
  };

  const handleStartBetting = async () => {
    // Advance to betting phase
    const updatedState: GameState = {
      ...gameState,
      phase: 'betting1',
    };

    await updateRoom(gameState.roomCode, updatedState);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{t.auction.title}</h2>
        <button
          onClick={() => {
            if (!showManual) {
              setAssignments(loadCurrentState());
            }
            setShowManual(!showManual);
          }}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          {showManual ? t.auction.hideManual : t.auction.manualOverride}
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.auction.currentAssignments}:</h3>
        <div className="space-y-2">
          {CAR_COLORS.map((car) => {
            const owner = gameState.carOwners[car];
            const ownerName = owner ? gameState.players[owner]?.name : t.auction.available;
            const price = owner ? (gameState.players[owner]?.auctionPrices?.[car] || 0) : 0;
            
            return (
              <div key={car} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} px-3 py-1 rounded font-semibold text-sm w-24 text-center`}>
                  {t.cars[car]}
                </div>
                <span className="flex-1 ml-3 text-sm text-gray-700">
                  {owner ? `${ownerName} - $${price}M` : t.auction.available}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {showManual && (
        <div className="mb-6 border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.auction.manualOverride}:</h3>
      
      <div className="space-y-3 mb-6">
        {CAR_COLORS.map((car) => (
          <div key={car} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} px-3 py-1 rounded font-semibold text-sm w-24 text-center`}>
                {t.cars[car]}
              </div>
              <select
                value={assignments[car].playerId}
                onChange={(e) => handleAssignment(car, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">{t.auction.noOwner}</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
            {assignments[car].playerId && (
              <div className="flex items-center gap-2 ml-28">
                <label className="text-sm text-gray-600">{t.common.price}:</label>
                <input
                  type="number"
                  min="0"
                  value={assignments[car].price || ''}
                  onChange={(e) => handlePrice(car, parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">M</span>
              </div>
            )}
          </div>
        ))}
      </div>

          <button
            onClick={handleManualOverride}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            {t.auction.applyChanges}
          </button>
        </div>
      )}

      <button
        onClick={handleStartBetting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
      >
        {t.auction.startBetting}
      </button>
    </div>
  );
}
