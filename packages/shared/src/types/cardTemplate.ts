import { z } from 'zod';
import {
  CardType,
  ResourceType,
  ScienceSymbol,
  Age,
  CostSchema,
  EffectSchema,
} from './cards';

// Card copies per player count
export const CardCopiesSchema = z.object({
  3: z.number().min(0).max(3),
  4: z.number().min(0).max(3),
  5: z.number().min(0).max(3),
  6: z.number().min(0).max(3),
  7: z.number().min(0).max(3),
});

// Card template schema - defines a card type with distribution info
export const CardTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(CardType),
  age: z.nativeEnum(Age),
  copies: CardCopiesSchema, // How many copies exist at each player count
  cost: CostSchema,
  effects: z.array(EffectSchema),
  chainFrom: z.array(z.string()).optional(), // Cards that allow this to be built for free
  chainTo: z.array(z.string()).optional(), // Cards this allows to be built for free
});

// Card instance schema - an actual card in play
export const CardInstanceSchema = z.object({
  templateId: z.string(), // Reference to the template
  instanceId: z.string(), // Unique instance identifier (e.g., "lumber_yard_1")
  name: z.string(),
  type: z.nativeEnum(CardType),
  age: z.nativeEnum(Age),
  cost: CostSchema,
  effects: z.array(EffectSchema),
  chainTo: z.array(z.string()).optional(),
});

// Type exports
export type CardCopies = z.infer<typeof CardCopiesSchema>;
export type CardTemplate = z.infer<typeof CardTemplateSchema>;
export type CardInstance = z.infer<typeof CardInstanceSchema>;

// Helper type for player counts
export type PlayerCount = 3 | 4 | 5 | 6 | 7;

// Helper functions
export function getCardCount(
  template: CardTemplate,
  playerCount: PlayerCount
): number {
  return template.copies[playerCount];
}

export function createCardInstance(
  template: CardTemplate,
  instanceNumber: number
): CardInstance {
  return {
    templateId: template.id,
    instanceId: `${template.id}_${instanceNumber}`,
    name: template.name,
    type: template.type,
    age: template.age,
    cost: template.cost,
    effects: template.effects,
    chainTo: template.chainTo,
  };
}
