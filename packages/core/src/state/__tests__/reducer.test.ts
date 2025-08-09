import { describe, it, expect, beforeEach } from 'vitest';
import { gameReducer } from '../reducer';
import { GameState, PlayerState } from '../types';
import {
  InitGameAction,
  PlayCardAction,
  DiscardCardAction,
  BuildWonderAction,
} from '../../actions/types';
import { Age, CardInstance, ScienceSymbol } from '@seven-wonders/shared';

describe('Game Reducer', () => {
  let initialState: GameState;
  let cardInstances: Map<string, CardInstance>;

  beforeEach(() => {
    initialState = {
      id: 'game1',
      players: [],
      age: Age.I,
      turn: 1,
      currentDeck: [],
      discardPile: [],
      direction: 'clockwise',
      version: 1,
      phase: 'setup',
    };

    cardInstances = new Map();
  });

  describe('INIT_GAME', () => {
    it('should initialize a new game with players', () => {
      const action: InitGameAction = {
        type: 'INIT_GAME',
        playerIds: ['player1', 'player2', 'player3'],
        wonderAssignments: {
          player1: { wonderId: 'alexandria', side: 'A' },
          player2: { wonderId: 'babylon', side: 'B' },
          player3: { wonderId: 'ephesus', side: 'A' },
        },
      };

      const newState = gameReducer(initialState, action, cardInstances);

      expect(newState.players).toHaveLength(3);
      expect(newState.players[0].id).toBe('player1');
      expect(newState.players[0].wonderId).toBe('alexandria');
      expect(newState.players[0].wonderSide).toBe('A');
      expect(newState.players[0].coins).toBe(3);
      expect(newState.players[0].wonderStages).toBe(0);
      expect(newState.phase).toBe('setup');
    });

    it('should set initial player properties correctly', () => {
      const action: InitGameAction = {
        type: 'INIT_GAME',
        playerIds: ['player1'],
        wonderAssignments: {
          player1: { wonderId: 'giza', side: 'B' },
        },
      };

      const newState = gameReducer(initialState, action, cardInstances);
      const player = newState.players[0];

      expect(player.hand).toEqual([]);
      expect(player.tableau).toEqual([]);
      expect(player.coins).toBe(3);
      expect(player.militaryShields).toBe(0);
      expect(player.victoryTokens).toBe(0);
      expect(player.defeatTokens).toBe(0);
      expect(player.science).toEqual({
        [ScienceSymbol.TABLET]: 0,
        [ScienceSymbol.COMPASS]: 0,
        [ScienceSymbol.GEAR]: 0,
      });
      expect(player.wonderStages).toBe(0);
      expect(player.leftTradeCost).toEqual({ raw: 2, manufactured: 2 });
      expect(player.rightTradeCost).toEqual({ raw: 2, manufactured: 2 });
    });
  });

  describe('DISCARD_CARD', () => {
    it('should discard a card and give 3 coins', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'alexandria',
        wonderSide: 'A',
        hand: ['card1', 'card2', 'card3'],
        tableau: [],
        coins: 5,
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
      };

      initialState.players = [player];

      const action: DiscardCardAction = {
        type: 'DISCARD_CARD',
        playerId: 'player1',
        cardInstanceId: 'card2',
      };

      const newState = gameReducer(initialState, action, cardInstances);

      expect(newState.players[0].hand).toEqual(['card1', 'card3']);
      expect(newState.players[0].coins).toBe(8); // 5 + 3
      expect(newState.discardPile).toContain('card2');
    });

    it('should not discard if card not in hand', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'alexandria',
        wonderSide: 'A',
        hand: ['card1', 'card2'],
        tableau: [],
        coins: 5,
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
      };

      initialState.players = [player];

      const action: DiscardCardAction = {
        type: 'DISCARD_CARD',
        playerId: 'player1',
        cardInstanceId: 'card3', // Not in hand
      };

      const newState = gameReducer(initialState, action, cardInstances);

      expect(newState.players[0].hand).toEqual(['card1', 'card2']);
      expect(newState.players[0].coins).toBe(5); // Unchanged
      expect(newState.discardPile).toEqual([]);
    });
  });

  describe('PASS_CARDS', () => {
    it('should pass cards clockwise', () => {
      const players: PlayerState[] = [
        {
          id: 'player1',
          wonderId: 'alexandria',
          wonderSide: 'A',
          hand: ['card1', 'card2'],
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
          hand: ['card3', 'card4'],
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
          wonderId: 'ephesus',
          wonderSide: 'A',
          hand: ['card5', 'card6'],
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
      ];

      initialState.players = players;
      initialState.direction = 'clockwise';

      const action = {
        type: 'PASS_CARDS' as const,
        playerId: 'player1',
      };

      const newState = gameReducer(initialState, action, cardInstances);

      // Clockwise: player1 gets player3's cards, player2 gets player1's cards, player3 gets player2's cards
      expect(newState.players[0].hand).toEqual(['card5', 'card6']);
      expect(newState.players[1].hand).toEqual(['card1', 'card2']);
      expect(newState.players[2].hand).toEqual(['card3', 'card4']);
      expect(newState.turn).toBe(2);
    });

    it('should pass cards counterclockwise', () => {
      const players: PlayerState[] = [
        {
          id: 'player1',
          wonderId: 'alexandria',
          wonderSide: 'A',
          hand: ['card1', 'card2'],
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
          hand: ['card3', 'card4'],
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
          wonderId: 'ephesus',
          wonderSide: 'A',
          hand: ['card5', 'card6'],
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
      ];

      initialState.players = players;
      initialState.direction = 'counterclockwise';

      const action = {
        type: 'PASS_CARDS' as const,
        playerId: 'player1',
      };

      const newState = gameReducer(initialState, action, cardInstances);

      // Counterclockwise: player1 gets player2's cards, player2 gets player3's cards, player3 gets player1's cards
      expect(newState.players[0].hand).toEqual(['card3', 'card4']);
      expect(newState.players[1].hand).toEqual(['card5', 'card6']);
      expect(newState.players[2].hand).toEqual(['card1', 'card2']);
      expect(newState.turn).toBe(2);
    });
  });

  describe('RESOLVE_MILITARY', () => {
    it('should resolve military conflicts for Age I', () => {
      const players: PlayerState[] = [
        {
          id: 'player1',
          wonderId: 'alexandria',
          wonderSide: 'A',
          hand: [],
          tableau: [],
          coins: 3,
          militaryShields: 3,
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
          militaryShields: 1,
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
          wonderId: 'ephesus',
          wonderSide: 'A',
          hand: [],
          tableau: [],
          coins: 3,
          militaryShields: 2,
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
      ];

      initialState.players = players;
      initialState.age = Age.I;

      const action = {
        type: 'RESOLVE_MILITARY' as const,
        playerId: 'player1',
      };

      const newState = gameReducer(initialState, action, cardInstances);

      // Player 1 (3 shields) beats player 3 (2 shields) on left and player 2 (1 shield) on right
      expect(newState.players[0].victoryTokens).toBe(2); // 1 + 1
      expect(newState.players[0].defeatTokens).toBe(0);

      // Player 2 (1 shield) loses to player 1 (3 shields) on left and player 3 (2 shields) on right
      expect(newState.players[1].victoryTokens).toBe(0);
      expect(newState.players[1].defeatTokens).toBe(2);

      // Player 3 (2 shields) loses to player 1 (3 shields) on right and beats player 2 (1 shield) on left
      expect(newState.players[2].victoryTokens).toBe(1);
      expect(newState.players[2].defeatTokens).toBe(1);
    });

    it('should award correct points for Age II', () => {
      const players: PlayerState[] = [
        {
          id: 'player1',
          wonderId: 'alexandria',
          wonderSide: 'A',
          hand: [],
          tableau: [],
          coins: 3,
          militaryShields: 5,
          victoryTokens: 1,
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
          militaryShields: 2,
          victoryTokens: 0,
          defeatTokens: 1,
          science: {
            [ScienceSymbol.TABLET]: 0,
            [ScienceSymbol.COMPASS]: 0,
            [ScienceSymbol.GEAR]: 0,
          },
          wonderStages: 0,
          leftTradeCost: { raw: 2, manufactured: 2 },
          rightTradeCost: { raw: 2, manufactured: 2 },
        },
      ];

      initialState.players = players;
      initialState.age = Age.II;

      const action = {
        type: 'RESOLVE_MILITARY' as const,
        playerId: 'player1',
      };

      const newState = gameReducer(initialState, action, cardInstances);

      // Age II gives 3 victory points
      // Player 1 beats player 2 on both sides
      expect(newState.players[0].victoryTokens).toBe(7); // 1 + 3 + 3
      expect(newState.players[0].defeatTokens).toBe(0);

      // Player 2 loses on both sides
      expect(newState.players[1].victoryTokens).toBe(0);
      expect(newState.players[1].defeatTokens).toBe(3); // 1 + 1 + 1
    });

    it('should handle ties', () => {
      const players: PlayerState[] = [
        {
          id: 'player1',
          wonderId: 'alexandria',
          wonderSide: 'A',
          hand: [],
          tableau: [],
          coins: 3,
          militaryShields: 2,
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
          militaryShields: 2,
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
      ];

      initialState.players = players;
      initialState.age = Age.I;

      const action = {
        type: 'RESOLVE_MILITARY' as const,
        playerId: 'player1',
      };

      const newState = gameReducer(initialState, action, cardInstances);

      // Both players have equal shields, no one gets points
      expect(newState.players[0].victoryTokens).toBe(0);
      expect(newState.players[0].defeatTokens).toBe(0);
      expect(newState.players[1].victoryTokens).toBe(0);
      expect(newState.players[1].defeatTokens).toBe(0);
    });
  });

  describe('NEXT_AGE', () => {
    it('should advance from Age I to Age II', () => {
      initialState.age = Age.I;
      initialState.direction = 'clockwise';

      const action = {
        type: 'NEXT_AGE' as const,
        playerId: 'player1',
      };

      const newState = gameReducer(initialState, action, cardInstances);

      expect(newState.age).toBe(Age.II);
      expect(newState.turn).toBe(1);
      expect(newState.direction).toBe('counterclockwise');
      expect(newState.phase).toBe('playing');
    });

    it('should advance from Age II to Age III', () => {
      initialState.age = Age.II;
      initialState.direction = 'counterclockwise';

      const action = {
        type: 'NEXT_AGE' as const,
        playerId: 'player1',
      };

      const newState = gameReducer(initialState, action, cardInstances);

      expect(newState.age).toBe(Age.III);
      expect(newState.turn).toBe(1);
      expect(newState.direction).toBe('clockwise');
      expect(newState.phase).toBe('playing');
    });

    it('should finish game after Age III', () => {
      initialState.age = Age.III;

      const action = {
        type: 'NEXT_AGE' as const,
        playerId: 'player1',
      };

      const newState = gameReducer(initialState, action, cardInstances);

      expect(newState.age).toBe(Age.III); // Remains at Age III
      expect(newState.phase).toBe('finished');
    });
  });
});
