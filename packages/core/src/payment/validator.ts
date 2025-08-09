import {
  ResourceType,
  CardInstance,
  CardTemplate,
  cardService,
} from '@seven-wonders/shared';
import { PlayerState, Payment, GameState, ResourcePool } from '../state/types';
import { calculateResourcePool } from '../resources/calculator';
import { getWonderById } from '../wonders/wonderData';

/**
 * Validate if a payment is valid for playing a card
 */
export function validateCardPayment(
  player: PlayerState,
  card: CardTemplate,
  payment: Payment,
  gameState: GameState,
  cardInstances: Map<string, CardInstance>
): boolean {
  // Check if card is free (chain building)
  if (payment.chain) {
    return validateChainPayment(player, card, payment.chain, cardInstances);
  }

  // Check resource cost
  if (card.cost.type === 'resource') {
    if (
      !validateResourcePayment(
        player,
        card.cost.resources,
        payment,
        gameState,
        cardInstances
      )
    ) {
      return false;
    }
  }

  // Check coin cost
  const coinCost = card.cost.type === 'coin' ? card.cost.amount : 0;
  const totalCoinCost =
    coinCost + payment.leftNeighborCoins + payment.rightNeighborCoins;
  if (payment.coins !== totalCoinCost) {
    return false;
  }

  // Ensure player has enough coins
  if (payment.coins > player.coins) {
    return false;
  }

  return true;
}

/**
 * Validate chain payment (free building from previous card)
 */
function validateChainPayment(
  player: PlayerState,
  card: CardTemplate,
  chainCardId: string,
  cardInstances: Map<string, CardInstance>
): boolean {
  // Card must have chainFrom option
  if (!card.chainFrom || card.chainFrom.length === 0) {
    return false;
  }

  // Player must have one of the chain source cards in tableau
  const hasChainCard = player.tableau.some((cardId) => {
    const instance = cardInstances.get(cardId);
    if (!instance) return false;
    const template = cardService.getCardTemplate(instance.templateId);
    // Check if this card is in the chainFrom list
    return template && card.chainFrom!.includes(template.id);
  });

  return hasChainCard;
}

/**
 * Validate resource payment including trading
 */
function validateResourcePayment(
  player: PlayerState,
  required: Partial<Record<ResourceType, number>>,
  payment: Payment,
  gameState: GameState,
  cardInstances: Map<string, CardInstance>
): boolean {
  const pool = calculateResourcePool(player, cardInstances);

  // Clone requirements to track what needs to be traded
  const needsTrading = { ...required };

  // First, use own resources
  for (const [resource, amount] of Object.entries(pool.fixed)) {
    const resourceType = resource as ResourceType;
    if (needsTrading[resourceType]) {
      const used = Math.min(needsTrading[resourceType]!, amount);
      needsTrading[resourceType]! -= used;
      if (needsTrading[resourceType] === 0) {
        delete needsTrading[resourceType];
      }
    }
  }

  // Use choice resources optimally (simplified for now)
  // In a full implementation, we'd need to track which choices were used
  for (const choice of pool.choices) {
    for (const [resource, amount] of Object.entries(choice)) {
      const resourceType = resource as ResourceType;
      if (needsTrading[resourceType]) {
        const used = Math.min(needsTrading[resourceType]!, amount || 1);
        needsTrading[resourceType]! -= used;
        if (needsTrading[resourceType] === 0) {
          delete needsTrading[resourceType];
        }
        break; // Each choice can only be used once
      }
    }
  }

  // Validate trading for remaining resources
  if (Object.keys(needsTrading).length > 0) {
    return validateTrading(
      player,
      needsTrading,
      payment,
      gameState,
      cardInstances
    );
  }

  return true;
}

/**
 * Validate trading with neighbors
 */
function validateTrading(
  player: PlayerState,
  needed: Partial<Record<ResourceType, number>>,
  payment: Payment,
  gameState: GameState,
  cardInstances: Map<string, CardInstance>
): boolean {
  const playerIndex = gameState.players.findIndex((p) => p.id === player.id);
  if (playerIndex === -1) return false;

  const leftNeighbor =
    gameState.players[
      (playerIndex - 1 + gameState.players.length) % gameState.players.length
    ];
  const rightNeighbor =
    gameState.players[(playerIndex + 1) % gameState.players.length];

  const leftPool = calculateResourcePool(leftNeighbor, cardInstances);
  const rightPool = calculateResourcePool(rightNeighbor, cardInstances);

  let leftTradeCost = 0;
  let rightTradeCost = 0;

  // Try to satisfy needs with neighbor resources
  for (const [resource, amount] of Object.entries(needed)) {
    const resourceType = resource as ResourceType;
    const isRaw = [
      ResourceType.WOOD,
      ResourceType.STONE,
      ResourceType.ORE,
      ResourceType.CLAY,
    ].includes(resourceType);

    let remaining = amount;

    // Try left neighbor
    const leftAvailable = leftPool.fixed[resourceType] || 0;
    if (leftAvailable > 0 && remaining > 0) {
      const traded = Math.min(leftAvailable, remaining);
      const costPerResource = isRaw
        ? player.leftTradeCost.raw
        : player.leftTradeCost.manufactured;
      leftTradeCost += traded * costPerResource;
      remaining -= traded;
    }

    // Try right neighbor if still needed
    const rightAvailable = rightPool.fixed[resourceType] || 0;
    if (rightAvailable > 0 && remaining > 0) {
      const traded = Math.min(rightAvailable, remaining);
      const costPerResource = isRaw
        ? player.rightTradeCost.raw
        : player.rightTradeCost.manufactured;
      rightTradeCost += traded * costPerResource;
      remaining -= traded;
    }

    // If still can't satisfy, payment is invalid
    if (remaining > 0) {
      return false;
    }
  }

  // Verify payment matches calculated trade costs
  return (
    payment.leftNeighborCoins === leftTradeCost &&
    payment.rightNeighborCoins === rightTradeCost
  );
}

/**
 * Validate payment for building a wonder stage
 */
export function validateWonderPayment(
  player: PlayerState,
  stageIndex: number,
  payment: Payment,
  gameState: GameState,
  cardInstances: Map<string, CardInstance>
): boolean {
  // Get wonder and stage
  const wonder = gameState.players.find((p) => p.id === player.id)?.wonderId;
  if (!wonder) return false;

  const wonderData = getWonderById(wonder);
  if (!wonderData) return false;

  const side = player.wonderSide === 'A' ? wonderData.sideA : wonderData.sideB;
  if (stageIndex >= side.stages.length) return false;
  if (stageIndex !== player.wonderStages) return false; // Must build in order

  const stage = side.stages[stageIndex];

  // Validate resource payment
  if (stage.cost.resources) {
    if (
      !validateResourcePayment(
        player,
        stage.cost.resources,
        payment,
        gameState,
        cardInstances
      )
    ) {
      return false;
    }
  }

  // Validate coin payment (wonder stages typically don't have coin costs, just resource costs)
  const totalCoinCost = payment.leftNeighborCoins + payment.rightNeighborCoins;
  if (payment.coins !== totalCoinCost) {
    return false;
  }

  // Ensure player has enough coins
  if (payment.coins > player.coins) {
    return false;
  }

  return true;
}
