import { NextRequest, NextResponse } from 'next/server';
import { roomManager } from '@/lib/room-manager';

export async function POST(request: NextRequest) {
  const { hostName } = await request.json();
  const roomCode = await roomManager.generateRoomCode();
  const playerId = crypto.randomUUID();
  const gameState = await roomManager.createRoom(roomCode, playerId, hostName);
  
  return NextResponse.json({ gameState, playerId });
}
