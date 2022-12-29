import type { Signal } from '@preact/signals';
import { JSXInternal } from 'preact/src/jsx';
import p5 from 'p5';

export interface Position {
  x: number;
  y: number;
}

export type Serializable = string | number | boolean | null;

export type Globals = Record<string, Serializable>;

export type ControlType = 'select' | 'checkbox' | 'slider' | 'info' | 'text';

export type ControlFactory = (controlProps: Control) => JSXInternal.Element;

export interface ControlDefaults {
  id: string;
  label: string;
  description?: string;
  type: ControlType;
  defaultValue: Serializable;
  component: ControlFactory;
  setup?: (c: p5, data: Signal) => void;
  draw?: (c: p5, data: Signal) => void;
}

export interface SelectControl extends ControlDefaults {
  type: 'select';
  defaultValue: string;
  options: string[];
}

export interface CheckboxControl extends ControlDefaults {
  type: 'checkbox';
  defaultValue: boolean;
}

export interface SliderControl extends ControlDefaults {
  type: 'slider';
  defaultValue: number;
  min: number;
  max: number;
  step: number;
}

export interface InfoControl extends ControlDefaults {
  type: 'info';
  defaultValue: string;
}

// TODO: review props and augment base behavior
export interface TextControl extends ControlDefaults {
  type: 'text';
  defaultValue: string;
}

export type ControlSettings =
  | SelectControl
  | CheckboxControl
  | SliderControl
  | InfoControl
  | TextControl;

export interface Control {
  data: Signal;
  onChange: (value: any) => void;
  settings: ControlSettings;
}

export interface ControlSignal {
  data: any;
  setup: (c: p5, data: Signal) => void;
  draw: (c: p5, data: Signal) => void;
}

export interface Experiment {
  (c: p5): void;
  // TODO: document
  exposeControl: (settings: ControlSettings) => ControlSignal;
}

export interface ExperimentDefinition {
  id: string;
  name: string;
  experiment: Experiment;
  description?: string;
  url?: string;
}
