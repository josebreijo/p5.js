import p5 from 'p5';

import type { Experiment } from '../../types';
import type { Option, Tile } from './types';
import controls from '../../modules/controls';
import * as utils from './utils';
import {
  BLANK,
  RULES,
  DOWN,
  LEFT,
  MOVEMENT_DELTA,
  RIGHT,
  TILES_UI,
  UP,
  DIMENSION,
} from './constants';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  const runningControl = experiment.exposeControl(controls.rendering.running);
  const frameRateControl = experiment.exposeControl(controls.rendering.frameRate);
  const frameCountControl = experiment.exposeControl(controls.rendering.frameCount);

  const OPTIONS: Option[] = [BLANK, UP, RIGHT, DOWN, LEFT];

  let grid: Tile[] = Array.from({ length: DIMENSION * DIMENSION }).map((_, index) => ({
    index,
    options: OPTIONS,
    seed: false,
    collapsed: false,
    position: utils.getTilePosition(index),
  }));

  const seedIndex = c.floor(c.random(DIMENSION * DIMENSION));

  grid[seedIndex].seed = true;
  grid[seedIndex].options = utils.randomizeOptions(OPTIONS);

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
          targetX < 0 || targetX >= DIMENSION || targetY < 0 || targetY >= DIMENSION;

        if (targetOffBounds) continue;

        const neighborTileIndex = targetX + targetY * DIMENSION;
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
    const tileStrokeWeight = c.map(tileX, 0, c.windowWidth, 2, 6);

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
    const tileWidth = c.windowWidth / DIMENSION;
    const tileHeight = c.windowHeight / DIMENSION;

    for (let tileIndex = 0; tileIndex < grid.length; tileIndex++) {
      const tile = grid[tileIndex];
      const tileX = tile.position.x * tileWidth;
      const tileY = tile.position.y * tileHeight;

      if (tile.collapsed) {
        drawTile(tile, tileX, tileY, tileWidth, tileHeight);
      }
    }
  }

  c.setup = function setup() {
    runningControl.setup(c, runningControl.data);
    frameRateControl.setup(c, frameRateControl.data);
    frameCountControl.setup(c, frameCountControl.data);

    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
  };

  c.draw = function draw() {
    runningControl.draw(c, runningControl.data);
    frameRateControl.draw(c, frameRateControl.data);
    frameCountControl.draw(c, frameCountControl.data);

    const collapsedTile = collapseTile(grid);

    if (!collapsedTile) {
      c.noLoop();
      return;
    }

    drawGrid();

    grid = propagateEntropy(grid);
  };

  c.windowResized = function () {
    c.resizeCanvas(c.windowWidth, c.windowHeight);
  };
};
