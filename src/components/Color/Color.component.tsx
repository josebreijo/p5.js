import { Control } from 'app/types';
import styles from './Color.module.css';

export function Color({ settings, data, onChange }: Control) {
  function onColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    onChange(target.value);
  }

  if (settings.type !== 'color') {
    throw new Error(`Incorrect component type "${settings.type}"!`);
  }

  return (
    <div class={styles.container}>
      <input
        type="color"
        value={data.value}
        onChange={onColorChange}
        id={settings.id}
        title={settings.description}
        class={styles.picker}
      />
      <span class={styles.value}>{data.value}</span>
    </div>
  );
}
