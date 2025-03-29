import type { ExperimentDefinition } from 'app/types';
import { experiment } from './experiment';

const experimentDefinition: ExperimentDefinition = {
  id: 'tetris',
  name: 'Tetris',
  description: 'Simple tetris game',
  url: 'https://example.com',
  experiment
};

export default experimentDefinition;
