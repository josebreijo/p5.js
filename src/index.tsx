import { render } from 'preact';
import { signal } from '@preact/signals';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import p5 from 'p5';

import type { Control, ControlSettings, ExperimentControls, ExperimentDefinition } from './types';
import { SKETCH_NODE_ID, STORAGE_KEY } from './constants';
import { Controls } from './components/Controls';
import experimentList from './experiments';
import storage from './modules/storage';
import './index.module.css';

const experiments = experimentList as ExperimentDefinition[];
const [defaultExperiment] = experiments;

if (!defaultExperiment) {
  throw new Error('No experiment found under "src/experiments"!');
}

const noop = () => {};
let sketchInstance: p5 | null = null;
const experimentStorageId = STORAGE_KEY.ACTIVE_EXPERIMENT_ID;

function App() {
  const initialExperimentId = useMemo(() => {
    const storedExperimentId = storage.get(experimentStorageId);
    if (
      !storedExperimentId ||
      !experiments.find((experiment) => experiment.id === storedExperimentId)
    ) {
      storage.remove(experimentStorageId);
    }
    return storedExperimentId || defaultExperiment.id;
  }, []);

  const lastExperimentId = useRef<string | null>(null);
  const [experimentId, setExperimentId] = useState(initialExperimentId);
  const [controls, setControls] = useState<Control[]>([]);

  useEffect(() => {
    if (lastExperimentId.current !== experimentId) {
      const sketchNode = document.getElementById(SKETCH_NODE_ID);

      if (!sketchNode) {
        throw new Error(`Element "#${SKETCH_NODE_ID}" not found!`);
      }

      const active = experiments.find((experiment) => experiment.id === experimentId);

      if (!active) {
        throw new Error(`No experiment found with id "${experimentId}"!`);
      }

      // Controls to be rendered after the active experiment changes
      const registeredControls: Control[] = [];

      // Binds the UI of each control to the data within the experiment via `preact signal's`.
      active.experiment.registerControls = (
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
          settings.setup && controlsSetupQueue.push((c: p5) => settings.setup!(c, data));
          settings.draw && controlsDrawQueue.push((c: p5) => settings.draw!(c, data));

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

      sketchInstance = new p5(active.experiment, sketchNode);
      lastExperimentId.current = active.id;

      storage.set(experimentStorageId, active.id);
      setControls(registeredControls);
    }

    return () => {
      if (sketchInstance) {
        sketchInstance.remove();
        sketchInstance = null;
      }
    };
  }, [experimentId]);

  function changeExperiment(event: Event) {
    const target = event.target as HTMLSelectElement;
    setExperimentId(target.value);
  }

  return (
    <main>
      <Controls
        controls={controls}
        experiments={experiments}
        activeExperimentId={experimentId}
        changeExperiment={changeExperiment}
      />

      <section id={SKETCH_NODE_ID} />
    </main>
  );
}

render(<App />, document.body as HTMLElement);
