import { Control } from 'app/types';
import styles from './Button.module.css';

export function Button({ settings, onChange }: Control) {
  if (settings.type !== 'button') {
    throw new Error(`Incorrect component type "${settings.type}"!`);
  }

  function onButtonClick() {
    onChange(true);
  }

  return (
    <div class={styles.container}>
      <button
        id={settings.id}
        title={settings.description}
        class={styles.button}
        onClick={onButtonClick}
      >
        {settings.defaultValue}
      </button>
    </div>
  );
}
