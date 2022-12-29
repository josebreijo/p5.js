import { Control } from '../../types';
import styles from './Info.module.css';

export function Info({ settings, data }: Control) {
  if (settings.type !== 'info') {
    throw new Error(`Incorrect component type "${settings.type}"!`);
  }

  return (
    <div class={styles.container}>
      <p class={styles.value}>{data.value}</p>
    </div>
  );
}
