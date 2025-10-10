import { NextRequest, NextResponse } from 'next/server';
import { roomManager } from '@/lib/room-manager';
import { CarColor } from '@/types/game';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { playerId, carColor, price } = await request.json();
  
  const room = await roomManager.getRoom(code);
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  // Check if car is available
  if (room.carOwners[carColor as CarColor] !== null) {
    return NextResponse.json({ error: 'Car already claimed' }, { status: 400 });
  }

  // Claim the car
  room.carOwners[carColor as CarColor] = playerId;
  room.players[playerId].ownedCars.push(carColor as CarColor);
  room.players[playerId].auctionPrices[carColor as CarColor] = price;

  await roomManager.updateRoom(code, room);

  return NextResponse.json({ success: true });
}
