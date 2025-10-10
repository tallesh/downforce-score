import { NextRequest, NextResponse } from 'next/server';
import { roomManager } from '@/lib/room-manager';
import { CarColor } from '@/types/game';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { playerId, carColor } = await request.json();
  
  const room = await roomManager.getRoom(code);
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  // Check if player owns this car
  if (room.carOwners[carColor as CarColor] !== playerId) {
    return NextResponse.json({ error: 'You do not own this car' }, { status: 400 });
  }

  // Release the car
  room.carOwners[carColor as CarColor] = null;
  room.players[playerId].ownedCars = room.players[playerId].ownedCars.filter(c => c !== carColor);
  delete room.players[playerId].auctionPrices[carColor as CarColor];

  await roomManager.updateRoom(code, room);

  return NextResponse.json({ success: true });
}
