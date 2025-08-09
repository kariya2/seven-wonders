import { Wonder } from './types';
import { ResourceType, ScienceSymbol } from '@seven-wonders/shared';

export const wonders: Wonder[] = [
  {
    id: 'alexandria',
    name: 'The Lighthouse of Alexandria',
    sideA: {
      startingResource: ResourceType.GLASS,
      stages: [
        {
          cost: { resources: { [ResourceType.STONE]: 2 } },
          effects: [],
          victoryPoints: 3,
        },
        {
          cost: { resources: { [ResourceType.ORE]: 2 } },
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
        },
        {
          cost: { resources: { [ResourceType.GLASS]: 2 } },
          effects: [],
          victoryPoints: 7,
        },
      ],
    },
    sideB: {
      startingResource: ResourceType.GLASS,
      stages: [
        {
          cost: { resources: { [ResourceType.CLAY]: 2 } },
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
        },
        {
          cost: { resources: { [ResourceType.WOOD]: 2 } },
          effects: [
            {
              type: 'resource_production',
              resources: [
                { [ResourceType.GLASS]: 1 },
                { [ResourceType.CLOTH]: 1 },
                { [ResourceType.PAPYRUS]: 1 },
              ],
            },
          ],
        },
        {
          cost: { resources: { [ResourceType.STONE]: 3 } },
          effects: [],
          victoryPoints: 7,
        },
      ],
    },
  },
  {
    id: 'babylon',
    name: 'The Hanging Gardens of Babylon',
    sideA: {
      startingResource: ResourceType.CLAY,
      stages: [
        {
          cost: { resources: { [ResourceType.CLAY]: 2 } },
          effects: [],
          victoryPoints: 3,
        },
        {
          cost: { resources: { [ResourceType.WOOD]: 3 } },
          effects: [
            {
              type: 'science',
              symbol: ScienceSymbol.TABLET,
            },
          ],
        },
        {
          cost: { resources: { [ResourceType.CLAY]: 4 } },
          effects: [],
          victoryPoints: 7,
        },
      ],
    },
    sideB: {
      startingResource: ResourceType.CLAY,
      stages: [
        {
          cost: {
            resources: { [ResourceType.CLOTH]: 1, [ResourceType.CLAY]: 1 },
          },
          effects: [],
          victoryPoints: 3,
        },
        {
          cost: {
            resources: { [ResourceType.WOOD]: 2, [ResourceType.GLASS]: 1 },
          },
          effects: [
            {
              type: 'play_seventh_card',
              description:
                'Play the 7th card instead of discarding it at the end of ages',
            },
          ],
        },
        {
          cost: {
            resources: { [ResourceType.CLAY]: 3, [ResourceType.PAPYRUS]: 1 },
          },
          effects: [
            {
              type: 'science_choice',
              description: 'Gain any science symbol',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'ephesus',
    name: 'The Temple of Artemis at Ephesus',
    sideA: {
      startingResource: ResourceType.PAPYRUS,
      stages: [
        {
          cost: { resources: { [ResourceType.STONE]: 2 } },
          effects: [],
          victoryPoints: 3,
        },
        {
          cost: { resources: { [ResourceType.WOOD]: 2 } },
          effects: [
            {
              type: 'coins',
              amount: 9,
            },
          ],
        },
        {
          cost: { resources: { [ResourceType.PAPYRUS]: 2 } },
          effects: [],
          victoryPoints: 7,
        },
      ],
    },
    sideB: {
      startingResource: ResourceType.PAPYRUS,
      stages: [
        {
          cost: { resources: { [ResourceType.STONE]: 2 } },
          effects: [
            {
              type: 'coins',
              amount: 4,
            },
          ],
          victoryPoints: 2,
        },
        {
          cost: { resources: { [ResourceType.WOOD]: 2 } },
          effects: [
            {
              type: 'coins',
              amount: 4,
            },
          ],
          victoryPoints: 3,
        },
        {
          cost: {
            resources: {
              [ResourceType.PAPYRUS]: 1,
              [ResourceType.CLOTH]: 1,
              [ResourceType.GLASS]: 1,
            },
          },
          effects: [
            {
              type: 'coins',
              amount: 4,
            },
          ],
          victoryPoints: 5,
        },
      ],
    },
  },
  {
    id: 'giza',
    name: 'The Pyramids of Giza',
    sideA: {
      startingResource: ResourceType.STONE,
      stages: [
        {
          cost: { resources: { [ResourceType.STONE]: 2 } },
          effects: [],
          victoryPoints: 3,
        },
        {
          cost: { resources: { [ResourceType.WOOD]: 3 } },
          effects: [],
          victoryPoints: 5,
        },
        {
          cost: { resources: { [ResourceType.STONE]: 4 } },
          effects: [],
          victoryPoints: 7,
        },
      ],
    },
    sideB: {
      startingResource: ResourceType.STONE,
      stages: [
        {
          cost: { resources: { [ResourceType.WOOD]: 2 } },
          effects: [],
          victoryPoints: 3,
        },
        {
          cost: { resources: { [ResourceType.STONE]: 3 } },
          effects: [],
          victoryPoints: 5,
        },
        {
          cost: { resources: { [ResourceType.CLAY]: 3 } },
          effects: [],
          victoryPoints: 5,
        },
        {
          cost: {
            resources: { [ResourceType.STONE]: 4, [ResourceType.PAPYRUS]: 1 },
          },
          effects: [],
          victoryPoints: 7,
        },
      ],
    },
  },
  {
    id: 'halicarnassus',
    name: 'The Mausoleum of Halicarnassus',
    sideA: {
      startingResource: ResourceType.CLOTH,
      stages: [
        {
          cost: { resources: { [ResourceType.CLAY]: 2 } },
          effects: [],
          victoryPoints: 3,
        },
        {
          cost: { resources: { [ResourceType.ORE]: 3 } },
          effects: [
            {
              type: 'free_build_from_discard',
              description:
                'Look through discard pile and build one card for free',
            },
          ],
        },
        {
          cost: { resources: { [ResourceType.CLOTH]: 2 } },
          effects: [],
          victoryPoints: 7,
        },
      ],
    },
    sideB: {
      startingResource: ResourceType.CLOTH,
      stages: [
        {
          cost: { resources: { [ResourceType.ORE]: 2 } },
          effects: [
            {
              type: 'free_build_from_discard',
              description:
                'Look through discard pile and build one card for free',
            },
          ],
          victoryPoints: 2,
        },
        {
          cost: { resources: { [ResourceType.CLAY]: 3 } },
          effects: [
            {
              type: 'free_build_from_discard',
              description:
                'Look through discard pile and build one card for free',
            },
          ],
          victoryPoints: 1,
        },
        {
          cost: {
            resources: {
              [ResourceType.GLASS]: 1,
              [ResourceType.PAPYRUS]: 1,
              [ResourceType.CLOTH]: 1,
            },
          },
          effects: [
            {
              type: 'free_build_from_discard',
              description:
                'Look through discard pile and build one card for free',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'olympia',
    name: 'The Statue of Zeus at Olympia',
    sideA: {
      startingResource: ResourceType.WOOD,
      stages: [
        {
          cost: { resources: { [ResourceType.WOOD]: 2 } },
          effects: [],
          victoryPoints: 3,
        },
        {
          cost: { resources: { [ResourceType.STONE]: 2 } },
          effects: [
            {
              type: 'free_build_once_per_age',
              description: 'Once per age, build a structure for free',
            },
          ],
        },
        {
          cost: { resources: { [ResourceType.ORE]: 2 } },
          effects: [],
          victoryPoints: 7,
        },
      ],
    },
    sideB: {
      startingResource: ResourceType.WOOD,
      stages: [
        {
          cost: { resources: { [ResourceType.WOOD]: 2 } },
          effects: [
            {
              type: 'trading',
              resourceType: [
                ResourceType.WOOD,
                ResourceType.STONE,
                ResourceType.ORE,
                ResourceType.CLAY,
              ],
              neighbors: 'both',
              costReduction: 1,
            },
          ],
        },
        {
          cost: { resources: { [ResourceType.STONE]: 2 } },
          effects: [],
          victoryPoints: 5,
        },
        {
          cost: {
            resources: { [ResourceType.ORE]: 2, [ResourceType.CLOTH]: 1 },
          },
          effects: [
            {
              type: 'copy_guild',
              description: 'Copy one Guild card from a neighbor',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'rhodes',
    name: 'The Colossus of Rhodes',
    sideA: {
      startingResource: ResourceType.ORE,
      stages: [
        {
          cost: { resources: { [ResourceType.WOOD]: 2 } },
          effects: [],
          victoryPoints: 3,
        },
        {
          cost: { resources: { [ResourceType.CLAY]: 3 } },
          effects: [
            {
              type: 'military',
              shields: 2,
            },
          ],
        },
        {
          cost: { resources: { [ResourceType.ORE]: 4 } },
          effects: [],
          victoryPoints: 7,
        },
      ],
    },
    sideB: {
      startingResource: ResourceType.ORE,
      stages: [
        {
          cost: { resources: { [ResourceType.STONE]: 3 } },
          effects: [
            {
              type: 'military',
              shields: 1,
            },
            {
              type: 'coins',
              amount: 3,
            },
          ],
          victoryPoints: 3,
        },
        {
          cost: { resources: { [ResourceType.ORE]: 4 } },
          effects: [
            {
              type: 'military',
              shields: 1,
            },
            {
              type: 'coins',
              amount: 4,
            },
          ],
          victoryPoints: 4,
        },
      ],
    },
  },
];

export function getWonderById(id: string): Wonder | undefined {
  return wonders.find((w) => w.id === id);
}
