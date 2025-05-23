import p5 from 'p5';

import type { Bit, Experiment, Position } from 'app/types';
import { EXTENDED_MOVEMENT_DELTA } from 'app/constants';
import builtinControls from 'app/controls/builtin';
import factoryControls from 'app/controls/factory';
import position from 'app/utils/position';

interface Defaults {
  TILE_SIZE: number;
  DEAD_COLOR: string;
  ALIVE_COLOR: string;
}

const DEFAULTS: Defaults = {
  TILE_SIZE: 15,
  ALIVE_COLOR: '#2e9949',
  DEAD_COLOR: '#000000'
};

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const DEAD = 0;
  const ALIVE = 1;

  let aliveCount = 0;

  let tileSize = DEFAULTS.TILE_SIZE;
  let aliveTileColor = DEFAULTS.ALIVE_COLOR;
  let deadTileColor = DEFAULTS.DEAD_COLOR;
  let columns = c.floor(c.windowWidth / tileSize);
  let rows = c.floor(c.windowHeight / tileSize);
  let gridSize = columns * rows;
  let population: Bit[] = [];

  function generatePopulation(): Bit[] {
    return Array.from({ length: gridSize }, () => {
      const state: Bit = c.random([DEAD, ALIVE]);
      aliveCount += state;
      return state;
    });
  }

  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.fps,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
    builtinControls.rendering.redraw,
    builtinControls.storage.saveFrame(experiment.name)
  ]);

  function restart(userDefaults: Partial<Defaults> = DEFAULTS) {
    tileSize = userDefaults.TILE_SIZE || DEFAULTS.TILE_SIZE;
    aliveTileColor = userDefaults.ALIVE_COLOR || DEFAULTS.ALIVE_COLOR;
    deadTileColor = userDefaults.DEAD_COLOR || DEFAULTS.DEAD_COLOR;

    columns = c.floor(c.windowWidth / tileSize);
    rows = c.floor(c.windowHeight / tileSize);
    gridSize = columns * rows;
    population = generatePopulation();

    // TODO: review hiding this implementation detail
    controls.signals.running.value = true;
    c.clear(0, 0, 0, 0);
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

    // Look through all 9 compass directions on the tiled board
    for (let delta of EXTENDED_MOVEMENT_DELTA) {
      let deltaX = tilePosition.x + delta.x;
      let deltaY = tilePosition.y + delta.y;

      // If were close to the edge, move to what would be a natural edge connection
      deltaX = deltaX < 0 ? columns - 1 : deltaX >= columns ? 0 : deltaX;
      deltaY = deltaX < 0 ? rows - 1 : deltaY >= rows ? 0 : deltaY;

      // Get the equivalent index in the population
      const targetTilePosition = { x: deltaX, y: deltaY };
      const targetIndex = position.getIndex(columns, targetTilePosition);

      // Increment the count based on the state
      neighbors += population[targetIndex];
    }

    return neighbors;
  }

  // TODO: review offloading to worker (`experiment.compute(...)?`)
  function evolve() {
    aliveCount = 0;
    let nextGen: Bit[] = [];

    for (let index = 0; index < gridSize; index++) {
      const neighbors = getNeighborCount(index);

      if (population[index] === DEAD) {
        nextGen[index] = neighbors === 3 ? ALIVE : DEAD;
      } else {
        nextGen[index] = neighbors < 2 || neighbors > 3 ? DEAD : ALIVE;
      }

      aliveCount += nextGen[index];
    }

    return nextGen;
  }

  const aliveTileColorControl = factoryControls.color({
    id: 'aliveTileColor',
    defaultValue: aliveTileColor,
    label: 'alive tile color',
    setup(data) {
      aliveTileColor = data.value;
    }
  });

  const deadTileColorControl = factoryControls.color({
    id: 'deadTileColor',
    defaultValue: deadTileColor,
    label: 'dead tile color',
    setup(data) {
      deadTileColor = data.value;
    }
  });

  const tileSizeControl = factoryControls.slider({
    id: 'tileSize',
    defaultValue: tileSize,
    label: 'tile size',
    min: 10,
    max: c.floor(c.windowWidth / 12),
    step: 1,
    setup(data) {
      restart({ TILE_SIZE: data.value, DEAD_COLOR: deadTileColor, ALIVE_COLOR: aliveTileColor });
    }
  });

  const tileControls = experiment.registerControls([
    aliveTileColorControl,
    deadTileColorControl,
    tileSizeControl
  ]);

  const restartControl = builtinControls.rendering.restart({
    restartExperiment() {
      tileControls.signals.aliveTileColor.value = DEFAULTS.ALIVE_COLOR;
      tileControls.signals.deadTileColor.value = DEFAULTS.DEAD_COLOR;
      tileControls.signals.tileSize.value = DEFAULTS.TILE_SIZE;
      restart();
    }
  });
  const reloadWithChangesControl = builtinControls.rendering.reload({
    reloadExperiment() {
      restart({
        ALIVE_COLOR: tileControls.signals.aliveTileColor.value,
        DEAD_COLOR: tileControls.signals.deadTileColor.value,
        TILE_SIZE: tileControls.signals.tileSize.value
      });
    }
  });

  const playbackControls = experiment.registerControls([restartControl, reloadWithChangesControl]);

  const aliveCountControl = factoryControls.info({
    id: 'aliveCount',
    defaultValue: aliveCount.toString(),
    label: 'alive',
    category: 'stats',
    draw(data) {
      data.value = aliveCount;
    }
  });

  const statsControls = experiment.registerControls([aliveCountControl]);

  c.setup = function setup() {
    controls.setup(c);
    tileControls.setup(c);
    playbackControls.setup(c);
    statsControls.setup(c);

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);

    population = generatePopulation();
  };

  c.draw = function draw() {
    controls.draw(c);
    tileControls.draw(c);
    playbackControls.draw(c);
    statsControls.draw(c);

    c.noStroke();
    c.fill(aliveTileColor);
    c.background(deadTileColor);

    drawGrid();
    population = evolve();
  };

  c.windowResized = function windowResized() {
    c.resizeCanvas(c.windowWidth, c.windowHeight);

    const { aliveTileColor, deadTileColor, tileSize } = tileControls.signals;

    restart({
      TILE_SIZE: tileSize.value,
      ALIVE_COLOR: aliveTileColor.value,
      DEAD_COLOR: deadTileColor.value
    });
  };

  function getCoordinateFromPointer(event: MouseEvent): Position {
    const tileX = c.floor(event.clientX / tileSize);
    const tileY = c.floor(event.clientY / tileSize);
    return { x: tileX, y: tileY };
  }

  c.mouseMoved = function mouseMoved(event: MouseEvent) {
    const { x, y } = getCoordinateFromPointer(event);

    c.push();
    c.noFill();
    c.stroke(aliveTileColor);
    c.strokeWeight(1);
    c.rect(x * tileSize, y * tileSize, tileSize - 2, tileSize - 2);
    c.pop();
  };

  c.mousePressed = function mousePressed(event: MouseEvent) {
    const tilePosition = getCoordinateFromPointer(event);
    const index = position.getIndex(columns, tilePosition);

    population[index] = c.abs(population[index] - 1) as Bit;
  };
};
