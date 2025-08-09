import {
  GameState,
  PlayerState,
  GameAction,
  gameReducer,
  CardInstance,
  Age,
  buildDeck,
  dealCards,
  cardService,
  PlayerCount,
} from '../index';
import { turnManager } from './turnManager';
import { actionValidator } from './actionValidator';

/**
 * Main game engine that orchestrates all game logic
 * This is the primary entry point for the rules engine
 */
export class GameEngine {
  private cardInstances: Map<string, CardInstance>;

  constructor() {
    this.cardInstances = new Map<string, CardInstance>();
  }

  /**
   * Apply an action to the game state
   * This is the main function required by the ROADMAP
   */
  applyAction(state: GameState, action: GameAction): GameState {
    // Validate the action before applying
    const validationError = this.validateAction(state, action);
    if (validationError) {
      throw new Error(`Invalid action: ${validationError}`);
    }

    // Apply the action through the reducer
    let newState = gameReducer(state, action, this.cardInstances);

    // Handle automatic game flow after certain actions
    if (
      action.type === 'PLAY_CARD' ||
      action.type === 'DISCARD_CARD' ||
      action.type === 'BUILD_WONDER'
    ) {
      // Record the player action
      if ('playerId' in action) {
        turnManager.recordPlayerAction(action.playerId);
      }
      newState = this.handlePostTurnLogic(newState);
    }

    return newState;
  }

  /**
   * Initialize a new game with players and wonder assignments
   */
  initializeGame(
    playerIds: string[],
    wonderAssignments: Record<string, { wonderId: string; side: 'A' | 'B' }>
  ): GameState {
    // Create initial game state
    const initAction: GameAction = {
      type: 'INIT_GAME',
      playerIds,
      wonderAssignments,
    };

    let state = gameReducer({} as GameState, initAction, this.cardInstances);

    // Deal cards for Age I
    state = this.dealCardsForAge(state, Age.I);
    state.phase = 'playing';

    return state;
  }

  /**
   * Deal cards for a specific age
   */
  private dealCardsForAge(state: GameState, age: Age): GameState {
    const playerCount = state.players.length as PlayerCount;

    // Build deck for this age
    const deck = buildDeck(age, playerCount);

    // Store card instances
    deck.forEach((card) => {
      this.cardInstances.set(card.instanceId, card);
    });

    // Deal cards to players
    const hands = dealCards(deck, playerCount);

    // Update player hands
    const newPlayers = state.players.map((player, index) => ({
      ...player,
      hand: hands[index].map((card) => card.instanceId),
    }));

    return {
      ...state,
      players: newPlayers,
      age,
      turn: 1,
      currentDeck: deck.map((c) => c.instanceId),
    };
  }

  /**
   * Handle automatic game flow after a turn
   */
  private handlePostTurnLogic(state: GameState): GameState {
    // Check if all players have played this turn
    const allPlayersActed = turnManager.allPlayersActed(state);

    if (!allPlayersActed) {
      return state;
    }

    // Reset for next turn
    turnManager.resetTurn();

    // Check if this was the last turn of the age
    const isLastTurn = turnManager.isLastTurnOfAge(state);

    if (isLastTurn) {
      // Handle end of age
      return this.handleEndOfAge(state);
    } else {
      // Pass cards for next turn
      const passAction: GameAction = {
        type: 'PASS_CARDS',
        playerId: state.players[0].id, // Any player ID works for this action
      };
      return gameReducer(state, passAction, this.cardInstances);
    }
  }

  /**
   * Handle end of age logic
   */
  private handleEndOfAge(state: GameState): GameState {
    // Resolve military conflicts
    const militaryAction: GameAction = {
      type: 'RESOLVE_MILITARY',
      playerId: state.players[0].id,
    };
    state = gameReducer(state, militaryAction, this.cardInstances);

    // Check if game is over
    if (state.age === Age.III) {
      state.phase = 'finished';
      return state;
    }

    // Advance to next age
    const nextAgeAction: GameAction = {
      type: 'NEXT_AGE',
      playerId: state.players[0].id,
    };
    state = gameReducer(state, nextAgeAction, this.cardInstances);

    // Deal cards for the new age
    state = this.dealCardsForAge(state, state.age);

    return state;
  }

  /**
   * Validate if an action is legal in the current state
   */
  private validateAction(state: GameState, action: GameAction): string | null {
    const validation = actionValidator.validateAction(
      state,
      action,
      this.cardInstances
    );
    return validation.valid ? null : validation.error || 'Invalid action';
  }

  /**
   * Check if the game is over
   */
  isGameOver(state: GameState): boolean {
    return state.phase === 'finished';
  }

  /**
   * Get the current card instances map
   */
  getCardInstances(): Map<string, CardInstance> {
    return this.cardInstances;
  }

  /**
   * Reset the engine for a new game
   */
  reset(): void {
    this.cardInstances.clear();
  }
}

// Export singleton instance for convenience
export const gameEngine = new GameEngine();

// Export main applyAction function as required by ROADMAP
export function applyAction(state: GameState, action: GameAction): GameState {
  return gameEngine.applyAction(state, action);
}
