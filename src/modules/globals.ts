import type { Globals, Serializable } from 'app/types';
import { STORAGE_KEY } from 'app/constants';
import storage from 'app/modules/storage';

// TODO: review this approach
const globals: Record<string, Serializable> = {};

window.globals = storage.get(STORAGE_KEY.GLOBALS) || globals;

function get<K extends keyof Globals, V extends Globals[K]>(key: K): V {
  return globals[key] as V;
}

function set<K extends keyof Globals>(key: K, value: Serializable): void {
  if (key === 'get' || key === 'set') return;
  window.globals[key] = value;
  storage.set(STORAGE_KEY.GLOBALS, globals);
}

export default { get, set };
