import { effect } from '@preact/signals';
import p5 from 'p5';

import type { Experiment } from '../../types';
import controls from '../../modules/controls';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const globalControls = controls.buildGlobalControls(experiment);

  const running = globalControls.running();
  const frameRate = globalControls.frameRate();

  let hue = 0;
  let saturation = 100;
  let lightness = 50;

  c.setup = function setup() {
    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
    c.fill(255);
    c.textSize(26);
    c.textFont('Iosevka Fixed');

    effect(() => c.frameRate(Number(frameRate.value)));

    effect(() => {
      if (running.value && !c.isLooping()) c.loop();
      if (c.isLooping() && !running.value) c.noLoop();
    });
  };

  c.draw = function draw() {
    const mouseDeltaX = c.map(c.mouseX, 0, c.windowWidth, 0, 101);
    const mouseDeltaY = c.map(c.mouseY, 0, c.windowHeight, 0, 101);

    hue = (hue + 0.25) % 360;
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

  c.mousePressed = function () {
    const toggleAnimation = running.value ? c.noLoop : c.loop;
    toggleAnimation.call(c);

    running.value = !running.value;

    if (!running.value) {
      const hslColor = `hsl(${c.int(hue)}deg ${saturation}% ${lightness}%)`;
      window.navigator.clipboard.writeText(hslColor);
    }
  };
};
