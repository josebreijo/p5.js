import type { ExperimentDefinition } from '../../types';
import { experiment } from './experiment';

const experimentDefinition: ExperimentDefinition = {
  id: 'experiment-id',
  name: 'Experiment title',
  description: 'Experiment description',
  url: 'https://example.com',
  experiment,
};

export default experimentDefinition;
