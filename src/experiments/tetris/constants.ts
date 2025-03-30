import type { Direction, Delta } from './types';

export const EMPTY = 0;
export const FILLED = 1;

export const DELTA: Record<Direction, Delta> = {
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
  DOWN: { dx: 0, dy: 1 }
};
