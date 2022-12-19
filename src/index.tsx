import { render } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import p5 from 'p5';

import type { Experiment } from './types';
import experimentList from './experiments';
import storage from './modules/storage';
import { Controls } from './components/Controls';
import { SKETCH_NODE_ID, STORAGE_KEY } from './constants';
import './index.css';

const experiments = experimentList as Experiment[];
const [defaultExperiment] = experiments;

if (!defaultExperiment) {
  throw new Error('No experiment found under "src/experiments"!');
}

let sketchInstance: p5 | null = null;

function App() {
  const initialExperimentId = useMemo(() => {
    const storedExperimentId = storage.get(STORAGE_KEY.ACTIVE_EXPERIMENT_ID);
    if (
      !storedExperimentId ||
      !experiments.find((experiment) => experiment.id === storedExperimentId)
    ) {
      storage.remove(STORAGE_KEY.ACTIVE_EXPERIMENT_ID);
    }

    return storedExperimentId || defaultExperiment.id;
  }, []);

  const lastExperimentId = useRef<string | null>(null);
  const [experimentId, setExperimentId] = useState(initialExperimentId);

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

      sketchInstance = new p5(activeExperiment.sketch, sketchNode);
      lastExperimentId.current = activeExperiment.id;

      storage.set(STORAGE_KEY.ACTIVE_EXPERIMENT_ID, activeExperiment.id);
    }

    return () => {
      if (sketchInstance) {
        sketchInstance.remove();
        sketchInstance = null;
      }
    };
  }, [experimentId]);

  function changeSketch(event: Event) {
    const target = event.target as HTMLSelectElement;
    setExperimentId(target.value);
  }

  return (
    <main>
      <Controls experiments={experiments} experimentId={experimentId} changeSketch={changeSketch} />

      <section id={SKETCH_NODE_ID} />
    </main>
  );
}

render(<App />, document.body as HTMLElement);
