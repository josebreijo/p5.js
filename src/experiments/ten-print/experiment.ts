import p5 from 'p5';

import type { Experiment } from 'app/types';
import builtinControls from 'app/controls/builtin';
import factoryControls from 'app/controls/factory';

interface Defaults {
  SIZE: number;
  COLOR: string;
  PROBABILITY_OFFSET: number;
}

const DEFAULTS: Defaults = {
  SIZE: 20,
  COLOR: '#2e9949',
  PROBABILITY_OFFSET: 0.5,
};

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  let color = DEFAULTS.COLOR;
  let size = DEFAULTS.SIZE;
  let probabilityOffset = DEFAULTS.PROBABILITY_OFFSET;

  const getColumns = () => c.floor(c.windowWidth / size);
  const getRows = () => c.floor(c.windowHeight / size);

  let y = 0;
  let x = 0;
  let rows = getRows();
  let columns = getColumns();

  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.fps,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
    builtinControls.rendering.redraw,
  ]);

  function restart(userDefaults: Partial<Defaults> = DEFAULTS) {
    size = userDefaults.SIZE || DEFAULTS.SIZE;
    color = userDefaults.COLOR || DEFAULTS.COLOR;
    probabilityOffset = userDefaults.PROBABILITY_OFFSET || DEFAULTS.PROBABILITY_OFFSET;

    y = 0;
    x = 0;
    columns = getColumns();
    rows = getRows();

    controls.signals.running.value = true;
    c.clear(0, 0, 0, 0);
  }

  const sizeControl = factoryControls.slider({
    id: 'size',
    defaultValue: size,
    label: 'size',
    min: 5,
    max: c.floor(c.windowWidth / 5),
    step: 1,
    setup(data) {
      controls.signals.running.value = true;
      restart({ SIZE: data.value, COLOR: color, PROBABILITY_OFFSET: probabilityOffset });
    },
  });

  const colorControl = factoryControls.color({
    id: 'color',
    defaultValue: color,
    label: 'color',
    setup(data) {
      color = data.value;
    },
  });

  const probabilityControl = factoryControls.slider({
    id: 'probability',
    defaultValue: probabilityOffset,
    label: 'probability offset',
    min: 0,
    max: 1,
    step: 0.1,
    setup(data) {
      probabilityOffset = data.value;
    },
  });

  const tileControls = experiment.registerControls([colorControl, sizeControl, probabilityControl]);

  const restartControl = builtinControls.rendering.restart({
    restartExperiment() {
      tileControls.signals.size.value = DEFAULTS.SIZE;
      tileControls.signals.color.value = DEFAULTS.COLOR;
      tileControls.signals.probability.value = DEFAULTS.PROBABILITY_OFFSET;
      restart();
    },
  });

  const reloadWithChangesControl = builtinControls.rendering.reload({
    reloadExperiment() {
      restart({
        SIZE: tileControls.signals.size.value,
        COLOR: tileControls.signals.color.value,
        PROBABILITY_OFFSET: tileControls.signals.probability.value,
      });
    },
  });

  const playbackControls = experiment.registerControls([restartControl, reloadWithChangesControl]);

  c.setup = function setup() {
    controls.setup(c);
    tileControls.setup(c);
    playbackControls.setup(c);

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
    c.background(0);
    c.fill(255);
    c.strokeCap(c.ROUND);
  };

  c.draw = function draw() {
    controls.draw(c);
    tileControls.draw(c);
    playbackControls.draw(c);

    const strokeWeight = c.floor(c.map(size, 0, c.floor(c.windowWidth / 5), 1, 20));
    c.strokeWeight(strokeWeight);
    c.stroke(color);

    let columnPadding = (c.windowWidth - columns * size) / 2;
    let rowPadding = (c.windowHeight - rows * size) / 2;

    c.translate(columnPadding, rowPadding);

    if (c.random(1) >= probabilityOffset) {
      c.line(x, y, x + size, y + size);
    } else {
      c.line(x, y, x, y + size);
    }

    const maxRows = rows * size;
    const maxColumns = columns * size;

    x += size;

    if (x >= maxColumns) {
      x = 0;
      y += size;

      if (y >= maxRows) {
        controls.signals.running.value = false;
      }
    }
  };

  c.windowResized = function windowResized() {
    c.resizeCanvas(c.windowWidth, c.windowHeight);
    const { color, size, probabilityOffset } = tileControls.signals;
    restart({ SIZE: size.value, COLOR: color.value, PROBABILITY_OFFSET: probabilityOffset.value });
  };
};
