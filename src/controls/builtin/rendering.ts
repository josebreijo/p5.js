import type {
  CheckboxControlSettings,
  InfoControlSettings,
  SliderControlSettings,
} from '../../types';
import { Checkbox } from '../../components/Checkbox';
import { Slider } from '../../components/Slider';
import { Info } from '../../components/Info';
import { effect } from '@preact/signals';

const running: CheckboxControlSettings = {
  type: 'checkbox',
  defaultValue: true,
  id: 'running',
  label: 'running',
  description: 'Whether the experiment is running or not',
  category: 'rendering',
  component: Checkbox,
  setup(data, c) {
    effect(() => {
      if (data.value && !c.isLooping()) c.loop();
      if (c.isLooping() && !data.value) c.noLoop();
    });
  },
};

const frameRate: SliderControlSettings = {
  type: 'slider',
  defaultValue: 24,
  id: 'frameRate',
  label: 'framerate',
  description: 'Number of frames to display each second',
  category: 'rendering',
  component: Slider,
  min: 1,
  max: 60,
  step: 1,
  setup(data, c) {
    effect(() => {
      c.frameRate(Number(data.value));
    });
  },
};

const frameCount: InfoControlSettings = {
  type: 'info',
  defaultValue: '0',
  id: 'frameCount',
  label: 'frame',
  description: 'Number of frames displayed since the program started',
  category: 'rendering',
  component: Info,
  draw(data, c) {
    data.value = c.frameCount.toString();
  },
};

const fps: InfoControlSettings = {
  type: 'info',
  defaultValue: '',
  id: 'fps',
  label: 'fps',
  description: 'Actual framerate',
  category: 'rendering',
  component: Info,
  draw(data, c) {
    data.value = c.frameRate().toFixed(0);
  },
};

export default { running, frameRate, frameCount, fps };
