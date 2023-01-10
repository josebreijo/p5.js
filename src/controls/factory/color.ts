import type { ColorControlSettings } from 'app/types';
import { Color } from 'app/components/Color';
import utils from 'app/controls/utils';

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
