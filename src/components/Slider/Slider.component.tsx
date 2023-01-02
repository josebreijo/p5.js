import { Control } from '../../types';
import styles from './Slider.module.css';

export function Slider({ settings, data, onChange }: Control) {
  function onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    onChange(target.value);
  }

  if (settings.type !== 'slider') {
    throw new Error(`Incorrect component type "${settings.type}"!`);
  }

  return (
    <div class={styles.container}>
      <input
        type="range"
        value={data.value}
        onChange={onSliderChange}
        min={settings.min}
        max={settings.max}
        step={settings.step}
        id={settings.id}
        class={styles.slider}
      />
      <span class={styles.value}>{data.value}</span>
    </div>
  );
}
