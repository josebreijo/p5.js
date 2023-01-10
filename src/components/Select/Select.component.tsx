import { Control } from 'app/types';
import styles from './Select.module.css';

export function Select({ data, onChange, settings }: Control) {
  function onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    onChange(target.value);
  }

  if (settings.type !== 'select') {
    throw new Error(`Incorrect component type "${settings.type}"!`);
  }

  return (
    <select
      value={data.value}
      onChange={onSelectChange}
      id={settings.id}
      title={settings.description}
      class={styles.select}
    >
      {settings.options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </select>
  );
}
