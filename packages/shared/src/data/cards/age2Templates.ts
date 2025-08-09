import {
  CardTemplate,
  CardType,
  Age,
  ResourceType,
  ScienceSymbol,
} from '../../types';

// Based on the Seven Wonders Quick Reference PDF - Age II cards
export const age2Templates: CardTemplate[] = [
  // === RAW MATERIALS (BROWN CARDS) ===
  {
    id: 'sawmill',
    name: 'Sawmill',
    type: CardType.BROWN,
    age: Age.II,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.WOOD]: 2 }],
      },
    ],
  },
  {
    id: 'foundry',
    name: 'Foundry',
    type: CardType.BROWN,
    age: Age.II,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.ORE]: 2 }],
      },
    ],
  },
  {
    id: 'brickyard',
    name: 'Brickyard',
    type: CardType.BROWN,
    age: Age.II,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.CLAY]: 2 }],
      },
    ],
  },
  {
    id: 'quarry',
    name: 'Quarry',
    type: CardType.BROWN,
    age: Age.II,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.STONE]: 2 }],
      },
    ],
  },

  // === MANUFACTURED GOODS (GREY CARDS) ===
  {
    id: 'loom2',
    name: 'Loom',
    type: CardType.GREY,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.CLOTH]: 1 }],
      },
    ],
  },
  {
    id: 'glassworks2',
    name: 'Glassworks',
    type: CardType.GREY,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.GLASS]: 1 }],
      },
    ],
  },
  {
    id: 'press2',
    name: 'Press',
    type: CardType.GREY,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.PAPYRUS]: 1 }],
      },
    ],
  },

  // === COMMERCIAL BUILDINGS (YELLOW CARDS) ===
  {
    id: 'forum',
    name: 'Forum',
    type: CardType.YELLOW,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 3 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.CLAY]: 2 },
    },
    effects: [
      {
        type: 'resource_production',
        resources: [
          { [ResourceType.CLOTH]: 1 },
          { [ResourceType.GLASS]: 1 },
          { [ResourceType.PAPYRUS]: 1 },
        ],
      },
    ],
    chainTo: ['haven'],
  },
  {
    id: 'caravansery',
    name: 'Caravansery',
    type: CardType.YELLOW,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 3 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.WOOD]: 2 },
    },
    effects: [
      {
        type: 'resource_production',
        resources: [
          { [ResourceType.WOOD]: 1 },
          { [ResourceType.STONE]: 1 },
          { [ResourceType.ORE]: 1 },
          { [ResourceType.CLAY]: 1 },
        ],
      },
    ],
    chainTo: ['lighthouse'],
  },
  {
    id: 'vineyard',
    name: 'Vineyard',
    type: CardType.YELLOW,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'coin_per_card',
        cardType: CardType.BROWN,
        amount: 1,
        neighbors: 'all',
      },
    ],
  },
  {
    id: 'bazaar',
    name: 'Bazaar',
    type: CardType.YELLOW,
    age: Age.II,
    copies: { 3: 0, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'coin_per_card',
        cardType: CardType.GREY,
        amount: 2,
        neighbors: 'all',
      },
    ],
  },

  // === MILITARY STRUCTURES (RED CARDS) ===
  {
    id: 'stables',
    name: 'Stables',
    type: CardType.RED,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 1,
        [ResourceType.WOOD]: 1,
        [ResourceType.ORE]: 1,
      },
    },
    effects: [
      {
        type: 'military',
        shields: 2,
      },
    ],
    chainFrom: ['apothecary'],
  },
  {
    id: 'archery_range',
    name: 'Archery Range',
    type: CardType.RED,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 2,
        [ResourceType.ORE]: 1,
      },
    },
    effects: [
      {
        type: 'military',
        shields: 2,
      },
    ],
    chainFrom: ['workshop'],
  },
  {
    id: 'walls',
    name: 'Walls',
    type: CardType.RED,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.STONE]: 3 },
    },
    effects: [
      {
        type: 'military',
        shields: 2,
      },
    ],
    chainTo: ['fortifications'],
  },
  {
    id: 'training_ground',
    name: 'Training Ground',
    type: CardType.RED,
    age: Age.II,
    copies: { 3: 0, 4: 1, 5: 1, 6: 2, 7: 3 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.ORE]: 2,
        [ResourceType.WOOD]: 1,
      },
    },
    effects: [
      {
        type: 'military',
        shields: 2,
      },
    ],
    chainTo: ['circus'],
  },

  // === SCIENTIFIC STRUCTURES (GREEN CARDS) ===
  {
    id: 'dispensary',
    name: 'Dispensary',
    type: CardType.GREEN,
    age: Age.II,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.ORE]: 2,
        [ResourceType.GLASS]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.COMPASS,
      },
    ],
    chainFrom: ['apothecary'],
    chainTo: ['arena', 'lodge'],
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    type: CardType.GREEN,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 2,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.GEAR,
      },
    ],
    chainFrom: ['workshop'],
    chainTo: ['siege_workshop', 'observatory'],
  },
  {
    id: 'library',
    name: 'Library',
    type: CardType.GREEN,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 2,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.TABLET,
      },
    ],
    chainFrom: ['scriptorium'],
    chainTo: ['senate', 'university'],
  },
  {
    id: 'school',
    name: 'School',
    type: CardType.GREEN,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 1,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.TABLET,
      },
    ],
    chainTo: ['academy', 'study'],
  },

  // === CIVIC STRUCTURES (BLUE CARDS) ===
  {
    id: 'temple',
    name: 'Temple',
    type: CardType.BLUE,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 1,
        [ResourceType.CLAY]: 1,
        [ResourceType.GLASS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 3,
      },
    ],
    chainFrom: ['altar'],
    chainTo: ['pantheon'],
  },
  {
    id: 'courthouse',
    name: 'Courthouse',
    type: CardType.BLUE,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 2,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 4,
      },
    ],
    chainFrom: ['scriptorium'],
  },
  {
    id: 'statue',
    name: 'Statue',
    type: CardType.BLUE,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.ORE]: 1,
        [ResourceType.WOOD]: 1,
        [ResourceType.STONE]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 4,
      },
    ],
    chainFrom: ['theatre'],
    chainTo: ['gardens'],
  },
  {
    id: 'aqueduct',
    name: 'Aqueduct',
    type: CardType.BLUE,
    age: Age.II,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.STONE]: 3 },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 5,
      },
    ],
    chainFrom: ['baths'],
  },
];

// Validation function
export function validateAge2Distribution(): boolean {
  const playerCounts: Array<3 | 4 | 5 | 6 | 7> = [3, 4, 5, 6, 7];

  for (const pc of playerCounts) {
    const totalCards = age2Templates.reduce(
      (sum, template) => sum + template.copies[pc],
      0
    );
    const expectedCards = pc * 7;

    if (totalCards !== expectedCards) {
      console.error(
        `Age II: ${pc} players has ${totalCards} cards, expected ${expectedCards}`
      );
      return false;
    }
  }

  return true;
}
