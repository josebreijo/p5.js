import { signal, useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { IconAdjustmentsHorizontal, IconQuestionCircle } from '@tabler/icons';
import p5 from 'p5';

import type { Control, ControlSettings, ExperimentControls, ExperimentDefinition } from 'app/types';
import { DEFAULT_EXPERIMENT_ID, SKETCH_NODE_ID, STORAGE_KEY } from 'app/constants';
import storage from 'app/modules/storage';
import dom from 'app/utils/dom';
import utils from './Controls.utils';
import styles from './Controls.module.css';

type Experiments = Record<string, ExperimentDefinition>;

const sketchInstance = signal<p5 | null>(null);
const lastExperimentId = signal<string | null>(null);
const experimentsImportMap = import.meta.glob('../../experiments/*/index.ts');

// TODO: review saving and loading controls state
// TODO: implement defaults and reset with controls state buttons
export function Controls() {
  const controls = useSignal<Control[]>([]);
  const experiments = useSignal<Experiments | null>(null);
  const activeExperiment = useSignal<ExperimentDefinition | null>(null);

  const groupedControls = utils.groupControlsByCategory(controls.value);

  function changeExperiment(event: Event) {
    const target = event.target as HTMLSelectElement;
    const experimentId = target.value;
    activeExperiment.value = experiments.value![experimentId];
    storage.set(STORAGE_KEY.ACTIVE_EXPERIMENT_ID, experimentId);
  }

  useEffect(() => {
    // TODO: review loading onChange depending on network conditions
    async function loadExperiments() {
      try {
        const experimentDefinitions: Experiments = {};

        for (const [filePath, moduleImportCall] of Object.entries(experimentsImportMap)) {
          const module = (await moduleImportCall()) as { default: ExperimentDefinition };

          if (!utils.moduleIsExperiment(module.default)) {
            // TODO: enhance error reporting
            throw new Error(`Incorrect experiment declaration for "${filePath}".`);
          }

          if (module.default.id in experimentDefinitions) {
            throw new Error(`Found duplicate experiment with id: "${module.default.id}"`);
          }

          experimentDefinitions[module.default.id] = module.default;
        }

        if (Object.keys(experimentDefinitions).length === 0) {
          throw new Error(`No experiment found under "src/experiments"!`);
        }

        const savedExperimentId = storage.get(STORAGE_KEY.ACTIVE_EXPERIMENT_ID);
        const initialExperimentId = savedExperimentId || DEFAULT_EXPERIMENT_ID;

        experiments.value = experimentDefinitions;
        activeExperiment.value = experimentDefinitions[initialExperimentId];

        storage.set(STORAGE_KEY.ACTIVE_EXPERIMENT_ID, initialExperimentId);
      } catch (error) {
        console.error('Error loading experiments: ', error);
      }
    }

    const callbackId = dom.requestIdleCallback.call(window, loadExperiments);

    return () => {
      dom.cancelIdleCallback.call(window, callbackId);
    };
  }, []);

  useEffect(() => {
    if (!activeExperiment.value || lastExperimentId.value === activeExperiment.value.id) {
      return;
    }

    const sketchNode = document.getElementById(SKETCH_NODE_ID);

    if (!sketchNode) {
      throw new Error(`Element "#${SKETCH_NODE_ID}" not found!`);
    }

    // Controls to be rendered after the active experiment changes
    const registeredControls: Control[] = [];

    // Binds the UI of each control to the data within the experiment via `preact signal's`.
    activeExperiment.value.experiment.registerControls = (
      controlsSettings: ControlSettings[]
    ): ExperimentControls => {
      // A list of effects to be run at p5.js lifecycle methods.
      const controlsSetupQueue: ((c: p5) => void)[] = [];
      const controlsDrawQueue: ((c: p5) => void)[] = [];
      // A simple API to host all signals and methods to flush setup and draw phase effects
      const controls: ExperimentControls = { setup() {}, draw() {}, signals: {} };

      for (const settings of controlsSettings) {
        // Initialize each signal with the control `defaultValue`.
        const data = signal(settings.defaultValue);

        if (settings.id === 'setup' || settings.id === 'draw') {
          throw new Error(`A control shouldn't be named either "setup" or "draw".`);
        }

        // Save a reference to the signal for each control.
        controls.signals[settings.id] = data;
        // Collect effects for each rendering phase since they either listen or
        // mutates the signal, which produces changes on the drawing context `c`,
        settings.setup && controlsSetupQueue.push((c: p5) => settings.setup!(data, c));
        settings.draw && controlsDrawQueue.push((c: p5) => settings.draw!(data, c));

        // Binds the signal value to the control UI via `onChange` prop.
        const onChange = (value: any) => (data.value = value);
        // Adds the control props to be rendered via `settings.component` factory.
        registeredControls.push({ data, onChange, settings });
      }

      // flush rendering phase effects on call
      controls.setup = function setup(c: p5) {
        for (const setupFn of controlsSetupQueue) setupFn(c);
      };

      controls.draw = function draw(c: p5) {
        for (const drawFn of controlsDrawQueue) drawFn(c);
      };

      return controls;
    };

    // experiment initialization
    sketchInstance.value = new p5(activeExperiment.value.experiment, sketchNode);
    lastExperimentId.value = activeExperiment.value.id;
    controls.value = registeredControls;

    return () => {
      if (sketchInstance.value) {
        sketchInstance.value.remove();
        sketchInstance.value = null;
      }
    };
  }, [activeExperiment.value?.id]);

  if (!experiments.value || !activeExperiment.value) {
    return null;
  }

  const { id, url, name, description } = activeExperiment.value;

  return (
    <section class={styles.container}>
      <div class={styles.header}>
        <IconAdjustmentsHorizontal />

        <select class={styles.experiments} value={id} onChange={changeExperiment}>
          {Object.values(experiments.value).map(
            (experiment) =>
              experiment.id !== 'sample' && (
                <option key={experiment.id} value={experiment.id} selected={experiment.id === id}>
                  {experiment.name}
                </option>
              )
          )}
        </select>

        {url && (
          <a target="_blank" href={url} title={name} alt={description} class={styles.urlLink}>
            <IconQuestionCircle />
          </a>
        )}
      </div>

      <div class={styles.controls}>
        {groupedControls.map(([category, controls]) => (
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
        ))}
      </div>
    </section>
  );
}
