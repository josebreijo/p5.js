import type { ExperimentDefinition } from '../types';
import colorExploration from './color-exploration';
import gameOfLife from './game-of-life';
import ruleN from './rule-n';
import tenPrint from './ten-print';
import waveFunctionCollapse from './wave-function-collapse';

const experiments: ExperimentDefinition[] = [
  gameOfLife,
  waveFunctionCollapse,
  ruleN,
  tenPrint,
  colorExploration,
];

// TODO: code-split
export default experiments;
