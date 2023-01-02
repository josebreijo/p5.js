import { effect } from '@preact/signals';
import p5 from 'p5';

import type { Bit, Experiment } from '../../types';
import position from '../../utils/position';
import builtinControls from '../../controls';
import factoryControls from '../../controls/factory';
import { EXTENDED_MOVEMENT_DELTA } from '../../constants';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const DEAD = 0;
  const ALIVE = 1;
  const TILE_SIZE = 10;

  let aliveTileColor = '#2e9949';
  let deadTileColor = '#000000';

  let population: Bit[] = [];

  let columns = c.floor(c.windowWidth / TILE_SIZE);
  let rows = c.floor(c.windowHeight / TILE_SIZE);
  let gridSize = columns * rows;

  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
  ]);

  const aliveTileColorControl = factoryControls.color({
    id: 'aliveTileColor',
    defaultValue: aliveTileColor,
    label: 'alive tile color',
    setup(_, data) {
      effect(() => (aliveTileColor = data.value));
    },
  });

  const deadTileColorControl = factoryControls.color({
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

  function generatePopulation(): Bit[] {
    return Array.from({ length: gridSize }, () => c.random([DEAD, ALIVE]));
  }

  function drawGrid() {
    let columnPadding = (c.windowWidth - columns * TILE_SIZE) / 2;
    let rowPadding = (c.windowHeight - rows * TILE_SIZE) / 2;

    c.translate(columnPadding, rowPadding);

    for (let i = 0; i < gridSize; i++) {
      const { x, y } = position.getPosition(columns, i);

      const tileColor = population[i] === ALIVE ? aliveTileColor : deadTileColor;
      c.fill(tileColor);
      c.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  function getNeighborCount(index: number) {
    let neighbors = 0;
    const tilePosition = position.getPosition(columns, index);

    for (let delta of EXTENDED_MOVEMENT_DELTA) {
      const deltaX = tilePosition.x + delta.x;
      const deltaY = tilePosition.y + delta.y;

      if (deltaX < 0 || deltaX >= columns || deltaY < 0 || deltaY >= rows) continue;

      const targetIndex = position.getIndex(columns, { x: deltaX, y: deltaY });

      if (targetIndex < 0 || targetIndex >= gridSize) continue;

      neighbors += population[targetIndex];
    }

    return neighbors;
  }

  function evolve() {
    let nextGen: Bit[] = [];

    for (let index = 0; index < gridSize; index++) {
      const neighbors = getNeighborCount(index);

      if (population[index] === DEAD) {
        nextGen[index] = neighbors === 3 ? ALIVE : DEAD;
      } else {
        nextGen[index] = neighbors < 2 || neighbors > 3 ? DEAD : ALIVE;
      }
    }

    return nextGen;
  }

  c.setup = function setup() {
    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);

    controls.setup(c);
    customControls.setup(c);

    population = generatePopulation();
  };

  c.draw = function draw() {
    c.fill(aliveTileColor);
    c.background(deadTileColor);

    controls.draw(c);
    customControls.draw(c);

    drawGrid();
    population = evolve();
  };

  c.windowResized = function windowResized() {
    columns = c.floor(c.windowWidth / TILE_SIZE);
    rows = c.floor(c.windowHeight / TILE_SIZE);
    gridSize = columns * rows;

    population = generatePopulation();

    c.resizeCanvas(c.windowWidth, c.windowHeight);
  };
};
