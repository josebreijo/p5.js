import type { Experiment } from '../../types';
import './Controls.styles.css';

interface ControlsProps {
  experimentId: string;
  changeSketch: (event: Event) => void;
  experiments: Experiment[];
}

export function Controls({ experiments, experimentId, changeSketch }: ControlsProps) {
  return (
    <section class="controls">
      <select value={experimentId} onChange={changeSketch}>
        {experiments.map((experiment) => (
          <option value={experiment.id} selected={experiment.id === experimentId}>
            {experiment.name}
          </option>
        ))}
      </select>
    </section>
  );
}
