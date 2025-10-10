'use client';

import { GameState, CarColor, PlayerScore } from '@/types/game';
import { calculateAllScores } from '@/lib/game-logic';
import { useTranslations } from '@/lib/i18n';

interface ScoreRevealProps {
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

export default function ScoreReveal({ gameState }: ScoreRevealProps) {
  const t = useTranslations();
  const scores = calculateAllScores(gameState);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{t.results.title}</h2>
        
        <div className="space-y-4">
          {scores.map((score, index) => (
            <div
              key={score.playerId}
              className={`p-4 rounded-lg border-2 ${
                index === 0 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                  <span className="text-xl font-bold text-gray-800">{score.playerName}</span>
                  {index === 0 && <span className="text-2xl">🏆</span>}
                </div>
                <span className={`text-2xl font-bold ${score.totalWinnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${score.totalWinnings}M
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-white p-2 rounded">
                  <p className="text-gray-600 text-xs">{t.results.racing}</p>
                  <p className="font-semibold text-green-600">+${score.racingTotal}M</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p className="text-gray-600 text-xs">{t.results.betting}</p>
                  <p className="font-semibold text-green-600">+${score.bettingTotal}M</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p className="text-gray-600 text-xs">{t.results.auction}</p>
                  <p className="font-semibold text-red-600">-${score.auctionTotal}M</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Players Bets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{t.results.allBets}</h3>
        <div className="space-y-3">
          {Object.values(gameState.players).map((player) => (
            <div key={player.id} className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-800 mb-2">{player.name}</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {[1, 2, 3].map((betNum) => {
                  const betKey = `bet${betNum}` as 'bet1' | 'bet2' | 'bet3';
                  const car = player.bets[betKey];
                  const position = player.betPositions[betKey];
                  const finalPos = car && gameState.finalPositions ? gameState.finalPositions[car] : null;
                  
                  return (
                    <div key={betNum} className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-600 mb-1">{t.common.bet} {betNum}:</p>
                      {car ? (
                        <>
                          <span className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} text-xs px-2 py-0.5 rounded font-semibold`}>
                            {t.cars[car]}
                          </span>
                          <p className="text-xs text-gray-600 mt-1">
                            {t.common.pos} {position} → {finalPos ? `${finalPos}${finalPos === 1 ? 'st' : finalPos === 2 ? 'nd' : finalPos === 3 ? 'rd' : 'th'}` : '?'}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-gray-400">{t.results.noBet}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Breakdown for Each Player */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{t.results.detailedBreakdown}</h3>
        <div className="space-y-4">
          {scores.map((score) => {
            const player = gameState.players[score.playerId];
            return (
              <div key={score.playerId} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-lg text-gray-800 mb-3">{score.playerName}</h4>
                
                {/* Auction */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">{t.results.auctionCost}:</p>
                  <div className="flex flex-wrap gap-2">
                    {player.ownedCars.map((car) => (
                      <span key={car} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        <span className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} px-1 rounded font-semibold`}>
                          {t.cars[car]}
                        </span>
                        {' '}-${player.auctionPrices[car]}M
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-red-600 mt-1">{t.results.total}: -${score.auctionTotal}M</p>
                </div>

                {/* Racing */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">{t.results.racingPrize}:</p>
                  <div className="flex flex-wrap gap-2">
                    {player.ownedCars.map((car) => {
                      const finalPos = gameState.finalPositions?.[car];
                      const prize = finalPos ? [12, 9, 6, 4, 2, 0][finalPos - 1] : 0;
                      return (
                        <span key={car} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          <span className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} px-1 rounded font-semibold`}>
                            {t.cars[car]}
                          </span>
                          {' '}#{finalPos} = +${prize}M
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-sm font-semibold text-green-600 mt-1">{t.results.total}: +${score.racingTotal}M</p>
                </div>

                {/* Betting */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">{t.results.bettingPayouts}:</p>
                  <p className="text-xs text-gray-500 mb-2 italic">
                    {t.results.formula}
                    <br />
                    {t.results.multipliers}
                  </p>
                  <div className="space-y-1">
                    {[1, 2, 3].map((betNum) => {
                      const betKey = `bet${betNum}` as 'bet1' | 'bet2' | 'bet3';
                      const car = player.bets[betKey];
                      const posAtBet = player.betPositions[betKey];
                      const finalPos = car && gameState.finalPositions ? gameState.finalPositions[car] : null;
                      
                      const multipliers = { bet1: [3, 2, 1], bet2: [2, 1, 0], bet3: [1, 0, 0] };
                      const mult = finalPos && finalPos <= 3 ? multipliers[betKey][finalPos - 1] : 0;
                      const payout = posAtBet && mult ? posAtBet * mult : 0;
                      
                      const finishLabel = finalPos === 1 ? '1st' : finalPos === 2 ? '2nd' : finalPos === 3 ? '3rd' : `${finalPos}th`;
                      
                      return car ? (
                        <div key={betNum} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {t.common.bet} {betNum}: <span className={`${CAR_COLORS_STYLE[car].bg} ${CAR_COLORS_STYLE[car].text} px-1 rounded font-semibold`}>
                            {t.cars[car]}
                          </span>
                          {' '}{t.common.at} {t.common.pos} {posAtBet} {t.common.finished} {finishLabel} → {posAtBet} × {mult} = +${payout}M
                        </div>
                      ) : null;
                    })}
                  </div>
                  <p className="text-sm font-semibold text-green-600 mt-1">{t.results.total}: +${score.bettingTotal}M</p>
                </div>

                <div className="border-t pt-2 mt-2">
                  <p className="text-lg font-bold text-gray-800">
                    {t.results.final}: <span className={score.totalWinnings >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${score.totalWinnings}M
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
