import type { ExperimentDefinition } from '../types';
import gameOfLife from './game-of-life';
import waveFunctionCollapse from './wave-function-collapse';
import colorExploration from './color-exploration';
import ruleN from './rule-n';

const experiments: ExperimentDefinition[] = [
  gameOfLife,
  waveFunctionCollapse,
  colorExploration,
  ruleN,
];

// TODO: code-split
export default experiments;
