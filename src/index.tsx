import { render } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import p5 from 'p5';

import experiments from './experiments';
import storage from './modules/storage';
import { SKETCH_NODE_ID, STORAGE_KEY } from './constants';
import './index.css';

const [defaultExperiment] = experiments;

if (!defaultExperiment) {
  throw new Error('No experiment found under "src/experiments"!');
}

let sketchInstance: p5 | null = null;

function App() {
  const initialExperimentId = useMemo(
    () => storage.get(STORAGE_KEY.ACTIVE_EXPERIMENT_ID) || defaultExperiment.id,
    [],
  );

  console.log({ initialExperimentId });

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
      <section id="controls">
        <select value={experimentId} onChange={changeSketch}>
          {experiments.map((experiment) => (
            <option value={experiment.id} selected={experiment.id === experimentId}>
              {experiment.title}
            </option>
          ))}
        </select>
      </section>

      <section id={SKETCH_NODE_ID} />
    </main>
  );
}

render(<App />, document.body as HTMLElement);
