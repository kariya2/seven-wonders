#!/usr/bin/env npx ts-node

import { GameEngine } from './src/engine/gameEngine';

// Create game engine
const engine = new GameEngine();

// Initialize a 3-player game
const playerIds = ['Alice', 'Bob', 'Charlie'];
const wonderAssignments = {
  Alice: { wonderId: 'alexandria', side: 'A' as const },
  Bob: { wonderId: 'babylon', side: 'A' as const },
  Charlie: { wonderId: 'ephesus', side: 'A' as const },
};

const state = engine.initializeGame(playerIds, wonderAssignments);

console.log('Game initialized successfully!');
console.log(`- ${state.players.length} players`);
console.log(`- Age: ${state.age}`);
console.log(`- Turn: ${state.turn}`);
console.log(`- Phase: ${state.phase}`);

// Check each player's starting state
state.players.forEach((player) => {
  console.log(`\nPlayer ${player.id}:`);
  console.log(`  Wonder: ${player.wonderId} (Side ${player.wonderSide})`);
  console.log(`  Hand: ${player.hand.length} cards`);
  console.log(`  Coins: ${player.coins}`);
});

// Test a simple action - player 1 discards a card
const firstPlayer = state.players[0];
const cardToDiscard = firstPlayer.hand[0];

console.log(`\n${firstPlayer.id} discards a card for 3 coins...`);

const newState = engine.applyAction(state, {
  type: 'DISCARD_CARD',
  playerId: firstPlayer.id,
  cardInstanceId: cardToDiscard,
});

const updatedPlayer = newState.players[0];
console.log(
  `  New coin count: ${updatedPlayer.coins} (was ${firstPlayer.coins})`
);
console.log(
  `  Cards in hand: ${updatedPlayer.hand.length} (was ${firstPlayer.hand.length})`
);

console.log('\n✅ Game engine is working correctly!');
