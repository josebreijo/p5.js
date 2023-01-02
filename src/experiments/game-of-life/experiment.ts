import { effect } from '@preact/signals';
import p5 from 'p5';

import type { Experiment } from '../../types';
import builtinControls from '../../controls';
import experimentControls from './controls';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const SIZE = 60;
  const DEAD = 0;
  const ALIVE = 1;

  let population: number[][] = [];
  let cellSize = c.windowWidth / SIZE;

  let aliveTileColor = '#ffffff';
  let deadTileColor = '#000000';

  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
  ]);

  const aliveTileColorControl = experimentControls.color({
    id: 'aliveTileColor',
    defaultValue: aliveTileColor,
    label: 'alive tile color',
    setup(_, data) {
      effect(() => {
        aliveTileColor = data.value;
      });
    },
  });

  const deadTileColorControl = experimentControls.color({
    id: 'deadTileColor',
    defaultValue: deadTileColor,
    label: 'dead tile color',
    setup(_, data) {
      effect(() => {
        deadTileColor = data.value;
      });
    },
  });

  const customControls = experiment.registerControls([aliveTileColorControl, deadTileColorControl]);

  function generatePopulation(size: number, { random = true } = {}) {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => (random ? c.floor(c.random(2)) : DEAD)),
    );
  }

  function drawGrid() {
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        c.fill(population[x][y] === ALIVE ? aliveTileColor : deadTileColor);
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
    controls.setup(c);
    customControls.setup(c);

    population = generatePopulation(SIZE);

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.background(0);
    c.fill(255);
    c.colorMode(c.HSB);
  };

  c.draw = function draw() {
    controls.draw(c);
    customControls.draw(c);

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
