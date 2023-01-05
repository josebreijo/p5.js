import type { InfoControlSettings } from '../../types';
import { Info } from '../../components/Info';
import utils from '../utils';

type InfoControlProps = Pick<
  InfoControlSettings,
  'id' | 'defaultValue' | 'label' | 'setup' | 'draw' | 'category'
>;

function info(settings: InfoControlProps): InfoControlSettings {
  return {
    ...settings,
    type: 'info',
    category: 'stats',
    component: Info,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { info };
