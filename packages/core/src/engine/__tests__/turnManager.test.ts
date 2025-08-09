import { describe, it, expect, beforeEach } from 'vitest';
import { TurnManager } from '../turnManager';
import { GameState } from '../../state/types';
import { Age, ScienceSymbol } from '@seven-wonders/shared';

describe('TurnManager', () => {
  let turnManager: TurnManager;
  let mockState: GameState;

  beforeEach(() => {
    turnManager = new TurnManager();

    mockState = {
      id: 'game1',
      players: [
        {
          id: 'player1',
          wonderId: 'alexandria',
          wonderSide: 'A',
          hand: [],
          tableau: [],
          coins: 3,
          militaryShields: 0,
          victoryTokens: 0,
          defeatTokens: 0,
          science: {
            [ScienceSymbol.TABLET]: 0,
            [ScienceSymbol.COMPASS]: 0,
            [ScienceSymbol.GEAR]: 0,
          },
          wonderStages: 0,
          leftTradeCost: { raw: 2, manufactured: 2 },
          rightTradeCost: { raw: 2, manufactured: 2 },
        },
        {
          id: 'player2',
          wonderId: 'babylon',
          wonderSide: 'A',
          hand: [],
          tableau: [],
          coins: 3,
          militaryShields: 0,
          victoryTokens: 0,
          defeatTokens: 0,
          science: {
            [ScienceSymbol.TABLET]: 0,
            [ScienceSymbol.COMPASS]: 0,
            [ScienceSymbol.GEAR]: 0,
          },
          wonderStages: 0,
          leftTradeCost: { raw: 2, manufactured: 2 },
          rightTradeCost: { raw: 2, manufactured: 2 },
        },
        {
          id: 'player3',
          wonderId: 'rhodes',
          wonderSide: 'A',
          hand: [],
          tableau: [],
          coins: 3,
          militaryShields: 0,
          victoryTokens: 0,
          defeatTokens: 0,
          science: {
            [ScienceSymbol.TABLET]: 0,
            [ScienceSymbol.COMPASS]: 0,
            [ScienceSymbol.GEAR]: 0,
          },
          wonderStages: 0,
          leftTradeCost: { raw: 2, manufactured: 2 },
          rightTradeCost: { raw: 2, manufactured: 2 },
        },
      ],
      age: Age.I,
      turn: 1,
      currentDeck: [],
      discardPile: [],
      direction: 'clockwise',
      version: 1,
      phase: 'playing',
    };
  });

  describe('recordPlayerAction', () => {
    it('should track player actions', () => {
      expect(turnManager.allPlayersActed(mockState)).toBe(false);

      turnManager.recordPlayerAction('player1');
      expect(turnManager.allPlayersActed(mockState)).toBe(false);

      turnManager.recordPlayerAction('player2');
      expect(turnManager.allPlayersActed(mockState)).toBe(false);

      turnManager.recordPlayerAction('player3');
      expect(turnManager.allPlayersActed(mockState)).toBe(true);
    });

    it('should handle duplicate player actions', () => {
      turnManager.recordPlayerAction('player1');
      turnManager.recordPlayerAction('player1'); // Duplicate
      turnManager.recordPlayerAction('player2');
      turnManager.recordPlayerAction('player3');

      expect(turnManager.allPlayersActed(mockState)).toBe(true);
    });
  });

  describe('resetTurn', () => {
    it('should clear all recorded actions', () => {
      turnManager.recordPlayerAction('player1');
      turnManager.recordPlayerAction('player2');
      expect(turnManager.allPlayersActed(mockState)).toBe(false);

      turnManager.resetTurn();
      expect(turnManager.allPlayersActed(mockState)).toBe(false);

      // Should need all players again
      turnManager.recordPlayerAction('player1');
      expect(turnManager.allPlayersActed(mockState)).toBe(false);
    });
  });

  describe('getTurnsInAge', () => {
    it('should return 6 turns for Age I', () => {
      mockState.age = Age.I;
      expect(turnManager.getTurnsInAge(mockState)).toBe(6);
    });

    it('should return 6 turns for Age II', () => {
      mockState.age = Age.II;
      expect(turnManager.getTurnsInAge(mockState)).toBe(6);
    });

    it('should return 6 turns for Age III without special ability', () => {
      mockState.age = Age.III;
      expect(turnManager.getTurnsInAge(mockState)).toBe(6);
    });

    // TODO: Test for 7 turns with play_seventh_card ability
  });

  describe('isLastTurnOfAge', () => {
    it('should identify last turn of Age I', () => {
      mockState.age = Age.I;
      mockState.turn = 5;
      expect(turnManager.isLastTurnOfAge(mockState)).toBe(false);

      mockState.turn = 6;
      expect(turnManager.isLastTurnOfAge(mockState)).toBe(true);

      mockState.turn = 7;
      expect(turnManager.isLastTurnOfAge(mockState)).toBe(true);
    });

    it('should identify last turn of Age III', () => {
      mockState.age = Age.III;
      mockState.turn = 5;
      expect(turnManager.isLastTurnOfAge(mockState)).toBe(false);

      mockState.turn = 6;
      expect(turnManager.isLastTurnOfAge(mockState)).toBe(true);
    });
  });

  describe('isDiscardTurn', () => {
    it('should identify discard turn in Age I', () => {
      mockState.age = Age.I;
      mockState.players[0].hand = ['card1'];
      expect(turnManager.isDiscardTurn(mockState)).toBe(true);

      mockState.players[0].hand = ['card1', 'card2'];
      expect(turnManager.isDiscardTurn(mockState)).toBe(false);
    });

    it('should identify discard turn in Age II', () => {
      mockState.age = Age.II;
      mockState.players[0].hand = ['card1'];
      expect(turnManager.isDiscardTurn(mockState)).toBe(true);
    });

    it('should not have discard turn in Age III', () => {
      mockState.age = Age.III;
      mockState.players[0].hand = ['card1'];
      expect(turnManager.isDiscardTurn(mockState)).toBe(false);
    });
  });

  describe('getPassDirection', () => {
    it('should pass clockwise in Age I', () => {
      expect(turnManager.getPassDirection(Age.I)).toBe('clockwise');
    });

    it('should pass counterclockwise in Age II', () => {
      expect(turnManager.getPassDirection(Age.II)).toBe('counterclockwise');
    });

    it('should pass clockwise in Age III', () => {
      expect(turnManager.getPassDirection(Age.III)).toBe('clockwise');
    });
  });

  describe('getValidActions', () => {
    beforeEach(() => {
      mockState.players[0].hand = ['card1', 'card2'];
    });

    it('should return no actions if player already acted', () => {
      turnManager.recordPlayerAction('player1');
      const actions = turnManager.getValidActions(mockState, 'player1');
      expect(actions).toHaveLength(0);
    });

    it('should return no actions if game is not playing', () => {
      mockState.phase = 'finished';
      const actions = turnManager.getValidActions(mockState, 'player1');
      expect(actions).toHaveLength(0);
    });

    it('should return only discard actions on discard turn', () => {
      mockState.age = Age.I;
      mockState.players[0].hand = ['card1']; // Only one card left

      const actions = turnManager.getValidActions(mockState, 'player1');

      expect(actions.every((a) => a.type === 'DISCARD_CARD')).toBe(true);
      expect(actions).toHaveLength(1);
    });

    it('should return play, discard, and wonder actions normally', () => {
      const actions = turnManager.getValidActions(mockState, 'player1');

      const playActions = actions.filter((a) => a.type === 'PLAY_CARD');
      const discardActions = actions.filter((a) => a.type === 'DISCARD_CARD');
      const wonderActions = actions.filter((a) => a.type === 'BUILD_WONDER');

      expect(playActions.length).toBeGreaterThan(0);
      expect(discardActions.length).toBeGreaterThan(0);
      expect(wonderActions.length).toBeGreaterThan(0);
    });
  });

  describe('createSimultaneousActions', () => {
    it('should order actions by player order', () => {
      const actionMap = new Map([
        [
          'player2',
          {
            type: 'DISCARD_CARD' as const,
            playerId: 'player2',
            cardInstanceId: 'card2',
          },
        ],
        [
          'player1',
          {
            type: 'DISCARD_CARD' as const,
            playerId: 'player1',
            cardInstanceId: 'card1',
          },
        ],
        [
          'player3',
          {
            type: 'DISCARD_CARD' as const,
            playerId: 'player3',
            cardInstanceId: 'card3',
          },
        ],
      ]);

      const actions = turnManager.createSimultaneousActions(
        mockState,
        actionMap
      );

      expect(actions).toHaveLength(3);
      expect((actions[0] as any).playerId).toBe('player1');
      expect((actions[1] as any).playerId).toBe('player2');
      expect((actions[2] as any).playerId).toBe('player3');
    });

    it('should throw on duplicate player actions', () => {
      const actionMap = new Map([
        [
          'player1',
          {
            type: 'DISCARD_CARD' as const,
            playerId: 'player1',
            cardInstanceId: 'card1',
          },
        ],
        [
          'duplicate',
          {
            type: 'DISCARD_CARD' as const,
            playerId: 'player1',
            cardInstanceId: 'card2',
          },
        ],
      ]);

      expect(() =>
        turnManager.createSimultaneousActions(mockState, actionMap)
      ).toThrow('Duplicate player actions');
    });
  });
});
