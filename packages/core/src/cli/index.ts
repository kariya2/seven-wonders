#!/usr/bin/env node

import * as readline from 'readline';
import { GameEngine } from '../engine/gameEngine';
import { GameState, PlayerState } from '../state/types';
import { GameAction } from '../actions/types';
import { calculateScores } from '../scoring/calculator';
import { actionValidator } from '../engine/actionValidator';
import { Age, cardService } from '@seven-wonders/shared';

/**
 * CLI Hot-seat game for Seven Wonders
 * Allows multiple players to play on the same terminal
 */
class CLIGame {
  private engine: GameEngine;
  private rl: readline.Interface;
  private gameState: GameState | null = null;
  private currentPlayerIndex: number = 0;

  constructor() {
    this.engine = new GameEngine();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start() {
    console.log('🏛️  Welcome to Seven Wonders CLI! 🏛️\n');

    const playerCount = await this.askPlayerCount();
    const playerNames = await this.askPlayerNames(playerCount);
    const wonderAssignments = await this.assignWonders(playerNames);

    // Initialize game
    this.gameState = this.engine.initializeGame(playerNames, wonderAssignments);
    console.log('\n🎮 Game initialized! Starting Age I...\n');

    // Main game loop
    await this.gameLoop();

    // Game over - show final scores
    this.showFinalScores();

    this.rl.close();
  }

  private async askPlayerCount(): Promise<number> {
    return new Promise((resolve) => {
      const ask = () => {
        this.rl.question('How many players? (3-7): ', (answer) => {
          const count = parseInt(answer);
          if (count >= 3 && count <= 7) {
            resolve(count);
          } else {
            console.log('Please enter a number between 3 and 7.');
            ask();
          }
        });
      };
      ask();
    });
  }

  private async askPlayerNames(count: number): Promise<string[]> {
    const names: string[] = [];
    for (let i = 1; i <= count; i++) {
      const name = await this.askQuestion(`Enter name for Player ${i}: `);
      names.push(name || `Player${i}`);
    }
    return names;
  }

  private async assignWonders(
    playerNames: string[]
  ): Promise<Record<string, { wonderId: string; side: 'A' | 'B' }>> {
    const wonders = [
      'alexandria',
      'babylon',
      'ephesus',
      'giza',
      'rhodes',
      'olympia',
      'halikarnassos',
    ];
    const assignments: Record<string, { wonderId: string; side: 'A' | 'B' }> =
      {};

    console.log('\nAssigning wonders randomly...');
    const shuffled = [...wonders].sort(() => Math.random() - 0.5);

    playerNames.forEach((name, index) => {
      const wonderId = shuffled[index];
      const side = Math.random() > 0.5 ? 'A' : 'B';
      assignments[name] = { wonderId, side: side as 'A' | 'B' };
      console.log(
        `${name}: ${wonderId.charAt(0).toUpperCase() + wonderId.slice(1)} (Side ${side})`
      );
    });

    return assignments;
  }

  private async gameLoop() {
    while (this.gameState && !this.engine.isGameOver(this.gameState)) {
      // Show current game state
      this.showGameState();

      // Get all players to make their moves
      const actions: GameAction[] = [];
      for (let i = 0; i < this.gameState.players.length; i++) {
        this.currentPlayerIndex = i;
        const player = this.gameState.players[i];

        console.log(`\n--- ${player.id}'s Turn ---`);
        const action = await this.getPlayerAction(player);
        actions.push(action);
      }

      // Apply all actions
      for (const action of actions) {
        try {
          this.gameState = this.engine.applyAction(this.gameState, action);
        } catch (error) {
          console.error(`Error applying action: ${error}`);
        }
      }

      // Check for age transition
      if (this.gameState.phase === 'military') {
        console.log('\n⚔️  Military conflicts resolved!');
        this.showMilitaryResults();
      }
    }
  }

  private showGameState() {
    if (!this.gameState) return;

    console.log('\n' + '='.repeat(50));
    console.log(`Age ${this.gameState.age} - Turn ${this.gameState.turn}`);
    console.log('='.repeat(50));

    for (const player of this.gameState.players) {
      console.log(`\n${player.id}:`);
      console.log(`  💰 Coins: ${player.coins}`);
      console.log(`  ⚔️  Military: ${player.militaryShields} shields`);
      console.log(
        `  🏆 Victory: ${player.victoryTokens} tokens, ${player.defeatTokens} defeats`
      );
      console.log(
        `  🧪 Science: T:${player.science.TABLET} C:${player.science.COMPASS} G:${player.science.GEAR}`
      );
      console.log(`  🏛️  Wonder: Stage ${player.wonderStages}`);
      console.log(`  🃏 Cards in hand: ${player.hand.length}`);
    }
  }

  private async getPlayerAction(player: PlayerState): Promise<GameAction> {
    if (!this.gameState) throw new Error('No game state');

    // Show player's hand
    console.log('\nYour hand:');
    player.hand.forEach((cardId, index) => {
      const instance = this.engine.getCardInstances().get(cardId);
      if (instance) {
        const template = cardService.getCardTemplate(instance.templateId);
        if (template) {
          console.log(`  ${index + 1}. ${template.name} (${template.type})`);
        }
      }
    });

    // Get legal actions
    const legalActions = actionValidator.getLegalActions(
      this.gameState,
      player.id,
      this.engine.getCardInstances()
    );

    // Group actions by type
    const playActions = legalActions.filter((a) => a.type === 'PLAY_CARD');
    const discardActions = legalActions.filter(
      (a) => a.type === 'DISCARD_CARD'
    );
    const wonderActions = legalActions.filter((a) => a.type === 'BUILD_WONDER');

    console.log('\nAvailable actions:');
    console.log(`  P) Play a card (${playActions.length} options)`);
    console.log(`  D) Discard for 3 coins (${discardActions.length} options)`);
    if (wonderActions.length > 0) {
      console.log(`  W) Build wonder stage (${wonderActions.length} options)`);
    }

    const actionType = await this.askQuestion('Choose action type (P/D/W): ');
    const cardIndex = await this.askCardIndex(player.hand.length);

    // Return the appropriate action
    const cardId = player.hand[cardIndex];

    if (actionType.toUpperCase() === 'W' && wonderActions.length > 0) {
      return {
        type: 'BUILD_WONDER',
        playerId: player.id,
        cardInstanceId: cardId,
        stageIndex: player.wonderStages,
        payment: {
          coins: 0,
          leftNeighborCoins: 0,
          rightNeighborCoins: 0,
        },
      };
    } else if (actionType.toUpperCase() === 'P') {
      return {
        type: 'PLAY_CARD',
        playerId: player.id,
        cardInstanceId: cardId,
        payment: {
          coins: 0,
          leftNeighborCoins: 0,
          rightNeighborCoins: 0,
        },
      };
    } else {
      // Default to discard
      return {
        type: 'DISCARD_CARD',
        playerId: player.id,
        cardInstanceId: cardId,
      };
    }
  }

  private async askCardIndex(maxCards: number): Promise<number> {
    return new Promise((resolve) => {
      const ask = () => {
        this.rl.question(`Select card (1-${maxCards}): `, (answer) => {
          const index = parseInt(answer) - 1;
          if (index >= 0 && index < maxCards) {
            resolve(index);
          } else {
            console.log(`Please enter a number between 1 and ${maxCards}.`);
            ask();
          }
        });
      };
      ask();
    });
  }

  private showMilitaryResults() {
    if (!this.gameState) return;

    console.log('\nMilitary Results:');
    for (const player of this.gameState.players) {
      console.log(
        `${player.id}: ${player.victoryTokens} victories, ${player.defeatTokens} defeats`
      );
    }
  }

  private showFinalScores() {
    if (!this.gameState) return;

    console.log('\n' + '🏆'.repeat(25));
    console.log('         FINAL SCORES');
    console.log('🏆'.repeat(25) + '\n');

    const scores = calculateScores(
      this.gameState,
      this.engine.getCardInstances()
    );

    // Sort players by score
    const sortedPlayers = Object.entries(scores).sort(
      ([, a], [, b]) => b.total - a.total
    );

    sortedPlayers.forEach(([playerId, score], index) => {
      const medal =
        index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      console.log(`${medal} ${playerId}: ${score.total} points`);
      console.log(`   Military: ${score.military}`);
      console.log(`   Coins: ${score.coins}`);
      console.log(`   Wonder: ${score.wonder}`);
      console.log(`   Civic: ${score.civic}`);
      console.log(`   Commercial: ${score.commercial}`);
      console.log(`   Guilds: ${score.guilds}`);
      console.log(`   Science: ${score.science}`);
      console.log('');
    });

    console.log(`\n🎉 ${sortedPlayers[0][0]} wins! 🎉\n`);
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// Main entry point
if (require.main === module) {
  const game = new CLIGame();
  game.start().catch(console.error);
}

export { CLIGame };
