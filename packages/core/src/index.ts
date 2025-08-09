// State types
export * from './state/types';
export * from './state/reducer';

// Action types
export * from './actions/types';

// Wonder data
export * from './wonders/types';
export * from './wonders/wonderData';

// Resource calculation
export * from './resources/calculator';

// Payment validation
export * from './payment/validator';

// Scoring
export * from './scoring/calculator';

// Game engine
export * from './engine/gameEngine';

// Re-export shared types and utilities
export {
  buildDeck,
  dealCards,
  cardService,
  Age,
  CardType,
  ResourceType,
  ScienceSymbol,
} from '@seven-wonders/shared';

export type {
  CardInstance,
  CardTemplate,
  PlayerCount,
} from '@seven-wonders/shared';
// test
