export const UP = 'UP';
export const RIGHT = 'RIGHT';
export const DOWN = 'DOWN';
export const LEFT = 'LEFT';

export const SKETCH_NODE_ID = 'sketch';

export const MOVEMENT_DELTA = [
  { x: 0, y: -1, direction: UP },
  { x: 1, y: 0, direction: RIGHT },
  { x: 0, y: 1, direction: DOWN },
  { x: -1, y: 0, direction: LEFT },
] as const;

export const STORAGE_KEY = {
  GLOBALS: 'globals',
  ACTIVE_EXPERIMENT_ID: 'active-experiment-id',
} as const;
