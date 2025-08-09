import { Payment } from '../state/types';

/**
 * Base action interface
 */
interface BaseAction {
  type: string;
  playerId: string;
}

/**
 * Play a card from hand
 */
export interface PlayCardAction extends BaseAction {
  type: 'PLAY_CARD';
  cardInstanceId: string;
  payment: Payment;
}

/**
 * Discard a card for coins
 */
export interface DiscardCardAction extends BaseAction {
  type: 'DISCARD_CARD';
  cardInstanceId: string;
}

/**
 * Build a wonder stage
 */
export interface BuildWonderAction extends BaseAction {
  type: 'BUILD_WONDER';
  cardInstanceId: string; // Card used to build
  payment: Payment;
  stageIndex: number;
}

/**
 * Pass cards to next player (automatic at end of turn)
 */
export interface PassCardsAction extends BaseAction {
  type: 'PASS_CARDS';
}

/**
 * Resolve military conflicts at end of age
 */
export interface ResolveMilitaryAction extends BaseAction {
  type: 'RESOLVE_MILITARY';
}

/**
 * Advance to next age
 */
export interface NextAgeAction extends BaseAction {
  type: 'NEXT_AGE';
}

/**
 * Initialize a new game
 */
export interface InitGameAction {
  type: 'INIT_GAME';
  playerIds: string[];
  wonderAssignments: Record<string, { wonderId: string; side: 'A' | 'B' }>;
}

/**
 * All possible game actions
 */
export type GameAction =
  | PlayCardAction
  | DiscardCardAction
  | BuildWonderAction
  | PassCardsAction
  | ResolveMilitaryAction
  | NextAgeAction
  | InitGameAction;
