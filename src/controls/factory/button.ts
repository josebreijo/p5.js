import type { ButtonControlSettings } from '../../types';
import { Button } from '../../components/Button';
import utils from '../utils';

type ButtonControlProps = Pick<
  ButtonControlSettings,
  'id' | 'defaultValue' | 'label' | 'category' | 'setup' | 'draw'
>;

function button(settings: ButtonControlProps): ButtonControlSettings {
  return {
    ...settings,
    type: 'button',
    component: Button,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { button };
