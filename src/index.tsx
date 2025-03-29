import { render } from 'preact';

import { SKETCH_NODE_ID } from './constants';
import { Controls } from './components/Controls';
import './index.module.css';

function App() {
  return (
    <>
      <section id={SKETCH_NODE_ID} />
      <Controls />
    </>
  );
}

render(<App />, document.body as HTMLElement);
