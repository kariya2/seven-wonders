import { describe, it, expect } from 'vitest';
import {
  buildDeck,
  shuffleDeck,
  dealCards,
  prepareGameDeck,
  getDeckStatistics,
  validateDeckDistribution,
} from '../deckBuilder';
import { Age, CardType, PlayerCount } from '../../../types';
import { age1Templates } from '../age1Templates';

describe('Deck Builder', () => {
  describe('buildDeck', () => {
    it('should create correct number of cards for each player count', () => {
      const playerCounts: PlayerCount[] = [3, 4, 5, 6, 7];

      playerCounts.forEach((pc) => {
        const deck = buildDeck(Age.I, pc);
        expect(deck.length).toBe(pc * 7);
      });
    });

    it('should create multiple instances of the same card', () => {
      const deck = buildDeck(Age.I, 7);
      const stats = getDeckStatistics(deck);

      // Lumber Yard should have 2 copies in 7-player game
      expect(stats.byName['Lumber Yard']).toBe(2);
      expect(stats.byName['Ore Vein']).toBe(2);
      expect(stats.byName['Clay Pool']).toBe(2);
      expect(stats.byName['Stone Pit']).toBe(2);
    });

    it('should create unique instance IDs for duplicate cards', () => {
      const deck = buildDeck(Age.I, 7);
      const lumberYards = deck.filter((card) => card.name === 'Lumber Yard');

      expect(lumberYards.length).toBe(2);
      expect(lumberYards[0].instanceId).toBe('lumber_yard_1');
      expect(lumberYards[1].instanceId).toBe('lumber_yard_2');
    });

    it('should not include cards below minimum player count', () => {
      const deck3 = buildDeck(Age.I, 3);
      const stats3 = getDeckStatistics(deck3);

      // Cards that require 4+ players should not be in 3-player deck
      expect(stats3.byName['Excavation']).toBeUndefined();
      expect(stats3.byName['Forest Cave']).toBeUndefined();
      expect(stats3.byName['Tavern']).toBeUndefined();
      expect(stats3.byName['Pawnshop']).toBeUndefined();
    });

    it('should include new cards as player count increases', () => {
      const deck3 = buildDeck(Age.I, 3);
      const deck4 = buildDeck(Age.I, 4);
      const deck5 = buildDeck(Age.I, 5);
      const deck6 = buildDeck(Age.I, 6);

      const stats3 = getDeckStatistics(deck3);
      const stats4 = getDeckStatistics(deck4);
      const stats5 = getDeckStatistics(deck5);
      const stats6 = getDeckStatistics(deck6);

      // Excavation appears at 4+ players
      expect(stats3.byName['Excavation']).toBeUndefined();
      expect(stats4.byName['Excavation']).toBe(1);

      // Forest Cave appears at 5+ players
      expect(stats4.byName['Forest Cave']).toBeUndefined();
      expect(stats5.byName['Forest Cave']).toBe(1);

      // Tree Farm appears at 6+ players
      expect(stats5.byName['Tree Farm']).toBeUndefined();
      expect(stats6.byName['Tree Farm']).toBe(1);
    });

    it('should have correct distribution of card types', () => {
      const deck = buildDeck(Age.I, 7);
      const stats = getDeckStatistics(deck);

      // Check that all card types are present
      expect(stats.byType[CardType.BROWN]).toBeGreaterThan(0);
      expect(stats.byType[CardType.GREY]).toBeGreaterThan(0);
      expect(stats.byType[CardType.BLUE]).toBeGreaterThan(0);
      expect(stats.byType[CardType.YELLOW]).toBeGreaterThan(0);
      expect(stats.byType[CardType.RED]).toBeGreaterThan(0);
      expect(stats.byType[CardType.GREEN]).toBeGreaterThan(0);
    });
  });

  describe('shuffleDeck', () => {
    it('should maintain deck size after shuffling', () => {
      const deck = buildDeck(Age.I, 5);
      const shuffled = shuffleDeck(deck);

      expect(shuffled.length).toBe(deck.length);
    });

    it('should contain all original cards', () => {
      const deck = buildDeck(Age.I, 5);
      const shuffled = shuffleDeck(deck);

      // Check that all instance IDs are still present
      const originalIds = deck.map((c) => c.instanceId).sort();
      const shuffledIds = shuffled.map((c) => c.instanceId).sort();

      expect(shuffledIds).toEqual(originalIds);
    });

    it('should actually shuffle the deck', () => {
      const deck = buildDeck(Age.I, 5);
      const shuffled1 = shuffleDeck(deck);
      const shuffled2 = shuffleDeck(deck);

      // Very unlikely that two shuffles produce the same order
      const order1 = shuffled1.map((c) => c.instanceId).join(',');
      const order2 = shuffled2.map((c) => c.instanceId).join(',');

      expect(order1).not.toBe(order2);
    });
  });

  describe('dealCards', () => {
    it('should deal 7 cards to each player', () => {
      const playerCounts: PlayerCount[] = [3, 4, 5, 6, 7];

      playerCounts.forEach((pc) => {
        const deck = buildDeck(Age.I, pc);
        const hands = dealCards(deck, pc);

        expect(hands.length).toBe(pc);
        hands.forEach((hand) => {
          expect(hand.length).toBe(7);
        });
      });
    });

    it('should use all cards in the deck', () => {
      const deck = buildDeck(Age.I, 5);
      const hands = dealCards(deck, 5);

      const totalCards = hands.reduce((sum, hand) => sum + hand.length, 0);
      expect(totalCards).toBe(deck.length);
    });

    it('should throw error for invalid deck size', () => {
      const deck = buildDeck(Age.I, 5);
      // Remove one card to make it invalid
      deck.pop();

      expect(() => dealCards(deck, 5)).toThrow('Invalid deck size');
    });
  });

  describe('prepareGameDeck', () => {
    it('should return shuffled deck and dealt hands', () => {
      const result = prepareGameDeck(Age.I, 5);

      expect(result.deck.length).toBe(35); // 5 * 7
      expect(result.hands.length).toBe(5);
      expect(result.hands[0].length).toBe(7);
    });
  });

  describe('validateDeckDistribution', () => {
    it('should validate Age I distribution', () => {
      const validation = validateDeckDistribution(Age.I);

      if (!validation.valid) {
        console.error('Validation errors:', validation.errors);
      }

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('Card copy validation', () => {
    it('should match expected copy counts from game rules', () => {
      // Test specific cards against known copy counts
      const lumberYard = age1Templates.find((t) => t.id === 'lumber_yard');
      expect(lumberYard?.copies).toEqual({ 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 });

      const tavern = age1Templates.find((t) => t.id === 'tavern');
      expect(tavern?.copies).toEqual({ 3: 0, 4: 1, 5: 2, 6: 2, 7: 3 });

      const loom = age1Templates.find((t) => t.id === 'loom');
      expect(loom?.copies).toEqual({ 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 });
    });
  });

  describe('Card instance properties', () => {
    it('should preserve all card properties in instances', () => {
      const deck = buildDeck(Age.I, 5);
      const lumberYard = deck.find((c) => c.templateId === 'lumber_yard');

      expect(lumberYard).toBeDefined();
      expect(lumberYard?.name).toBe('Lumber Yard');
      expect(lumberYard?.type).toBe(CardType.BROWN);
      expect(lumberYard?.age).toBe(Age.I);
      expect(lumberYard?.cost).toEqual({ type: 'free' });
      expect(lumberYard?.effects).toBeDefined();
      expect(lumberYard?.effects.length).toBeGreaterThan(0);
    });
  });

  describe('Age II deck building', () => {
    it('should create correct number of cards for Age II', () => {
      const playerCounts: PlayerCount[] = [3, 4, 5, 6, 7];

      playerCounts.forEach((pc) => {
        const deck = buildDeck(Age.II, pc);
        expect(deck.length).toBe(pc * 7);
      });
    });

    it('should include Age II specific cards', () => {
      const deck = buildDeck(Age.II, 5);
      const stats = getDeckStatistics(deck);

      // Check that we have Age II cards
      const ageIICards = deck.filter((card) => card.age === Age.II);
      expect(ageIICards.length).toBe(35); // All cards should be Age II
    });

    it('should have proper distribution of card types in Age II', () => {
      const deck = buildDeck(Age.II, 7);
      const stats = getDeckStatistics(deck);

      // Age II should have various card types
      expect(stats.byType).toBeDefined();
      expect(Object.keys(stats.byType).length).toBeGreaterThan(0);
    });

    it('should validate Age II distribution', () => {
      const validation = validateDeckDistribution(Age.II);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should include Age II unique cards', () => {
      const deck = buildDeck(Age.II, 5);

      // Check for some Age II specific cards
      const foundry = deck.find((c) => c.name === 'Foundry');
      const sawmill = deck.find((c) => c.name === 'Sawmill');
      const quarry = deck.find((c) => c.name === 'Quarry');

      expect(foundry || sawmill || quarry).toBeDefined();
    });
  });

  describe('Age III deck building', () => {
    it('should create correct number of cards for Age III', () => {
      const playerCounts: PlayerCount[] = [3, 4, 5, 6, 7];

      playerCounts.forEach((pc) => {
        const deck = buildDeck(Age.III, pc);
        expect(deck.length).toBe(pc * 7);
      });
    });

    it('should include guild cards in Age III', () => {
      const deck = buildDeck(Age.III, 5);

      // Age III includes guild cards
      const guildCards = deck.filter((card) => card.type === CardType.PURPLE);
      expect(guildCards.length).toBe(7); // playerCount + 2 = 5 + 2 = 7 guilds
    });

    it('should have different guilds in different games', () => {
      // Build multiple decks and check that guilds vary
      const decks: CardInstance[][] = [];
      for (let i = 0; i < 5; i++) {
        decks.push(buildDeck(Age.III, 3));
      }

      // Extract guild names from each deck
      const guildSets = decks.map((deck) => {
        const guilds = deck.filter((card) => card.type === CardType.PURPLE);
        return new Set(guilds.map((g) => g.name));
      });

      // At least some decks should have different guilds (not deterministic due to shuffling)
      let hasDifference = false;
      for (let i = 1; i < guildSets.length; i++) {
        const set1 = Array.from(guildSets[0]);
        const set2 = Array.from(guildSets[i]);
        if (
          set1.some((g) => !set2.includes(g)) ||
          set2.some((g) => !set1.includes(g))
        ) {
          hasDifference = true;
          break;
        }
      }

      // This might fail occasionally due to random chance, but should usually pass
      expect(hasDifference).toBe(true);
    });

    it('should include both regular Age III cards and guilds', () => {
      const deck = buildDeck(Age.III, 4);

      const purpleCards = deck.filter((card) => card.type === CardType.PURPLE);
      const nonPurpleCards = deck.filter(
        (card) => card.type !== CardType.PURPLE
      );

      expect(purpleCards.length).toBe(6); // playerCount + 2 = 4 + 2 = 6 guilds
      expect(nonPurpleCards.length).toBe(22); // 28 total - 6 guilds = 22 regular
    });

    it('should validate Age III distribution', () => {
      const validation = validateDeckDistribution(Age.III);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should include Age III unique cards', () => {
      const deck = buildDeck(Age.III, 5);

      // Check for some Age III specific cards
      const palace = deck.find((c) => c.name === 'Palace');
      const pantheon = deck.find((c) => c.name === 'Pantheon');
      const senate = deck.find((c) => c.name === 'Senate');

      expect(palace || pantheon || senate).toBeDefined();
    });
  });

  describe('Full game deck progression', () => {
    it('should be able to build decks for all ages in sequence', () => {
      const playerCount: PlayerCount = 5;

      // Simulate a full game
      const age1Deck = buildDeck(Age.I, playerCount);
      expect(age1Deck.length).toBe(35);
      expect(age1Deck.every((card) => card.age === Age.I)).toBe(true);

      const age2Deck = buildDeck(Age.II, playerCount);
      expect(age2Deck.length).toBe(35);
      expect(age2Deck.every((card) => card.age === Age.II)).toBe(true);

      const age3Deck = buildDeck(Age.III, playerCount);
      expect(age3Deck.length).toBe(35);
      expect(age3Deck.every((card) => card.age === Age.III)).toBe(true);

      // Verify no card instance IDs are duplicated across ages
      const allIds = new Set([
        ...age1Deck.map((c) => c.instanceId),
        ...age2Deck.map((c) => c.instanceId),
        ...age3Deck.map((c) => c.instanceId),
      ]);

      const totalCards = age1Deck.length + age2Deck.length + age3Deck.length;
      expect(allIds.size).toBe(totalCards);
    });

    it('should handle all player counts correctly', () => {
      const playerCounts: PlayerCount[] = [3, 4, 5, 6, 7];

      playerCounts.forEach((pc) => {
        const age1 = buildDeck(Age.I, pc);
        const age2 = buildDeck(Age.II, pc);
        const age3 = buildDeck(Age.III, pc);

        expect(age1.length).toBe(pc * 7);
        expect(age2.length).toBe(pc * 7);
        expect(age3.length).toBe(pc * 7);
      });
    });
  });
});
