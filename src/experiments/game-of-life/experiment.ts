import p5 from 'p5';

import type { Experiment } from '../../types';
import controls from '../../modules/controls';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const runningControl = experiment.exposeControl(controls.rendering.running);
  const frameRateControl = experiment.exposeControl(controls.rendering.frameRate);
  const frameCountControl = experiment.exposeControl(controls.rendering.frameCount);

  const SIZE = 40;
  const DEAD = 0;
  const ALIVE = 1;
  const DEAD_COLOR = 0;
  const ALIVE_COLOR = 240;

  let population: number[][] = [];
  let cellSize = c.windowWidth / SIZE;

  function generatePopulation(size: number, { random = true } = {}) {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => (random ? c.floor(c.random(2)) : DEAD)),
    );
  }

  function drawGrid() {
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        c.fill(population[x][y] === ALIVE ? ALIVE_COLOR : DEAD_COLOR);
        c.rect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
      }
    }
  }

  function getNen(x: number, y: number) {
    let nen = 0;

    for (let deltaX = -1; deltaX <= 1; deltaX++) {
      for (let deltaY = -1; deltaY <= 1; deltaY++) {
        const nX = x + deltaX;
        const nY = y + deltaY;

        if ((deltaX === 0 && deltaY === 0) || nX < 0 || nX >= SIZE || nY < 0 || nY >= SIZE) {
          continue;
        }

        nen += population[nX][nY];
      }
    }

    return nen;
  }

  c.setup = function setup() {
    runningControl.setup(c, runningControl.data);
    frameRateControl.setup(c, frameRateControl.data);
    frameCountControl.setup(c, frameCountControl.data);

    population = generatePopulation(SIZE);

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.background(0);
    c.fill(255);
    c.colorMode(c.HSB);
  };

  c.draw = function draw() {
    runningControl.draw(c, runningControl.data);
    frameRateControl.draw(c, frameRateControl.data);
    frameCountControl.draw(c, frameCountControl.data);

    drawGrid();

    cellSize = c.windowWidth / SIZE;
    let nextGen: number[][] = generatePopulation(SIZE, { random: false });

    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        const nen = getNen(x, y);

        if (population[x][y] === DEAD) {
          nextGen[x][y] = nen === 3 ? ALIVE : DEAD;
        } else {
          nextGen[x][y] = nen < 2 || nen > 3 ? DEAD : ALIVE;
        }
      }
    }

    population = nextGen;
  };
};
