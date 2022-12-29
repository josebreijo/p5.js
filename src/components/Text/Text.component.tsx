import { useEffect, useState } from 'preact/hooks';

import type { Control } from '../../types';
import styles from './Text.module.css';

export function Text({ settings, data, onChange }: Control) {
  const [value, setValue] = useState(data.value);

  useEffect(() => {
    setValue(data.value);
  }, [data.value]);

  function onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    setValue(target.value);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;

    const target = event.target as HTMLInputElement;

    if (target.value.trim() !== '') {
      onChange(target.value);
    }
  }

  if (settings.type !== 'text') {
    throw new Error(`Incorrect component type "${settings.type}"!`);
  }

  return (
    <div class={styles.container}>
      <input
        type="text"
        value={value}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        id={settings.id}
        class={styles.input}
      />
    </div>
  );
}
