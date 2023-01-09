import factoryControls from '../factory';

// TODO: review decoupling the concept of running from the framerate
const running = factoryControls.checkbox({
  id: 'running',
  defaultValue: true,
  label: 'running',
  description: 'Whether the experiment is running or not',
  category: 'rendering',
  setup(data, c) {
    if (data.value && !c.isLooping()) c.loop();
    if (!data.value && c.isLooping()) c.noLoop();
  },
});

const frameRate = factoryControls.slider({
  id: 'frameRate',
  label: 'framerate',
  defaultValue: 24,
  description: 'Number of frames to display each second',
  category: 'rendering',
  min: 1,
  max: 60,
  step: 1,
  setup(data, c) {
    c.frameRate(Number(data.value));
  },
});

const frameCount = factoryControls.info({
  id: 'frameCount',
  label: 'frame',
  defaultValue: '0',
  description: 'Number of frames displayed since the program started',
  category: 'rendering',
  draw(data, c) {
    data.value = c.frameCount.toString();
  },
});

const fps = factoryControls.info({
  defaultValue: '',
  id: 'fps',
  label: 'fps',
  description: 'Actual framerate',
  category: 'rendering',
  draw(data, c) {
    data.value = c.frameRate().toFixed(0);
  },
});

const redraw = factoryControls.button({
  defaultValue: 'redraw',
  id: 'redraw',
  label: 'draw frame',
  description: 'Click to redraw screen',
  category: 'rendering',
  setup(data, c) {
    // TODO: review exposing a better/custom api
    // true signals the button was clicked, done via onChange(true) on click
    if (data.value) {
      c.redraw();
      data.value = false;
    }
  },
});

function restart({ restartExperiment }: { restartExperiment: () => void }) {
  return factoryControls.button({
    id: 'restart',
    defaultValue: 'restart',
    label: 'restart experiment',
    category: 'rendering',
    setup(data) {
      if (data.value) {
        restartExperiment();
        data.value = false;
      }
    },
  });
}

function reload({ reloadExperiment }: { reloadExperiment: () => void }) {
  return factoryControls.button({
    id: 'reload',
    defaultValue: 'reload',
    label: 'reload with changes',
    category: 'custom',
    setup(data) {
      if (data.value) {
        reloadExperiment();
        data.value = false;
      }
    },
  });
}

export default { running, frameRate, frameCount, fps, redraw, restart, reload };
