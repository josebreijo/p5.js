import type { ExperimentDefinition } from 'app/types';
import { experiment } from './experiment';

const experimentDefinition: ExperimentDefinition = {
  id: 'game-of-life',
  name: "Conway's Game of Life",
  url: 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life',
  experiment,
};

export default experimentDefinition;
