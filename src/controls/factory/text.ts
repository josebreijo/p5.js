import type { TextControlSettings } from 'app/types';
import { Text } from 'app/components/Text';
import utils from 'app/controls/utils';

type TextControlProps = Pick<
  TextControlSettings,
  'id' | 'defaultValue' | 'label' | 'category' | 'description' | 'setup' | 'draw'
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
