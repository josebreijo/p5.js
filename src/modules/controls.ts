import { effect } from '@preact/signals';

import type { CheckboxControlSettings, InfoControlSettings, SliderControlSettings } from '../types';
import { Checkbox } from '../components/Checkbox';
import { Slider } from '../components/Slider';
import { Info } from '../components/Info';

const running: CheckboxControlSettings = {
  type: 'checkbox',
  defaultValue: true,
  id: 'running',
  label: 'running',
  description: 'Whether the experiment is running or not',
  component: Checkbox,
  setup(c, data) {
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
  component: Slider,
  min: 1,
  max: 60,
  step: 1,
  setup(c, data) {
    effect(() => c.frameRate(Number(data.value)));
  },
};

const frameCount: InfoControlSettings = {
  type: 'info',
  defaultValue: '0',
  id: 'frameCount',
  label: 'frame',
  description: 'Number of frames displayed since the program started',
  component: Info,
  draw(c, data) {
    data.value = c.frameCount.toString();
  },
};

const controls = {
  rendering: {
    running,
    frameRate,
    frameCount,
  },
};

export default controls;
