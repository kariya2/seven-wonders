import {
  CardTemplate,
  CardType,
  Age,
  ResourceType,
  ScienceSymbol,
} from '../../types';

// Guild cards are special Age III cards (purple)
// For each game, randomly select (number of players + 2) guild cards from this list
export const guildTemplates: CardTemplate[] = [
  {
    id: 'workers_guild',
    name: 'Workers Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 }, // Always 1 copy when selected
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
        type: 'victory_per_card_type',
        cardType: CardType.BROWN,
        pointsPerCard: 1,
        neighbors: 'all',
      },
    ],
  },
  {
    id: 'craftsmens_guild',
    name: 'Craftsmens Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.ORE]: 2,
        [ResourceType.STONE]: 2,
      },
    },
    effects: [
      {
        type: 'victory_per_card_type',
        cardType: CardType.GREY,
        pointsPerCard: 2,
        neighbors: 'all',
      },
    ],
  },
  {
    id: 'traders_guild',
    name: 'Traders Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
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
        type: 'victory_per_card_type',
        cardType: CardType.YELLOW,
        pointsPerCard: 1,
        neighbors: 'all',
      },
    ],
  },
  {
    id: 'philosophers_guild',
    name: 'Philosophers Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 3,
        [ResourceType.CLOTH]: 1,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card_type',
        cardType: CardType.GREEN,
        pointsPerCard: 1,
        neighbors: 'all',
      },
    ],
  },
  {
    id: 'spies_guild',
    name: 'Spies Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 3,
        [ResourceType.GLASS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_card_type',
        cardType: CardType.RED,
        pointsPerCard: 1,
        neighbors: 'all',
      },
    ],
  },
  {
    id: 'strategists_guild',
    name: 'Strategists Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
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
        type: 'victory_per_defeat',
        pointsPerDefeat: 1,
      },
    ],
  },
  {
    id: 'shipowners_guild',
    name: 'Shipowners Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
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
        type: 'victory_per_card_type',
        cardType: CardType.BROWN,
        pointsPerCard: 1,
        neighbors: 'self',
      },
      {
        type: 'victory_per_card_type',
        cardType: CardType.GREY,
        pointsPerCard: 1,
        neighbors: 'self',
      },
      {
        type: 'victory_per_card_type',
        cardType: CardType.PURPLE,
        pointsPerCard: 1,
        neighbors: 'self',
      },
    ],
  },
  {
    id: 'scientists_guild',
    name: 'Scientists Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
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
        type: 'science_choice',
        description: 'Choose one extra science symbol',
      },
    ],
  },
  {
    id: 'magistrates_guild',
    name: 'Magistrates Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
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
        type: 'victory_per_card_type',
        cardType: CardType.BLUE,
        pointsPerCard: 1,
        neighbors: 'all',
      },
    ],
  },
  {
    id: 'builders_guild',
    name: 'Builders Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
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
        type: 'victory_per_wonder_stage',
        pointsPerStage: 1,
        neighbors: 'all',
      },
    ],
  },
  {
    id: 'architects_guild',
    name: 'Architects Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 3,
        [ResourceType.GLASS]: 1,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_wonder_stage',
        pointsPerStage: 3,
        neighbors: 'self',
      },
    ],
  },
  {
    id: 'gamers_guild',
    name: 'Gamers Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 3,
        [ResourceType.ORE]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_defeat',
        pointsPerDefeat: 1,
      },
    ],
  },
  {
    id: 'diplomats_guild',
    name: 'Diplomats Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.STONE]: 1,
        [ResourceType.GLASS]: 1,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_wonder_stage',
        pointsPerStage: 1,
        neighbors: 'all',
      },
    ],
  },
  {
    id: 'courtesans_guild',
    name: 'Courtesans Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 2,
        [ResourceType.GLASS]: 1,
        [ResourceType.PAPYRUS]: 1,
      },
    },
    effects: [
      {
        type: 'copy_guild',
      },
    ],
  },
  {
    id: 'guild_of_shadows',
    name: 'Guild of Shadows',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.CLAY]: 2,
        [ResourceType.WOOD]: 2,
      },
    },
    effects: [
      {
        type: 'victory_per_card_type',
        cardType: CardType.BROWN, // Player chooses at game end
        neighbors: 'all',
        pointsPerCard: 1,
      },
    ],
  },
  {
    id: 'counterfeiters_guild',
    name: 'Counterfeiters Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 3,
      },
    },
    effects: [
      {
        type: 'victory_points',
        amount: 3,
      },
      {
        type: 'coins',
        amount: 9, // 1 coin per 3 VP at game end
      },
    ],
  },
  {
    id: 'mourners_guild',
    name: 'Mourners Guild',
    type: CardType.PURPLE,
    age: Age.III,
    copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
    cost: {
      type: 'resource',
      resources: {
        [ResourceType.WOOD]: 2,
        [ResourceType.GLASS]: 2,
        [ResourceType.CLOTH]: 1,
      },
    },
    effects: [
      {
        type: 'victory_per_victory_token',
        pointsPerToken: 1,
      },
    ],
  },
];

// Function to randomly select guild cards for a game
export function selectGuildsForGame(
  playerCount: 3 | 4 | 5 | 6 | 7
): CardTemplate[] {
  const guildsNeeded = playerCount + 2;
  const shuffled = [...guildTemplates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, guildsNeeded);
}
