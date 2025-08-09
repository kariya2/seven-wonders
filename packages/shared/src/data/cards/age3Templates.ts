import {
  CardTemplate,
  CardType,
  Age,
  ResourceType,
  ScienceSymbol,
} from '../../types';

// Based on the Seven Wonders Quick Reference PDF - Age III cards
export const age3Templates: CardTemplate[] = [
  // === COMMERCIAL BUILDINGS (YELLOW CARDS) ===
  {
    id: 'haven',
    name: 'Haven',
    type: CardType.YELLOW,
    age: Age.III,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 1,
        [ResourceType.ORE]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.BROWN,
        amount: 1,
        neighbors: 'self',
      },
      {
        type: 'coin_per_card',
        cardType: CardType.BROWN,
        amount: 1,
        neighbors: 'self',
      },
    ],
    chainFrom: ['forum'],
  },
  {
    id: 'lighthouse',
    name: 'Lighthouse',
    type: CardType.YELLOW,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 1,
        [ResourceType.GLASS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.YELLOW,
        amount: 1,
        neighbors: 'self',
      },
      {
        type: 'coin_per_card',
        cardType: CardType.YELLOW,
        amount: 1,
        neighbors: 'self',
      },
    ],
    chainFrom: ['caravansery'],
  },
  {
    id: 'chamber_of_commerce',
    name: 'Chamber of Commerce',
    type: CardType.YELLOW,
    age: Age.III,
    copies: { 3: 0, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 2,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.GREY,
        amount: 2,
        neighbors: 'self',
      },
      {
        type: 'coin_per_card',
        cardType: CardType.GREY,
        amount: 2,
        neighbors: 'self',
      },
    ],
  },
  {
    id: 'arena',
    name: 'Arena',
    type: CardType.YELLOW,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 3 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 2,
        [ResourceType.ORE]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_wonder_stage',
        neighbors: 'all',
        pointsPerStage: 1,
      },
      {
        type: 'coins',
        amount: 3,
      },
    ],
    chainFrom: ['dispensary'],
  },

  // === MILITARY STRUCTURES (RED CARDS) ===
  {
    id: 'siege_workshop',
    name: 'Siege Workshop',
    type: CardType.RED,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 3,
        [ResourceType.WOOD]: 1,
      },
    },
    effects: [
      {
        type: 'military',
        shields: 3,
      },
    ],
    chainFrom: ['laboratory'],
  },
  {
    id: 'fortifications',
    name: 'Fortifications',
    type: CardType.RED,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.ORE]: 3,
        [ResourceType.STONE]: 1,
      },
    },
    effects: [
      {
        type: 'military',
        shields: 3,
      },
    ],
    chainFrom: ['walls'],
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    type: CardType.RED,
    age: Age.III,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 3 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 2,
        [ResourceType.ORE]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'military',
        shields: 3,
      },
    ],
  },
  {
    id: 'circus',
    name: 'Circus',
    type: CardType.RED,
    age: Age.III,
    copies: { 3: 0, 4: 1, 5: 2, 6: 3, 7: 3 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 3,
        [ResourceType.ORE]: 1,
      },
    },
    effects: [
      {
        type: 'military',
        shields: 3,
      },
    ],
    chainFrom: ['training_ground'],
  },

  // === SCIENTIFIC STRUCTURES (GREEN CARDS) ===
  {
    id: 'university',
    name: 'University',
    type: CardType.GREEN,
    age: Age.III,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 2,
        [ResourceType.PAPYRUS]: 1,
        [ResourceType.GLASS]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.TABLET,
      },
    ],
    chainFrom: ['library'],
  },
  {
    id: 'observatory',
    name: 'Observatory',
    type: CardType.GREEN,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.ORE]: 2,
        [ResourceType.GLASS]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.GEAR,
      },
    ],
    chainFrom: ['laboratory'],
  },
  {
    id: 'lodge',
    name: 'Lodge',
    type: CardType.GREEN,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 2,
        [ResourceType.PAPYRUS]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.COMPASS,
      },
    ],
    chainFrom: ['dispensary'],
  },
  {
    id: 'study',
    name: 'Study',
    type: CardType.GREEN,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 1,
        [ResourceType.PAPYRUS]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.GEAR,
      },
    ],
    chainFrom: ['school'],
  },
  {
    id: 'academy',
    name: 'Academy',
    type: CardType.GREEN,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 3,
        [ResourceType.GLASS]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.COMPASS,
      },
    ],
    chainFrom: ['school'],
  },

  // === CIVIC STRUCTURES (BLUE CARDS) ===
  {
    id: 'gardens',
    name: 'Gardens',
    type: CardType.BLUE,
    age: Age.III,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 2,
        [ResourceType.WOOD]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 5,
      },
    ],
    chainFrom: ['statue'],
  },
  {
    id: 'senate',
    name: 'Senate',
    type: CardType.BLUE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 2,
        [ResourceType.STONE]: 1,
        [ResourceType.ORE]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 6,
      },
    ],
    chainFrom: ['library'],
  },
  {
    id: 'town_hall',
    name: 'Town Hall',
    type: CardType.BLUE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 2, 6: 3, 7: 3 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 2,
        [ResourceType.ORE]: 1,
        [ResourceType.GLASS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 6,
      },
    ],
  },
  {
    id: 'pantheon',
    name: 'Pantheon',
    type: CardType.BLUE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 2,
        [ResourceType.ORE]: 1,
        [ResourceType.GLASS]: 1,
        [ResourceType.PAPYRUS]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 7,
      },
    ],
    chainFrom: ['temple'],
  },
  {
    id: 'palace',
    name: 'Palace',
    type: CardType.BLUE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 1,
        [ResourceType.ORE]: 1,
        [ResourceType.WOOD]: 1,
        [ResourceType.CLAY]: 1,
        [ResourceType.GLASS]: 1,
        [ResourceType.PAPYRUS]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 8,
      },
    ],
  },
];

// Validation function for base Age III cards (without guilds)
export function validateAge3BaseDistribution(): boolean {
  const playerCounts: Array<3 | 4 | 5 | 6 | 7> = [3, 4, 5, 6, 7];

  for (const pc of playerCounts) {
    const baseCards = age3Templates.reduce(
      (sum, template) => sum + template.copies[pc],
      0
    );
    const guildsNeeded = pc + 2; // Number of guild cards to add
    const totalCards = baseCards + guildsNeeded;
    const expectedCards = pc * 7;

    if (totalCards !== expectedCards) {
      console.error(
        `Age III: ${pc} players has ${baseCards} base + ${guildsNeeded} guilds = ${totalCards} cards, expected ${expectedCards}`
      );
      return false;
    }
  }

  return true;
}
