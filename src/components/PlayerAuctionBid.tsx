'use client';

import { useState } from 'react';
import { GameState, CarColor, CAR_COLORS } from '@/types/game';
import { claimCar, releaseCar } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

interface PlayerAuctionBidProps {
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

export default function PlayerAuctionBid({ gameState, playerId }: PlayerAuctionBidProps) {
  const t = useTranslations();
  const [selectedCar, setSelectedCar] = useState<CarColor | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const handleCarClick = (car: CarColor) => {
    const owner = gameState.carOwners[car];
    if (owner === null) {
      setSelectedCar(car);
      setBidAmount(1);
      setError('');
    }
  };

  const handleClaim = async () => {
    if (!selectedCar) return;
    
    const result = await claimCar(gameState.roomCode, playerId, selectedCar, bidAmount);
    if (result.error) {
      setError(result.error);
    } else {
      setSelectedCar(null);
      setError('');
    }
  };

  const handleRelease = async (car: CarColor) => {
    await releaseCar(gameState.roomCode, playerId, car);
  };

  const myCars = CAR_COLORS.filter(car => gameState.carOwners[car] === playerId);
  const availableCars = CAR_COLORS.filter(car => gameState.carOwners[car] === null);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{t.auction.selectCar}</h2>
      
      {myCars.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Cars:</h3>
          <div className="grid grid-cols-2 gap-3">
            {myCars.map((car) => {
              const price = gameState.players[playerId].auctionPrices[car];
              return (
                <div key={car} className="p-4 rounded-lg border-2 border-green-500 bg-green-50">
                  <div className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} px-3 py-2 rounded font-semibold text-center mb-2`}>
                    {t.cars[car]}
                  </div>
                  <p className="text-sm text-green-700 font-semibold text-center mb-2">
                    ${price}M
                  </p>
                  <button
                    onClick={() => handleRelease(car)}
                    className="w-full text-xs bg-red-500 hover:bg-red-600 text-white py-1 rounded"
                  >
                    {t.auction.release}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {availableCars.length > 0 && !selectedCar && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{t.auction.available}:</h3>
          <div className="grid grid-cols-2 gap-3">
            {availableCars.map((car) => (
              <div
                key={car}
                onClick={() => handleCarClick(car)}
                className="p-4 rounded-lg border-2 border-gray-300 hover:border-indigo-500 cursor-pointer transition"
              >
                <div className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} px-3 py-2 rounded font-semibold text-center`}>
                  {t.cars[car]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCar && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{t.auction.selectCar}:</h3>
          <div className="p-4 rounded-lg border-2 border-indigo-500 bg-indigo-50">
            <div className={`${CAR_COLORS_STYLE[selectedCar].bg} ${CAR_COLORS_STYLE[selectedCar].text} px-3 py-2 rounded font-semibold text-center`}>
              {t.cars[selectedCar]}
            </div>
          </div>
        </div>
      )}

      {availableCars.length === 0 && myCars.length === 0 && (
        <p className="text-center text-gray-500 py-4">All cars have been claimed</p>
      )}

      {selectedCar && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-900 mb-3">
            {t.cars[selectedCar]}
          </h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.auction.selectBid}:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBidAmount(amount)}
                  className={`py-3 rounded-lg font-semibold transition ${
                    bidAmount === amount
                      ? `${CAR_COLORS_STYLE[selectedCar].bg} ${CAR_COLORS_STYLE[selectedCar].text}`
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ${amount}M
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleClaim}
              className={`flex-1 ${CAR_COLORS_STYLE[selectedCar].bg} hover:opacity-90 ${CAR_COLORS_STYLE[selectedCar].text} font-semibold py-2 rounded`}
            >
              Claim Car
            </button>
            <button
              onClick={() => setSelectedCar(null)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
