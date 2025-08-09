import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine, applyAction } from '../gameEngine';
import { GameState, PlayerState } from '../../state/types';
import { GameAction } from '../../actions/types';
import { Age, ScienceSymbol } from '@seven-wonders/shared';

describe('GameEngine', () => {
  let engine: GameEngine;
  let initialState: GameState;

  beforeEach(() => {
    engine = new GameEngine();
    engine.reset();
  });

  describe('initializeGame', () => {
    it('should initialize a game with correct player count', () => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'alexandria', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };

      const state = engine.initializeGame(playerIds, wonderAssignments);

      expect(state.players).toHaveLength(3);
      expect(state.players[0].id).toBe('player1');
      expect(state.players[0].wonderId).toBe('alexandria');
      expect(state.age).toBe(Age.I);
      expect(state.phase).toBe('playing');
    });

    it('should deal 7 cards to each player', () => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'alexandria', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };

      const state = engine.initializeGame(playerIds, wonderAssignments);

      state.players.forEach((player) => {
        expect(player.hand).toHaveLength(7);
      });
    });

    it('should initialize players with starting resources', () => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'alexandria', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };

      const state = engine.initializeGame(playerIds, wonderAssignments);
      const player = state.players[0];

      expect(player.coins).toBe(3);
      expect(player.militaryShields).toBe(0);
      expect(player.victoryTokens).toBe(0);
      expect(player.defeatTokens).toBe(0);
      expect(player.wonderStages).toBe(0);
      expect(player.science).toEqual({
        [ScienceSymbol.TABLET]: 0,
        [ScienceSymbol.COMPASS]: 0,
        [ScienceSymbol.GEAR]: 0,
      });
    });
  });

  describe('applyAction', () => {
    beforeEach(() => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'alexandria', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };
      initialState = engine.initializeGame(playerIds, wonderAssignments);
    });

    it('should allow discarding a card for 3 coins', () => {
      const player = initialState.players[0];
      const cardToDiscard = player.hand[0];
      const initialCoins = player.coins;

      const action: GameAction = {
        type: 'DISCARD_CARD',
        playerId: player.id,
        cardInstanceId: cardToDiscard,
      };

      const newState = engine.applyAction(initialState, action);
      const updatedPlayer = newState.players[0];

      expect(updatedPlayer.hand).not.toContain(cardToDiscard);
      expect(updatedPlayer.coins).toBe(initialCoins + 3);
      expect(newState.discardPile).toContain(cardToDiscard);
    });

    it('should reject invalid actions', () => {
      const action: GameAction = {
        type: 'PLAY_CARD',
        playerId: 'invalid-player',
        cardInstanceId: 'invalid-card',
        payment: {
          coins: 0,
          leftNeighborCoins: 0,
          rightNeighborCoins: 0,
        },
      };

      expect(() => engine.applyAction(initialState, action)).toThrow(
        'Invalid action'
      );
    });

    it('should reject actions when game is finished', () => {
      initialState.phase = 'finished';

      const action: GameAction = {
        type: 'DISCARD_CARD',
        playerId: initialState.players[0].id,
        cardInstanceId: initialState.players[0].hand[0],
      };

      expect(() => engine.applyAction(initialState, action)).toThrow();
    });
  });

  describe('Game Flow', () => {
    beforeEach(() => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'giza', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'rhodes', side: 'A' as const },
      };
      initialState = engine.initializeGame(playerIds, wonderAssignments);
    });

    it('should handle a complete turn with all players discarding', () => {
      const state1 = initialState;

      // Each player discards their first card
      let currentState = state1;
      for (let i = 0; i < 3; i++) {
        const player = currentState.players[i];
        const action: GameAction = {
          type: 'DISCARD_CARD',
          playerId: player.id,
          cardInstanceId: player.hand[0],
        };
        currentState = engine.applyAction(currentState, action);
      }

      // After all players act, cards should be passed and turn should advance
      expect(currentState.turn).toBe(2); // Turn advances after all players act
    });
  });

  describe('isGameOver', () => {
    it('should return false for ongoing game', () => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'alexandria', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };
      const state = engine.initializeGame(playerIds, wonderAssignments);

      expect(engine.isGameOver(state)).toBe(false);
    });

    it('should return true for finished game', () => {
      const state: GameState = {
        id: 'game1',
        players: [],
        age: Age.III,
        turn: 7,
        currentDeck: [],
        discardPile: [],
        direction: 'clockwise',
        version: 1,
        phase: 'finished',
      };

      expect(engine.isGameOver(state)).toBe(true);
    });
  });

  describe('Module Export', () => {
    it('should export applyAction function', () => {
      expect(applyAction).toBeDefined();
      expect(typeof applyAction).toBe('function');
    });

    it('applyAction should work with game state', () => {
      const playerIds = ['player1', 'player2', 'player3'];
      const wonderAssignments = {
        player1: { wonderId: 'alexandria', side: 'A' as const },
        player2: { wonderId: 'babylon', side: 'A' as const },
        player3: { wonderId: 'ephesus', side: 'A' as const },
      };

      const state = engine.initializeGame(playerIds, wonderAssignments);
      const player = state.players[0];

      const action: GameAction = {
        type: 'DISCARD_CARD',
        playerId: player.id,
        cardInstanceId: player.hand[0],
      };

      const newState = applyAction(state, action);
      expect(newState.players[0].coins).toBe(6); // 3 starting + 3 from discard
    });
  });
});
