import { z } from 'zod';

export const ActionSchema = z.object({
  type: z.string(),
  payload: z.any().optional(),
});

export const RuleSchema = z.object({
  condition: z.function(),
  action: ActionSchema,
  priority: z.number().optional(),
});

export const GameStateSchema = z.object({
  playerId: z.string(),
  score: z.number().default(0),
  resources: z.record(z.string(), z.number()).default({}),
  cards: z.array(z.string()).default([]),
  age: z.number().min(1).max(3).default(1),
});

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean().default(false),
});

export const GameConfigSchema = z.object({
  maxPlayers: z.number().min(2).max(7).default(7),
  enableExpansions: z.boolean().default(false),
  timeLimit: z.number().positive().optional(),
});

export type Action = z.infer<typeof ActionSchema>;
export type Rule = z.infer<typeof RuleSchema>;
export type GameState = z.infer<typeof GameStateSchema>;
export type Player = z.infer<typeof PlayerSchema>;
export type GameConfig = z.infer<typeof GameConfigSchema>;

export const validateAction = (data: unknown): Action => {
  return ActionSchema.parse(data);
};

export const validateGameState = (data: unknown): GameState => {
  return GameStateSchema.parse(data);
};

export const validatePlayer = (data: unknown): Player => {
  return PlayerSchema.parse(data);
};

export const validateGameConfig = (data: unknown): GameConfig => {
  return GameConfigSchema.parse(data);
};