import type { ExperimentDefinition } from '../../types';
import { experiment } from './experiment';

const experimentDefinition: ExperimentDefinition = {
  id: 'ten-print',
  name: '10 PRINT CHR$(205.5+RND(1)); : GOTO 10',
  url: 'https://10print.org/',
  experiment,
};

export default experimentDefinition;
