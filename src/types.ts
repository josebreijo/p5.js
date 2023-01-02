import type { Signal } from '@preact/signals';
import { JSXInternal } from 'preact/src/jsx';
import p5 from 'p5';

export type Bit = 0 | 1;

export interface Position {
  x: number;
  y: number;
}

export type Serializable = string | number | boolean | null;

export type Globals = Record<string, Serializable>;

export type ControlType = 'select' | 'checkbox' | 'slider' | 'info' | 'text' | 'color' | 'button';

export type ControlCategory = 'rendering' | 'custom';

export type ControlFactory = (controlProps: Control) => JSXInternal.Element;

export type ControlRenderFn = (data: Signal, c: p5) => void;

export interface ControlDefaults {
  id: string;
  label: string;
  description?: string;
  type: ControlType;
  defaultValue: Serializable;
  component: ControlFactory;
  setup?: ControlRenderFn;
  draw?: ControlRenderFn;
  category?: ControlCategory;
}

export interface SelectControlSettings extends ControlDefaults {
  type: 'select';
  defaultValue: string;
  options: string[];
}

export interface CheckboxControlSettings extends ControlDefaults {
  type: 'checkbox';
  defaultValue: boolean;
}

export interface SliderControlSettings extends ControlDefaults {
  type: 'slider';
  defaultValue: number;
  min: number;
  max: number;
  step: number;
}

export interface InfoControlSettings extends ControlDefaults {
  type: 'info';
  defaultValue: string;
}

// TODO: review props and augment base behavior
export interface TextControlSettings extends ControlDefaults {
  type: 'text';
  defaultValue: string;
}

export interface ColorControlSettings extends ControlDefaults {
  type: 'color';
  defaultValue: string;
}

export interface ButtonControlSettings extends ControlDefaults {
  type: 'button';
  defaultValue: string;
}

export type ControlSettings =
  | SelectControlSettings
  | CheckboxControlSettings
  | SliderControlSettings
  | InfoControlSettings
  | TextControlSettings
  | ColorControlSettings
  | ButtonControlSettings;

export interface Control {
  data: Signal;
  onChange: (value: any) => void;
  settings: ControlSettings;
}

export interface ExperimentControls {
  setup(c: p5): void;
  draw(c: p5): void;
  signals: Record<string, Signal>;
}

export interface Experiment {
  (c: p5): void;
  // TODO: document & type properly
  registerControls: (settings: ControlSettings[]) => ExperimentControls;
}

export interface ExperimentDefinition {
  id: string;
  name: string;
  experiment: Experiment;
  description?: string;
  url?: string;
}
