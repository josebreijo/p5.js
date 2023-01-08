import { render } from 'preact';

import { SKETCH_NODE_ID } from './constants';
import { Controls } from './components/Controls';
import './index.module.css';

function App() {
  return (
    <main>
      <section id={SKETCH_NODE_ID} />
      <Controls />
    </main>
  );
}

render(<App />, document.body as HTMLElement);
