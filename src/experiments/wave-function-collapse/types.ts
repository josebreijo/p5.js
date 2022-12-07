export interface Position {
  x: number;
  y: number;
}

export type Option = 'BLANK' | 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
export type Direction = Exclude<Option, 'BLANK'>;

export type TileUI = [number, number, number, number];

export interface Tile {
  index: number;
  seed: boolean;
  position: Position;
  collapsed: boolean;
  options: Option[];
}

export type Connections = Record<Option, Record<Direction, Option[]>>;
