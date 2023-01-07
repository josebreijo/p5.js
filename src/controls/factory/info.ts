import type { InfoControlSettings } from '../../types';
import { Info } from '../../components/Info';
import utils from '../utils';

type InfoSettings = Pick<
  InfoControlSettings,
  'id' | 'defaultValue' | 'label' | 'category' | 'description' | 'setup' | 'draw'
>;

function info(settings: InfoSettings): InfoControlSettings {
  return {
    ...settings,
    type: 'info',
    // TODO: review allowing to override component component from experiment
    component: Info,
    setup: utils.wrapSetupEffects(settings.setup),
  };
}

export { info };
