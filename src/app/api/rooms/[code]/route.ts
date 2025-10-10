import { NextRequest, NextResponse } from 'next/server';
import { roomManager } from '@/lib/room-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const room = await roomManager.getRoom(code);
  
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }
  
  return NextResponse.json(room);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { playerName } = await request.json();
  const playerId = crypto.randomUUID();
  
  const room = await roomManager.addPlayer(code, playerId, playerName);
  
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }
  
  return NextResponse.json({ gameState: room, playerId });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { gameState } = await request.json();
  
  await roomManager.updateRoom(code, gameState);
  
  return NextResponse.json({ success: true });
}
