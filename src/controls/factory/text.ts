import type { TextControlSettings } from '../../types';
import { Text } from '../../components/Text';

type TextControlProps = Pick<
  TextControlSettings,
  'id' | 'defaultValue' | 'label' | 'setup' | 'draw'
>;

function text(settings: TextControlProps): TextControlSettings {
  return {
    ...settings,
    type: 'text',
    component: Text,
  };
}

export { text };
