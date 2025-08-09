import { describe, it, expect, beforeEach } from 'vitest';
import { validateCardPayment, validateWonderPayment } from '../validator';
import { GameState, PlayerState, Payment } from '../../state/types';
import {
  Age,
  CardInstance,
  CardTemplate,
  CardType,
  ResourceType,
  ScienceSymbol,
  buildDeck,
  cardService,
} from '@seven-wonders/shared';
import { GameEngine } from '../../engine/gameEngine';

describe('Payment Validation Integration Tests', () => {
  let gameState: GameState;
  let cardInstances: Map<string, CardInstance>;
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    engine.reset();

    // Initialize a 3-player game
    const playerIds = ['alice', 'bob', 'charlie'];
    const wonderAssignments = {
      alice: { wonderId: 'alexandria', side: 'A' as const },
      bob: { wonderId: 'babylon', side: 'A' as const },
      charlie: { wonderId: 'rhodes', side: 'A' as const },
    };

    gameState = engine.initializeGame(playerIds, wonderAssignments);
    cardInstances = engine.getCardInstances();
  });

  describe('Free cards', () => {
    it('should allow playing free cards without payment', () => {
      const player = gameState.players[0];
      const freeCard = Array.from(cardInstances.values()).find(
        (card) =>
          card.cost.type === 'free' && player.hand.includes(card.instanceId)
      );

      if (!freeCard) {
        throw new Error('No free card found in hand');
      }

      const template = cardService.getCardTemplate(freeCard.templateId);
      const payment: Payment = {
        coins: 0,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
      };

      const valid = validateCardPayment(
        player,
        template,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(true);
    });

    it('should reject free cards with unnecessary payment', () => {
      const player = gameState.players[0];
      const freeCard = Array.from(cardInstances.values()).find(
        (card) =>
          card.cost.type === 'free' && player.hand.includes(card.instanceId)
      );

      if (!freeCard) {
        throw new Error('No free card found in hand');
      }

      const template = cardService.getCardTemplate(freeCard.templateId);
      const payment: Payment = {
        coins: 1, // Unnecessary payment
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
      };

      const valid = validateCardPayment(
        player,
        template,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(false);
    });
  });

  describe('Coin cost cards', () => {
    it('should allow playing cards with exact coin payment', () => {
      const player = gameState.players[0];
      player.coins = 10; // Give player enough coins

      const coinCard = Array.from(cardInstances.values()).find(
        (card) =>
          card.cost.type === 'coin' && player.hand.includes(card.instanceId)
      );

      if (!coinCard) {
        // If no coin card in hand, skip this test
        return;
      }

      const template = cardService.getCardTemplate(coinCard.templateId);
      const coinCost = coinCard.cost.type === 'coin' ? coinCard.cost.amount : 0;

      const payment: Payment = {
        coins: coinCost,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
      };

      const valid = validateCardPayment(
        player,
        template,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(true);
    });

    it('should reject cards when player has insufficient coins', () => {
      const player = gameState.players[0];
      player.coins = 0; // No coins

      const coinCard = Array.from(cardInstances.values()).find(
        (card) =>
          card.cost.type === 'coin' &&
          card.cost.amount > 0 &&
          player.hand.includes(card.instanceId)
      );

      if (!coinCard) {
        return;
      }

      const template = cardService.getCardTemplate(coinCard.templateId);
      const coinCost = coinCard.cost.type === 'coin' ? coinCard.cost.amount : 0;

      const payment: Payment = {
        coins: coinCost,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
      };

      const valid = validateCardPayment(
        player,
        template,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(false);
    });
  });

  describe('Resource cost cards', () => {
    it('should allow playing cards when player has required resources', () => {
      const player = gameState.players[0];

      // Give player a lumber yard (produces wood)
      const lumberYard: CardInstance = {
        templateId: 'lumber_yard_test',
        instanceId: 'test_lumber_yard',
        name: 'Lumber Yard',
        type: CardType.BROWN,
        age: Age.I,
        cost: { type: 'free' },
        effects: [
          {
            type: 'resource_production',
            resources: [{ [ResourceType.WOOD]: 1 }],
          },
        ],
      };
      cardInstances.set('test_lumber_yard', lumberYard);
      player.tableau.push('test_lumber_yard');

      // Find a card that costs wood
      const woodCostCard = Array.from(cardInstances.values()).find(
        (card) =>
          card.cost.type === 'resource' &&
          card.cost.resources[ResourceType.WOOD] === 1 &&
          player.hand.includes(card.instanceId)
      );

      if (!woodCostCard) {
        return;
      }

      const template = cardService.getCardTemplate(woodCostCard.templateId);
      const payment: Payment = {
        coins: 0,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
        resources: { [ResourceType.WOOD]: 1 },
      };

      const valid = validateCardPayment(
        player,
        template,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(true);
    });

    it('should allow trading with neighbors for resources', () => {
      const alice = gameState.players[0];
      const bob = gameState.players[1]; // RIGHT neighbor (index 1 is to the right of index 0)

      // Give bob a lumber yard
      const lumberYard: CardInstance = {
        templateId: 'lumber_yard_bob',
        instanceId: 'bob_lumber_yard',
        name: 'Lumber Yard',
        type: CardType.BROWN,
        age: Age.I,
        cost: { type: 'free' },
        effects: [
          {
            type: 'resource_production',
            resources: [{ [ResourceType.WOOD]: 1 }],
          },
        ],
      };
      cardInstances.set('bob_lumber_yard', lumberYard);
      bob.tableau.push('bob_lumber_yard');

      // Alice has coins to trade
      alice.coins = 10;

      // Find a card that costs wood
      const woodCostCard = Array.from(cardInstances.values()).find(
        (card) =>
          card.cost.type === 'resource' &&
          card.cost.resources[ResourceType.WOOD] === 1 &&
          alice.hand.includes(card.instanceId)
      );

      if (!woodCostCard) {
        return;
      }

      const template = cardService.getCardTemplate(woodCostCard.templateId);

      // If template not found, use the card instance data directly as a template
      const cardTemplate =
        template ||
        ({
          id: woodCostCard.templateId,
          name: woodCostCard.name,
          type: woodCostCard.type,
          age: woodCostCard.age,
          cost: woodCostCard.cost,
          effects: woodCostCard.effects,
          copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
        } as CardTemplate);

      const payment: Payment = {
        coins: 2, // Pay for trading
        leftNeighborCoins: 0,
        rightNeighborCoins: 2, // Trade cost for raw material from right neighbor (Bob)
        resources: { [ResourceType.WOOD]: 1 },
      };

      const valid = validateCardPayment(
        alice,
        cardTemplate,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(true);
    });
  });

  describe('Chain building', () => {
    it('should allow free building with chain', () => {
      const player = gameState.players[0];

      // Find a scriptorium from the deck
      const scriptorium = Array.from(cardInstances.values()).find(
        (card) => card.name === 'Scriptorium'
      );

      if (scriptorium) {
        // Remove from someone's hand and add to tableau
        gameState.players.forEach((p) => {
          const idx = p.hand.indexOf(scriptorium.instanceId);
          if (idx >= 0) p.hand.splice(idx, 1);
        });
        player.tableau.push(scriptorium.instanceId);
      }

      // Find Library card (if it exists and costs resources/coins)
      const libraryCard = Array.from(cardInstances.values()).find(
        (card) =>
          card.templateId === 'library' && player.hand.includes(card.instanceId)
      );

      if (!libraryCard) {
        return;
      }

      const template = cardService.getCardTemplate(libraryCard.templateId);
      const payment: Payment = {
        coins: 0,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
        chain: 'test_scriptorium',
      };

      const valid = validateCardPayment(
        player,
        template,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(true);
    });

    it('should reject chain building without the chain card', () => {
      const player = gameState.players[0];

      // Try to use chain without having the base card
      const someCard = Array.from(cardInstances.values()).find(
        (card) =>
          card.cost.type !== 'free' && player.hand.includes(card.instanceId)
      );

      if (!someCard) {
        return;
      }

      const template = cardService.getCardTemplate(someCard.templateId);
      const payment: Payment = {
        coins: 0,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
        chain: 'nonexistent_card',
      };

      const valid = validateCardPayment(
        player,
        template,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(false);
    });
  });

  describe('Wonder stage building', () => {
    it('should validate wonder stage payments', () => {
      const player = gameState.players[0];
      player.coins = 10;
      player.wonderStages = 0; // Starting at stage 0

      // Test with actual wonder stage index (Alexandria's first stage)
      const stageIndex = 0;

      // Give player stone production
      const stonePit: CardInstance = {
        templateId: 'stone_pit_test',
        instanceId: 'test_stone_pit',
        name: 'Stone Pit',
        type: CardType.BROWN,
        age: Age.I,
        cost: { type: 'free' },
        effects: [
          {
            type: 'resource_production',
            resources: [{ [ResourceType.STONE]: 1 }],
          },
        ],
      };
      cardInstances.set('test_stone_pit', stonePit);
      player.tableau.push('test_stone_pit');

      const stonePit2: CardInstance = {
        templateId: 'stone_pit_test2',
        instanceId: 'test_stone_pit2',
        name: 'Stone Pit 2',
        type: CardType.BROWN,
        age: Age.I,
        cost: { type: 'free' },
        effects: [
          {
            type: 'resource_production',
            resources: [{ [ResourceType.STONE]: 1 }],
          },
        ],
      };
      cardInstances.set('test_stone_pit2', stonePit2);
      player.tableau.push('test_stone_pit2');

      const payment: Payment = {
        coins: 0,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
        resources: { [ResourceType.STONE]: 2 },
      };

      const valid = validateWonderPayment(
        player,
        stageIndex,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(true);
    });

    it('should reject wonder building with insufficient resources', () => {
      const player = gameState.players[0];
      player.wonderStages = 0; // Starting at stage 0

      const stageIndex = 0;

      // Player has no stone production (Alexandria needs 2 stone for stage 1)
      const payment: Payment = {
        coins: 0,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
        resources: { [ResourceType.STONE]: 2 },
      };

      const valid = validateWonderPayment(
        player,
        stageIndex,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(false);
    });
  });

  describe('Complex payment scenarios', () => {
    it('should handle multiple resource requirements', () => {
      const player = gameState.players[0];

      // Give player multiple resource productions
      const resources = [
        { id: 'wood1', resource: ResourceType.WOOD },
        { id: 'stone1', resource: ResourceType.STONE },
        { id: 'clay1', resource: ResourceType.CLAY },
      ];

      resources.forEach(({ id, resource }) => {
        const card: CardInstance = {
          templateId: id,
          instanceId: id,
          name: `${resource} Producer`,
          type: CardType.BROWN,
          age: Age.I,
          cost: { type: 'free' },
          effects: [
            {
              type: 'resource_production',
              resources: [{ [resource]: 1 }],
            },
          ],
        };
        cardInstances.set(id, card);
        player.tableau.push(id);
      });

      // Card that costs multiple resources
      const complexCard: CardTemplate = {
        id: 'complex_card',
        name: 'Complex Card',
        type: CardType.YELLOW,
        age: Age.II,
        cost: {
          type: 'resource',
          resources: {
            [ResourceType.WOOD]: 1,
            [ResourceType.STONE]: 1,
            [ResourceType.CLAY]: 1,
          },
        },
        effects: [],
        copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
      };

      const payment: Payment = {
        coins: 0,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
        resources: {
          [ResourceType.WOOD]: 1,
          [ResourceType.STONE]: 1,
          [ResourceType.CLAY]: 1,
        },
      };

      const valid = validateCardPayment(
        player,
        complexCard,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(true);
    });

    it('should handle choice resources correctly', () => {
      const player = gameState.players[0];

      // Give player a card with choice resource production
      const treeFarm: CardInstance = {
        templateId: 'tree_farm',
        instanceId: 'test_tree_farm',
        name: 'Tree Farm',
        type: CardType.BROWN,
        age: Age.I,
        cost: { type: 'coin', amount: 1 },
        effects: [
          {
            type: 'resource_production',
            resources: [
              { [ResourceType.WOOD]: 1, [ResourceType.CLAY]: 1 }, // Choice - can produce either
            ],
          },
        ],
      };
      cardInstances.set('test_tree_farm', treeFarm);
      player.tableau.push('test_tree_farm');

      // Card that costs wood
      const woodCard: CardTemplate = {
        id: 'wood_card',
        name: 'Wood Card',
        type: CardType.YELLOW,
        age: Age.I,
        cost: {
          type: 'resource',
          resources: { [ResourceType.WOOD]: 1 },
        },
        effects: [],
        copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
      };

      const payment: Payment = {
        coins: 0,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
        resources: { [ResourceType.WOOD]: 1 },
      };

      const valid = validateCardPayment(
        player,
        woodCard,
        payment,
        gameState,
        cardInstances
      );
      expect(valid).toBe(true);
    });
  });
});
