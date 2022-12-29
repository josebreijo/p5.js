import { Control } from '../../../../types';
import styles from './Select.module.css';

export function Select({ data, onChange, settings }: Control) {
  function onSelectChange(event: any) {
    onChange(event.target.value);
    event.stopPropagation();
  }

  if (settings.type !== 'select') {
    throw new Error(`Incorrect component type "${settings.type}"!`);
  }

  return (
    <select value={data.value} onChange={onSelectChange} id={settings.id} class={styles.select}>
      {settings.options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </select>
  );
}
