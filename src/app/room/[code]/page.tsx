'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRoom } from '@/lib/api';
import { GameState } from '@/types/game';
import { useTranslations } from '@/lib/i18n';
import PlayerList from '@/components/PlayerList';
import AuctionControls from '@/components/AuctionControls';
import AuctionDisplay from '@/components/AuctionDisplay';
import PlayerAuctionBid from '@/components/PlayerAuctionBid';
import HostPositionControls from '@/components/HostPositionControls';
import BettingForm from '@/components/BettingForm';
import MyBets from '@/components/MyBets';
import FinalPositionControls from '@/components/FinalPositionControls';
import ScoreReveal from '@/components/ScoreReveal';

export default function RoomPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const roomCode = params.code as string;
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string>('');

  useEffect(() => {
    const storedPlayerId = localStorage.getItem('playerId');
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    }

    const fetchRoom = async () => {
      try {
        const room = await getRoom(roomCode);
        setGameState(room);
      } catch (error) {
        console.error('Failed to fetch room:', error);
      }
    };

    fetchRoom();
    const interval = setInterval(fetchRoom, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [roomCode]);

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.room.loading}</p>
        </div>
      </div>
    );
  }

  const isHost = gameState.players[playerId]?.isHost || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🏎️ Downforce</h1>
              <p className="text-gray-600">{t.room.roomCode}: <span className="font-mono font-bold text-2xl">{roomCode}</span></p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
            >
              {t.room.leave}
            </button>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-indigo-800">
              <strong>{t.room.phase}:</strong> {t.phases[gameState.phase]}
            </p>
            {isHost && (
              <p className="text-sm text-indigo-600 mt-2">
                {t.room.youAreHost}
              </p>
            )}
          </div>
        </div>

        <PlayerList gameState={gameState} currentPlayerId={playerId} />

        <div className="mt-4 space-y-4">
          {gameState.phase === 'auction' && (
            <>
              {isHost && <AuctionControls gameState={gameState} />}
              <PlayerAuctionBid gameState={gameState} playerId={playerId} />
            </>
          )}

          {(gameState.phase === 'betting1' || gameState.phase === 'betting2') && isHost && (
            <>
              <HostPositionControls gameState={gameState} />
              <BettingForm gameState={gameState} playerId={playerId} />
            </>
          )}

          {gameState.phase === 'betting3' && isHost && !gameState.positionsSet && (
            <HostPositionControls gameState={gameState} />
          )}

          {gameState.phase === 'betting3' && isHost && gameState.positionsSet && (
            <>
              <FinalPositionControls gameState={gameState} />
              <BettingForm gameState={gameState} playerId={playerId} />
            </>
          )}

          {(gameState.phase === 'betting1' || gameState.phase === 'betting2' || gameState.phase === 'betting3') && !isHost && (
            <BettingForm gameState={gameState} playerId={playerId} />
          )}

          {(gameState.phase === 'betting1' || gameState.phase === 'betting2' || gameState.phase === 'betting3') && (
            <MyBets gameState={gameState} playerId={playerId} />
          )}

          {gameState.phase === 'finished' && (
            <ScoreReveal gameState={gameState} />
          )}

          {gameState.phase !== 'auction' && gameState.phase !== 'finished' && (
            <AuctionDisplay gameState={gameState} currentPlayerId={playerId} />
          )}
        </div>
      </div>
    </div>
  );
}
