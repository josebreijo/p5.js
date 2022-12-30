import { effect } from '@preact/signals';

import type { SelectControlSettings } from '../../types';
import { Select } from '../../components/Select';

const options = [28, 30, 50, 54, 60, 90, 94, 102, 110, 150, 158, 188, 190, 220].map((rule) =>
  rule.toString(),
);

function ruleNumberControl(updateRule: (newRule: number) => void) {
  const control: SelectControlSettings = {
    type: 'select',
    defaultValue: '30',
    options,
    id: 'rule-number',
    label: 'ruleset',
    description: 'Rule set to use',
    component: Select,
    setup(_, data) {
      effect(() => updateRule(Number(data.value)));
    },
  };

  return control;
}

export default { ruleNumberControl };
