import type { Position } from 'app/types';

function getIndex(upperBound: number, position: Position): number {
  return position.x + position.y * upperBound;
}

function getPosition(upperBound: number, index: number): Position {
  return {
    x: index % upperBound,
    y: Math.trunc(index / upperBound),
  };
}

export { getIndex, getPosition };
