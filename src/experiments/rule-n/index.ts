import type { Experiment } from '../../types';
import { sketch } from './sketch';

const experiment: Experiment = {
  id: 'rule-n',
  name: 'Rule-N Cellular Automata',
  url: 'https://en.wikipedia.org/wiki/Rule_30',
  sketch,
};

export default experiment;
