import { GameState } from '@/types/game';

export async function createRoom(hostName: string): Promise<{ gameState: GameState; playerId: string }> {
  const res = await fetch('/api/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hostName }),
  });
  return res.json();
}

export async function joinRoom(roomCode: string, playerName: string): Promise<{ gameState: GameState; playerId: string }> {
  const res = await fetch(`/api/rooms/${roomCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName }),
  });
  if (!res.ok) throw new Error('Room not found');
  return res.json();
}

export async function getRoom(roomCode: string): Promise<GameState> {
  const res = await fetch(`/api/rooms/${roomCode}`);
  if (!res.ok) throw new Error('Room not found');
  return res.json();
}

export async function updateRoom(roomCode: string, gameState: GameState): Promise<void> {
  await fetch(`/api/rooms/${roomCode}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameState }),
  });
}
