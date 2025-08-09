import { ResourceType, Effect } from '@seven-wonders/shared';

/**
 * Cost to build a wonder stage
 */
export interface WonderStageCost {
  resources?: Partial<Record<ResourceType, number>>;
  coins?: number;
}

/**
 * A single stage of a wonder
 */
export interface WonderStage {
  cost: WonderStageCost;
  effects: Effect[];
  victoryPoints?: number;
}

/**
 * One side of a wonder board
 */
export interface WonderSide {
  stages: WonderStage[];
  startingResource?: ResourceType;
}

/**
 * Complete wonder definition
 */
export interface Wonder {
  id: string;
  name: string;
  sideA: WonderSide;
  sideB: WonderSide;
}
