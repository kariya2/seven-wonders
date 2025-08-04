export interface Action {
  type: string;
  payload?: any;
}

export interface Rule {
  condition: (state: any) => boolean;
  action: Action;
  priority?: number;
}

export interface RulesEngine {
  rules: Rule[];
  addRule: (rule: Rule) => void;
  removeRule: (index: number) => void;
  evaluate: (state: any) => Action[];
}

export function createRulesEngine(): RulesEngine {
  const rules: Rule[] = [];

  return {
    rules,
    addRule: (rule: Rule) => {
      rules.push(rule);
      rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    },
    removeRule: (index: number) => {
      rules.splice(index, 1);
    },
    evaluate: (state: any) => {
      return rules
        .filter(rule => rule.condition(state))
        .map(rule => rule.action);
    }
  };
}

export function applyAction(state: any, action: Action): any {
  switch (action.type) {
    case 'SET_PROPERTY':
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    case 'INCREMENT':
      return {
        ...state,
        [action.payload.key]: (state[action.payload.key] || 0) + (action.payload.amount || 1)
      };
    case 'RESET':
      return action.payload.initialState || {};
    default:
      return state;
  }
}