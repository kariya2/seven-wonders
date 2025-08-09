import {
  Card,
  CardType,
  Age,
  ResourceType,
  ScienceSymbol,
} from '../../types/cards';

export const age1Cards: Card[] = [
  // Raw Materials (Brown Cards)
  {
    id: 'lumber_yard',
    name: 'Lumber Yard',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 3,
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.WOOD]: 1 }],
      },
    ],
  },
  {
    id: 'ore_vein',
    name: 'Ore Vein',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 3,
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.ORE]: 1 }],
      },
    ],
  },
  {
    id: 'clay_pool',
    name: 'Clay Pool',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 3,
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.CLAY]: 1 }],
      },
    ],
  },
  {
    id: 'stone_pit',
    name: 'Stone Pit',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 3,
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.STONE]: 1 }],
      },
    ],
  },
  {
    id: 'timber_yard',
    name: 'Timber Yard',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 3,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.STONE]: 1 }, { [ResourceType.WOOD]: 1 }], // Choice
      },
    ],
  },
  {
    id: 'clay_pit',
    name: 'Clay Pit',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 3,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.CLAY]: 1 }, { [ResourceType.ORE]: 1 }], // Choice
      },
    ],
  },
  {
    id: 'excavation',
    name: 'Excavation',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 4,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.STONE]: 1 }, { [ResourceType.CLAY]: 1 }], // Choice
      },
    ],
  },
  {
    id: 'forest_cave',
    name: 'Forest Cave',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 5,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.WOOD]: 1 }, { [ResourceType.ORE]: 1 }], // Choice
      },
    ],
  },
  {
    id: 'tree_farm',
    name: 'Tree Farm',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 6,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.WOOD]: 1 }, { [ResourceType.CLAY]: 1 }], // Choice
      },
    ],
  },
  {
    id: 'mine',
    name: 'Mine',
    type: CardType.BROWN,
    age: Age.I,
    minPlayers: 6,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.ORE]: 1 }, { [ResourceType.STONE]: 1 }], // Choice
      },
    ],
  },

  // Manufactured Goods (Grey Cards)
  {
    id: 'loom',
    name: 'Loom',
    type: CardType.GREY,
    age: Age.I,
    minPlayers: 3,
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
    minPlayers: 3,
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
    minPlayers: 3,
    cost: { type: 'free' },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.PAPYRUS]: 1 }],
      },
    ],
  },

  // Commercial Buildings (Yellow Cards)
  {
    id: 'east_trading_post',
    name: 'East Trading Post',
    type: CardType.YELLOW,
    age: Age.I,
    minPlayers: 3,
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
    minPlayers: 3,
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
    minPlayers: 3,
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
  {
    id: 'tavern',
    name: 'Tavern',
    type: CardType.YELLOW,
    age: Age.I,
    minPlayers: 4,
    cost: { type: 'free' },
    effects: [
      {
        type: 'coins',
        amount: 5,
      },
    ],
  },

  // Military Buildings (Red Cards)
  {
    id: 'stockade',
    name: 'Stockade',
    type: CardType.RED,
    age: Age.I,
    minPlayers: 3,
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
    minPlayers: 3,
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
    minPlayers: 4,
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

  // Scientific Buildings (Green Cards)
  {
    id: 'apothecary',
    name: 'Apothecary',
    type: CardType.GREEN,
    age: Age.I,
    minPlayers: 3,
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
    minPlayers: 3,
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
    minPlayers: 3,
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

  // Civic Buildings (Blue Cards)
  {
    id: 'altar',
    name: 'Altar',
    type: CardType.BLUE,
    age: Age.I,
    minPlayers: 3,
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
    minPlayers: 3,
    cost: { type: 'free' },
    effects: [
      {
        type: 'victory_points',
        amount: 2,
      },
    ],
    chainTo: ['statue'],
  },
  {
    id: 'baths',
    name: 'Baths',
    type: CardType.BLUE,
    age: Age.I,
    minPlayers: 3,
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
    id: 'pawnshop',
    name: 'Pawnshop',
    type: CardType.BLUE,
    age: Age.I,
    minPlayers: 4,
    cost: { type: 'free' },
    effects: [
      {
        type: 'victory_points',
        amount: 3,
      },
    ],
  },
];
