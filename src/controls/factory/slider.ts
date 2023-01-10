import type { SliderControlSettings } from 'app/types';
import { Slider } from 'app/components/Slider';
import utils from 'app/controls/utils';

type SliderSettings = Pick<
  SliderControlSettings,
  | 'id'
  | 'defaultValue'
  | 'label'
  | 'category'
  | 'description'
  | 'min'
  | 'max'
  | 'step'
  | 'setup'
  | 'draw'
>;

function slider(settings: SliderSettings): SliderControlSettings {
  return {
    ...settings,
    type: 'slider',
    component: Slider,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { slider };
