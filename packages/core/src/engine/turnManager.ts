import { GameState, PlayerState } from '../state/types';
import { GameAction } from '../actions/types';
import { Age } from '@seven-wonders/shared';

/**
 * Manages turn flow and game phases
 */
export class TurnManager {
  /**
   * Track which players have acted this turn
   */
  private playersActedThisTurn: Set<string> = new Set();

  /**
   * Record that a player has acted this turn
   */
  recordPlayerAction(playerId: string): void {
    this.playersActedThisTurn.add(playerId);
  }

  /**
   * Check if all players have acted this turn
   */
  allPlayersActed(state: GameState): boolean {
    return this.playersActedThisTurn.size === state.players.length;
  }

  /**
   * Reset for a new turn
   */
  resetTurn(): void {
    this.playersActedThisTurn.clear();
  }

  /**
   * Get the number of turns in the current age
   */
  getTurnsInAge(state: GameState): number {
    // Check for special wonder abilities
    const hasPlaySeventhCard = this.checkPlaySeventhCardAbility(state);

    if (state.age === Age.III && hasPlaySeventhCard) {
      return 7;
    }

    // Standard: 6 turns per age (7th card is discarded in Ages I & II)
    return 6;
  }

  /**
   * Check if any player has the ability to play the 7th card
   */
  private checkPlaySeventhCardAbility(state: GameState): boolean {
    // This would check wonder stages for the play_seventh_card effect
    // For now, return false until we implement wonder effect checking
    return state.players.some((player) => {
      // TODO: Check player's wonder stages for play_seventh_card effect
      return false;
    });
  }

  /**
   * Determine if this is the last playable turn of the age
   */
  isLastTurnOfAge(state: GameState): boolean {
    const maxTurns = this.getTurnsInAge(state);
    return state.turn >= maxTurns;
  }

  /**
   * Check if this is the discard turn (last card in hand for Ages I & II)
   */
  isDiscardTurn(state: GameState): boolean {
    if (state.age === Age.III) {
      return false; // Age III doesn't have a discard turn
    }

    // In Ages I & II, the 7th card (when hand has 1 card left) is discarded
    // unless a wonder ability allows playing it
    const hasOneCardLeft = state.players[0].hand.length === 1;
    const hasPlaySeventhCard = this.checkPlaySeventhCardAbility(state);

    return hasOneCardLeft && !hasPlaySeventhCard;
  }

  /**
   * Get the direction cards are passed this age
   */
  getPassDirection(age: Age): 'clockwise' | 'counterclockwise' {
    // Age I: clockwise (left)
    // Age II: counterclockwise (right)
    // Age III: clockwise (left)
    return age === Age.II ? 'counterclockwise' : 'clockwise';
  }

  /**
   * Get valid actions for a player in the current state
   */
  getValidActions(state: GameState, playerId: string): GameAction[] {
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return [];

    const actions: GameAction[] = [];

    // Can't act if already acted this turn
    if (this.playersActedThisTurn.has(playerId)) {
      return [];
    }

    // Can't act if game is not in playing phase
    if (state.phase !== 'playing') {
      return [];
    }

    // If it's the forced discard turn, only allow discard
    if (this.isDiscardTurn(state)) {
      player.hand.forEach((cardId) => {
        actions.push({
          type: 'DISCARD_CARD',
          playerId,
          cardInstanceId: cardId,
        });
      });
      return actions;
    }

    // Otherwise, can play, discard, or build wonder with any card
    player.hand.forEach((cardId) => {
      // Play card (payment validation happens in reducer)
      actions.push({
        type: 'PLAY_CARD',
        playerId,
        cardInstanceId: cardId,
        payment: {
          coins: 0,
          leftNeighborCoins: 0,
          rightNeighborCoins: 0,
        },
      });

      // Discard for 3 coins
      actions.push({
        type: 'DISCARD_CARD',
        playerId,
        cardInstanceId: cardId,
      });

      // Build next wonder stage if available
      if (this.canBuildWonderStage(state, player)) {
        actions.push({
          type: 'BUILD_WONDER',
          playerId,
          cardInstanceId: cardId,
          stageIndex: player.wonderStages,
          payment: {
            coins: 0,
            leftNeighborCoins: 0,
            rightNeighborCoins: 0,
          },
        });
      }
    });

    return actions;
  }

  /**
   * Check if a player can build their next wonder stage
   */
  private canBuildWonderStage(state: GameState, player: PlayerState): boolean {
    // This is a simplified check - full validation happens in the reducer
    // Just check if there are more stages to build

    // TODO: Get wonder data and check max stages
    // For now, assume max 3 stages for side A, 4 for side B
    const maxStages = player.wonderSide === 'A' ? 3 : 4;
    return player.wonderStages < maxStages;
  }

  /**
   * Create a simultaneous action selection phase
   * All players select actions, then they're revealed and applied
   */
  createSimultaneousActions(
    state: GameState,
    playerActions: Map<string, GameAction>
  ): GameAction[] {
    // Validate all actions are from different players
    const playerIds = new Set(
      Array.from(playerActions.values()).map((a) =>
        'playerId' in a ? a.playerId : ''
      )
    );

    if (playerIds.size !== playerActions.size) {
      throw new Error('Duplicate player actions in simultaneous selection');
    }

    // Return actions in player order for consistent application
    return state.players
      .map((p) => playerActions.get(p.id))
      .filter((a): a is GameAction => a !== undefined);
  }
}

// Export singleton for convenience
export const turnManager = new TurnManager();
