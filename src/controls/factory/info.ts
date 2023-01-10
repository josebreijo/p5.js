import type { InfoControlSettings } from 'app/types';
import { Info } from 'app/components/Info';
import utils from 'app/controls/utils';

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
