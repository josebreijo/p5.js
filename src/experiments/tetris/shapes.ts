import { COLORS } from './constants';
import { Shape, ShapeNames } from './types';

export const SHAPES: Record<ShapeNames, Shape> = {
  o: {
    layout: [
      [1, 1],
      [1, 1]
    ],
    color: COLORS.yellow
  },
  l: {
    layout: [[1, 1, 1, 1]],
    color: COLORS.cyan
  },
  s: {
    layout: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: COLORS.green
  },
  z: {
    layout: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: COLORS.red
  },
  L: {
    layout: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    color: COLORS.orange
  },
  J: {
    layout: [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    color: COLORS.blue
  },
  T: {
    layout: [
      [1, 1, 1],
      [0, 1, 0]
    ],
    color: COLORS.purple
  }
};
