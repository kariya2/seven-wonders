import { describe, it, expect } from 'vitest';
import { age1Templates } from '../age1Templates';
import { age2Templates } from '../age2Templates';
import { age3Templates } from '../age3Templates';
import { guildTemplates } from '../guildTemplates';
import { CardTemplateSchema } from '../../../types/cardTemplate';
import { CardType, Age } from '../../../types/cards';

describe('Card Template Integrity', () => {
  const allTemplates = [
    ...age1Templates,
    ...age2Templates,
    ...age3Templates,
    ...guildTemplates,
  ];

  it('should have valid card template schemas', () => {
    allTemplates.forEach((template) => {
      expect(() => CardTemplateSchema.parse(template)).not.toThrow();
    });
  });

  it('should have unique card IDs', () => {
    const ids = allTemplates.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have correct age assignments', () => {
    age1Templates.forEach((t) => expect(t.age).toBe(Age.I));
    age2Templates.forEach((t) => expect(t.age).toBe(Age.II));
    age3Templates.forEach((t) => expect(t.age).toBe(Age.III));
    guildTemplates.forEach((t) => expect(t.age).toBe(Age.III));
  });

  it('should have guilds only in Age III', () => {
    const purpleCards = allTemplates.filter((t) => t.type === CardType.PURPLE);
    purpleCards.forEach((card) => {
      expect(card.age).toBe(Age.III);
    });
    // All guilds are purple
    expect(guildTemplates.every((g) => g.type === CardType.PURPLE)).toBe(true);
  });

  describe('Chain consistency', () => {
    it('should have valid chainTo references', () => {
      allTemplates.forEach((template) => {
        if (template.chainTo) {
          template.chainTo.forEach((chainId) => {
            const targetTemplate = allTemplates.find((t) => t.id === chainId);
            expect(targetTemplate).toBeDefined();

            // Chain targets should be in later ages
            if (targetTemplate) {
              expect(targetTemplate.age).toBeGreaterThan(template.age);
            }
          });
        }
      });
    });

    it('should have valid chainFrom references', () => {
      allTemplates.forEach((template) => {
        if (template.chainFrom) {
          template.chainFrom.forEach((chainId) => {
            const sourceTemplate = allTemplates.find((t) => t.id === chainId);
            expect(sourceTemplate).toBeDefined();

            // Chain sources should be in earlier ages
            if (sourceTemplate) {
              expect(sourceTemplate.age).toBeLessThan(template.age);
            }
          });
        }
      });
    });

    it('should have bidirectional chain consistency', () => {
      // Every chainTo should have a corresponding chainFrom
      allTemplates.forEach((template) => {
        if (template.chainTo) {
          template.chainTo.forEach((chainId) => {
            const targetTemplate = allTemplates.find((t) => t.id === chainId);
            if (targetTemplate?.chainFrom) {
              expect(targetTemplate.chainFrom).toContain(template.id);
            }
          });
        }
      });

      // Every chainFrom should have a corresponding chainTo
      allTemplates.forEach((template) => {
        if (template.chainFrom) {
          template.chainFrom.forEach((chainId) => {
            const sourceTemplate = allTemplates.find((t) => t.id === chainId);
            if (sourceTemplate?.chainTo) {
              expect(sourceTemplate.chainTo).toContain(template.id);
            }
          });
        }
      });
    });
  });

  describe('Card copies distribution', () => {
    it('should have exactly 7 cards per player for each age', () => {
      const playerCounts = [3, 4, 5, 6, 7] as const;

      playerCounts.forEach((pc) => {
        // Age I
        const age1Count = age1Templates.reduce(
          (sum, t) => sum + (t.copies[pc] || 0),
          0
        );
        expect(age1Count).toBe(pc * 7);

        // Age II
        const age2Count = age2Templates.reduce(
          (sum, t) => sum + (t.copies[pc] || 0),
          0
        );
        expect(age2Count).toBe(pc * 7);

        // Age III (includes guilds)
        const age3BaseCount = age3Templates.reduce(
          (sum, t) => sum + (t.copies[pc] || 0),
          0
        );
        const guildCount = pc + 2; // Number of guilds in play
        expect(age3BaseCount + guildCount).toBe(pc * 7);
      });
    });

    it('should have non-decreasing copies as player count increases', () => {
      allTemplates.forEach((template) => {
        let previousCopies = 0;
        ([3, 4, 5, 6, 7] as const).forEach((pc) => {
          const copies = template.copies[pc] || 0;
          expect(copies).toBeGreaterThanOrEqual(previousCopies);
          previousCopies = copies;
        });
      });
    });
  });

  describe('Effects validation', () => {
    it('should have at least one effect per card', () => {
      allTemplates.forEach((template) => {
        expect(template.effects.length).toBeGreaterThan(0);
      });
    });

    it('should have valid effect properties', () => {
      allTemplates.forEach((template) => {
        template.effects.forEach((effect) => {
          // Basic validation - the schema will catch detailed issues
          expect(effect.type).toBeDefined();
        });
      });
    });
  });

  describe('Cost validation', () => {
    it('should have valid cost types', () => {
      allTemplates.forEach((template) => {
        expect(['free', 'coin', 'resource', 'chain']).toContain(
          template.cost.type
        );
      });
    });

    it('should have reasonable resource costs', () => {
      allTemplates.forEach((template) => {
        if (template.cost.type === 'resource') {
          const totalResources = Object.values(template.cost.resources).reduce(
            (sum, count) => sum + count,
            0
          );

          // Resource costs should be reasonable
          expect(totalResources).toBeGreaterThan(0);
          expect(totalResources).toBeLessThanOrEqual(7);
        }
      });
    });
  });
});
