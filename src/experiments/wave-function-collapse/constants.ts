import { Connections as Rules, TileUI } from './types';

export const DIMENSION = 25;

export const BLANK = 'BLANK';
export const UP = 'UP';
export const RIGHT = 'RIGHT';
export const DOWN = 'DOWN';
export const LEFT = 'LEFT';

export const TILES_UI: Record<string, TileUI> = {
  BLANK: [0, 0, 0, 0],
  UP: [1, 1, 0, 1],
  RIGHT: [1, 1, 1, 0],
  DOWN: [0, 1, 1, 1],
  LEFT: [1, 0, 1, 1],
};

export const MOVEMENT_DELTA = [
  { x: 0, y: -1, direction: UP },
  { x: 1, y: 0, direction: RIGHT },
  { x: 0, y: 1, direction: DOWN },
  { x: -1, y: 0, direction: LEFT },
] as const;

export const RULES: Rules = {
  BLANK: {
    UP: [BLANK, UP],
    RIGHT: [BLANK, RIGHT],
    DOWN: [BLANK, DOWN],
    LEFT: [BLANK, LEFT],
  },
  UP: {
    UP: [DOWN, RIGHT, LEFT],
    RIGHT: [UP, DOWN, LEFT],
    DOWN: [BLANK, DOWN],
    LEFT: [UP, DOWN, RIGHT],
  },
  RIGHT: {
    UP: [DOWN, RIGHT, LEFT],
    RIGHT: [UP, DOWN, LEFT],
    DOWN: [UP, LEFT, RIGHT],
    LEFT: [BLANK, LEFT],
  },
  DOWN: {
    UP: [BLANK, UP],
    RIGHT: [UP, DOWN, LEFT],
    DOWN: [UP, LEFT, RIGHT],
    LEFT: [UP, DOWN, RIGHT],
  },
  LEFT: {
    UP: [DOWN, RIGHT, LEFT],
    RIGHT: [BLANK, RIGHT],
    DOWN: [UP, LEFT, RIGHT],
    LEFT: [UP, DOWN, RIGHT],
  },
};
