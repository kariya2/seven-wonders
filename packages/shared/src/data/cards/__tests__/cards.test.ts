import { describe, it, expect } from 'vitest';
import {
  getAllCards,
  getCardsByAge,
  getCardsByType,
  getCardsForGame,
  validateCardsForPlayerCount,
  getCardById,
  Age,
  CardType,
  CardSchema,
} from '../index';

describe('Card Data Integrity', () => {
  const allCards = getAllCards();

  it('should have cards for all ages', () => {
    expect(getCardsByAge(Age.I).length).toBeGreaterThan(0);
    expect(getCardsByAge(Age.II).length).toBeGreaterThan(0);
    expect(getCardsByAge(Age.III).length).toBeGreaterThan(0);
  });

  it('should have all card types', () => {
    const types = Object.values(CardType);
    types.forEach((type) => {
      const cards = getCardsByType(type);
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it('should have unique card IDs', () => {
    const ids = allCards.map((card) => card.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid card schemas', () => {
    allCards.forEach((card) => {
      expect(() => CardSchema.parse(card)).not.toThrow();
    });
  });

  it('should have correct number of unique card types', () => {
    const counts = validateCardsForPlayerCount(7);

    // Check we have unique cards for each age
    expect(counts.age1).toBeGreaterThan(20);
    expect(counts.age2).toBeGreaterThan(20);
    expect(counts.age3).toBeGreaterThan(20);
    expect(counts.total).toBeGreaterThan(60);
  });

  it('should have progressively more cards for higher player counts', () => {
    // Cards should increase with player count
    let previousCount = 0;
    for (let players = 3; players <= 7; players++) {
      const counts = validateCardsForPlayerCount(players);
      expect(counts.total).toBeGreaterThanOrEqual(previousCount);
      previousCount = counts.total;
    }

    // Check specific player counts have minimum cards
    const count3 = validateCardsForPlayerCount(3);
    const count7 = validateCardsForPlayerCount(7);
    expect(count3.total).toBeGreaterThan(50);
    expect(count7.total).toBeGreaterThan(70);
  });

  it('should have valid chain references', () => {
    allCards.forEach((card) => {
      if (card.chainTo) {
        card.chainTo.forEach((chainId) => {
          const targetCard = getCardById(chainId);
          expect(targetCard).toBeDefined();

          // Chain targets should be in later ages
          if (targetCard) {
            expect(targetCard.age).toBeGreaterThan(card.age);
          }
        });
      }
    });
  });

  it('should have appropriate resource costs', () => {
    allCards.forEach((card) => {
      if (card.cost.type === 'resource') {
        const totalResources = Object.values(card.cost.resources).reduce(
          (sum, count) => sum + count,
          0
        );

        // Resource costs should be reasonable
        expect(totalResources).toBeGreaterThan(0);
        expect(totalResources).toBeLessThanOrEqual(7);

        // Higher age cards generally have higher costs
        if (card.age === Age.III) {
          expect(totalResources).toBeGreaterThanOrEqual(2);
        }
      }
    });
  });

  it('should have appropriate coin costs', () => {
    allCards.forEach((card) => {
      if (card.cost.type === 'coin') {
        // Coin costs should be reasonable
        expect(card.cost.amount).toBeGreaterThan(0);
        expect(card.cost.amount).toBeLessThanOrEqual(3);
      }
    });
  });

  it('should have guilds only in Age III', () => {
    const guilds = getCardsByType(CardType.PURPLE);
    guilds.forEach((guild) => {
      expect(guild.age).toBe(Age.III);
    });

    // Should have exactly 10 guilds
    expect(guilds.length).toBe(10);
  });

  it('should have valid player count requirements', () => {
    allCards.forEach((card) => {
      expect(card.minPlayers).toBeGreaterThanOrEqual(3);
      expect(card.minPlayers).toBeLessThanOrEqual(7);
    });
  });

  it('should have correct distribution of cards by type per age', () => {
    // Age I should have more resource cards
    const age1Browns = getCardsByAge(Age.I).filter(
      (c) => c.type === CardType.BROWN
    );
    const age1Greys = getCardsByAge(Age.I).filter(
      (c) => c.type === CardType.GREY
    );
    expect(age1Browns.length).toBeGreaterThan(0);
    expect(age1Greys.length).toBeGreaterThan(0);

    // Age III should have guilds
    const age3Purples = getCardsByAge(Age.III).filter(
      (c) => c.type === CardType.PURPLE
    );
    expect(age3Purples.length).toBe(10);
  });

  it('should have valid effects on all cards', () => {
    allCards.forEach((card) => {
      expect(card.effects.length).toBeGreaterThan(0);

      card.effects.forEach((effect) => {
        // Check effect has required properties based on type
        switch (effect.type) {
          case 'resource_production':
            expect(effect.resources).toBeDefined();
            expect(Array.isArray(effect.resources)).toBe(true);
            break;
          case 'victory_points':
            expect(typeof effect.amount).toBe('number');
            break;
          case 'military':
            expect(typeof effect.shields).toBe('number');
            break;
          case 'science':
            expect(effect.symbol).toBeDefined();
            break;
          case 'coins':
            expect(typeof effect.amount).toBe('number');
            break;
          case 'trading':
            expect(effect.resourceType).toBeDefined();
            expect(effect.neighbors).toBeDefined();
            expect(typeof effect.costReduction).toBe('number');
            break;
        }
      });
    });
  });
});
