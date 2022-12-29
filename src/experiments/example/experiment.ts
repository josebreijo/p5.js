import p5 from 'p5';

import type { Experiment } from '../../types';
import controls from '../../modules/controls';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const runningControl = experiment.exposeControl(controls.rendering.running);
  const frameRateControl = experiment.exposeControl(controls.rendering.frameRate);
  const frameCountControl = experiment.exposeControl(controls.rendering.frameCount);

  c.setup = function setup() {
    runningControl.setup(c, runningControl.data);
    frameRateControl.setup(c, frameRateControl.data);
    frameCountControl.setup(c, frameCountControl.data);

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.background(0);
    c.fill(255);
    c.colorMode(c.HSB);
  };

  c.draw = function draw() {
    runningControl.draw(c, runningControl.data);
    frameRateControl.draw(c, frameRateControl.data);
    frameCountControl.draw(c, frameCountControl.data);

    // TODO: enhance and list example
    // magic!
  };
};
