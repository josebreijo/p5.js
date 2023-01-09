# p5.js

Modern [p5.js](https://p5js.org/) TypeScript playground built with [Vite](https://vitejs.dev/) and [Preact](https://preactjs.com/). :zap:

## Features

1. TypeScript support out of the box.
2. UI components via Preact.
3. Custom controls for changing the experiments behavior externally.
> Allows to expose implementation details via custom controls by using [Preact Signals](https://preactjs.com/guide/v10/signals/) internally.

https://user-images.githubusercontent.com/30603119/211370008-244a834f-a5d4-4008-b3c0-55fcb47c4e33.mov

## Conventions

1. Each experiment should be listed under `src/experiments` following the same structure as [`src/experiments/example`](https://github.com/josebreijo/p5.js/tree/main/src/experiments/example)
2. Experiments are retrieved via [glob imports](https://vitejs.dev/guide/features.html#glob-import) and fetched in the background when IDLE.
3. Experiment controls are exposed via `experiment.registerControls` API.

### Creating a control

A control is [a representation](https://github.com/josebreijo/p5.js/blob/main/src/types.ts#L24) of how to bind an experiment value to a certain web control and the logic to use that value on each render phase of the p5.js code.
For example, we could build a slider control to alter the [p5.js frameRate](https://p5js.org/reference/#/p5/frameRate) like so

```ts
import p5 from 'p5';

import type { Experiment } from '../../types';

export const experiment: Experiment = (c: p5) => {
  const frameRate: SliderControlSettings = {
    id: 'frameRate',
    type: 'slider',
    label: 'framerate',
    defaultValue: 24,
    description: 'Number of frames to display each second',
    category: 'rendering',
    min: 1,
    max: 60,
    step: 1,
    component: Slider,
    setup(data, c) { // data points to the signal, c to p5.js context
      effect(() => {
        c.frameRate(Number(data.value));
      });
    },
  };

  const controls = experiment.registerControls([frameRate]);

  c.setup = function setup() {
    // flush controls setup effects
    controls.setup(c); 
    
    // p5.js setup
  };

  c.draw = function draw() {
    // run draw updates
    controls.draw(c);

    // read from any registered control's signal value via `id`
    console.log(controls.signals.frameRate.value) 
    
    // p5.js draw
  };
};
```
resulting on the following control being rendered and bound to the `frameRate` value

<img width="377" alt="Screenshot 2023-01-09 at 12 14 30" src="https://user-images.githubusercontent.com/30603119/211378738-ba274fd7-0d1c-416f-b31b-0ea951427401.png">

`experiment.registerControls` does a couple things behind the scenes

1. Creates a signal (`data`) which points to the control `defaultValue`
2. Creates an `onChange` listener to update the signal value.
3. Groups this data as a control definition (props).
4. Pass these props to the control `component` (`data`, `onChange` and control `settings`) to be rendered.
5. Updates the signal from within the component to trigger either `setup` or `draw` updates

> There's currently a set of factory controls under `src/controls/factory` to avoid mixing preact signals implementation details with p5.js code and to make control making API less verbose. Please review other experiment code for guidance!






