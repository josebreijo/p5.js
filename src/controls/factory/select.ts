import type { SelectControlSettings } from '../../types';
import { Select } from '../../components/Select';
import utils from '../utils';

type SelectControlProps = Pick<
  SelectControlSettings,
  'id' | 'defaultValue' | 'options' | 'label' | 'setup' | 'draw'
>;

function select(settings: SelectControlProps): SelectControlSettings {
  return {
    ...settings,
    type: 'select',
    component: Select,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { select };
