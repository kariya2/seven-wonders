import { describe, it, expect } from 'vitest';
import {
  calculateScores,
  calculateScienceScore,
  determineWinner,
} from '../calculator';
import { GameState, PlayerState } from '../../state/types';
import { Age, CardInstance, ScienceSymbol } from '@seven-wonders/shared';

describe('Scoring Calculator', () => {
  describe('calculateScienceScore', () => {
    it('should calculate score for individual symbols', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'babylon',
        wonderSide: 'A',
        hand: [],
        tableau: [],
        coins: 0,
        militaryShields: 0,
        victoryTokens: 0,
        defeatTokens: 0,
        science: {
          [ScienceSymbol.TABLET]: 2,
          [ScienceSymbol.COMPASS]: 1,
          [ScienceSymbol.GEAR]: 3,
        },
        wonderStages: 0,
        leftTradeCost: { raw: 2, manufactured: 2 },
        rightTradeCost: { raw: 2, manufactured: 2 },
      };

      // Score should be: 2^2 + 1^2 + 3^2 + 1*7 (one complete set)
      // = 4 + 1 + 9 + 7 = 21
      const score = calculateScienceScore(player);
      expect(score).toBe(21);
    });

    it('should calculate score for multiple complete sets', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'babylon',
        wonderSide: 'A',
        hand: [],
        tableau: [],
        coins: 0,
        militaryShields: 0,
        victoryTokens: 0,
        defeatTokens: 0,
        science: {
          [ScienceSymbol.TABLET]: 3,
          [ScienceSymbol.COMPASS]: 3,
          [ScienceSymbol.GEAR]: 3,
        },
        wonderStages: 0,
        leftTradeCost: { raw: 2, manufactured: 2 },
        rightTradeCost: { raw: 2, manufactured: 2 },
      };

      // Score should be: 3^2 + 3^2 + 3^2 + 3*7 (three complete sets)
      // = 9 + 9 + 9 + 21 = 48
      const score = calculateScienceScore(player);
      expect(score).toBe(48);
    });

    it('should handle zero science symbols', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'giza',
        wonderSide: 'A',
        hand: [],
        tableau: [],
        coins: 0,
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

      const score = calculateScienceScore(player);
      expect(score).toBe(0);
    });

    it('should handle uneven distribution', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'babylon',
        wonderSide: 'A',
        hand: [],
        tableau: [],
        coins: 0,
        militaryShields: 0,
        victoryTokens: 0,
        defeatTokens: 0,
        science: {
          [ScienceSymbol.TABLET]: 4,
          [ScienceSymbol.COMPASS]: 1,
          [ScienceSymbol.GEAR]: 0,
        },
        wonderStages: 0,
        leftTradeCost: { raw: 2, manufactured: 2 },
        rightTradeCost: { raw: 2, manufactured: 2 },
      };

      // Score should be: 4^2 + 1^2 + 0^2 + 0*7 (no complete sets)
      // = 16 + 1 + 0 + 0 = 17
      const score = calculateScienceScore(player);
      expect(score).toBe(17);
    });
  });

  describe('Military Score', () => {
    it('should calculate positive military score', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'rhodes',
        wonderSide: 'A',
        hand: [],
        tableau: [],
        coins: 0,
        militaryShields: 0,
        victoryTokens: 6,
        defeatTokens: 1,
        science: {
          [ScienceSymbol.TABLET]: 0,
          [ScienceSymbol.COMPASS]: 0,
          [ScienceSymbol.GEAR]: 0,
        },
        wonderStages: 0,
        leftTradeCost: { raw: 2, manufactured: 2 },
        rightTradeCost: { raw: 2, manufactured: 2 },
      };

      const gameState: GameState = {
        id: 'game1',
        players: [player],
        age: Age.III,
        turn: 7,
        currentDeck: [],
        discardPile: [],
        direction: 'clockwise',
        version: 1,
        phase: 'finished',
      };

      const scores = calculateScores(gameState, new Map());
      expect(scores[player.id].military).toBe(5); // 6 - 1
    });

    it('should calculate negative military score', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'alexandria',
        wonderSide: 'A',
        hand: [],
        tableau: [],
        coins: 0,
        militaryShields: 0,
        victoryTokens: 1,
        defeatTokens: 5,
        science: {
          [ScienceSymbol.TABLET]: 0,
          [ScienceSymbol.COMPASS]: 0,
          [ScienceSymbol.GEAR]: 0,
        },
        wonderStages: 0,
        leftTradeCost: { raw: 2, manufactured: 2 },
        rightTradeCost: { raw: 2, manufactured: 2 },
      };

      const gameState: GameState = {
        id: 'game1',
        players: [player],
        age: Age.III,
        turn: 7,
        currentDeck: [],
        discardPile: [],
        direction: 'clockwise',
        version: 1,
        phase: 'finished',
      };

      const scores = calculateScores(gameState, new Map());
      expect(scores[player.id].military).toBe(-4); // 1 - 5
    });
  });

  describe('Coin Score', () => {
    it('should calculate coin score correctly', () => {
      const testCases = [
        { coins: 0, expectedScore: 0 },
        { coins: 2, expectedScore: 0 },
        { coins: 3, expectedScore: 1 },
        { coins: 5, expectedScore: 1 },
        { coins: 6, expectedScore: 2 },
        { coins: 15, expectedScore: 5 },
        { coins: 23, expectedScore: 7 },
      ];

      for (const { coins, expectedScore } of testCases) {
        const player: PlayerState = {
          id: 'player1',
          wonderId: 'ephesus',
          wonderSide: 'A',
          hand: [],
          tableau: [],
          coins,
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

        const gameState: GameState = {
          id: 'game1',
          players: [player],
          age: Age.III,
          turn: 7,
          currentDeck: [],
          discardPile: [],
          direction: 'clockwise',
          version: 1,
          phase: 'finished',
        };

        const scores = calculateScores(gameState, new Map());
        expect(scores[player.id].coins).toBe(expectedScore);
      }
    });
  });

  describe('Wonder Score', () => {
    it('should calculate wonder victory points for side A', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'giza',
        wonderSide: 'A',
        hand: [],
        tableau: [],
        coins: 0,
        militaryShields: 0,
        victoryTokens: 0,
        defeatTokens: 0,
        science: {
          [ScienceSymbol.TABLET]: 0,
          [ScienceSymbol.COMPASS]: 0,
          [ScienceSymbol.GEAR]: 0,
        },
        wonderStages: 3, // All three stages built
        leftTradeCost: { raw: 2, manufactured: 2 },
        rightTradeCost: { raw: 2, manufactured: 2 },
      };

      const gameState: GameState = {
        id: 'game1',
        players: [player],
        age: Age.III,
        turn: 7,
        currentDeck: [],
        discardPile: [],
        direction: 'clockwise',
        version: 1,
        phase: 'finished',
      };

      const scores = calculateScores(gameState, new Map());
      // Giza side A: 3 + 5 + 7 = 15 points
      expect(scores[player.id].wonder).toBe(15);
    });

    it('should calculate wonder victory points for side B', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'giza',
        wonderSide: 'B',
        hand: [],
        tableau: [],
        coins: 0,
        militaryShields: 0,
        victoryTokens: 0,
        defeatTokens: 0,
        science: {
          [ScienceSymbol.TABLET]: 0,
          [ScienceSymbol.COMPASS]: 0,
          [ScienceSymbol.GEAR]: 0,
        },
        wonderStages: 4, // All four stages built
        leftTradeCost: { raw: 2, manufactured: 2 },
        rightTradeCost: { raw: 2, manufactured: 2 },
      };

      const gameState: GameState = {
        id: 'game1',
        players: [player],
        age: Age.III,
        turn: 7,
        currentDeck: [],
        discardPile: [],
        direction: 'clockwise',
        version: 1,
        phase: 'finished',
      };

      const scores = calculateScores(gameState, new Map());
      // Giza side B: 3 + 5 + 5 + 7 = 20 points
      expect(scores[player.id].wonder).toBe(20);
    });

    it('should handle partially built wonders', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'alexandria',
        wonderSide: 'A',
        hand: [],
        tableau: [],
        coins: 0,
        militaryShields: 0,
        victoryTokens: 0,
        defeatTokens: 0,
        science: {
          [ScienceSymbol.TABLET]: 0,
          [ScienceSymbol.COMPASS]: 0,
          [ScienceSymbol.GEAR]: 0,
        },
        wonderStages: 1, // Only first stage built
        leftTradeCost: { raw: 2, manufactured: 2 },
        rightTradeCost: { raw: 2, manufactured: 2 },
      };

      const gameState: GameState = {
        id: 'game1',
        players: [player],
        age: Age.III,
        turn: 7,
        currentDeck: [],
        discardPile: [],
        direction: 'clockwise',
        version: 1,
        phase: 'finished',
      };

      const scores = calculateScores(gameState, new Map());
      // Alexandria side A first stage: 3 points
      expect(scores[player.id].wonder).toBe(3);
    });
  });

  describe('Total Score', () => {
    it('should calculate total score correctly', () => {
      const player: PlayerState = {
        id: 'player1',
        wonderId: 'babylon',
        wonderSide: 'A',
        hand: [],
        tableau: [],
        coins: 12, // 4 points
        militaryShields: 0,
        victoryTokens: 6, // 6 points
        defeatTokens: 1, // -1 point
        science: {
          [ScienceSymbol.TABLET]: 2,
          [ScienceSymbol.COMPASS]: 2,
          [ScienceSymbol.GEAR]: 2,
        }, // 2*7 + 4*3 = 26 points
        wonderStages: 2, // 3 + 0 = 3 points (second stage has no VP)
        leftTradeCost: { raw: 2, manufactured: 2 },
        rightTradeCost: { raw: 2, manufactured: 2 },
      };

      const gameState: GameState = {
        id: 'game1',
        players: [player],
        age: Age.III,
        turn: 7,
        currentDeck: [],
        discardPile: [],
        direction: 'clockwise',
        version: 1,
        phase: 'finished',
      };

      const scores = calculateScores(gameState, new Map());
      const breakdown = scores[player.id];

      expect(breakdown.coins).toBe(4);
      expect(breakdown.military).toBe(5);
      expect(breakdown.science).toBe(26);
      expect(breakdown.wonder).toBe(3);
      expect(breakdown.total).toBe(38); // 4 + 5 + 26 + 3
    });
  });

  describe('determineWinner', () => {
    it('should determine winner with highest score', () => {
      const scores = {
        player1: {
          military: 5,
          coins: 3,
          wonder: 10,
          civic: 8,
          commercial: 3,
          guilds: 5,
          science: 12,
          total: 46,
        },
        player2: {
          military: 2,
          coins: 5,
          wonder: 15,
          civic: 6,
          commercial: 4,
          guilds: 7,
          science: 9,
          total: 48,
        },
        player3: {
          military: 8,
          coins: 2,
          wonder: 7,
          civic: 10,
          commercial: 2,
          guilds: 3,
          science: 13,
          total: 45,
        },
      };

      const winner = determineWinner(scores);
      expect(winner).toBe('player2');
    });

    it('should handle single player', () => {
      const scores = {
        player1: {
          military: 0,
          coins: 0,
          wonder: 0,
          civic: 0,
          commercial: 0,
          guilds: 0,
          science: 0,
          total: 0,
        },
      };

      const winner = determineWinner(scores);
      expect(winner).toBe('player1');
    });
  });
});
