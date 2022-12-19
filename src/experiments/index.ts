import type { Experiment } from '../types';
import waveFunctionCollapse from './wave-function-collapse';
import gameOfLife from './game-of-life';
import colorExploration from './color-exploration';
import ruleN from './rule-n';

const experiments: Experiment[] = [waveFunctionCollapse, gameOfLife, colorExploration, ruleN];

export default experiments;
