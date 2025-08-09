import { Card, CardType, Age, ResourceType } from '../../types/cards';
import { age1Cards } from './age1';
import { age2Cards } from './age2';
import { age3Cards } from './age3';

// Get all cards
export const getAllCards = (): Card[] => {
  return [...age1Cards, ...age2Cards, ...age3Cards];
};

// Get cards by age
export const getCardsByAge = (age: Age): Card[] => {
  switch (age) {
    case Age.I:
      return age1Cards;
    case Age.II:
      return age2Cards;
    case Age.III:
      return age3Cards;
    default:
      return [];
  }
};

// Get cards by type
export const getCardsByType = (type: CardType): Card[] => {
  return getAllCards().filter((card) => card.type === type);
};

// Get cards by player count
export const getCardsByPlayerCount = (playerCount: number): Card[] => {
  return getAllCards().filter((card) => card.minPlayers <= playerCount);
};

// Get cards for a specific age and player count
export const getCardsForGame = (age: Age, playerCount: number): Card[] => {
  return getCardsByAge(age).filter((card) => card.minPlayers <= playerCount);
};

// Get card by ID
export const getCardById = (id: string): Card | undefined => {
  return getAllCards().find((card) => card.id === id);
};

// Get cards that chain from a specific card
export const getChainedCards = (cardId: string): Card[] => {
  return getAllCards().filter(
    (card) => card.cost.type === 'chain' && card.cost.fromCard === cardId
  );
};

// Get cards that a specific card chains to
export const getChainsTo = (card: Card): Card[] => {
  if (!card.chainTo) return [];
  return card.chainTo
    .map((id) => getCardById(id))
    .filter((c): c is Card => c !== undefined);
};

// Check if a card produces a specific resource
export const producesResource = (
  card: Card,
  resource: ResourceType
): boolean => {
  return card.effects.some((effect) => {
    if (effect.type === 'resource_production') {
      return effect.resources.some((resourceMap) => resource in resourceMap);
    }
    return false;
  });
};

// Get total resources produced by a card (for single production cards)
export const getResourceProduction = (
  card: Card
): Record<ResourceType, number> => {
  const production: Partial<Record<ResourceType, number>> = {};

  card.effects.forEach((effect) => {
    if (
      effect.type === 'resource_production' &&
      effect.resources.length === 1
    ) {
      const resourceMap = effect.resources[0];
      Object.entries(resourceMap).forEach(
        ([resource, amount]: [string, number]) => {
          const resType = resource as ResourceType;
          production[resType] = (production[resType] || 0) + amount;
        }
      );
    }
  });

  return production as Record<ResourceType, number>;
};

// Check if card has choice production (produces one of multiple resources)
export const hasChoiceProduction = (card: Card): boolean => {
  return card.effects.some(
    (effect) =>
      effect.type === 'resource_production' && effect.resources.length > 1
  );
};

// Get victory points from a card (static points only)
export const getVictoryPoints = (card: Card): number => {
  const vpEffect = card.effects.find(
    (effect) => effect.type === 'victory_points'
  );
  return vpEffect?.amount || 0;
};

// Get military shields from a card
export const getMilitaryShields = (card: Card): number => {
  const militaryEffect = card.effects.find(
    (effect) => effect.type === 'military'
  );
  return militaryEffect?.shields || 0;
};

// Group cards by type for a specific age
export const groupCardsByType = (age: Age): Record<CardType, Card[]> => {
  const cards = getCardsByAge(age);
  const grouped: Partial<Record<CardType, Card[]>> = {};

  cards.forEach((card) => {
    if (!grouped[card.type]) {
      grouped[card.type] = [];
    }
    grouped[card.type]!.push(card);
  });

  return grouped as Record<CardType, Card[]>;
};

// Validate card data for a player count
export const validateCardsForPlayerCount = (
  playerCount: number
): {
  age1: number;
  age2: number;
  age3: number;
  total: number;
} => {
  const age1 = getCardsForGame(Age.I, playerCount).length;
  const age2 = getCardsForGame(Age.II, playerCount).length;
  const age3 = getCardsForGame(Age.III, playerCount).length;

  return {
    age1,
    age2,
    age3,
    total: age1 + age2 + age3,
  };
};
