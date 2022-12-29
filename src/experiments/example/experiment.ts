import { effect } from '@preact/signals';
import p5 from 'p5';

import type { Experiment } from '../../types';
import controls from '../../modules/controls';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const globalControls = controls.buildGlobalControls(experiment);

  const running = globalControls.running();
  const frameRate = globalControls.frameRate();

  c.setup = function setup() {
    c.createCanvas(c.windowWidth, c.windowHeight);
    c.background(0);
    c.fill(255);
    c.colorMode(c.HSB);

    effect(() => c.frameRate(Number(frameRate.value)));

    effect(() => {
      if (running.value && !c.isLooping()) c.loop();
      if (c.isLooping() && !running.value) c.noLoop();
    });
  };

  c.draw = function draw() {
    // magic!
  };
};
