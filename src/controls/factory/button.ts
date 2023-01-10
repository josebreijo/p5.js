import type { ButtonControlSettings } from 'app/types';
import { Button } from 'app/components/Button';
import utils from 'app/controls/utils';

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
