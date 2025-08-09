import {
  Card,
  CardType,
  Age,
  ResourceType,
  ScienceSymbol,
} from '../../types/cards';

export const age3Cards: Card[] = [
  // Commercial Buildings (Yellow Cards)
  {
    id: 'haven',
    name: 'Haven',
    type: CardType.YELLOW,
    age: Age.III,
    minPlayers: 3,
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
        neighbors: 'self',
        amount: 1,
      },
      {
        type: 'coins',
        amount: 1,
      },
    ],
  },
  {
    id: 'lighthouse',
    name: 'Lighthouse',
    type: CardType.YELLOW,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.STONE]: 1, [ResourceType.GLASS]: 1 },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.YELLOW,
        neighbors: 'self',
        amount: 1,
      },
      {
        type: 'coins',
        amount: 1,
      },
    ],
  },
  {
    id: 'chamber_of_commerce',
    name: 'Chamber of Commerce',
    type: CardType.YELLOW,
    age: Age.III,
    minPlayers: 4,
    cost: {
      type: 'resource',
      resources: { [ResourceType.CLAY]: 2, [ResourceType.PAPYRUS]: 1 },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.GREY,
        neighbors: 'self',
        amount: 2,
      },
      {
        type: 'coins',
        amount: 2,
      },
    ],
  },
  {
    id: 'arena',
    name: 'Arena',
    type: CardType.YELLOW,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.STONE]: 2, [ResourceType.ORE]: 1 },
    },
    effects: [
      {
        type: 'victory_per_wonder',
        neighbors: 'self',
        amount: 3,
      },
      {
        type: 'coins',
        amount: 3,
      },
    ],
  },

  // Military Buildings (Red Cards)
  {
    id: 'fortifications',
    name: 'Fortifications',
    type: CardType.RED,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.ORE]: 3, [ResourceType.STONE]: 1 },
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
    minPlayers: 4,
    cost: {
      type: 'resource',
      resources: { [ResourceType.STONE]: 3, [ResourceType.ORE]: 1 },
    },
    effects: [
      {
        type: 'military',
        shields: 3,
      },
    ],
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    type: CardType.RED,
    age: Age.III,
    minPlayers: 3,
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
    id: 'siege_workshop',
    name: 'Siege Workshop',
    type: CardType.RED,
    age: Age.III,
    minPlayers: 5,
    cost: {
      type: 'resource',
      resources: { [ResourceType.CLAY]: 3, [ResourceType.WOOD]: 1 },
    },
    effects: [
      {
        type: 'military',
        shields: 3,
      },
    ],
  },

  // Scientific Buildings (Green Cards)
  {
    id: 'lodge',
    name: 'Lodge',
    type: CardType.GREEN,
    age: Age.III,
    minPlayers: 3,
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
  },
  {
    id: 'observatory',
    name: 'Observatory',
    type: CardType.GREEN,
    age: Age.III,
    minPlayers: 3,
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
  },
  {
    id: 'university',
    name: 'University',
    type: CardType.GREEN,
    age: Age.III,
    minPlayers: 3,
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
  },
  {
    id: 'academy',
    name: 'Academy',
    type: CardType.GREEN,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.STONE]: 3, [ResourceType.GLASS]: 1 },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.COMPASS,
      },
    ],
  },
  {
    id: 'study',
    name: 'Study',
    type: CardType.GREEN,
    age: Age.III,
    minPlayers: 5,
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
  },

  // Civic Buildings (Blue Cards)
  {
    id: 'pantheon',
    name: 'Pantheon',
    type: CardType.BLUE,
    age: Age.III,
    minPlayers: 3,
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
  },
  {
    id: 'gardens',
    name: 'Gardens',
    type: CardType.BLUE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: { [ResourceType.CLAY]: 2, [ResourceType.WOOD]: 1 },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 5,
      },
    ],
  },
  {
    id: 'town_hall',
    name: 'Town Hall',
    type: CardType.BLUE,
    age: Age.III,
    minPlayers: 3,
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
    id: 'palace',
    name: 'Palace',
    type: CardType.BLUE,
    age: Age.III,
    minPlayers: 3,
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
  {
    id: 'senate',
    name: 'Senate',
    type: CardType.BLUE,
    age: Age.III,
    minPlayers: 5,
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
  },

  // Guilds (Purple Cards)
  {
    id: 'workers_guild',
    name: 'Workers Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.ORE]: 2,
        [ResourceType.CLAY]: 1,
        [ResourceType.STONE]: 1,
        [ResourceType.WOOD]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.BROWN,
        neighbors: 'neighbors',
        amount: 1,
      },
    ],
  },
  {
    id: 'craftsmens_guild',
    name: 'Craftsmens Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.ORE]: 2,
        [ResourceType.STONE]: 2,
      },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.GREY,
        neighbors: 'neighbors',
        amount: 2,
      },
    ],
  },
  {
    id: 'traders_guild',
    name: 'Traders Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.GLASS]: 1,
        [ResourceType.CLOTH]: 1,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.YELLOW,
        neighbors: 'neighbors',
        amount: 1,
      },
    ],
  },
  {
    id: 'philosophers_guild',
    name: 'Philosophers Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 3,
        [ResourceType.PAPYRUS]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.GREEN,
        neighbors: 'neighbors',
        amount: 1,
      },
    ],
  },
  {
    id: 'spies_guild',
    name: 'Spies Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 3,
        [ResourceType.GLASS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.RED,
        neighbors: 'neighbors',
        amount: 1,
      },
    ],
  },
  {
    id: 'strategists_guild',
    name: 'Strategists Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.ORE]: 2,
        [ResourceType.STONE]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 1, // Per military defeat token neighbors have
      },
    ],
  },
  {
    id: 'shipowners_guild',
    name: 'Shipowners Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 3,
        [ResourceType.GLASS]: 1,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 1, // Per brown, grey and purple card player has
      },
    ],
  },
  {
    id: 'scientists_guild',
    name: 'Scientists Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 2,
        [ResourceType.ORE]: 2,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'science',
        symbol: ScienceSymbol.COMPASS, // Player chooses one of any science symbol
      },
    ],
  },
  {
    id: 'magistrates_guild',
    name: 'Magistrates Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 3,
        [ResourceType.STONE]: 1,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card',
        cardType: CardType.BLUE,
        neighbors: 'neighbors',
        amount: 1,
      },
    ],
  },
  {
    id: 'builders_guild',
    name: 'Builders Guild',
    type: CardType.PURPLE,
    age: Age.III,
    minPlayers: 3,
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 2,
        [ResourceType.CLAY]: 2,
        [ResourceType.GLASS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_wonder',
        neighbors: 'all',
        amount: 1,
      },
    ],
  },
];
