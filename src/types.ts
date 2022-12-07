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
