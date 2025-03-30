export type Direction = 'LEFT' | 'RIGHT' | 'DOWN';
export type ShapeNames = 'o' | 'l' | 's' | 'z' | 'L' | 'J' | 'T';

export interface Delta {
  dx: number;
  dy: number;
}

export interface Shape {
  color: number[];
  layout: number[][];
}

export interface ActivePiece extends Shape {
  location: { x: number; y: number };
}
