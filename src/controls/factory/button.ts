const redraw: ButtonControlSettings = {
  type: 'button',
  id: 'redraw',
  label: 'click to redraw',
  defaultValue: 'redraw',
  description: 'Click to redraw screen',
  category: 'rendering',
  component: Button,
  action() {
    c.redraw();
  },
};

import type { ButtonControlSettings } from '../../types';
import { Button } from '../../components/Button';
import utils from '../utils';

type ButtonControlProps = Pick<
  ButtonControlSettings,
  'id' | 'defaultValue' | 'label' | 'action' | 'setup' | 'draw'
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
