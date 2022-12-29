import type { ExperimentDefinition } from '../../types';
import { experiment } from './experiment';

const experimentDefinition: ExperimentDefinition = {
  id: 'rule-n',
  name: 'Rule-N Cellular Automata',
  url: 'https://en.wikipedia.org/wiki/Rule_30',
  experiment,
};

export default experimentDefinition;
