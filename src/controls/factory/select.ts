import type { SelectControlSettings } from '../../types';
import { Select } from '../../components/Select';
import utils from '../utils';

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
