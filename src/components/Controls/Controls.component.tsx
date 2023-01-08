import { signal } from '@preact/signals';
import { useEffect, useRef, useState } from 'preact/hooks';
import { IconAdjustmentsHorizontal, IconQuestionCircle } from '@tabler/icons';
import p5 from 'p5';

import type {
  Control,
  ControlSettings,
  ExperimentControls,
  ExperimentDefinition,
} from '../../types';
import { SKETCH_NODE_ID } from '../../constants';
import dom from '../../utils/dom';
import utils from './Controls.utils';
import styles from './Controls.module.css';

type Experiments = Record<string, ExperimentDefinition>;

let sketchInstance: p5 | null = null;
const experimentsImportMap = import.meta.glob('../../experiments/*/index.ts');

// TODO: review saving and loading controls state
// TODO: implement defaults and reset with controls state buttons
export function Controls() {
  const lastExperimentId = useRef<string | null>(null);
  const [experiments, setExperiments] = useState<Experiments | null>(null);
  const [activeExperiment, setActiveExperiment] = useState<ExperimentDefinition | null>(null);
  const [controls, setControls] = useState<Control[]>([]);

  const groupedControls = utils.groupControlsByCategory(controls);

  useEffect(() => {
    async function loadExperiments() {
      try {
        const experimentDefinitions: Experiments = {};

        for (const [filePath, moduleImportCall] of Object.entries(experimentsImportMap)) {
          const module = (await moduleImportCall()) as { default: ExperimentDefinition };

          if (!utils.moduleIsExperiment(module.default)) {
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

        setExperiments(experimentDefinitions);
        setActiveExperiment(Object.values(experimentDefinitions)[0]);
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
    if (activeExperiment && lastExperimentId.current !== activeExperiment.id) {
      const sketchNode = document.getElementById(SKETCH_NODE_ID);

      if (!sketchNode) {
        throw new Error(`Element "#${SKETCH_NODE_ID}" not found!`);
      }

      // Controls to be rendered after the active experiment changes
      const registeredControls: Control[] = [];

      // Binds the UI of each control to the data within the experiment via `preact signal's`.
      activeExperiment.experiment.registerControls = (
        controlsSettings: ControlSettings[],
      ): ExperimentControls => {
        // A list of effects to be run at p5.js lifecycle methods.
        const controlsSetupQueue: ((c: p5) => void)[] = [];
        const controlsDrawQueue: ((c: p5) => void)[] = [];
        // A collection of signals and methods to flush rendering effects.
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

        // Binds rendering phase effects
        controls.setup = function setup(c: p5) {
          for (const setupFn of controlsSetupQueue) setupFn(c);
        };

        controls.draw = function draw(c: p5) {
          for (const drawFn of controlsDrawQueue) drawFn(c);
        };

        return controls;
      };

      sketchInstance = new p5(activeExperiment.experiment, sketchNode);
      lastExperimentId.current = activeExperiment.id;

      setControls(registeredControls);
    }

    return () => {
      if (sketchInstance) {
        sketchInstance.remove();
        sketchInstance = null;
      }
    };
  }, [activeExperiment?.id]);

  function changeExperiment(event: Event) {
    const target = event.target as HTMLSelectElement;
    setActiveExperiment(experiments![target.value]);
  }

  if (!experiments || !activeExperiment) {
    return null;
  }

  return (
    <section class={styles.container}>
      <div class={styles.header}>
        <IconAdjustmentsHorizontal />

        <select class={styles.experiments} value={activeExperiment.id} onChange={changeExperiment}>
          {Object.values(experiments).map(
            (experiment) =>
              experiment.id !== 'sample' && (
                <option value={experiment.id} selected={experiment.id === activeExperiment.id}>
                  {experiment.name}
                </option>
              ),
          )}
        </select>

        {activeExperiment.url ? (
          <a
            target="_blank"
            href={activeExperiment.url}
            title={activeExperiment.name}
            alt={activeExperiment.description}
            class={styles.urlLink}
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
