import type { ExperimentDefinition } from 'app/types';
import { experiment } from './experiment';

const experimentDefinition: ExperimentDefinition = {
  id: 'hsl-color-exploration',
  name: 'HSL Color Exploration',
  experiment,
};

export default experimentDefinition;
