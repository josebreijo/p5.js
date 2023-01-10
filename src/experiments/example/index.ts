import type { ExperimentDefinition } from 'app/types';
import { experiment } from './experiment';

const experimentDefinition: ExperimentDefinition = {
  id: 'sample',
  name: 'sample text',
  description: 'sample description',
  url: 'https://example.com',
  experiment,
};

export default experimentDefinition;
