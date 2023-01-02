import p5 from 'p5';

import type { Experiment } from '../../types';
import builtinControls from '../../controls/builtin';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.fps,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
    builtinControls.rendering.redraw,
  ]);

  c.setup = function setup() {
    controls.setup(c);

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.background(0);
    c.fill(255);
    c.colorMode(c.HSB);
  };

  c.draw = function draw() {
    controls.draw(c);

    // TODO: enhance and list example
    // magic!
  };
};
