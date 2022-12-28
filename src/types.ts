import { Signal } from '@preact/signals';
import p5 from 'p5';

export interface Position {
  x: number;
  y: number;
}

export type Serializable = string | number | boolean | null;

export type Globals = Record<string, Serializable>;

export interface Experiment {
  id: string;
  name: string;
  sketch: (p: p5) => void;
  description?: string;
  url?: string;
}

export type ControlSettings = {
  id: string;
  name: string;
  description?: string;
} & ({ type: 'select'; value: string; options: string[] } | { type: 'checkbox'; value: boolean });

export interface Control {
  id: string;
  data: Signal;
  onChange: (value: any) => void;
  settings: ControlSettings;
}
