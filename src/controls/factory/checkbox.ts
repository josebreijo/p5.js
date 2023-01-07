import type { CheckboxControlSettings } from '../../types';
import { Checkbox } from '../../components/Checkbox';
import utils from '../utils';

type CheckboxSettings = Pick<
  CheckboxControlSettings,
  // TODO: extract shared defaults
  'id' | 'defaultValue' | 'label' | 'category' | 'description' | 'setup' | 'draw'
>;

function checkbox(settings: CheckboxSettings): CheckboxControlSettings {
  return {
    ...settings,
    type: 'checkbox',
    component: Checkbox,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { checkbox };
