import p5 from 'p5';

import type { Experiment } from '../../types';
import type { Bit } from './types';
import controls from '../../modules/controls';
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

  function updateRule(newRule: number) {
    rule = newRule;
    ruleSet = utils.generateRuleSet(rule);

    epoch = 0;
    cells = Array.from({ length: gridLength * 2 }, () => 0);

    // TODO: allow to update the seed as well
    cells[c.ceil(gridLength / 2)] = 1;

    c.clear(0, 0, 0, 0);
  }

  const runningControl = experiment.exposeControl(controls.rendering.running);
  const frameRateControl = experiment.exposeControl(controls.rendering.frameRate);
  const frameCountControl = experiment.exposeControl(controls.rendering.frameCount);

  // TODO: generalize the concept of restarting an experiment via this pattern
  const ruleNumberControl = experiment.exposeControl(
    experimentControls.ruleNumberControl(updateRule),
  );

  c.setup = function setup() {
    runningControl.setup(c, runningControl.data);
    frameRateControl.setup(c, frameRateControl.data);
    frameCountControl.setup(c, frameCountControl.data);
    ruleNumberControl.setup(c, ruleNumberControl.data);

    cells[c.floor(gridLength / 2)] = 1;

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
    c.background(0);
    c.fill(255);
    c.strokeWeight(1);
  };

  c.draw = function draw() {
    runningControl.draw(c, runningControl.data);
    frameRateControl.draw(c, frameRateControl.data);
    frameCountControl.draw(c, frameCountControl.data);
    ruleNumberControl.draw(c, ruleNumberControl.data);

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
};
