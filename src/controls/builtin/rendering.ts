import factoryControls from 'app/controls/factory';

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
  }
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
  }
});

const frameCount = factoryControls.info({
  id: 'frameCount',
  label: 'frame',
  defaultValue: '0',
  description: 'Number of frames displayed since the program started',
  category: 'rendering',
  draw(data, c) {
    data.value = c.frameCount.toString();
  }
});

const fps = factoryControls.info({
  defaultValue: '',
  id: 'fps',
  label: 'fps',
  description: 'Actual framerate',
  category: 'rendering',
  draw(data, c) {
    data.value = c.frameRate().toFixed(0);
  }
});

const redraw = factoryControls.button({
  id: 'redraw',
  defaultValue: 'draw',
  label: 'draw frame',
  description: 'Click to draw frame',
  category: 'rendering',
  setup(data, c) {
    // TODO: review exposing a better/custom api
    // true signals the button was clicked, done via onChange(true) on click
    if (data.value && !c.isLooping()) {
      c.redraw();
      data.value = 'draw';
    }
  }
});

function restart({ restartExperiment }: { restartExperiment: () => void }) {
  const defaultValue = 'reload';

  return factoryControls.button({
    id: 'restart',
    defaultValue,
    label: 'restart experiment',
    category: 'rendering',
    setup(data) {
      if (data.value) {
        restartExperiment();
        data.value = defaultValue;
      }
    }
  });
}

function reload({ reloadExperiment }: { reloadExperiment: () => void }) {
  const defaultValue = 'reload';

  return factoryControls.button({
    id: 'reload',
    defaultValue,
    label: 'reload with changes',
    category: 'custom',
    setup(data) {
      if (data.value) {
        reloadExperiment();
        data.value = defaultValue;
      }
    }
  });
}

export default { running, frameRate, frameCount, fps, redraw, restart, reload };
