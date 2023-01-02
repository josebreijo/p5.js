import p5 from 'p5';

import type { Bit, Experiment } from '../../types';
import builtinControls from '../../controls';
import experimentControls from './controls';
import utils from './utils';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const CELL_SIZE = 4;
  const gridLength = c.ceil(c.windowWidth / CELL_SIZE);
  const lifespan = c.ceil(c.windowHeight / CELL_SIZE);

  let rule = 30;
  let ruleSet = utils.generateRuleSet(rule);
  let epoch = 0;
  let cells: Bit[] = Array.from({ length: gridLength * 2 }, () => 0);

  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
  ]);

  function resetSketch(newRule: number) {
    rule = newRule;
    ruleSet = utils.generateRuleSet(rule);
    epoch = 0;
    cells = Array.from({ length: gridLength * 2 }, () => 0);
    cells[c.ceil(gridLength / 2)] = 1;
    controls.signals.running.value = true;
    c.clear(0, 0, 0, 0);
  }

  const customControls = experiment.registerControls([experimentControls.ruleNumber(resetSketch)]);

  c.setup = function setup() {
    controls.setup(c);
    customControls.setup(c);

    cells[c.floor(gridLength / 2)] = 1;

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
    c.background(0);
    c.fill(255);
    c.strokeWeight(1);
  };

  c.draw = function draw() {
    controls.draw(c);
    customControls.draw(c);

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
      controls.signals.running.value = false;
    }
  };
};
