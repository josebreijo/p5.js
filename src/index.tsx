import { render } from 'preact';
import { signal } from '@preact/signals';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import p5 from 'p5';

import type { Control, ControlSettings, ControlSignal, ExperimentDefinition } from './types';
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

let sketchInstance: p5 | null = null;
const experimentStorageId = STORAGE_KEY.ACTIVE_EXPERIMENT_ID;
const noop = () => {};

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

      const activeExperiment = experiments.find((experiment) => experiment.id === experimentId);

      if (!activeExperiment) {
        throw new Error(`No experiment found with id "${experimentId}"!`);
      }

      const experimentControls: Control[] = [];

      // TODO: review approach and document
      activeExperiment.experiment.exposeControl = (settings: ControlSettings) => {
        const data = signal(settings.defaultValue);

        function onChange(value: any) {
          data.value = value;
        }

        experimentControls.push({ data, onChange, settings });

        const controlSignal: ControlSignal = {
          data,
          draw: settings.draw || noop,
          setup: settings.setup || noop,
        };

        return controlSignal;
      };

      sketchInstance = new p5(activeExperiment.experiment, sketchNode);
      lastExperimentId.current = activeExperiment.id;

      storage.set(experimentStorageId, activeExperiment.id);
      setControls(experimentControls);
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
