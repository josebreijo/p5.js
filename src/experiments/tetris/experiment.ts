import p5 from 'p5';

import type { Experiment } from 'app/types';
import builtinControls from 'app/controls/builtin';
import { SHAPES } from './shapes';
import { EMPTY, FILLED, DELTA } from './constants';
import { Delta, Direction } from './types';

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  console.clear();

  // TODO: apply resize
  const BOARD_WIDTH = 20;
  const BLOCK_SIZE = Math.floor(c.windowWidth / BOARD_WIDTH);
  const BOARD_HEIGHT = Math.floor(c.windowHeight / BLOCK_SIZE);

  function getRandomShape() {
    const availableShapes = Object.keys(SHAPES);
    const choice = Math.floor(Math.random() * availableShapes.length);
    const shapeName = availableShapes[choice] as keyof typeof SHAPES;
    return SHAPES[shapeName];
  }

  function getNextActive() {
    const shape = getRandomShape();

    const shapeCenter = Math.floor(shape[0].length / 2);
    const screenCenter = Math.floor(BOARD_WIDTH / 2);
    const location = { x: screenCenter - shapeCenter, y: 0 };

    return { shape, location };
  }

  const board = Array.from({ length: BOARD_WIDTH }, () =>
    Array.from({ length: BOARD_HEIGHT }, () => EMPTY)
  );

  let active = getNextActive();

  function drawBoard(c: p5) {
    c.push();

    board.forEach((row, x) => {
      row.forEach((value, y) => {
        const color = value ? c.color(25, 80, 80) : c.color(255);
        c.fill(color);
        const dx = x * BLOCK_SIZE;
        const dy = y * BLOCK_SIZE;
        c.rect(dx, dy, BLOCK_SIZE, BLOCK_SIZE);
      });
    });

    c.pop();
  }

  function drawActive(c: p5) {
    c.push();
    c.fill(255, 100, 20);

    active.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value) return;
        const dx = (x + active.location.x) * BLOCK_SIZE;
        const dy = (y + active.location.y) * BLOCK_SIZE;
        c.rect(dx, dy, BLOCK_SIZE, BLOCK_SIZE);
      });
    });

    c.pop();
  }

  function hasCollition(delta: Delta) {
    let hasBoardCollition = false;

    console.log('\n');

    active.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (hasBoardCollition || !value) return;

        const dx = x + active.location.x + delta.dx;
        const dy = y + active.location.y + delta.dy;

        const boardState = board[dx][dy];

        if (boardState === undefined || boardState === FILLED) {
          hasBoardCollition = true;
          return;
        }
      });
    });

    return hasBoardCollition || false;
  }

  function freezeActive() {
    active.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value) return;

        const dx = x + active.location.x;
        const dy = y + active.location.y;

        board[dx][dy] = 1;
      });
    });
  }

  function moveActive(direction: Direction) {
    const { dx, dy } = DELTA[direction];

    if (hasCollition({ dx, dy })) {
      if (direction === 'DOWN') {
        freezeActive();
        active = getNextActive();
      }
    } else {
      active.location.x += dx;
      active.location.y += dy;
    }
  }

  // function rotateActive() {
  // }

  document.addEventListener('keydown', (event) => {
    event.preventDefault();

    switch (event.key) {
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
        // rotateActive();
        break;
      }
    }
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
    c.noLoop();
  };

  let lastFrame = 0;

  c.draw = function draw() {
    lastFrame += 1;
    c.clear(0, 0, 0, 0);

    controls.draw(c);

    if (lastFrame >= controls.signals.frameRate.value / 2) {
      lastFrame = 0;
      moveActive('DOWN');
    }

    drawBoard(c);
    drawActive(c);
  };
};
