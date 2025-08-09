import { GameState, PlayerState } from './types';
import { GameAction } from '../actions/types';
import {
  CardInstance,
  cardService,
  Age,
  ScienceSymbol,
} from '@seven-wonders/shared';
import {
  validateCardPayment,
  validateWonderPayment,
} from '../payment/validator';
import { getWonderById } from '../wonders/wonderData';

/**
 * Main game reducer
 */
export function gameReducer(
  state: GameState,
  action: GameAction,
  cardInstances: Map<string, CardInstance>
): GameState {
  switch (action.type) {
    case 'INIT_GAME':
      return initGame(action.playerIds, action.wonderAssignments);

    case 'PLAY_CARD':
      return playCard(
        state,
        action.playerId,
        action.cardInstanceId,
        action.payment,
        cardInstances
      );

    case 'DISCARD_CARD':
      return discardCard(state, action.playerId, action.cardInstanceId);

    case 'BUILD_WONDER':
      return buildWonder(
        state,
        action.playerId,
        action.cardInstanceId,
        action.stageIndex,
        action.payment,
        cardInstances
      );

    case 'PASS_CARDS':
      return passCards(state);

    case 'RESOLVE_MILITARY':
      return resolveMilitary(state);

    case 'NEXT_AGE':
      return nextAge(state);

    default:
      return state;
  }
}

/**
 * Initialize a new game
 */
function initGame(
  playerIds: string[],
  wonderAssignments: Record<string, { wonderId: string; side: 'A' | 'B' }>
): GameState {
  const players: PlayerState[] = playerIds.map((id) => ({
    id,
    wonderId: wonderAssignments[id].wonderId,
    wonderSide: wonderAssignments[id].side,
    hand: [],
    tableau: [],
    coins: 3, // Starting coins
    militaryShields: 0,
    victoryTokens: 0,
    defeatTokens: 0,
    science: {
      [ScienceSymbol.TABLET]: 0,
      [ScienceSymbol.COMPASS]: 0,
      [ScienceSymbol.GEAR]: 0,
    },
    wonderStages: 0,
    leftTradeCost: { raw: 2, manufactured: 2 },
    rightTradeCost: { raw: 2, manufactured: 2 },
  }));

  return {
    id: crypto.randomUUID(),
    players,
    age: Age.I,
    turn: 1,
    currentDeck: [],
    discardPile: [],
    direction: 'clockwise',
    version: 1,
    phase: 'setup',
  };
}

/**
 * Play a card from hand to tableau
 */
function playCard(
  state: GameState,
  playerId: string,
  cardInstanceId: string,
  payment: any,
  cardInstances: Map<string, CardInstance>
): GameState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return state;

  // Verify card is in hand
  if (!player.hand.includes(cardInstanceId)) {
    return state;
  }

  // Get card template
  const cardInstance = cardInstances.get(cardInstanceId);
  if (!cardInstance) return state;

  const template = cardService.getCardTemplate(cardInstance.templateId);
  if (!template) return state;

  // Validate payment
  if (!validateCardPayment(player, template, payment, state, cardInstances)) {
    return state;
  }

  // Update state
  const newPlayers = state.players.map((p) => {
    if (p.id !== playerId) {
      // Pay neighbors for trading
      if (
        p ===
        state.players[
          (state.players.indexOf(player) - 1 + state.players.length) %
            state.players.length
        ]
      ) {
        return { ...p, coins: p.coins + payment.leftNeighborCoins };
      }
      if (
        p ===
        state.players[
          (state.players.indexOf(player) + 1) % state.players.length
        ]
      ) {
        return { ...p, coins: p.coins + payment.rightNeighborCoins };
      }
      return p;
    }

    // Update playing player
    const newHand = p.hand.filter((id) => id !== cardInstanceId);
    const newTableau = [...p.tableau, cardInstanceId];
    const newCoins = p.coins - payment.coins;

    // Apply immediate effects
    let updatedPlayer: PlayerState = {
      ...p,
      hand: newHand,
      tableau: newTableau,
      coins: newCoins,
    };

    // Apply card effects
    for (const effect of template.effects) {
      switch (effect.type) {
        case 'coins':
          updatedPlayer.coins += effect.amount || 0;
          break;
        case 'military':
          updatedPlayer.militaryShields += effect.shields || 0;
          break;
        case 'science':
          if (effect.symbol) {
            updatedPlayer.science[effect.symbol] =
              (updatedPlayer.science[effect.symbol] || 0) + 1;
          }
          break;
        case 'trading':
          // Update trade costs
          if (effect.neighbors === 'left' || effect.neighbors === 'both') {
            if (effect.resourceType?.includes('wood' as any)) {
              updatedPlayer.leftTradeCost.raw = Math.min(
                updatedPlayer.leftTradeCost.raw,
                effect.costReduction || 1
              );
            }
            if (effect.resourceType?.includes('glass' as any)) {
              updatedPlayer.leftTradeCost.manufactured = Math.min(
                updatedPlayer.leftTradeCost.manufactured,
                effect.costReduction || 1
              );
            }
          }
          if (effect.neighbors === 'right' || effect.neighbors === 'both') {
            if (effect.resourceType?.includes('wood' as any)) {
              updatedPlayer.rightTradeCost.raw = Math.min(
                updatedPlayer.rightTradeCost.raw,
                effect.costReduction || 1
              );
            }
            if (effect.resourceType?.includes('glass' as any)) {
              updatedPlayer.rightTradeCost.manufactured = Math.min(
                updatedPlayer.rightTradeCost.manufactured,
                effect.costReduction || 1
              );
            }
          }
          break;
      }
    }

    return updatedPlayer;
  });

  return {
    ...state,
    players: newPlayers,
    version: state.version + 1,
  };
}

/**
 * Discard a card for coins
 */
function discardCard(
  state: GameState,
  playerId: string,
  cardInstanceId: string
): GameState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return state;

  // Verify card is in hand
  if (!player.hand.includes(cardInstanceId)) {
    return state;
  }

  // Update state
  const newPlayers = state.players.map((p) => {
    if (p.id !== playerId) return p;

    return {
      ...p,
      hand: p.hand.filter((id) => id !== cardInstanceId),
      coins: p.coins + 3, // Discard gives 3 coins
    };
  });

  return {
    ...state,
    players: newPlayers,
    discardPile: [...state.discardPile, cardInstanceId],
    version: state.version + 1,
  };
}

/**
 * Build a wonder stage using a card
 */
function buildWonder(
  state: GameState,
  playerId: string,
  cardInstanceId: string,
  stageIndex: number,
  payment: any,
  cardInstances: Map<string, CardInstance>
): GameState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return state;

  // Verify card is in hand
  if (!player.hand.includes(cardInstanceId)) {
    return state;
  }

  // Validate wonder payment
  if (
    !validateWonderPayment(player, stageIndex, payment, state, cardInstances)
  ) {
    return state;
  }

  // Get wonder data
  const wonder = getWonderById(player.wonderId);
  if (!wonder) return state;

  const side = player.wonderSide === 'A' ? wonder.sideA : wonder.sideB;
  const stage = side.stages[stageIndex];

  // Update state
  const newPlayers = state.players.map((p) => {
    if (p.id !== playerId) {
      // Pay neighbors for trading
      if (
        p ===
        state.players[
          (state.players.indexOf(player) - 1 + state.players.length) %
            state.players.length
        ]
      ) {
        return { ...p, coins: p.coins + payment.leftNeighborCoins };
      }
      if (
        p ===
        state.players[
          (state.players.indexOf(player) + 1) % state.players.length
        ]
      ) {
        return { ...p, coins: p.coins + payment.rightNeighborCoins };
      }
      return p;
    }

    // Update playing player
    let updatedPlayer: PlayerState = {
      ...p,
      hand: p.hand.filter((id) => id !== cardInstanceId),
      coins: p.coins - payment.coins,
      wonderStages: p.wonderStages + 1,
    };

    // Apply wonder stage effects
    for (const effect of stage.effects) {
      switch (effect.type) {
        case 'coins':
          updatedPlayer.coins += effect.amount || 0;
          break;
        case 'military':
          updatedPlayer.militaryShields += effect.shields || 0;
          break;
        case 'science':
          if (effect.symbol) {
            updatedPlayer.science[effect.symbol] =
              (updatedPlayer.science[effect.symbol] || 0) + 1;
          }
          break;
      }
    }

    return updatedPlayer;
  });

  return {
    ...state,
    players: newPlayers,
    version: state.version + 1,
  };
}

/**
 * Pass cards to the next player
 */
function passCards(state: GameState): GameState {
  const direction = state.direction === 'clockwise' ? 1 : -1;
  const playerCount = state.players.length;

  const newHands = state.players.map((player, index) => {
    const sourceIndex = (index - direction + playerCount) % playerCount;
    return state.players[sourceIndex].hand;
  });

  const newPlayers = state.players.map((player, index) => ({
    ...player,
    hand: newHands[index],
  }));

  return {
    ...state,
    players: newPlayers,
    turn: state.turn + 1,
    version: state.version + 1,
  };
}

/**
 * Resolve military conflicts at end of age
 */
function resolveMilitary(state: GameState): GameState {
  const victoryPoints: Record<Age, number> = {
    [Age.I]: 1,
    [Age.II]: 3,
    [Age.III]: 5,
  };

  const points = victoryPoints[state.age];

  const newPlayers = state.players.map((player, index) => {
    const leftIndex = (index - 1 + state.players.length) % state.players.length;
    const rightIndex = (index + 1) % state.players.length;

    const leftNeighbor = state.players[leftIndex];
    const rightNeighbor = state.players[rightIndex];

    let victoryTokens = player.victoryTokens;
    let defeatTokens = player.defeatTokens;

    // Left conflict
    if (player.militaryShields > leftNeighbor.militaryShields) {
      victoryTokens += points;
    } else if (player.militaryShields < leftNeighbor.militaryShields) {
      defeatTokens += 1;
    }

    // Right conflict
    if (player.militaryShields > rightNeighbor.militaryShields) {
      victoryTokens += points;
    } else if (player.militaryShields < rightNeighbor.militaryShields) {
      defeatTokens += 1;
    }

    return {
      ...player,
      victoryTokens,
      defeatTokens,
    };
  });

  return {
    ...state,
    players: newPlayers,
    phase: 'military',
    version: state.version + 1,
  };
}

/**
 * Advance to the next age
 */
function nextAge(state: GameState): GameState {
  const nextAgeMap: Record<Age, Age | null> = {
    [Age.I]: Age.II,
    [Age.II]: Age.III,
    [Age.III]: null,
  };

  const next = nextAgeMap[state.age];
  if (!next) {
    return {
      ...state,
      phase: 'finished',
      version: state.version + 1,
    };
  }

  return {
    ...state,
    age: next,
    turn: 1,
    direction: next === Age.II ? 'counterclockwise' : 'clockwise',
    phase: 'playing',
    version: state.version + 1,
  };
}
