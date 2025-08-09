import { CardTemplate } from '../../types/cardTemplate';
import { age1Templates } from './age1Templates';
import { age2Templates } from './age2Templates';
import { age3Templates } from './age3Templates';
import { guildTemplates } from './guildTemplates';

class CardService {
  private templates: Map<string, CardTemplate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates() {
    // Load all templates into the map
    [
      ...age1Templates,
      ...age2Templates,
      ...age3Templates,
      ...guildTemplates,
    ].forEach((template) => {
      this.templates.set(template.id, template);
    });
  }

  getCardTemplate(id: string): CardTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): CardTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByAge(age: 1 | 2 | 3): CardTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.age === age);
  }
}

export const cardService = new CardService();
