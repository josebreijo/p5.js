import p5 from 'p5';

import type { Bit, Experiment } from '../../types';
import { EXTENDED_MOVEMENT_DELTA } from '../../constants';
import builtinControls from '../../controls/builtin';
import factoryControls from '../../controls/factory';
import position from '../../utils/position';

interface Defaults {
  TILE_SIZE: number;
  DEAD_COLOR: string;
  ALIVE_COLOR: string;
}

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const DEFAULTS: Defaults = {
    TILE_SIZE: 20,
    ALIVE_COLOR: '#2e9949',
    DEAD_COLOR: '#000000',
  };

  const DEAD = 0;
  const ALIVE = 1;

  let aliveTileColor = DEFAULTS.ALIVE_COLOR;
  let deadTileColor = DEFAULTS.DEAD_COLOR;
  let tileSize = DEFAULTS.TILE_SIZE;

  let columns = c.floor(c.windowWidth / tileSize);
  let rows = c.floor(c.windowHeight / tileSize);
  let gridSize = columns * rows;

  let population: Bit[] = [];

  function generatePopulation(): Bit[] {
    return Array.from({ length: gridSize }, () => c.random([DEAD, ALIVE]));
  }

  function drawGrid() {
    let columnPadding = (c.windowWidth - columns * tileSize) / 2;
    let rowPadding = (c.windowHeight - rows * tileSize) / 2;

    c.translate(columnPadding, rowPadding);

    for (let index = 0; index < gridSize; index++) {
      const { x, y } = position.getPosition(columns, index);

      const tileColor = population[index] === ALIVE ? aliveTileColor : deadTileColor;

      c.fill(tileColor);
      c.rect(x * tileSize, y * tileSize, tileSize - 3, tileSize - 3);
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

  // TODO: review offloading to worker (`experiment.compute(...)?`)
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

  function reset(userDefaults: Partial<Defaults> = DEFAULTS) {
    tileSize = userDefaults.TILE_SIZE || DEFAULTS.TILE_SIZE;
    aliveTileColor = userDefaults.ALIVE_COLOR || DEFAULTS.ALIVE_COLOR;
    deadTileColor = userDefaults.DEAD_COLOR || DEFAULTS.DEAD_COLOR;

    columns = c.floor(c.windowWidth / tileSize);
    rows = c.floor(c.windowHeight / tileSize);
    gridSize = columns * rows;
    population = generatePopulation();
  }

  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.fps,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
    builtinControls.rendering.redraw,
  ]);

  const aliveTileColorControl = factoryControls.color({
    id: 'aliveTileColor',
    defaultValue: aliveTileColor,
    label: 'alive tile color',
    setup(data) {
      aliveTileColor = data.value;
    },
  });

  const deadTileColorControl = factoryControls.color({
    id: 'deadTileColor',
    defaultValue: deadTileColor,
    label: 'dead tile color',
    setup(data) {
      deadTileColor = data.value;
    },
  });

  const tileSizeControl = factoryControls.slider({
    id: 'tileSize',
    defaultValue: tileSize,
    label: 'tile size',
    min: 10,
    max: c.floor(c.windowWidth / 12),
    step: 1,
    setup(data) {
      reset({ TILE_SIZE: data.value });
    },
  });

  const customControls = experiment.registerControls([
    aliveTileColorControl,
    deadTileColorControl,
    tileSizeControl,
  ]);

  c.setup = function setup() {
    controls.setup(c);
    customControls.setup(c);

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);

    population = generatePopulation();
  };

  c.draw = function draw() {
    controls.draw(c);
    customControls.draw(c);

    c.noStroke();
    c.fill(aliveTileColor);
    c.background(deadTileColor);

    drawGrid();
    population = evolve();
  };

  c.windowResized = function windowResized() {
    c.resizeCanvas(c.windowWidth, c.windowHeight);

    const { aliveTileColor, deadTileColor, tileSize } = customControls.signals;

    // TODO: review and generalize `reset` approach
    reset({
      TILE_SIZE: tileSize.value,
      ALIVE_COLOR: aliveTileColor.value,
      DEAD_COLOR: deadTileColor.value,
    });
  };
};
