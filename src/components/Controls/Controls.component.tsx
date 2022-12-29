import { IconAdjustmentsHorizontal } from '@tabler/icons';
import type { JSXInternal } from 'preact/src/jsx';

import type { Control, ControlType, ExperimentDefinition } from '../../types';
import { Checkbox } from './components/Checkbox';
import { Select } from './components/Select';
import { Slider } from './components/Slider';
import styles from './Controls.module.css';

interface ControlsProps {
  activeExperimentId: string;
  changeExperiment: (event: Event) => void;
  experiments: ExperimentDefinition[];
  controls: Control[];
}

type ControlFactory = (controlProps: Control) => JSXInternal.Element;

const controlFactory: Record<ControlType, ControlFactory> = {
  checkbox: Checkbox,
  select: Select,
  slider: Slider,
};

export function Controls({
  experiments,
  activeExperimentId,
  changeExperiment,
  controls,
}: ControlsProps) {
  const activeExperiment = experiments.find((experiment) => experiment.id === activeExperimentId);

  if (!activeExperiment) {
    throw new Error('No active experiment found');
  }

  return (
    <section class={styles.container}>
      <div class={styles.header}>
        <IconAdjustmentsHorizontal />

        <select class={styles.experiments} value={activeExperiment.id} onChange={changeExperiment}>
          {experiments.map((experiment) => (
            <option value={experiment.id} selected={experiment.id === activeExperimentId}>
              {experiment.name}
            </option>
          ))}
        </select>
      </div>

      <div class={styles.controls}>
        {controls.map((control) => {
          const ControlComponent = controlFactory[control.settings.type];

          return (
            <label class={styles.control} for={control.settings.id} key={control.settings.id}>
              <span class={styles.label}>{control.settings.label}</span>

              <ControlComponent {...control} />
            </label>
          );
        })}
      </div>
    </section>
  );
}
