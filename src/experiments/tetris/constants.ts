import type { Direction, Delta } from './types';

export const EMPTY = 0;
export const FILLED = 1;

export const DELTA: Record<Direction, Delta> = {
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
  DOWN: { dx: 0, dy: 1 }
};

export const COLORS = {
  yellow: [204, 204, 153],
  cyan: [153, 204, 204],
  green: [153, 204, 153],
  red: [204, 153, 153],
  orange: [204, 178, 153],
  blue: [153, 153, 204],
  purple: [178, 153, 204]
};
