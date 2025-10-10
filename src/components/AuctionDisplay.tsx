import { GameState, CarColor, CAR_COLORS } from '@/types/game';

interface AuctionDisplayProps {
  gameState: GameState;
  currentPlayerId: string;
}

const CAR_DISPLAY: Record<CarColor, { name: string; bg: string; text: string }> = {
  black: { name: 'Black', bg: 'bg-gray-800', text: 'text-white' },
  blue: { name: 'Blue', bg: 'bg-blue-600', text: 'text-white' },
  green: { name: 'Green', bg: 'bg-green-600', text: 'text-white' },
  orange: { name: 'Orange', bg: 'bg-orange-500', text: 'text-white' },
  red: { name: 'Red', bg: 'bg-red-600', text: 'text-white' },
  yellow: { name: 'Yellow', bg: 'bg-yellow-400', text: 'text-gray-800' },
};

export default function AuctionDisplay({ gameState, currentPlayerId }: AuctionDisplayProps) {
  const currentPlayer = gameState.players[currentPlayerId];
  const auctionTotal = Object.values(currentPlayer?.auctionPrices || {}).reduce((sum, price) => sum + price, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Your Auction Results
      </h2>

      {currentPlayer?.ownedCars.length === 0 ? (
        <p className="text-gray-600 text-center py-4">
          You don&apos;t own any cars
        </p>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {CAR_COLORS.map((car) => {
              if (!currentPlayer?.ownedCars.includes(car)) return null;
              const price = currentPlayer.auctionPrices[car] || 0;
              return (
                <div
                  key={car}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div
                    className={`${CAR_DISPLAY[car].bg} ${CAR_DISPLAY[car].text} px-3 py-1 rounded font-semibold text-sm`}
                  >
                    {CAR_DISPLAY[car].name}
                  </div>
                  <span className="font-semibold text-gray-800">${price}M</span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Auction Total:</span>
              <span className="font-bold text-lg text-red-600">
                -${auctionTotal}M
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
