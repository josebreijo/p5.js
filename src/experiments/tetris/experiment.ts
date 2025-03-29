import p5 from 'p5';

import type { Experiment } from 'app/types';
import builtinControls from 'app/controls/builtin';
import { SHAPES } from './shapes';

interface Delta {
  dx: number;
  dy: number;
}

// @ts-expect-error `exposeControl` defined in caller
export const experiment: Experiment = (c: p5) => {
  console.clear();

  // TODO: apply resize
  const BLOCK_COUNT = 20;
  const BLOCK_SIZE = Math.floor(c.windowWidth / BLOCK_COUNT);
  const GAME_HEIGHT = Math.floor(c.windowHeight / BLOCK_SIZE);

  function getRandomShape() {
    const options = Object.values(SHAPES);
    const pick = Math.floor(Math.random() * options.length);
    return options[pick];
  }

  function drawBoard(c: p5) {
    board.forEach((row, x) => {
      row.forEach((value, y) => {
        const color = value ? 255 : 25;
        c.fill(color);

        const dx = x * BLOCK_SIZE;
        const dy = y * BLOCK_SIZE;

        c.rect(dx, dy, BLOCK_SIZE, BLOCK_SIZE);
      });
    });
  }

  function drawActive(c: p5) {
    active.shape.forEach((row, x) => {
      row.forEach((value, y) => {
        if (!value) return;

        const dx = (x + active.location.x) * BLOCK_SIZE;
        const dy = (y + active.location.y) * BLOCK_SIZE;

        c.fill(100);
        c.rect(dx, dy, BLOCK_SIZE, BLOCK_SIZE);
      });
    });
  }

  // function hasCollition({ dx, dy }: Delta) {
  //   const targetX = active.location.x + dx;
  //   const targetY = active.location.y + dy;
  // }

  function moveActive({ dx, dy }: Delta) {
    // hasCollition({ dx, dy });

    active.location.x += dx;
    active.location.y += dy;
  }

  function rotateActive() {
    const current = active.shape;
  }

  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowRight': {
        moveActive({ dx: 1, dy: 0 });
        break;
      }
      case 'ArrowLeft': {
        moveActive({ dx: -1, dy: 0 });
        break;
      }
      case 'ArrowDown': {
        moveActive({ dx: 0, dy: 1 });
        break;
      }
      case 'ArrowUp': {
        rotateActive();
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

  const board = Array.from({ length: BLOCK_COUNT }, () =>
    Array.from({ length: GAME_HEIGHT }, () => 0)
  );

  const active = {
    location: { x: 0, y: 0 },
    shape: getRandomShape()
  };

  c.setup = function setup() {
    controls.setup(c);

    c.createCanvas(c.windowWidth, c.windowHeight);

    c.colorMode(c.HSB);
    c.background(0);
    c.fill(255);
  };

  c.draw = function draw() {
    controls.draw(c);

    c.clear(0, 0, 0, 0);

    drawBoard(c);
    drawActive(c);
  };
};
