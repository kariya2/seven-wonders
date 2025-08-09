import { z } from 'zod';

// Enums for card categories
export enum CardType {
  BROWN = 'BROWN', // Raw materials
  GREY = 'GREY', // Manufactured goods
  BLUE = 'BLUE', // Civic buildings
  YELLOW = 'YELLOW', // Commercial buildings
  RED = 'RED', // Military buildings
  GREEN = 'GREEN', // Scientific buildings
  PURPLE = 'PURPLE', // Guilds
}

export enum ResourceType {
  // Raw materials
  WOOD = 'WOOD',
  CLAY = 'CLAY',
  ORE = 'ORE',
  STONE = 'STONE',
  // Manufactured goods
  GLASS = 'GLASS',
  CLOTH = 'CLOTH',
  PAPYRUS = 'PAPYRUS',
}

export enum ScienceSymbol {
  COMPASS = 'COMPASS',
  GEAR = 'GEAR',
  TABLET = 'TABLET',
}

export enum Age {
  I = 1,
  II = 2,
  III = 3,
}

// Cost types
export const ResourceCostSchema = z.object({
  type: z.literal('resource'),
  resources: z.record(z.nativeEnum(ResourceType), z.number()),
});

export const CoinCostSchema = z.object({
  type: z.literal('coin'),
  amount: z.number(),
});

export const ChainCostSchema = z.object({
  type: z.literal('chain'),
  fromCard: z.string(), // Card name that allows free construction
});

export const FreeCostSchema = z.object({
  type: z.literal('free'),
});

export const CostSchema = z.union([
  ResourceCostSchema,
  CoinCostSchema,
  ChainCostSchema,
  FreeCostSchema,
]);

// Effect types
export const ResourceProductionEffectSchema = z.object({
  type: z.literal('resource_production'),
  resources: z.array(z.record(z.nativeEnum(ResourceType), z.number())), // Array for choice resources
});

export const VictoryPointsEffectSchema = z.object({
  type: z.literal('victory_points'),
  amount: z.number(),
});

export const MilitaryEffectSchema = z.object({
  type: z.literal('military'),
  shields: z.number(),
});

export const ScienceEffectSchema = z.object({
  type: z.literal('science'),
  symbol: z.nativeEnum(ScienceSymbol),
});

export const CoinEffectSchema = z.object({
  type: z.literal('coins'),
  amount: z.number(),
});

export const TradingEffectSchema = z.object({
  type: z.literal('trading'),
  resourceType: z.array(z.nativeEnum(ResourceType)),
  neighbors: z.enum(['left', 'right', 'both']),
  costReduction: z.number(), // Usually reduces from 2 to 1
});

export const CoinPerCardEffectSchema = z.object({
  type: z.literal('coin_per_card'),
  cardType: z.nativeEnum(CardType),
  neighbors: z.enum(['self', 'neighbors', 'all']),
  amount: z.number(),
});

export const VictoryPerCardEffectSchema = z.object({
  type: z.literal('victory_per_card'),
  cardType: z.nativeEnum(CardType),
  neighbors: z.enum(['self', 'neighbors', 'all']),
  amount: z.number(),
});

export const VictoryPerWonderEffectSchema = z.object({
  type: z.literal('victory_per_wonder'),
  neighbors: z.enum(['self', 'neighbors', 'all']),
  amount: z.number(),
});

export const CopyGuildEffectSchema = z.object({
  type: z.literal('copy_guild'),
  description: z.string().optional(),
});

export const VictoryPerWonderStageEffectSchema = z.object({
  type: z.literal('victory_per_wonder_stage'),
  neighbors: z.enum(['self', 'neighbors', 'all']),
  pointsPerStage: z.number(),
});

export const VictoryPerDefeatEffectSchema = z.object({
  type: z.literal('victory_per_defeat'),
  pointsPerDefeat: z.number(),
});

export const VictoryPerCardTypeEffectSchema = z.object({
  type: z.literal('victory_per_card_type'),
  cardType: z.nativeEnum(CardType),
  neighbors: z.enum(['self', 'neighbors', 'all']),
  pointsPerCard: z.number(),
});

export const VictoryPerResourceCardEffectSchema = z.object({
  type: z.literal('victory_per_resource_card'),
  neighbors: z.enum(['self', 'neighbors', 'all']),
  pointsPerCard: z.number(),
});

export const ScienceChoiceEffectSchema = z.object({
  type: z.literal('science_choice'),
  description: z.string().optional(),
});

export const VictoryPerVictoryTokenEffectSchema = z.object({
  type: z.literal('victory_per_victory_token'),
  pointsPerToken: z.number(),
});

// Wonder-specific effects
export const PlaySeventhCardEffectSchema = z.object({
  type: z.literal('play_seventh_card'),
  description: z.string().optional(),
});

export const FreeBuildFromDiscardEffectSchema = z.object({
  type: z.literal('free_build_from_discard'),
  description: z.string().optional(),
});

export const FreeBuildOncePerAgeEffectSchema = z.object({
  type: z.literal('free_build_once_per_age'),
  description: z.string().optional(),
});

export const EffectSchema = z.union([
  ResourceProductionEffectSchema,
  VictoryPointsEffectSchema,
  MilitaryEffectSchema,
  ScienceEffectSchema,
  CoinEffectSchema,
  TradingEffectSchema,
  CoinPerCardEffectSchema,
  VictoryPerCardEffectSchema,
  VictoryPerWonderEffectSchema,
  CopyGuildEffectSchema,
  VictoryPerWonderStageEffectSchema,
  VictoryPerDefeatEffectSchema,
  VictoryPerCardTypeEffectSchema,
  VictoryPerResourceCardEffectSchema,
  ScienceChoiceEffectSchema,
  VictoryPerVictoryTokenEffectSchema,
  PlaySeventhCardEffectSchema,
  FreeBuildFromDiscardEffectSchema,
  FreeBuildOncePerAgeEffectSchema,
]);

// Card schema
export const CardSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(CardType),
  age: z.nativeEnum(Age),
  minPlayers: z.number().min(2).max(7),
  cost: CostSchema,
  effects: z.array(EffectSchema),
  chainTo: z.array(z.string()).optional(), // Cards this leads to
});

// Type exports
export type ResourceCost = z.infer<typeof ResourceCostSchema>;
export type CoinCost = z.infer<typeof CoinCostSchema>;
export type ChainCost = z.infer<typeof ChainCostSchema>;
export type FreeCost = z.infer<typeof FreeCostSchema>;
export type Cost = z.infer<typeof CostSchema>;

export type ResourceProductionEffect = z.infer<
  typeof ResourceProductionEffectSchema
>;
export type VictoryPointsEffect = z.infer<typeof VictoryPointsEffectSchema>;
export type MilitaryEffect = z.infer<typeof MilitaryEffectSchema>;
export type ScienceEffect = z.infer<typeof ScienceEffectSchema>;
export type CoinEffect = z.infer<typeof CoinEffectSchema>;
export type TradingEffect = z.infer<typeof TradingEffectSchema>;
export type CoinPerCardEffect = z.infer<typeof CoinPerCardEffectSchema>;
export type VictoryPerCardEffect = z.infer<typeof VictoryPerCardEffectSchema>;
export type VictoryPerWonderEffect = z.infer<
  typeof VictoryPerWonderEffectSchema
>;
export type CopyGuildEffect = z.infer<typeof CopyGuildEffectSchema>;
export type VictoryPerWonderStageEffect = z.infer<
  typeof VictoryPerWonderStageEffectSchema
>;
export type VictoryPerDefeatEffect = z.infer<
  typeof VictoryPerDefeatEffectSchema
>;
export type VictoryPerCardTypeEffect = z.infer<
  typeof VictoryPerCardTypeEffectSchema
>;
export type VictoryPerResourceCardEffect = z.infer<
  typeof VictoryPerResourceCardEffectSchema
>;
export type ScienceChoiceEffect = z.infer<typeof ScienceChoiceEffectSchema>;
export type VictoryPerVictoryTokenEffect = z.infer<
  typeof VictoryPerVictoryTokenEffectSchema
>;
export type PlaySeventhCardEffect = z.infer<typeof PlaySeventhCardEffectSchema>;
export type FreeBuildFromDiscardEffect = z.infer<
  typeof FreeBuildFromDiscardEffectSchema
>;
export type FreeBuildOncePerAgeEffect = z.infer<
  typeof FreeBuildOncePerAgeEffectSchema
>;
export type Effect = z.infer<typeof EffectSchema>;

export type Card = z.infer<typeof CardSchema>;
