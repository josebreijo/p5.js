import p5 from 'p5';
import { Bit } from './types';
import utils from './utils';

function sketch(c: p5) {
  const FRAMERATE = 30;

  const CELL_SIZE = 6;
  const gridLength = c.ceil(c.windowWidth / CELL_SIZE);
  const lifespan = c.ceil(c.windowHeight / CELL_SIZE);

  const RULE = 30;
  const ruleSet = utils.generateRuleSet(RULE);

  let epoch = 0;
  let cells: Bit[] = Array.from({ length: gridLength }, () => 0);

  c.setup = function setup() {
    c.frameRate(FRAMERATE);
    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
    c.background(0);
    c.fill(255);
    c.stroke(230, 100, 50);
    c.strokeWeight(1);

    cells[c.floor(gridLength / 2)] = 1;
  };

  c.draw = function draw() {
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
