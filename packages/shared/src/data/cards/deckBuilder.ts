import {
  CardTemplate,
  CardInstance,
  PlayerCount,
  Age,
  createCardInstance,
} from '../../types';
import { age1Templates, validateAge1Distribution } from './age1Templates';
import { age2Templates } from './age2Templates';
import { age3Templates } from './age3Templates';
import { guildTemplates } from './guildTemplates';

/**
 * Build a deck of card instances for a specific age and player count
 * @param age The age of the game (I, II, or III)
 * @param playerCount Number of players (3-7)
 * @returns Array of card instances ready for play
 */
export function buildDeck(age: Age, playerCount: PlayerCount): CardInstance[] {
  const templates = getTemplatesForAge(age, playerCount);
  const instances: CardInstance[] = [];

  // Generate instances for each template based on copy count
  templates.forEach((template) => {
    const copyCount = template.copies[playerCount];

    for (let i = 1; i <= copyCount; i++) {
      instances.push(createCardInstance(template, i));
    }
  });

  // Validate deck size
  const expectedSize = playerCount * 7;
  if (instances.length !== expectedSize) {
    throw new Error(
      `Invalid deck size for Age ${age}, ${playerCount} players. ` +
        `Got ${instances.length} cards, expected ${expectedSize}`
    );
  }

  return instances;
}

/**
 * Get templates for a specific age
 */
function getTemplatesForAge(
  age: Age,
  playerCount: PlayerCount
): CardTemplate[] {
  switch (age) {
    case Age.I:
      // Validate distribution on first use
      if (!validateAge1Distribution()) {
        throw new Error('Age I card distribution is invalid');
      }
      return age1Templates;
    case Age.II:
      return age2Templates;
    case Age.III:
      // Age III includes regular cards plus guilds
      const guildCount = playerCount + 2; // Number of guilds to include
      const shuffledGuilds = shuffleDeck(guildTemplates);
      const selectedGuilds = shuffledGuilds.slice(0, guildCount);
      return [...age3Templates, ...selectedGuilds];
    default:
      throw new Error(`Invalid age: ${age}`);
  }
}

/**
 * Shuffle a deck of cards using Fisher-Yates algorithm
 */
export function shuffleDeck<T>(deck: T[]): T[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Deal cards to players
 * @param deck The deck to deal from
 * @param playerCount Number of players
 * @returns Array of hands, one for each player
 */
export function dealCards(
  deck: CardInstance[],
  playerCount: PlayerCount
): CardInstance[][] {
  if (deck.length !== playerCount * 7) {
    throw new Error(`Invalid deck size: ${deck.length}`);
  }

  const hands: CardInstance[][] = Array.from({ length: playerCount }, () => []);

  // Deal 7 cards to each player
  deck.forEach((card, index) => {
    const playerIndex = index % playerCount;
    hands[playerIndex].push(card);
  });

  return hands;
}

/**
 * Complete deck building and dealing process
 */
export function prepareGameDeck(
  age: Age,
  playerCount: PlayerCount
): {
  deck: CardInstance[];
  hands: CardInstance[][];
} {
  const deck = buildDeck(age, playerCount);
  const shuffledDeck = shuffleDeck(deck);
  const hands = dealCards(shuffledDeck, playerCount);

  return { deck: shuffledDeck, hands };
}

/**
 * Get statistics about a deck
 */
export function getDeckStatistics(deck: CardInstance[]): {
  totalCards: number;
  byType: Record<string, number>;
  byName: Record<string, number>;
} {
  const byType: Record<string, number> = {};
  const byName: Record<string, number> = {};

  deck.forEach((card) => {
    // Count by type
    byType[card.type] = (byType[card.type] || 0) + 1;

    // Count by name
    byName[card.name] = (byName[card.name] || 0) + 1;
  });

  return {
    totalCards: deck.length,
    byType,
    byName,
  };
}

/**
 * Validate that a deck has the correct distribution for all player counts
 */
export function validateDeckDistribution(age: Age): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const playerCounts: PlayerCount[] = [3, 4, 5, 6, 7];

  for (const pc of playerCounts) {
    try {
      const deck = buildDeck(age, pc);
      const stats = getDeckStatistics(deck);

      if (stats.totalCards !== pc * 7) {
        errors.push(
          `Age ${age}, ${pc} players: Expected ${pc * 7} cards, got ${stats.totalCards}`
        );
      }
    } catch (error) {
      errors.push(`Age ${age}, ${pc} players: ${error}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
