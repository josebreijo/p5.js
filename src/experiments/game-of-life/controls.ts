import type { ColorControlSettings } from '../../types';
import { Color } from '../../components/Color';

type ColorControlProps = Pick<
  ColorControlSettings,
  'id' | 'defaultValue' | 'label' | 'setup' | 'draw'
>;

function color(settings: ColorControlProps): ColorControlSettings {
  return {
    ...settings,
    type: 'color',
    component: Color,
  };
}

export default { color };
