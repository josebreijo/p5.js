import type { Experiment } from '../../types';
import { sketch } from './sketch';

const experiment: Experiment = {
  id: 'experiment-id',
  name: 'Experiment title',
  description: 'Experiment description',
  url: 'https://example.com',
  sketch,
};

export default experiment;
