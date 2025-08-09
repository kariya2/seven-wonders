import {
  Age,
  CardType,
  ResourceType,
  ScienceSymbol,
} from '@seven-wonders/shared';

/**
 * Represents a player's current state in the game
 */
export interface PlayerState {
  id: string;
  wonderId: string;

  // Cards in play
  hand: string[]; // Card instance IDs in hand
  tableau: string[]; // Card instance IDs played to tableau

  // Resources & Economy
  coins: number;

  // Military
  militaryShields: number;
  victoryTokens: number; // From military victories
  defeatTokens: number; // From military defeats

  // Science
  science: Record<ScienceSymbol, number>;

  // Wonder progress
  wonderStages: number; // Number of stages built
  wonderSide: 'A' | 'B'; // Which side of wonder board

  // Trading costs with neighbors
  leftTradeCost: {
    raw: number; // Cost per raw material from left neighbor
    manufactured: number; // Cost per manufactured good from left neighbor
  };
  rightTradeCost: {
    raw: number; // Cost per raw material from right neighbor
    manufactured: number; // Cost per manufactured good from right neighbor
  };
}

/**
 * Represents the overall game state
 */
export interface GameState {
  id: string;
  players: PlayerState[];

  // Current phase
  age: Age;
  turn: number; // 1-6 for ages I & II, 1-7 for age III

  // Card management
  currentDeck: string[]; // Card instance IDs for current age
  discardPile: string[]; // Discarded card instance IDs

  // Direction of card passing
  direction: 'clockwise' | 'counterclockwise';

  // Version for optimistic concurrency control
  version: number;

  // Game phase
  phase: 'setup' | 'playing' | 'military' | 'finished';
}

/**
 * Resources available to a player
 */
export interface ResourcePool {
  // Fixed resources
  fixed: Partial<Record<ResourceType, number>>;

  // Choice resources (e.g., Stone/Wood)
  choices: Array<Partial<Record<ResourceType, number>>>;
}

/**
 * Payment for a card or wonder stage
 */
export interface Payment {
  coins: number;
  leftNeighborCoins: number;
  rightNeighborCoins: number;
  resources?: Partial<Record<ResourceType, number>>; // Optional - only needed for resource payments
  chain?: string; // Card ID if using chain
}

/**
 * Result of a military conflict
 */
export interface MilitaryResult {
  leftResult: 'victory' | 'defeat' | 'tie';
  rightResult: 'victory' | 'defeat' | 'tie';
  leftPoints: number;
  rightPoints: number;
}

/**
 * Final scoring breakdown
 */
export interface ScoreBreakdown {
  military: number;
  coins: number;
  wonder: number;
  civic: number;
  commercial: number;
  guilds: number;
  science: number;
  total: number;
}

/**
 * Complete game result
 */
export interface GameResult {
  winner: string; // Player ID
  scores: Record<string, ScoreBreakdown>;
  finalState: GameState;
}
