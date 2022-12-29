import { Control } from '../../types';
import styles from './Checkbox.module.css';

export function Checkbox({ settings, data, onChange }: Control) {
  function onCheckboxChange(event: any) {
    onChange(event.target.checked);
    event.stopPropagation();
  }

  if (settings.type !== 'checkbox') {
    throw new Error(`Incorrect component type "${settings.type}"!`);
  }

  return (
    <div class={styles.container}>
      <input
        type="checkbox"
        checked={data.value}
        onChange={onCheckboxChange}
        id={settings.id}
        class={styles.checkbox}
      />
      <span class={styles.value}>{data.value ? 'ON' : 'OFF'}</span>
    </div>
  );
}
