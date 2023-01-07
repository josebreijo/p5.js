import type { ButtonControlSettings } from '../../types';
import { Button } from '../../components/Button';
import utils from '../utils';

type ButtonSettings = Pick<
  ButtonControlSettings,
  'id' | 'defaultValue' | 'label' | 'category' | 'description' | 'setup' | 'draw'
>;

function button(settings: ButtonSettings): ButtonControlSettings {
  return {
    ...settings,
    type: 'button',
    component: Button,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { button };
