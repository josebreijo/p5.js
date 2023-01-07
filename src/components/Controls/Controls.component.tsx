import { IconAdjustmentsHorizontal, IconQuestionCircle } from '@tabler/icons';

import type { Control, ExperimentDefinition } from '../../types';
import utils from './Controls.utils';
import styles from './Controls.module.css';

interface ControlsProps {
  activeExperimentId: string;
  changeExperiment: (event: Event) => void;
  experiments: ExperimentDefinition[];
  controls: Control[];
}

// TODO: review saving and loading controls state
// TODO: implement defaults and reset with controls state buttons
export function Controls({
  experiments,
  activeExperimentId,
  changeExperiment,
  controls,
}: ControlsProps) {
  const activeExperiment = experiments.find((experiment) => experiment.id === activeExperimentId);
  const groupedControls = utils.groupControlsByCategory(controls);

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

        {activeExperiment.url ? (
          <a
            target="_blank"
            href={activeExperiment.url}
            title={activeExperiment.name}
            alt={activeExperiment.description}
          >
            <IconQuestionCircle />
          </a>
        ) : null}
      </div>

      <div class={styles.controls}>
        {groupedControls.map(([category, controls]) => {
          return (
            <fieldset class={styles.category}>
              <legend class={styles.legend}>
                {category} {category !== 'stats' && 'controls'}
              </legend>
              {controls.map((control) => {
                const ControlComponent = control.settings.component;

                return (
                  <label
                    class={styles.control}
                    for={control.settings.id}
                    key={control.settings.id}
                    title={control.settings.description}
                  >
                    <span class={styles.label}>{control.settings.label}</span>

                    <ControlComponent {...control} />
                  </label>
                );
              })}
            </fieldset>
          );
        })}
      </div>
    </section>
  );
}
