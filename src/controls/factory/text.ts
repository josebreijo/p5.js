import type { TextControlSettings } from '../../types';
import { Text } from '../../components/Text';
import utils from '../utils';

type TextControlProps = Pick<
  TextControlSettings,
  'id' | 'defaultValue' | 'label' | 'setup' | 'draw'
>;

function text(settings: TextControlProps): TextControlSettings {
  return {
    ...settings,
    type: 'text',
    component: Text,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { text };
