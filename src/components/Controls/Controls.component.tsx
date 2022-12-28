import { useState } from 'preact/hooks';
import { IconAdjustmentsHorizontal } from '@tabler/icons';

import type { JSXInternal } from 'preact/src/jsx';
import type { Control, ControlSettings, Experiment } from '../../types';
import { Checkbox } from './components/Checkbox';
import { Select } from './components/Select';
import styles from './Controls.module.css';

interface ControlsProps {
  activeExperimentId: string;
  changeExperiment: (event: Event) => void;
  experiments: Experiment[];
  controls: Control[];
}

type ControlFactory = (...args: any[]) => JSXInternal.Element;

const factory: Record<ControlSettings['type'], ControlFactory> = {
  checkbox: Checkbox,
  select: Select,
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
          const Component = factory[control.settings.type];

          return (
            <label class={styles.control} for={control.id}>
              <span class={styles.id}>{control.id}</span>
              <Component
                id={control.id}
                data={control.data}
                onChange={control.onChange}
                type={control.settings.type}
                settings={control.settings}
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
