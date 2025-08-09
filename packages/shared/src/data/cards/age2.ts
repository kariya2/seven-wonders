import {
  Card,
  CardType,
  Age,
  ResourceType,
  ScienceSymbol,
} from '../../types/cards';

export const age2Cards: Card[] = [
  // Raw Materials (Brown Cards)
  {
    id: 'sawmill',
    name: 'Sawmill',
    type: CardType.BROWN,
    age: Age.II,
    minPlayers: 3,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.WOOD]: 2 }],
      },
    ],
  },
  {
    id: 'quarry',
    name: 'Quarry',
    type: CardType.BROWN,
    age: Age.II,
    minPlayers: 3,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.STONE]: 2 }],
      },
    ],
  },
  {
    id: 'brickyard',
    name: 'Brickyard',
    type: CardType.BROWN,
    age: Age.II,
    minPlayers: 3,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.CLAY]: 2 }],
      },
    ],
  },
  {
    id: 'foundry',
    name: 'Foundry',
    type: CardType.BROWN,
    age: Age.II,
    minPlayers: 3,
    cost: { type: 'coin', amount: 1 },
    effects: [
      {
        type: 'resource_production',
        resources: [{ [ResourceType.ORE]: 2 }],
      },
    ],
  },

  // Manufactured Goods (Grey Cards)
  {
    id: 'loom_2',
    name: 'Loom',
    type: CardType.GREY,
    age: Age.II,
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
    id: 'glassworks_2',
    name: 'Glassworks',
    type: CardType.GREY,
    age: Age.II,
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
    id: 'press_2',
    name: 'Press',
    type: CardType.GREY,
    age: Age.II,
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
    id: 'forum',
    name: 'Forum',
    type: CardType.YELLOW,
    age: Age.II,
    minPlayers: 3,
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
        ], // Choice of one manufactured good
      },
    ],
    chainTo: ['haven'],
  },
  {
    id: 'caravansery',
    name: 'Caravansery',
    type: CardType.YELLOW,
    age: Age.II,
    minPlayers: 3,
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
        ], // Choice of one raw material
      },
    ],
    chainTo: ['lighthouse'],
  },
  {
    id: 'vineyard',
    name: 'Vineyard',
    type: CardType.YELLOW,
    age: Age.II,
    minPlayers: 3,
    cost: { type: 'free' },
    effects: [
      {
        type: 'coin_per_card',
        cardType: CardType.BROWN,
        neighbors: 'all',
        amount: 1,
      },
    ],
  },
  {
    id: 'bazar',
    name: 'Bazar',
    type: CardType.YELLOW,
    age: Age.II,
    minPlayers: 4,
    cost: { type: 'free' },
    effects: [
      {
        type: 'coin_per_card',
        cardType: CardType.GREY,
        neighbors: 'all',
        amount: 2,
      },
    ],
  },

  // Military Buildings (Red Cards)
  {
    id: 'walls',
    name: 'Walls',
    type: CardType.RED,
    age: Age.II,
    minPlayers: 3,
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
    minPlayers: 4,
    cost: {
      type: 'resource',
      resources: { [ResourceType.ORE]: 2, [ResourceType.WOOD]: 1 },
    },
    effects: [
      {
        type: 'military',
        shields: 2,
      },
    ],
    chainTo: ['circus'],
  },
  {
    id: 'stables',
    name: 'Stables',
    type: CardType.RED,
    age: Age.II,
    minPlayers: 5,
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
  },
  {
    id: 'archery_range',
    name: 'Archery Range',
    type: CardType.RED,
    age: Age.II,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.WOOD]: 2, [ResourceType.ORE]: 1 },
    },
    effects: [
      {
        type: 'military',
        shields: 2,
      },
    ],
  },

  // Scientific Buildings (Green Cards)
  {
    id: 'dispensary',
    name: 'Dispensary',
    type: CardType.GREEN,
    age: Age.II,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.ORE]: 2, [ResourceType.GLASS]: 1 },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.COMPASS,
      },
    ],
    chainTo: ['lodge', 'arena'],
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    type: CardType.GREEN,
    age: Age.II,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.CLAY]: 2, [ResourceType.PAPYRUS]: 1 },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.GEAR,
      },
    ],
    chainTo: ['siege_workshop', 'observatory'],
  },
  {
    id: 'library',
    name: 'Library',
    type: CardType.GREEN,
    age: Age.II,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.STONE]: 2, [ResourceType.CLOTH]: 1 },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.TABLET,
      },
    ],
    chainTo: ['senate', 'university'],
  },
  {
    id: 'school',
    name: 'School',
    type: CardType.GREEN,
    age: Age.II,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.WOOD]: 1, [ResourceType.PAPYRUS]: 1 },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.TABLET,
      },
    ],
    chainTo: ['academy', 'study'],
  },

  // Civic Buildings (Blue Cards)
  {
    id: 'courthouse',
    name: 'Courthouse',
    type: CardType.BLUE,
    age: Age.II,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.CLAY]: 2, [ResourceType.CLOTH]: 1 },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 4,
      },
    ],
  },
  {
    id: 'statue',
    name: 'Statue',
    type: CardType.BLUE,
    age: Age.II,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.ORE]: 1, [ResourceType.WOOD]: 1 },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 4,
      },
    ],
    chainTo: ['gardens'],
  },
  {
    id: 'temple',
    name: 'Temple',
    type: CardType.BLUE,
    age: Age.II,
    minPlayers: 3,
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
    chainTo: ['pantheon'],
  },
  {
    id: 'aqueduct',
    name: 'Aqueduct',
    type: CardType.BLUE,
    age: Age.II,
    minPlayers: 3,
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
  },
];
