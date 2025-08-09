import { GameState, PlayerState, Payment } from '../state/types';
import { GameAction } from '../actions/types';
import { CardInstance, cardService } from '@seven-wonders/shared';
import {
  validateCardPayment,
  validateWonderPayment,
} from '../payment/validator';
import {
  calculateResourcePool,
  canSatisfyResourceRequirement,
} from '../resources/calculator';
import { getWonderById } from '../wonders/wonderData';

/**
 * Validates game actions for legality
 */
export class ActionValidator {
  /**
   * Validate any game action
   */
  validateAction(
    state: GameState,
    action: GameAction,
    cardInstances: Map<string, CardInstance>
  ): { valid: boolean; error?: string } {
    // System actions are always valid
    if (
      ['INIT_GAME', 'PASS_CARDS', 'RESOLVE_MILITARY', 'NEXT_AGE'].includes(
        action.type
      )
    ) {
      return { valid: true };
    }

    // Game must be in playing phase
    if (state.phase !== 'playing') {
      return {
        valid: false,
        error: `Cannot perform action: game is ${state.phase}`,
      };
    }

    // Validate player exists
    if (!('playerId' in action)) {
      return { valid: false, error: 'Action missing playerId' };
    }

    const player = state.players.find((p) => p.id === action.playerId);
    if (!player) {
      return {
        valid: false,
        error: `Player ${action.playerId} not found`,
      };
    }

    // Validate specific action types
    switch (action.type) {
      case 'PLAY_CARD':
        return this.validatePlayCard(state, player, action, cardInstances);

      case 'DISCARD_CARD':
        return this.validateDiscardCard(state, player, action);

      case 'BUILD_WONDER':
        return this.validateBuildWonder(state, player, action, cardInstances);

      default:
        return {
          valid: false,
          error: `Unknown action type: ${(action as any).type}`,
        };
    }
  }

  /**
   * Validate PLAY_CARD action
   */
  private validatePlayCard(
    state: GameState,
    player: PlayerState,
    action: Extract<GameAction, { type: 'PLAY_CARD' }>,
    cardInstances: Map<string, CardInstance>
  ): { valid: boolean; error?: string } {
    // Check card is in hand
    if (!player.hand.includes(action.cardInstanceId)) {
      return {
        valid: false,
        error: `Card ${action.cardInstanceId} not in hand`,
      };
    }

    // Get card instance and template
    const cardInstance = cardInstances.get(action.cardInstanceId);
    if (!cardInstance) {
      return {
        valid: false,
        error: `Card instance ${action.cardInstanceId} not found`,
      };
    }

    const template = cardService.getCardTemplate(cardInstance.templateId);
    if (!template) {
      return {
        valid: false,
        error: `Card template ${cardInstance.templateId} not found`,
      };
    }

    // Check if card is already in tableau (no duplicates)
    const alreadyPlayed = player.tableau.some((cardId) => {
      const instance = cardInstances.get(cardId);
      return instance && instance.templateId === cardInstance.templateId;
    });

    if (alreadyPlayed) {
      return {
        valid: false,
        error: `Card ${template.name} already played`,
      };
    }

    // Validate payment
    if (
      !validateCardPayment(
        player,
        template,
        action.payment,
        state,
        cardInstances
      )
    ) {
      return {
        valid: false,
        error: `Invalid payment for ${template.name}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate DISCARD_CARD action
   */
  private validateDiscardCard(
    state: GameState,
    player: PlayerState,
    action: Extract<GameAction, { type: 'DISCARD_CARD' }>
  ): { valid: boolean; error?: string } {
    // Check card is in hand
    if (!player.hand.includes(action.cardInstanceId)) {
      return {
        valid: false,
        error: `Card ${action.cardInstanceId} not in hand`,
      };
    }

    // Discarding is always allowed if card is in hand
    return { valid: true };
  }

  /**
   * Validate BUILD_WONDER action
   */
  private validateBuildWonder(
    state: GameState,
    player: PlayerState,
    action: Extract<GameAction, { type: 'BUILD_WONDER' }>,
    cardInstances: Map<string, CardInstance>
  ): { valid: boolean; error?: string } {
    // Check card is in hand
    if (!player.hand.includes(action.cardInstanceId)) {
      return {
        valid: false,
        error: `Card ${action.cardInstanceId} not in hand`,
      };
    }

    // Check wonder data
    const wonder = getWonderById(player.wonderId);
    if (!wonder) {
      return {
        valid: false,
        error: `Wonder ${player.wonderId} not found`,
      };
    }

    const side = player.wonderSide === 'A' ? wonder.sideA : wonder.sideB;

    // Check stage index is valid
    if (action.stageIndex < 0 || action.stageIndex >= side.stages.length) {
      return {
        valid: false,
        error: `Invalid stage index ${action.stageIndex}`,
      };
    }

    // Check stages are built in order
    if (action.stageIndex !== player.wonderStages) {
      return {
        valid: false,
        error: `Must build stage ${player.wonderStages} next`,
      };
    }

    // Validate payment for wonder stage
    if (
      !validateWonderPayment(
        player,
        action.stageIndex,
        action.payment,
        state,
        cardInstances
      )
    ) {
      return {
        valid: false,
        error: `Invalid payment for wonder stage ${action.stageIndex + 1}`,
      };
    }

    return { valid: true };
  }

  /**
   * Get all legal actions for a player
   */
  getLegalActions(
    state: GameState,
    playerId: string,
    cardInstances: Map<string, CardInstance>
  ): GameAction[] {
    const player = state.players.find((p) => p.id === playerId);
    if (!player || state.phase !== 'playing') {
      return [];
    }

    const legalActions: GameAction[] = [];

    // For each card in hand
    player.hand.forEach((cardInstanceId) => {
      // Always can discard
      legalActions.push({
        type: 'DISCARD_CARD',
        playerId,
        cardInstanceId,
      });

      // Try to play the card with various payment options
      const cardInstance = cardInstances.get(cardInstanceId);
      if (cardInstance) {
        const template = cardService.getCardTemplate(cardInstance.templateId);
        if (template) {
          // Generate possible payments for this card
          const possiblePayments = this.generatePossiblePayments(
            state,
            player,
            template,
            cardInstances
          );

          possiblePayments.forEach((payment) => {
            const action: GameAction = {
              type: 'PLAY_CARD',
              playerId,
              cardInstanceId,
              payment,
            };

            if (
              this.validatePlayCard(state, player, action as any, cardInstances)
                .valid
            ) {
              legalActions.push(action);
            }
          });
        }
      }

      // Try to build wonder if possible
      if (player.wonderStages < this.getMaxWonderStages(player)) {
        const wonder = getWonderById(player.wonderId);
        if (wonder) {
          const side = player.wonderSide === 'A' ? wonder.sideA : wonder.sideB;
          const nextStage = side.stages[player.wonderStages];

          if (nextStage) {
            // Generate possible payments for wonder stage
            const possiblePayments = this.generateWonderPayments(
              state,
              player,
              player.wonderStages,
              cardInstances
            );

            possiblePayments.forEach((payment) => {
              const action: GameAction = {
                type: 'BUILD_WONDER',
                playerId,
                cardInstanceId,
                stageIndex: player.wonderStages,
                payment,
              };

              if (
                this.validateBuildWonder(
                  state,
                  player,
                  action as any,
                  cardInstances
                ).valid
              ) {
                legalActions.push(action);
              }
            });
          }
        }
      }
    });

    return legalActions;
  }

  /**
   * Generate possible payment options for a card
   */
  private generatePossiblePayments(
    state: GameState,
    player: PlayerState,
    template: any,
    cardInstances: Map<string, CardInstance>
  ): Payment[] {
    const payments: Payment[] = [];

    // Free via chain
    if (template.chainFrom && template.chainFrom.length > 0) {
      const hasChainCard = player.tableau.some((cardId) => {
        const instance = cardInstances.get(cardId);
        if (!instance) return false;
        const cardTemplate = cardService.getCardTemplate(instance.templateId);
        return cardTemplate && template.chainFrom.includes(cardTemplate.id);
      });

      if (hasChainCard) {
        payments.push({
          coins: 0,
          leftNeighborCoins: 0,
          rightNeighborCoins: 0,
          chain: template.chainFrom[0],
        });
      }
    }

    // Free cost
    if (template.cost.type === 'free') {
      payments.push({
        coins: 0,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
      });
    }

    // Coin cost
    if (template.cost.type === 'coin') {
      if (player.coins >= template.cost.amount) {
        payments.push({
          coins: template.cost.amount,
          leftNeighborCoins: 0,
          rightNeighborCoins: 0,
        });
      }
    }

    // Resource cost - simplified for now
    if (template.cost.type === 'resource') {
      // Just try paying with own resources
      const pool = calculateResourcePool(player, cardInstances);
      if (canSatisfyResourceRequirement(pool, template.cost.resources)) {
        payments.push({
          coins: 0,
          leftNeighborCoins: 0,
          rightNeighborCoins: 0,
        });
      }

      // TODO: Generate trading payment options
    }

    return payments;
  }

  /**
   * Generate possible payment options for a wonder stage
   */
  private generateWonderPayments(
    state: GameState,
    player: PlayerState,
    stageIndex: number,
    cardInstances: Map<string, CardInstance>
  ): Payment[] {
    const payments: Payment[] = [];

    const wonder = getWonderById(player.wonderId);
    if (!wonder) return payments;

    const side = player.wonderSide === 'A' ? wonder.sideA : wonder.sideB;
    const stage = side.stages[stageIndex];
    if (!stage) return payments;

    // Check coin cost
    const coinCost = stage.cost.coins || 0;

    // Check resource cost
    if (stage.cost.resources) {
      const pool = calculateResourcePool(player, cardInstances);
      if (canSatisfyResourceRequirement(pool, stage.cost.resources)) {
        if (player.coins >= coinCost) {
          payments.push({
            coins: coinCost,
            leftNeighborCoins: 0,
            rightNeighborCoins: 0,
          });
        }
      }

      // TODO: Generate trading payment options
    } else if (player.coins >= coinCost) {
      // Just coin cost
      payments.push({
        coins: coinCost,
        leftNeighborCoins: 0,
        rightNeighborCoins: 0,
      });
    }

    return payments;
  }

  /**
   * Get maximum wonder stages for a player
   */
  private getMaxWonderStages(player: PlayerState): number {
    const wonder = getWonderById(player.wonderId);
    if (!wonder) return 0;

    const side = player.wonderSide === 'A' ? wonder.sideA : wonder.sideB;
    return side.stages.length;
  }
}

// Export singleton
export const actionValidator = new ActionValidator();
