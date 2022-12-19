import p5 from 'p5';

export interface Position {
  x: number;
  y: number;
}

export type Serializable = string | number | boolean | null;

export type Globals = Record<string, Serializable>;

declare global {
  interface Window {
    globals: Globals;
  }
}

export interface Experiment {
  id: string;
  name: string;
  sketch: (p: p5) => void;
  description?: string;
  url?: string;
}
