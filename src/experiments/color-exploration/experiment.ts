import p5 from 'p5';

import type { Experiment } from '../../types';
import builtinControls from '../../controls/builtin';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  let hue = 0;
  let saturation = 100;
  let lightness = 50;

  let rotateHue = true;

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
    c.colorMode(c.HSB);
    c.fill(255);
    c.textSize(26);
    c.textFont('JetBrains Mono');
  };

  c.draw = function draw() {
    controls.draw(c);

    const mouseDeltaX = c.map(c.mouseX, 0, c.windowWidth, 0, 101);
    const mouseDeltaY = c.map(c.mouseY, 0, c.windowHeight, 0, 101);

    hue = rotateHue ? (hue + 0.25) % 360 : hue;
    saturation = c.int(mouseDeltaX);
    lightness = c.int(mouseDeltaY);

    c.fill(lightness > 60 ? 0 : 255);
    c.background(hue, saturation, lightness);

    const currentColor = `
      hue: ${c.int(hue)}
      saturation: ${saturation}
      lightness: ${lightness}`;

    c.text(currentColor, 20, 50);
  };

  // TODO: avoid clicks on the controls
  c.mousePressed = function () {
    rotateHue = !rotateHue;

    if (!rotateHue) {
      const hslColor = `hsl(${c.int(hue)}deg ${saturation}% ${lightness}%)`;
      window.navigator.clipboard.writeText(hslColor);
    }
  };
};
