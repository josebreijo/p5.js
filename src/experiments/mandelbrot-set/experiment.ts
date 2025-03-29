import p5 from 'p5';

import type { Experiment } from 'app/types';
import builtinControls from 'app/controls/builtin';
import factoryControls from 'app/controls/factory';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const BOUND = 100;
  const WIDTH = 1000;
  let iterationCount = 500;

  const iterationsSliderControl = factoryControls.slider({
    id: 'iterationCount',
    defaultValue: 500,
    label: '# iterations',
    min: 1,
    max: 2000,
    step: 5,
    setup(data) {
      iterationCount = data.value;
    }
  });

  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.fps,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
    builtinControls.rendering.redraw,
    builtinControls.storage.saveFrame(experiment.name),
    iterationsSliderControl
  ]);

  c.setup = function setup() {
    controls.setup(c);
    c.createCanvas(WIDTH, WIDTH);
    c.pixelDensity(1);
  };

  c.draw = function draw() {
    controls.draw(c);

    c.loadPixels();

    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < WIDTH; y++) {
        let a = c.map(x, 0, WIDTH, -2, 2);
        let b = c.map(y, 0, WIDTH, -2, 2);

        const firstA = a;
        const firstB = b;

        let iteration = 0;

        while (iteration < iterationCount) {
          const aa = a * a - b * b;
          const bb = 2 * a * b;

          a = aa + firstA;
          b = bb + firstB;

          if (c.abs(a + b) > BOUND) {
            break;
          }

          iteration += 1;
        }

        let brightness = c.map(iteration, 0, iterationCount, 0, 1);
        brightness = c.map(c.sqrt(brightness), 0, 1, 0, 255);

        if (iteration === iterationCount) {
          brightness = 0;
        }

        const index = (x + y * WIDTH) * 4;

        c.pixels[index] = brightness * 3;
        c.pixels[index + 1] = brightness;
        c.pixels[index + 2] = brightness * 0.5;
        c.pixels[index + 3] = 255;
      }
    }

    c.updatePixels();
    c.noLoop();
  };
};
