import type { ColorControlSettings } from '../../types';
import { Color } from '../../components/Color';
import utils from '../utils';

type ColorSettings = Pick<
  ColorControlSettings,
  'id' | 'defaultValue' | 'label' | 'category' | 'description' | 'setup' | 'draw'
>;

function color(settings: ColorSettings): ColorControlSettings {
  return {
    ...settings,
    type: 'color',
    component: Color,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { color };
