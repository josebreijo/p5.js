import p5 from 'p5';

import type { Experiment } from 'app/types';
import builtinControls from 'app/controls/builtin';
import { SHAPES } from './shapes';
import { EMPTY, FILLED, DELTA } from './constants';
import { ActivePiece, Delta, Direction } from './types';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  console.clear();

  // TODO: apply resize
  const BOARD_WIDTH = 10;
  const BLOCK_SIZE = Math.floor(c.windowWidth / BOARD_WIDTH);
  const BOARD_HEIGHT = Math.floor(c.windowHeight / BLOCK_SIZE);

  function getRandomShape() {
    const availableShapes = Object.keys(SHAPES);
    const choice = Math.floor(Math.random() * availableShapes.length);
    const shapeName = availableShapes[choice] as keyof typeof SHAPES;
    return SHAPES[shapeName];
  }

  function getNextActivePiece(): ActivePiece {
    const shape = getRandomShape();
    const shapeCenter = Math.floor(shape.layout[0].length / 2);
    const screenCenter = Math.floor(BOARD_WIDTH / 2);
    const location = { x: screenCenter - shapeCenter, y: 0 };
    return { ...shape, location };
  }

  const BOARD = Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => EMPTY)
  );

  let activePiece: ActivePiece = getNextActivePiece();
  let isGameOver = false;

  function resetGame() {
    BOARD.forEach((row, y) => {
      row.forEach((_, x) => {
        BOARD[y][x] = EMPTY;
      });
    });
    activePiece = getNextActivePiece();
    isGameOver = false;
  }

  function checkGameOver() {
    if (BOARD[0].some((cell) => cell === FILLED)) {
      isGameOver = true;
      alert('Game Over! Press OK to restart.');
      resetGame();
    }
  }

  function drawBoard(c: p5) {
    c.push();

    BOARD.forEach((row, y) => {
      row.forEach((value, x) => {
        c.fill(value ? c.color(25, 80, 80) : c.color(255));
        c.rect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      });
    });

    c.pop();
  }

  function drawActive(c: p5) {
    c.push();
    c.fill(c.color(activePiece.color));

    activePiece.layout.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value) return;

        const dx = (x + activePiece.location.x) * BLOCK_SIZE;
        const dy = (y + activePiece.location.y) * BLOCK_SIZE;

        c.rect(dx, dy, BLOCK_SIZE, BLOCK_SIZE);
      });
    });

    c.pop();
  }

  function hasCollition(delta: Delta) {
    let hasBoardCollition = false;

    activePiece.layout.forEach((row, y) => {
      row.forEach((value, x) => {
        if (hasBoardCollition || !value) return;

        const dx = x + activePiece.location.x + delta.dx;
        const dy = y + activePiece.location.y + delta.dy;
        const boardState = BOARD[dy]?.[dx];

        if (boardState === undefined || boardState === FILLED) {
          hasBoardCollition = true;
          return;
        }
      });
    });

    return hasBoardCollition || false;
  }

  function freezeActive() {
    activePiece.layout.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value) return;
        const dx = x + activePiece.location.x;
        const dy = y + activePiece.location.y;
        BOARD[dy][dx] = FILLED;
      });
    });

    checkGameOver();
  }

  function moveActive(direction: Direction) {
    const { dx, dy } = DELTA[direction];

    if (hasCollition({ dx, dy })) {
      if (direction === 'DOWN') {
        freezeActive();
        activePiece = getNextActivePiece();
      }
    } else {
      activePiece.location.x += dx;
      activePiece.location.y += dy;
    }
  }

  function rotateActive() {
    // Create a new array with swapped dimensions
    const rotated = Array.from({ length: activePiece.layout[0].length }, () =>
      Array.from({ length: activePiece.layout.length }, () => EMPTY)
    );

    // Rotate 90 degrees counter-clockwise by mapping:
    // - row index becomes the column index
    // - column index becomes the row index from right
    for (let y = 0; y < activePiece.layout.length; y++) {
      for (let x = 0; x < activePiece.layout[y].length; x++) {
        const newX = y;
        const newY = activePiece.layout[y].length - 1 - x;
        rotated[newY][newX] = activePiece.layout[y][x];
      }
    }

    // Check if rotation would cause collision
    const originalShape = activePiece.layout;
    activePiece.layout = rotated;

    if (hasCollition({ dx: 0, dy: 0 })) {
      // Restore original shape if collision detected
      activePiece.layout = originalShape;
      return;
    }
  }

  function checkForFullRows() {
    BOARD.forEach((row, y) => {
      if (row.every((value) => value === FILLED)) {
        BOARD.splice(y, 1);
        BOARD.unshift(Array.from({ length: BOARD_WIDTH }, () => EMPTY));
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (isGameOver) return;

    switch (event.code) {
      case 'ArrowRight': {
        moveActive('RIGHT');
        break;
      }
      case 'ArrowLeft': {
        moveActive('LEFT');
        break;
      }
      case 'ArrowDown': {
        moveActive('DOWN');
        break;
      }
      case 'ArrowUp': {
        rotateActive();
        break;
      }
      case 'Space': {
        controls.signals.running.value = !controls.signals.running.value;
        break;
      }
    }

    event.preventDefault();
  });

  const controls = experiment.registerControls([
    builtinControls.rendering.running,
    builtinControls.rendering.fps,
    builtinControls.rendering.frameRate,
    builtinControls.rendering.frameCount,
    builtinControls.rendering.redraw
  ]);

  c.setup = function setup() {
    controls.setup(c);
    controls.signals.frameRate.value = 60;

    c.createCanvas(c.windowWidth, c.windowHeight);
    rotateActive();
    // c.noLoop();
  };

  let lastFrame = 0;

  c.draw = function draw() {
    lastFrame += 1;
    c.clear(0, 0, 0, 0);

    controls.draw(c);

    if (!isGameOver && lastFrame >= controls.signals.frameRate.value) {
      lastFrame = 0;
      moveActive('DOWN');
    }

    drawBoard(c);
    drawActive(c);
    checkForFullRows();
  };
};
