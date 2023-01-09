import p5 from 'p5';

import type { Bit, Experiment } from '../../types';
import builtinControls from '../../controls/builtin';
import factoryControls from '../../controls/factory';
import utils from './utils';

interface Defaults {
  RULE: number;
}

const DEFAULTS: Defaults = {
  RULE: 30,
};

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const CELL_SIZE = 4;
  const gridLength = c.ceil(c.windowWidth / CELL_SIZE);
  const lifespan = c.ceil(c.windowHeight / CELL_SIZE);

  let rule = DEFAULTS.RULE;
  let ruleSet = utils.generateRuleSet(rule);
  let epoch = 0;
  let cells: Bit[] = Array.from({ length: gridLength * 2 }, () => 0);

  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.fps,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
    builtinControls.rendering.redraw,
  ]);

  function restart(userDefaults: Partial<Defaults> = DEFAULTS) {
    rule = userDefaults.RULE || DEFAULTS.RULE;
    ruleSet = utils.generateRuleSet(rule);
    epoch = 0;
    cells = Array.from({ length: gridLength * 2 }, () => 0);
    cells[c.ceil(gridLength / 2)] = 1;

    controls.signals.running.value = true;
    c.clear(0, 0, 0, 0);
  }

  const ruleNumberControl = factoryControls.select({
    id: 'ruleNumber',
    defaultValue: '30',
    options: [28, 30, 50, 54, 60, 90, 94, 102, 110, 150, 158, 188, 190, 220].map((rule) =>
      rule.toString(),
    ),
    label: 'ruleset',
    setup(data) {
      restart({ RULE: Number(data.value) });
    },
  });

  const customControls = experiment.registerControls([ruleNumberControl]);

  const restartControl = builtinControls.rendering.restart({
    restartExperiment() {
      customControls.signals.ruleNumber.value = DEFAULTS.RULE.toString();
      restart();
    },
  });

  const reloadWithChangesControls = builtinControls.rendering.reload({
    reloadExperiment() {
      restart({ RULE: Number(customControls.signals.ruleNumber.value) });
    },
  });

  const playbackControls = experiment.registerControls([restartControl, reloadWithChangesControls]);

  c.setup = function setup() {
    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
    c.background(0);
    c.fill(255);
    c.strokeWeight(1);

    controls.setup(c);
    customControls.setup(c);
    playbackControls.setup(c);

    cells[c.floor(gridLength / 2)] = 1;
  };

  c.draw = function draw() {
    controls.draw(c);
    customControls.draw(c);
    playbackControls.draw(c);

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
