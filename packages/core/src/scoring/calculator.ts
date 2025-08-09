import {
  CardInstance,
  CardType,
  cardService,
  ScienceSymbol,
} from '@seven-wonders/shared';
import { GameState, PlayerState, ScoreBreakdown } from '../state/types';
import { getWonderById } from '../wonders/wonderData';

/**
 * Calculate final scores for all players
 */
export function calculateScores(
  gameState: GameState,
  cardInstances: Map<string, CardInstance>
): Record<string, ScoreBreakdown> {
  const scores: Record<string, ScoreBreakdown> = {};

  for (const player of gameState.players) {
    scores[player.id] = calculatePlayerScore(player, gameState, cardInstances);
  }

  return scores;
}

/**
 * Calculate score for a single player
 */
function calculatePlayerScore(
  player: PlayerState,
  gameState: GameState,
  cardInstances: Map<string, CardInstance>
): ScoreBreakdown {
  const military = calculateMilitaryScore(player);
  const coins = calculateCoinScore(player);
  const wonder = calculateWonderScore(player);
  const civic = calculateCivicScore(player, cardInstances);
  const commercial = calculateCommercialScore(player, cardInstances);
  const guilds = calculateGuildScore(player, gameState, cardInstances);
  const science = calculateScienceScore(player);

  return {
    military,
    coins,
    wonder,
    civic,
    commercial,
    guilds,
    science,
    total: military + coins + wonder + civic + commercial + guilds + science,
  };
}

/**
 * Calculate military score
 */
function calculateMilitaryScore(player: PlayerState): number {
  return player.victoryTokens - player.defeatTokens;
}

/**
 * Calculate coin score (1 point per 3 coins)
 */
function calculateCoinScore(player: PlayerState): number {
  return Math.floor(player.coins / 3);
}

/**
 * Calculate wonder score
 */
function calculateWonderScore(player: PlayerState): number {
  const wonder = getWonderById(player.wonderId);
  if (!wonder) return 0;

  const side = player.wonderSide === 'A' ? wonder.sideA : wonder.sideB;
  let score = 0;

  for (let i = 0; i < player.wonderStages; i++) {
    if (i < side.stages.length) {
      score += side.stages[i].victoryPoints || 0;
    }
  }

  return score;
}

/**
 * Calculate civic (blue card) score
 */
function calculateCivicScore(
  player: PlayerState,
  cardInstances: Map<string, CardInstance>
): number {
  let score = 0;

  for (const cardId of player.tableau) {
    const instance = cardInstances.get(cardId);
    if (!instance) continue;

    const template = cardService.getCardTemplate(instance.templateId);
    if (!template) continue;

    if (template.type === CardType.BLUE) {
      // Look for victory points effect
      for (const effect of template.effects) {
        if (effect.type === 'victory_points') {
          score += effect.amount || 0;
        }
      }
    }
  }

  return score;
}

/**
 * Calculate commercial (yellow card) score
 */
function calculateCommercialScore(
  player: PlayerState,
  cardInstances: Map<string, CardInstance>
): number {
  let score = 0;

  for (const cardId of player.tableau) {
    const instance = cardInstances.get(cardId);
    if (!instance) continue;

    const template = cardService.getCardTemplate(instance.templateId);
    if (!template) continue;

    if (template.type === CardType.YELLOW) {
      // Look for victory points effect
      for (const effect of template.effects) {
        if (effect.type === 'victory_points') {
          score += effect.amount || 0;
        }
      }
    }
  }

  return score;
}

/**
 * Calculate guild (purple card) score
 */
function calculateGuildScore(
  player: PlayerState,
  gameState: GameState,
  cardInstances: Map<string, CardInstance>
): number {
  let score = 0;
  const playerIndex = gameState.players.findIndex((p) => p.id === player.id);

  const leftNeighbor =
    gameState.players[
      (playerIndex - 1 + gameState.players.length) % gameState.players.length
    ];
  const rightNeighbor =
    gameState.players[(playerIndex + 1) % gameState.players.length];

  for (const cardId of player.tableau) {
    const instance = cardInstances.get(cardId);
    if (!instance) continue;

    const template = cardService.getCardTemplate(instance.templateId);
    if (!template) continue;

    if (template.type === CardType.PURPLE) {
      // Calculate guild-specific scoring
      for (const effect of template.effects) {
        if (effect.type === 'victory_per_card_type') {
          // Count cards of specific type in neighbors
          let count = 0;

          if (effect.neighbors === 'neighbors' || effect.neighbors === 'all') {
            count += countCardsByType(
              leftNeighbor,
              effect.cardType,
              cardInstances
            );
            count += countCardsByType(
              rightNeighbor,
              effect.cardType,
              cardInstances
            );
          }
          if (effect.neighbors === 'self' || effect.neighbors === 'all') {
            count += countCardsByType(player, effect.cardType, cardInstances);
          }

          score += count * (effect.pointsPerCard || 1);
        } else if (effect.type === 'victory_per_wonder_stage') {
          let stages = 0;

          if (effect.neighbors === 'neighbors' || effect.neighbors === 'all') {
            stages += leftNeighbor.wonderStages;
            stages += rightNeighbor.wonderStages;
          }
          if (effect.neighbors === 'self' || effect.neighbors === 'all') {
            stages += player.wonderStages;
          }

          score += stages * (effect.pointsPerStage || 1);
        } else if (effect.type === 'victory_per_defeat') {
          score += player.defeatTokens * (effect.pointsPerDefeat || 1);
        } else if (effect.type === 'victory_per_resource_card') {
          // Count brown and grey cards
          let count = 0;

          if (effect.neighbors === 'neighbors' || effect.neighbors === 'all') {
            count += countCardsByType(
              leftNeighbor,
              CardType.BROWN,
              cardInstances
            );
            count += countCardsByType(
              leftNeighbor,
              CardType.GREY,
              cardInstances
            );
            count += countCardsByType(
              rightNeighbor,
              CardType.BROWN,
              cardInstances
            );
            count += countCardsByType(
              rightNeighbor,
              CardType.GREY,
              cardInstances
            );
          }
          if (effect.neighbors === 'self' || effect.neighbors === 'all') {
            count += countCardsByType(player, CardType.BROWN, cardInstances);
            count += countCardsByType(player, CardType.GREY, cardInstances);
          }

          score += count;
        }
      }
    }
  }

  return score;
}

/**
 * Count cards of a specific type in a player's tableau
 */
function countCardsByType(
  player: PlayerState,
  cardType: CardType,
  cardInstances: Map<string, CardInstance>
): number {
  let count = 0;

  for (const cardId of player.tableau) {
    const instance = cardInstances.get(cardId);
    if (!instance) continue;

    const template = cardService.getCardTemplate(instance.templateId);
    if (!template) continue;

    if (template.type === cardType) {
      count++;
    }
  }

  return count;
}

/**
 * Calculate science score
 */
export function calculateScienceScore(player: PlayerState): number {
  const tablet = player.science[ScienceSymbol.TABLET] || 0;
  const compass = player.science[ScienceSymbol.COMPASS] || 0;
  const gear = player.science[ScienceSymbol.GEAR] || 0;

  // Score for sets of all three symbols
  const completeSets = Math.min(tablet, compass, gear);
  const setScore = completeSets * 7;

  // Score for each symbol squared
  const tabletScore = tablet * tablet;
  const compassScore = compass * compass;
  const gearScore = gear * gear;

  return setScore + tabletScore + compassScore + gearScore;
}

/**
 * Determine the winner
 */
export function determineWinner(
  scores: Record<string, ScoreBreakdown>
): string {
  let winnerId = '';
  let highestScore = -1;

  for (const [playerId, scoreBreakdown] of Object.entries(scores)) {
    if (scoreBreakdown.total > highestScore) {
      highestScore = scoreBreakdown.total;
      winnerId = playerId;
    }
  }

  return winnerId;
}
