import { render } from 'preact';
import { signal } from '@preact/signals';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import p5 from 'p5';

import type { Control, ControlSettings, Experiment } from './types';
import storage from './modules/storage';
import { Controls } from './components/Controls';
import { SKETCH_NODE_ID, STORAGE_KEY } from './constants';
import experimentList from './experiments';
import './index.module.css';

const experiments = experimentList as Experiment[];
const [defaultExperiment] = experiments;

if (!defaultExperiment) {
  throw new Error('No experiment found under "src/experiments"!');
}

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

      const activeExperiment = experiments.find((experiment) => experiment.id === experimentId);

      if (!activeExperiment) {
        throw new Error(`No experiment found with id "${experimentId}"!`);
      }

      const sketchControls: Control[] = [];

      // @ts-ignore // TODO: type properly
      activeExperiment.sketch.createControl = function createControl(
        id: string,
        settings: ControlSettings,
      ) {
        const data = signal(settings.value);

        function onChange(value: any) {
          console.log(`"${id}": ${data.peek()} => ${value}`);
          data.value = value;
        }

        const newControl: Control = { id, data, onChange, settings };
        sketchControls.push(newControl);

        return data;
      };

      setControls(sketchControls);

      sketchInstance = new p5(activeExperiment.sketch, sketchNode);
      lastExperimentId.current = activeExperiment.id;

      storage.set(experimentStorageId, activeExperiment.id);
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
