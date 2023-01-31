export const NORTH = 'N';
export const NORTH_EAST = 'NE';
export const EAST = 'E';
export const SOUTH_EAST = 'SE';
export const SOUTH = 'S';
export const SOUTH_WEST = 'SW';
export const WEST = 'W';
export const NORTH_WEST = 'NW';

export const SKETCH_NODE_ID = 'sketch';

export const DEFAULT_EXPERIMENT_ID = 'game-of-life';

export const SIMPLE_MOVEMENT_DELTA = [
  {x: 0, y: -1, direction: NORTH},
  {x: 1, y: 0, direction: EAST},
  {x: 0, y: 1, direction: SOUTH},
  {x: -1, y: 0, direction: WEST},
] as const;

export const EXTENDED_MOVEMENT_DELTA = [
  {x: 0, y: -1, direction: NORTH},
  {x: 1, y: -1, direction: NORTH_EAST},
  {x: 1, y: 0, direction: EAST},
  {x: 1, y: 1, direction: SOUTH_EAST},
  {x: 0, y: 1, direction: SOUTH},
  {x: -1, y: 1, direction: SOUTH_WEST},
  {x: -1, y: 0, direction: WEST},
  {x: -1, y: -1, direction: NORTH_WEST},
] as const;

export const STORAGE_KEY = {
  GLOBALS: 'globals',
  ACTIVE_EXPERIMENT_ID: 'active-experiment-id',
} as const;
