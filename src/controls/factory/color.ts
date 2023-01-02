import type { ColorControlSettings } from '../../types';
import { Color } from '../../components/Color';
import utils from '../utils';

type ColorControlProps = Pick<
  ColorControlSettings,
  'id' | 'defaultValue' | 'label' | 'setup' | 'draw'
>;

function color(settings: ColorControlProps): ColorControlSettings {
  return {
    ...settings,
    type: 'color',
    component: Color,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { color };
