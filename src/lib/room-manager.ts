import { CAR_COLORS, CarColor, GameState, Player } from '@/types/game';
import { kv } from '@vercel/kv';

export class RoomManager {
  private getKey(roomCode: string): string {
    return `room:${roomCode}`;
  }

  async generateRoomCode(): Promise<string> {
    let code: string;
    let exists = true;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
      exists = await kv.exists(this.getKey(code)) === 1;
    } while (exists);
    return code;
  }

  async createRoom(roomCode: string, hostId: string, hostName: string): Promise<GameState> {
    const cars = CAR_COLORS.reduce((acc, color) => {
      acc[color] = { color, position: 1 };
      return acc;
    }, {} as GameState['cars']);

    const host: Player = {
      id: hostId,
      name: hostName,
      isHost: true,
      ownedCars: [],
      auctionPrices: {},
      bets: {},
      betPositions: {},
    };

    const gameState: GameState = {
      roomCode,
      phase: 'auction',
      players: { [hostId]: host },
      cars,
      carOwners: CAR_COLORS.reduce((acc, color) => {
        acc[color] = null;
        return acc;
      }, {} as Record<CarColor, string | null>),
      positionsSet: false,
      createdAt: Date.now(),
    };

    await kv.set(this.getKey(roomCode), gameState, { ex: 14400 }); // 4 hours TTL
    return gameState;
  }

  async getRoom(roomCode: string): Promise<GameState | null> {
    const data = await kv.get<GameState>(this.getKey(roomCode));
    return data;
  }

  async addPlayer(roomCode: string, playerId: string, playerName: string): Promise<GameState | null> {
    try {
      const room = await this.getRoom(roomCode);
      if (!room) return null;

      room.players[playerId] = {
        id: playerId,
        name: playerName,
        isHost: false,
        ownedCars: [],
        auctionPrices: {},
        bets: {},
        betPositions: {},
      };

      await this.updateRoom(roomCode, room);
      return room;
    } catch (error) {
      console.error('Failed to add player:', error);
      return null;
    }
  }

  async removePlayer(roomCode: string, playerId: string): Promise<void> {
    try {
      const room = await this.getRoom(roomCode);
      if (!room) return;

      delete room.players[playerId];

      // Delete room if empty
      if (Object.keys(room.players).length === 0) {
        await kv.del(this.getKey(roomCode));
      } else {
        await this.updateRoom(roomCode, room);
      }
    } catch (error) {
      console.error('Failed to remove player:', error);
    }
  }

  async updateRoom(roomCode: string, gameState: GameState): Promise<void> {
    try {
      await kv.set(this.getKey(roomCode), gameState, { ex: 14400 }); // 4 hours TTL
    } catch (error) {
      console.error('Failed to update room:', error);
      throw error;
    }
  }
}

export const roomManager = new RoomManager();
