import { Signal } from '@preact/signals';
import p5 from 'p5';

export interface Position {
  x: number;
  y: number;
}

export type Serializable = string | number | boolean | null;

export type Globals = Record<string, Serializable>;

export type ControlType = 'select' | 'checkbox' | 'slider';

export interface ControlDefaults {
  id: string;
  label: string;
  description?: string;
  type: ControlType;
  value: Serializable;
}

export interface SelectControl extends ControlDefaults {
  type: 'select';
  value: string;
  options: string[];
}

export interface CheckboxControl extends ControlDefaults {
  type: 'checkbox';
  value: boolean;
}

export interface SliderControl extends ControlDefaults {
  type: 'slider';
  value: number;
  min: number;
  max: number;
  step: number;
}

export type ControlSettings = SelectControl | CheckboxControl | SliderControl;

export interface Control {
  data: Signal;
  onChange: (value: any) => void;
  settings: ControlSettings;
}

export interface Experiment {
  (c: p5): void;
  exposeControl: (settings: ControlSettings) => Signal;
}

export interface ExperimentDefinition {
  id: string;
  name: string;
  experiment: Experiment;
  description?: string;
  url?: string;
}
