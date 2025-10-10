import { GameState, PlayerScore, RACE_PRIZES, BetPayoutMultipliers } from '@/types/game';

const BET_MULTIPLIERS: BetPayoutMultipliers = {
  bet1: { first: 3, second: 2, third: 1 },
  bet2: { first: 2, second: 1, third: 0 },
  bet3: { first: 1, second: 0, third: 0 },
};

export function calculatePlayerScore(gameState: GameState, playerId: string): PlayerScore {
  const player = gameState.players[playerId];
  
  // Auction total (expense)
  const auctionTotal = Object.values(player.auctionPrices).reduce((sum, price) => sum + price, 0);
  
  // Racing total (prize money from owned cars)
  let racingTotal = 0;
  if (gameState.finalPositions) {
    player.ownedCars.forEach((car) => {
      const position = gameState.finalPositions![car];
      racingTotal += RACE_PRIZES[position] || 0;
    });
  }
  
  // Betting total (odds betting payouts)
  let bettingTotal = 0;
  if (gameState.finalPositions) {
    // Bet 1
    if (player.bets.bet1 && player.betPositions.bet1) {
      const finalPos = gameState.finalPositions[player.bets.bet1];
      const positionAtBet = player.betPositions.bet1;
      if (finalPos === 1) bettingTotal += positionAtBet * BET_MULTIPLIERS.bet1.first;
      else if (finalPos === 2) bettingTotal += positionAtBet * BET_MULTIPLIERS.bet1.second;
      else if (finalPos === 3) bettingTotal += positionAtBet * BET_MULTIPLIERS.bet1.third;
    }
    
    // Bet 2
    if (player.bets.bet2 && player.betPositions.bet2) {
      const finalPos = gameState.finalPositions[player.bets.bet2];
      const positionAtBet = player.betPositions.bet2;
      if (finalPos === 1) bettingTotal += positionAtBet * BET_MULTIPLIERS.bet2.first;
      else if (finalPos === 2) bettingTotal += positionAtBet * BET_MULTIPLIERS.bet2.second;
      else if (finalPos === 3) bettingTotal += positionAtBet * BET_MULTIPLIERS.bet2.third;
    }
    
    // Bet 3
    if (player.bets.bet3 && player.betPositions.bet3) {
      const finalPos = gameState.finalPositions[player.bets.bet3];
      const positionAtBet = player.betPositions.bet3;
      if (finalPos === 1) bettingTotal += positionAtBet * BET_MULTIPLIERS.bet3.first;
      else if (finalPos === 2) bettingTotal += positionAtBet * BET_MULTIPLIERS.bet3.second;
      else if (finalPos === 3) bettingTotal += positionAtBet * BET_MULTIPLIERS.bet3.third;
    }
  }
  
  return {
    playerId,
    playerName: player.name,
    auctionTotal,
    bettingTotal,
    racingTotal,
    totalWinnings: racingTotal + bettingTotal - auctionTotal,
  };
}

export function calculateAllScores(gameState: GameState): PlayerScore[] {
  return Object.keys(gameState.players)
    .map((playerId) => calculatePlayerScore(gameState, playerId))
    .sort((a, b) => b.totalWinnings - a.totalWinnings);
}
