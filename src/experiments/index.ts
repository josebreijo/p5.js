import type { ExperimentDefinition } from '../types';
import waveFunctionCollapse from './wave-function-collapse';
import gameOfLife from './game-of-life';
import colorExploration from './color-exploration';
import ruleN from './rule-n';

const experiments: ExperimentDefinition[] = [
  waveFunctionCollapse,
  gameOfLife,
  colorExploration,
  ruleN,
];

// TODO: code-split
export default experiments;
