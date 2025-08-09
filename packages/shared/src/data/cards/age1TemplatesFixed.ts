import {
  CardTemplate,
  CardType,
  Age,
  ResourceType,
  ScienceSymbol,
} from '../../types';

// Based on careful analysis of the Seven Wonders Quick Reference PDF
// Each player count shows the exact number of each card in play
export const age1Templates: CardTemplate[] = [
  // === RAW MATERIALS (BROWN CARDS) ===
  // Basic single resources - multiple copies
  {
    id: 'lumber_yard',
    name: 'Lumber Yard',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.WOOD]: 1 }],
      },
    ],
  },
  {
    id: 'stone_pit',
    name: 'Stone Pit',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.STONE]: 1 }],
      },
    ],
  },
  {
    id: 'clay_pool',
    name: 'Clay Pool',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.CLAY]: 1 }],
      },
    ],
  },
  {
    id: 'ore_vein',
    name: 'Ore Vein',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.ORE]: 1 }],
      },
    ],
  },

  // Choice resources - 1 copy each
  {
    id: 'tree_farm',
    name: 'Tree Farm',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.WOOD]: 1 }, { [ResourceType.CLAY]: 1 }],
      },
    ],
  },
  {
    id: 'excavation',
    name: 'Excavation',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.STONE]: 1 }, { [ResourceType.CLAY]: 1 }],
      },
    ],
  },
  {
    id: 'clay_pit',
    name: 'Clay Pit',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.CLAY]: 1 }, { [ResourceType.ORE]: 1 }],
      },
    ],
  },
  {
    id: 'timber_yard',
    name: 'Timber Yard',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.STONE]: 1 }, { [ResourceType.WOOD]: 1 }],
      },
    ],
  },
  {
    id: 'forest_cave',
    name: 'Forest Cave',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 0, 4: 0, 5: 1, 6: 1, 7: 1 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.WOOD]: 1 }, { [ResourceType.ORE]: 1 }],
      },
    ],
  },
  {
    id: 'mine',
    name: 'Mine',
    type: CardType.BROWN,
    age: Age.I,
    copies: { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 },
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.ORE]: 1 }, { [ResourceType.STONE]: 1 }],
      },
    ],
  },

  // === MANUFACTURED GOODS (GREY CARDS) ===
  {
    id: 'loom',
    name: 'Loom',
    type: CardType.GREY,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.CLOTH]: 1 }],
      },
    ],
  },
  {
    id: 'glassworks',
    name: 'Glassworks',
    type: CardType.GREY,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.GLASS]: 1 }],
      },
    ],
  },
  {
    id: 'press',
    name: 'Press',
    type: CardType.GREY,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
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
    id: 'tavern',
    name: 'Tavern',
    type: CardType.YELLOW,
    age: Age.I,
    copies: { 3: 0, 4: 1, 5: 2, 6: 2, 7: 3 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'coins',
        amount: 5,
      },
    ],
  },
  {
    id: 'east_trading_post',
    name: 'East Trading Post',
    type: CardType.YELLOW,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'trading',
        resourceType: [
          ResourceType.CLAY,
          ResourceType.STONE,
          ResourceType.ORE,
          ResourceType.WOOD,
        ],
        neighbors: 'right',
        costReduction: 1,
      },
    ],
    chainTo: ['forum'],
  },
  {
    id: 'west_trading_post',
    name: 'West Trading Post',
    type: CardType.YELLOW,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'trading',
        resourceType: [
          ResourceType.CLAY,
          ResourceType.STONE,
          ResourceType.ORE,
          ResourceType.WOOD,
        ],
        neighbors: 'left',
        costReduction: 1,
      },
    ],
    chainTo: ['forum'],
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    type: CardType.YELLOW,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'trading',
        resourceType: [
          ResourceType.GLASS,
          ResourceType.CLOTH,
          ResourceType.PAPYRUS,
        ],
        neighbors: 'both',
        costReduction: 1,
      },
    ],
    chainTo: ['caravansery'],
  },

  // === MILITARY STRUCTURES (RED CARDS) ===
  {
    id: 'stockade',
    name: 'Stockade',
    type: CardType.RED,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.WOOD]: 1 },
    },
    effects: [
      {
        type: 'military',
        shields: 1,
      },
    ],
  },
  {
    id: 'barracks',
    name: 'Barracks',
    type: CardType.RED,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.ORE]: 1 },
    },
    effects: [
      {
        type: 'military',
        shields: 1,
      },
    ],
  },
  {
    id: 'guard_tower',
    name: 'Guard Tower',
    type: CardType.RED,
    age: Age.I,
    copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.CLAY]: 1 },
    },
    effects: [
      {
        type: 'military',
        shields: 1,
      },
    ],
  },

  // === SCIENTIFIC STRUCTURES (GREEN CARDS) ===
  {
    id: 'apothecary',
    name: 'Apothecary',
    type: CardType.GREEN,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.CLOTH]: 1 },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.COMPASS,
      },
    ],
    chainTo: ['stables', 'dispensary'],
  },
  {
    id: 'workshop',
    name: 'Workshop',
    type: CardType.GREEN,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.GLASS]: 1 },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.GEAR,
      },
    ],
    chainTo: ['archery_range', 'laboratory'],
  },
  {
    id: 'scriptorium',
    name: 'Scriptorium',
    type: CardType.GREEN,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.PAPYRUS]: 1 },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.TABLET,
      },
    ],
    chainTo: ['courthouse', 'library'],
  },

  // === CIVIC STRUCTURES (BLUE CARDS) ===
  {
    id: 'pawnshop',
    name: 'Pawnshop',
    type: CardType.BLUE,
    age: Age.I,
    copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'victory_points',
        amount: 3,
      },
    ],
  },
  {
    id: 'baths',
    name: 'Baths',
    type: CardType.BLUE,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: {
      type: 'resource',
      resources: { [ResourceType.STONE]: 1 },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 3,
      },
    ],
    chainTo: ['aqueduct'],
  },
  {
    id: 'altar',
    name: 'Altar',
    type: CardType.BLUE,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'victory_points',
        amount: 2,
      },
    ],
    chainTo: ['temple'],
  },
  {
    id: 'theatre',
    name: 'Theatre',
    type: CardType.BLUE,
    age: Age.I,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
    cost: { type: 'free' },
    effects: [
      {
        type: 'victory_points',
        amount: 2,
      },
    ],
    chainTo: ['statue'],
  },
];

// Validation function
export function validateAge1Distribution(): boolean {
  const playerCounts: Array<3 | 4 | 5 | 6 | 7> = [3, 4, 5, 6, 7];

  for (const pc of playerCounts) {
    const totalCards = age1Templates.reduce(
      (sum, template) => sum + template.copies[pc],
      0
    );
    const expectedCards = pc * 7;

    if (totalCards !== expectedCards) {
      console.error(
        `Age I: ${pc} players has ${totalCards} cards, expected ${expectedCards}`
      );
      return false;
    }
  }

  return true;
}
