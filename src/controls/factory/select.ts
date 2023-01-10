import type { SelectControlSettings } from 'app/types';
import { Select } from 'app/components/Select';
import utils from 'app/controls/utils';

type SelectSettings = Pick<
  SelectControlSettings,
  'id' | 'defaultValue' | 'label' | 'category' | 'description' | 'options' | 'setup' | 'draw'
>;

function select(settings: SelectSettings): SelectControlSettings {
  return {
    ...settings,
    type: 'select',
    component: Select,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { select };
