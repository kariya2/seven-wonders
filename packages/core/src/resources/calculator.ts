import { ResourceType, CardInstance, cardService } from '@seven-wonders/shared';
import { PlayerState, ResourcePool } from '../state/types';
import { getWonderById } from '../wonders/wonderData';

/**
 * Calculate all resources available to a player
 */
export function calculateResourcePool(
  player: PlayerState,
  cardInstances: Map<string, CardInstance>
): ResourcePool {
  const pool: ResourcePool = {
    fixed: {},
    choices: [],
  };

  // Add wonder's starting resource
  const wonder = getWonderById(player.wonderId);
  if (wonder) {
    const side = player.wonderSide === 'A' ? wonder.sideA : wonder.sideB;
    if (side.startingResource) {
      pool.fixed[side.startingResource] =
        (pool.fixed[side.startingResource] || 0) + 1;
    }
  }

  // Add resources from tableau cards
  for (const cardId of player.tableau) {
    const cardInstance = cardInstances.get(cardId);
    if (!cardInstance) continue;

    // Use effects directly from card instance or get from template
    const effects = cardInstance.effects || [];

    // If no effects on instance, try to get from template
    if (effects.length === 0) {
      const template = cardService.getCardTemplate(cardInstance.templateId);
      if (template) {
        effects.push(...template.effects);
      }
    }

    // Process resource effects
    for (const effect of effects) {
      if (effect.type === 'resource_production') {
        // Resources is an array of resource choices
        if (effect.resources) {
          for (const resourceChoice of effect.resources) {
            // If only one resource in the choice, it's a fixed resource
            const resourceTypes = Object.keys(resourceChoice) as ResourceType[];
            if (resourceTypes.length === 1) {
              const resource = resourceTypes[0];
              const amount = resourceChoice[resource] || 0;
              pool.fixed[resource] = (pool.fixed[resource] || 0) + amount;
            } else {
              // Multiple resources means it's a choice
              pool.choices.push(resourceChoice);
            }
          }
        }
      }
    }
  }

  // Add resources from wonder stages
  if (wonder) {
    const side = player.wonderSide === 'A' ? wonder.sideA : wonder.sideB;
    const builtStages = side.stages.slice(0, player.wonderStages);

    for (const stage of builtStages) {
      for (const effect of stage.effects) {
        if (effect.type === 'resource_production') {
          // Resources is an array of resource choices
          if (effect.resources) {
            for (const resourceChoice of effect.resources) {
              // If only one resource in the choice, it's a fixed resource
              const resourceTypes = Object.keys(
                resourceChoice
              ) as ResourceType[];
              if (resourceTypes.length === 1) {
                const resource = resourceTypes[0];
                const amount = resourceChoice[resource] || 0;
                pool.fixed[resource] = (pool.fixed[resource] || 0) + amount;
              } else {
                // Multiple resources means it's a choice
                pool.choices.push(resourceChoice);
              }
            }
          }
        }
      }
    }
  }

  return pool;
}

/**
 * Check if a resource pool can satisfy a resource requirement
 */
export function canSatisfyResourceRequirement(
  pool: ResourcePool,
  requirement: Partial<Record<ResourceType, number>>
): boolean {
  // Clone the requirement to track what we still need
  const needed = { ...requirement };

  // First, use fixed resources
  for (const [resource, amount] of Object.entries(pool.fixed)) {
    const resourceType = resource as ResourceType;
    if (needed[resourceType]) {
      const used = Math.min(needed[resourceType]!, amount);
      needed[resourceType]! -= used;
      if (needed[resourceType] === 0) {
        delete needed[resourceType];
      }
    }
  }

  // If all satisfied with fixed resources, we're done
  if (Object.keys(needed).length === 0) {
    return true;
  }

  // Try to satisfy remaining needs with choice resources
  return canSatisfyWithChoices(needed, pool.choices);
}

/**
 * Recursively check if choice resources can satisfy requirements
 */
function canSatisfyWithChoices(
  needed: Partial<Record<ResourceType, number>>,
  choices: Array<Partial<Record<ResourceType, number>>>
): boolean {
  // Base case: all needs satisfied
  if (Object.keys(needed).length === 0) {
    return true;
  }

  // Base case: no more choices available
  if (choices.length === 0) {
    return false;
  }

  // Try each option from the first choice
  const [firstChoice, ...remainingChoices] = choices;

  for (const [resource, amount] of Object.entries(firstChoice)) {
    const resourceType = resource as ResourceType;

    // Skip if we don't need this resource
    if (!needed[resourceType]) continue;

    // Try using this choice for this resource
    const newNeeded = { ...needed };
    const used = Math.min(newNeeded[resourceType]!, amount || 1);
    newNeeded[resourceType]! -= used;
    if (newNeeded[resourceType] === 0) {
      delete newNeeded[resourceType];
    }

    // Recursively check if we can satisfy the rest
    if (canSatisfyWithChoices(newNeeded, remainingChoices)) {
      return true;
    }
  }

  // Also try not using this choice at all
  return canSatisfyWithChoices(needed, remainingChoices);
}

/**
 * Calculate coins produced by a player's tableau
 */
export function calculateCoinProduction(
  player: PlayerState,
  cardInstances: Map<string, CardInstance>
): number {
  let coins = 0;

  for (const cardId of player.tableau) {
    const cardInstance = cardInstances.get(cardId);
    if (!cardInstance) continue;

    const template = cardService.getCardTemplate(cardInstance.templateId);
    if (!template) continue;

    for (const effect of template.effects) {
      if (effect.type === 'coins') {
        coins += effect.amount || 0;
      }
    }
  }

  return coins;
}
