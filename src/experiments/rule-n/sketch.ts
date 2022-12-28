import { effect } from '@preact/signals';
import p5 from 'p5';

import { Bit } from './types';
import utils from './utils';

function sketch(c: p5) {
  // @ts-expect-error // TODO: type properly
  const running = sketch.createControl('running', { type: 'checkbox', value: true });

  // @ts-expect-error // TODO: type properly
  const frameRate = sketch.createControl('framerate', {
    type: 'select',
    value: 30,
    options: [5, 24, 30, 60],
  });

  const CELL_SIZE = 4;
  const gridLength = c.ceil(c.windowWidth / CELL_SIZE);
  const lifespan = c.ceil(c.windowHeight / CELL_SIZE);

  const RULE = 30;
  const ruleSet = utils.generateRuleSet(RULE);

  let epoch = 0;
  let cells: Bit[] = Array.from({ length: gridLength * 2 }, () => 0);

  c.setup = function setup() {
    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
    c.background(0);
    c.fill(255);
    c.strokeWeight(1);

    cells[c.floor(gridLength / 2)] = 1;

    effect(() => c.frameRate(Number(frameRate.value)));

    effect(() => {
      if (running.value && !c.isLooping()) c.loop();
      if (c.isLooping() && !running.value) c.noLoop();
    });
  };

  c.draw = function draw() {
    const hue = c.int(c.map(epoch, 0, c.windowHeight, 0, 360));
    c.stroke(hue, 100, 100);

    for (let i = 0; i < gridLength; i++) {
      if (cells[i]) {
        c.rect(i * CELL_SIZE, epoch * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    const nextCells: Bit[] = [];

    for (let i = 0; i < cells.length; i++) {
      const left = cells[i - 1] || 0;
      const central = cells[i];
      const right = cells[i + 1] || 0;
      const pattern = `${left}${central}${right}`;

      nextCells.push(ruleSet[pattern]);
    }

    cells = nextCells;
    epoch += 1;

    if (epoch > lifespan) {
      c.noLoop();
    }
  };
}

export { sketch };
