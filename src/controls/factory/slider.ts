import type { SliderControlSettings } from '../../types';
import { Slider } from '../../components/Slider';

type SliderControlProps = Pick<
  SliderControlSettings,
  'id' | 'defaultValue' | 'label' | 'min' | 'max' | 'step' | 'setup' | 'draw'
>;

function slider(settings: SliderControlProps): SliderControlSettings {
  return {
    ...settings,
    type: 'slider',
    component: Slider,
  };
}

export { slider };
