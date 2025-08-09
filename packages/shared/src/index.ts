// Export all card types and enums
export * from './types/cards';
export * from './types/cardTemplate';

// Export card data
export * from './data/cards/age1Templates';
export * from './data/cards/age2Templates';
export * from './data/cards/age3Templates';
export * from './data/cards/guildTemplates';

// Export deck builder
export * from './data/cards/deckBuilder';

// Export card service
export { cardService } from './data/cards/cardService';

// Re-export commonly used types for convenience
export { CardType, ResourceType, ScienceSymbol, Age } from './types/cards';
export type { Effect } from './types/cards';
export type { CardTemplate, CardInstance } from './types/cardTemplate';
