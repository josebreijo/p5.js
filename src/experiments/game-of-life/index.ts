import type { Experiment } from '../../types';
import { sketch } from './sketch';

const experiment: Experiment = {
  id: 'game-of-life',
  name: "Conway's Game of Life",
  url: 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life',
  sketch,
};

export default experiment;
