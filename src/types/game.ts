export type CarColor = 'black' | 'blue' | 'green' | 'orange' | 'red' | 'yellow';

export type GamePhase = 'auction' | 'betting1' | 'betting2' | 'betting3' | 'finished';

export interface Car {
  color: CarColor;
  position: number; // Current position (1-6)
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  ownedCars: CarColor[];
  auctionPrices: Partial<Record<CarColor, number>>; // Car color -> price paid
  bets: {
    bet1?: CarColor;
    bet2?: CarColor;
    bet3?: CarColor;
  };
  betPositions: {
    bet1?: number; // Position of car when bet was placed
    bet2?: number;
    bet3?: number;
  };
}

export interface GameState {
  roomCode: string;
  phase: GamePhase;
  players: Record<string, Player>; // playerId -> Player
  cars: Record<CarColor, Car>;
  carOwners: Record<CarColor, string | null>; // carColor -> playerId or null (available)
  positionsSet?: boolean; // True when host has set positions for current betting round
  finalPositions?: Record<CarColor, number>; // Final race positions (1-6)
  createdAt: number;
}

export interface BetPayoutMultipliers {
  bet1: { first: 3; second: 2; third: 1 };
  bet2: { first: 2; second: 1; third: 0 };
  bet3: { first: 1; second: 0; third: 0 };
}

export interface PlayerScore {
  playerId: string;
  playerName: string;
  auctionTotal: number;
  bettingTotal: number;
  racingTotal: number;
  totalWinnings: number;
}

export const RACE_PRIZES: Record<number, number> = {
  1: 12,
  2: 9,
  3: 6,
  4: 4,
  5: 2,
  6: 0,
};

export const CAR_COLORS: CarColor[] = ['black', 'blue', 'green', 'orange', 'red', 'yellow'];
