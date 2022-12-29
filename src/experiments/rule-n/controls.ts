import { effect } from '@preact/signals';

import type { TextControl } from '../../types';
import { Text } from '../../components/Text';

function ruleNumberControl(updateRule: (newRule: number) => void) {
  const control: TextControl = {
    type: 'text',
    defaultValue: '30',
    id: 'rule-number',
    label: 'ruleset',
    description: 'Rule set to use',
    component: Text,
    setup(c, data) {
      effect(() => {
        const ruleNumber = Number.parseInt(data.value);

        if (isNaN(ruleNumber)) {
          console.error(`Unable to render rule ${data.value}`);
          return;
        }

        updateRule(ruleNumber);
      });
    },
  };

  return control;
}

export default { ruleNumberControl };
