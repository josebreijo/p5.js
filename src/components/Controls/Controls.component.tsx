import { useState } from 'preact/hooks';
import { IconAdjustmentsHorizontal } from '@tabler/icons';

import type { Control, Experiment } from '../../types';
import { Checkbox } from './components/Checkbox';
import styles from './Controls.module.css';

interface ControlsProps {
  activeExperimentId: string;
  changeExperiment: (event: Event) => void;
  experiments: Experiment[];
  controls: Control[];
}

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
          switch (control.type) {
            case 'checkbox':
              return <Checkbox {...control} />;
            default:
              return null;
          }
        })}
      </div>
    </section>
  );
}
