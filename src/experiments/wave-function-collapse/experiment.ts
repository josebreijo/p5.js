import p5 from 'p5';

import type { Experiment } from '../../types';
import type { Option, Tile } from './types';
import builtinControls from '../../controls/builtin';
import position from '../../utils/position';
import utils from './utils';
import { BLANK, RULES, DOWN, LEFT, MOVEMENT_DELTA, RIGHT, TILES_UI, UP } from './constants';
import factoryControls from '../../controls/factory';

interface Defaults {
  TILES_PER_ROW: number;
}

const DEFAULTS: Defaults = {
  TILES_PER_ROW: 20,
};

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.fps,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
    builtinControls.rendering.redraw,
  ]);

  const OPTIONS: Option[] = [BLANK, UP, RIGHT, DOWN, LEFT];

  let tilesPerRow = DEFAULTS.TILES_PER_ROW;
  let minimumTilesPerRow = 10;

  let grid: Tile[] = Array.from({ length: tilesPerRow * tilesPerRow }).map((_, index) => ({
    index,
    options: OPTIONS,
    seed: false,
    collapsed: false,
    position: position.getPosition(tilesPerRow, index),
  }));

  let seedIndex = c.floor(c.random(tilesPerRow * tilesPerRow));

  grid[seedIndex].seed = true;
  grid[seedIndex].options = utils.randomizeOptions(OPTIONS);

  function restart(userDefaults: Partial<Defaults> = DEFAULTS) {
    tilesPerRow = userDefaults.TILES_PER_ROW || DEFAULTS.TILES_PER_ROW;

    grid = Array.from({ length: tilesPerRow * tilesPerRow }).map((_, index) => ({
      index,
      options: OPTIONS,
      seed: false,
      collapsed: false,
      position: position.getPosition(tilesPerRow, index),
    }));

    seedIndex = c.floor(c.random(tilesPerRow * tilesPerRow));

    grid[seedIndex].seed = true;
    grid[seedIndex].options = utils.randomizeOptions(OPTIONS);

    controls.signals.running.value = true;
    c.clear(0, 0, 0, 0);
    c.redraw();
  }

  function collapseTile(grid: Tile[]) {
    const sortedByLessEntropy = [...grid]
      .filter((tile) => !tile.collapsed)
      .sort((first, second) => first.options.length - second.options.length);

    if (sortedByLessEntropy.length === 0) {
      return null;
    }

    // Select the least entropy tiles
    const [leastEntropyTile] = sortedByLessEntropy;
    const leastEntropyTiles = [leastEntropyTile];
    let minimumEntropy = leastEntropyTile.options.length;

    for (let i = 1; i < sortedByLessEntropy.length; i++) {
      if (sortedByLessEntropy[i].options.length !== minimumEntropy) break;
      leastEntropyTiles.push(sortedByLessEntropy[i]);
    }

    // From the same entropy tiles, pick one at random
    const selectedTile = c.random(leastEntropyTiles) as Tile;
    const selectedTileType = c.random(selectedTile.options) as Option;

    // Collapse the lest entropy tile and reduce it's options
    selectedTile.collapsed = true;
    selectedTile.options = [selectedTileType];

    return selectedTile;
  }

  // Propagate entropy to the neighbors of the collapsed tiles as they're the only affected
  function propagateEntropy(grid: Tile[]) {
    const nextGrid = [...grid];

    for (let tileIndex = 0; tileIndex < nextGrid.length; tileIndex++) {
      const tile = nextGrid[tileIndex];

      // Collapsed tiles are ignored as their entropy is already zero
      if (tile.collapsed) continue;

      for (let k = 0; k < MOVEMENT_DELTA.length; k++) {
        const moveDelta = MOVEMENT_DELTA[k];
        const targetX = tile.position.x + moveDelta.x;
        const targetY = tile.position.y + moveDelta.y;

        const targetOffBounds =
          targetX < 0 || targetX >= tilesPerRow || targetY < 0 || targetY >= tilesPerRow;

        if (targetOffBounds) continue;

        const neighborTileIndex = targetX + targetY * tilesPerRow;
        const neighborTile = grid[neighborTileIndex];

        // Non-collapsed neighbor tiles are ignored as they don't affect the entropy of the current tile
        if (!neighborTile.collapsed) continue;

        const [neighborTileType] = neighborTile.options;
        const directionFromNeighbor = utils.inverse(moveDelta.direction);

        // Get the available options that matches the neighbor tile from the current one
        const optionsMatchingNeighborType = RULES[neighborTileType][directionFromNeighbor];

        // Intersect the available options with the existing ones
        const remainingTileOptions = tile.options.filter((currentTileOptions) =>
          optionsMatchingNeighborType.includes(currentTileOptions),
        );

        // Having no available options means the tile can't be matched from different sides
        if (remainingTileOptions.length === 0) {
          const errorMessage = 'Reached incorrect state, no backtracking implemented yet!';
          window.alert(errorMessage);
          window.location.reload();
        }

        tile.options = remainingTileOptions;
      }
    }

    return nextGrid;
  }

  function drawTile(tile: Tile, x: number, y: number, tileWidth: number, tileHeight: number) {
    const tileX = tile.position.x * tileWidth;
    const tileY = tile.position.y * tileHeight;
    const tileHue = c.map(tileX, 0, c.windowWidth, 0, 360);
    const tileLightness = c.map(tileY, 0, c.windowHeight, 40, 100);
    const tileColor = c.color(tileHue, 100, tileLightness);
    const maxTilesPerRow = c.floor(c.windowWidth / minimumTilesPerRow);
    const tileStrokeWeight = c.map(tilesPerRow, 5, maxTilesPerRow, 6, 1);

    c.push();
    c.noFill();
    c.strokeCap(c.SQUARE);
    c.rectMode(c.CENTER);
    c.strokeWeight(tileStrokeWeight);
    c.stroke(tileColor);
    c.translate(x + tileWidth / 2, y + tileHeight / 2);

    // Draws a tile by using a clockwise array representation e.g. UP for [1, 1, 0, 1]
    const [tileUI] = tile.options;
    const tileOrientation = TILES_UI[tileUI];

    for (let k = 0; k < tileOrientation.length; k++) {
      if (tileOrientation[k] === 0) continue;

      const delta = MOVEMENT_DELTA[k];
      const targetX = delta.x * (tileWidth / 2);
      const targetY = delta.y * (tileHeight / 2);

      // Draw lines to the tile edges
      c.line(0, 0, targetX, targetY);
    }

    c.pop();
  }

  function drawGrid() {
    const tileWidth = c.windowWidth / tilesPerRow;
    const tileHeight = c.windowHeight / tilesPerRow;

    for (let tileIndex = 0; tileIndex < grid.length; tileIndex++) {
      const tile = grid[tileIndex];
      const tileX = tile.position.x * tileWidth;
      const tileY = tile.position.y * tileHeight;

      if (tile.collapsed) {
        drawTile(tile, tileX, tileY, tileWidth, tileHeight);
      }
    }
  }

  const tilesPerRowControl = factoryControls.slider({
    id: 'tilesPerRow',
    defaultValue: tilesPerRow,
    label: 'tiles per row',
    min: 5,
    max: c.floor(c.windowWidth / 10),
    step: 1,
    setup(data) {
      restart({ TILES_PER_ROW: data.value });
    },
  });

  const customControls = experiment.registerControls([tilesPerRowControl]);

  c.setup = function setup() {
    controls.setup(c);
    customControls.setup(c);

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
  };

  c.draw = function draw() {
    controls.draw(c);
    customControls.draw(c);

    const collapsedTile = collapseTile(grid);

    if (!collapsedTile) {
      controls.signals.running.value = false;

      return;
    }

    drawGrid();

    grid = propagateEntropy(grid);
  };

  c.windowResized = function () {
    restart();
    c.resizeCanvas(c.windowWidth, c.windowHeight);
  };
};
