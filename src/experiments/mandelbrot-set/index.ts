import type { ExperimentDefinition } from 'app/types';
import { experiment } from './experiment';

const experimentDefinition: ExperimentDefinition = {
  id: 'mandelbrot-set',
  name: 'Mandelbrot Set',
  description: 'The Mandelbrot Set',
  url: 'https://en.wikipedia.org/wiki/Mandelbrot_set',
  experiment
};

export default experimentDefinition;
