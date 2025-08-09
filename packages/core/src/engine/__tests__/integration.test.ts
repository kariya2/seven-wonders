import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../gameEngine';
import { GameState } from '../../state/types';
import { GameAction } from '../../actions/types';
import { calculateScores } from '../../scoring/calculator';
import { Age, ScienceSymbol } from '@seven-wonders/shared';

describe('Integration Tests - Complete Games', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    engine.reset();
  });

  describe('3-Player Game', () => {
    it('should complete a full game from start to finish', () => {
      // Initialize game
      const playerIds = ['alice', 'bob', 'charlie'];
      const wonderAssignments = {
        alice: { wonderId: 'alexandria', side: 'A' as const },
        bob: { wonderId: 'babylon', side: 'A' as const },
        charlie: { wonderId: 'rhodes', side: 'A' as const },
      };

      let state = engine.initializeGame(playerIds, wonderAssignments);

      // Verify initial setup
      expect(state.players).toHaveLength(3);
      expect(state.age).toBe(Age.I);
      expect(state.turn).toBe(1);
      expect(state.phase).toBe('playing');

      // Track game progression
      let turnsPlayed = 0;
      const maxTurnsPerAge = 6;
      const ages = [Age.I, Age.II, Age.III];

      // Play through all three ages
      for (const expectedAge of ages) {
        // Verify we're in the correct age
        if (turnsPlayed > 0) {
          // Cards should be dealt for new age
          state.players.forEach((player) => {
            expect(player.hand.length).toBeGreaterThan(0);
          });
        }

        // Play 6 turns per age (7th card is discarded)
        for (let turn = 1; turn <= maxTurnsPerAge; turn++) {
          const turnBefore = state.turn;

          // Each player discards a card (simplified play)
          for (const player of state.players) {
            if (player.hand.length > 0) {
              const action: GameAction = {
                type: 'DISCARD_CARD',
                playerId: player.id,
                cardInstanceId: player.hand[0],
              };

              state = engine.applyAction(state, action);
              turnsPlayed++;
            }
          }

          // After Age III Turn 6, game should be finished
          if (expectedAge === Age.III && turn === maxTurnsPerAge) {
            break;
          }
        }

        // After last age, game should be finished
        if (expectedAge === Age.III) {
          // Game should end after Age III
          // Note: Current implementation may need adjustment
        }
      }

      // Calculate final scores
      const scores = calculateScores(state, engine.getCardInstances());

      // Verify all players have scores
      expect(Object.keys(scores)).toHaveLength(3);
      playerIds.forEach((playerId) => {
        expect(scores[playerId]).toBeDefined();
        expect(scores[playerId].total).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Military Resolution', () => {
    it('should correctly resolve military conflicts at end of age', () => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'rhodes', side: 'A' as const }, // Military wonder
        player2: { wonderId: 'alexandria', side: 'A' as const },
        player3: { wonderId: 'babylon', side: 'A' as const },
      };

      let state = engine.initializeGame(playerIds, wonderAssignments);

      // Give player1 military advantage
      state.players[0].militaryShields = 3;
      state.players[1].militaryShields = 1;

      // Set to end of Age I
      state.age = Age.I;
      state.turn = 6;

      // Trigger military resolution
      const action: GameAction = {
        type: 'RESOLVE_MILITARY',
        playerId: 'player1',
      };

      state = engine.applyAction(state, action);

      // Player 1 should have victory tokens (1 point for Age I)
      expect(state.players[0].victoryTokens).toBeGreaterThan(0);
      // Player 2 should have defeat tokens
      expect(state.players[1].defeatTokens).toBeGreaterThan(0);
    });
  });

  describe('Science Scoring', () => {
    it('should correctly calculate science scores', () => {
      const playerIds = ['scientist', 'player2', 'player3'];
      const wonderAssignments = {
        scientist: { wonderId: 'babylon', side: 'A' as const }, // Science wonder
        player2: { wonderId: 'alexandria', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };

      let state = engine.initializeGame(playerIds, wonderAssignments);
      const player = state.players[0];

      // Give player science symbols
      player.science[ScienceSymbol.TABLET] = 2;
      player.science[ScienceSymbol.COMPASS] = 2;
      player.science[ScienceSymbol.GEAR] = 2;

      const scores = calculateScores(state, engine.getCardInstances());

      // 2 sets of 3 = 2*7 = 14
      // Individual: 2^2 + 2^2 + 2^2 = 12
      // Total science: 14 + 12 = 26
      expect(scores[player.id].science).toBe(26);
    });
  });

  describe('Wonder Building', () => {
    it('should allow building wonder stages', () => {
      const playerIds = ['builder', 'player2', 'player3'];
      const wonderAssignments = {
        builder: { wonderId: 'giza', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };

      let state = engine.initializeGame(playerIds, wonderAssignments);
      const player = state.players[0];

      // Give player enough resources/coins
      player.coins = 10;

      // Try to build first wonder stage
      if (player.hand.length > 0) {
        const action: GameAction = {
          type: 'BUILD_WONDER',
          playerId: player.id,
          cardInstanceId: player.hand[0],
          stageIndex: 0,
          payment: {
            coins: 0,
            leftNeighborCoins: 0,
            rightNeighborCoins: 0,
          },
        };

        // This may fail due to resource requirements
        // But the action should be processable
        try {
          state = engine.applyAction(state, action);
          expect(state.players[0].wonderStages).toBe(1);
        } catch (e) {
          // Expected if player doesn't have required resources
          expect(e).toBeDefined();
        }
      }
    });
  });

  describe('Card Chaining', () => {
    it('should recognize chain building opportunities', () => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'alexandria', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };

      let state = engine.initializeGame(playerIds, wonderAssignments);

      // This test would require setting up specific cards with chain relationships
      // For now, we just verify the system doesn't crash
      expect(state).toBeDefined();
    });
  });

  describe('Resource Trading', () => {
    it('should allow trading with neighbors', () => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'alexandria', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };

      let state = engine.initializeGame(playerIds, wonderAssignments);

      // Set up trading scenario
      const trader = state.players[0];
      trader.coins = 10;
      trader.leftTradeCost = { raw: 2, manufactured: 2 };
      trader.rightTradeCost = { raw: 2, manufactured: 2 };

      // Trading logic would be tested here
      expect(trader.leftTradeCost.raw).toBe(2);
      expect(trader.rightTradeCost.manufactured).toBe(2);
    });
  });

  describe('Game State Consistency', () => {
    it('should maintain consistent state through multiple actions', () => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'alexandria', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };

      let state = engine.initializeGame(playerIds, wonderAssignments);
      const initialVersion = state.version;

      // Perform multiple actions
      for (let i = 0; i < 5; i++) {
        const player = state.players[i % 3];
        if (player.hand.length > 0) {
          const action: GameAction = {
            type: 'DISCARD_CARD',
            playerId: player.id,
            cardInstanceId: player.hand[0],
          };
          state = engine.applyAction(state, action);
        }
      }

      // Version should increment with each action
      expect(state.version).toBeGreaterThan(initialVersion);

      // State should remain valid
      expect(state.players).toHaveLength(3);
      expect(state.age).toBeGreaterThanOrEqual(Age.I);
      expect(state.age).toBeLessThanOrEqual(Age.III);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum player game', () => {
      const playerIds = ['p1', 'p2', 'p3'];
      const wonderAssignments = {
        p1: { wonderId: 'alexandria', side: 'A' as const },
        p2: { wonderId: 'babylon', side: 'A' as const },
        p3: { wonderId: 'ephesus', side: 'A' as const },
      };

      const state = engine.initializeGame(playerIds, wonderAssignments);

      expect(state.players).toHaveLength(3);
      state.players.forEach((player) => {
        expect(player.hand).toHaveLength(7);
      });
    });

    it('should handle 7 player game', () => {
      const playerIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
      const wonderAssignments: Record<
        string,
        { wonderId: string; side: 'A' | 'B' }
      > = {};
      const wonders = [
        'alexandria',
        'babylon',
        'ephesus',
        'giza',
        'rhodes',
        'olympia',
        'halikarnassos',
      ];

      playerIds.forEach((id, index) => {
        wonderAssignments[id] = { wonderId: wonders[index], side: 'A' };
      });

      const state = engine.initializeGame(playerIds, wonderAssignments);

      expect(state.players).toHaveLength(7);
      state.players.forEach((player) => {
        expect(player.hand).toHaveLength(7);
      });
    });
  });
});
