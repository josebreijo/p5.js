import { Experiment } from 'types';

function buildGlobalControls(experiment: Experiment) {
  function running() {
    return experiment.exposeControl({
      id: 'running',
      label: 'Running',
      type: 'checkbox',
      value: true,
    });
  }

  function frameRate() {
    return experiment.exposeControl({
      id: 'framerate',
      label: 'Framerate',
      type: 'slider',
      value: 24,
      min: 1,
      max: 60,
      step: 1,
    });
  }

  return {
    running,
    frameRate,
  };
}

export default { buildGlobalControls };
