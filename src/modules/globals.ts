import type { Serializable } from '../types';
import { SKETCH_GLOBAL_ID, SKETCH_GLOBAL_SYMBOL } from '../constants';
import storage from './storage';

function _globalKey(key: string) {
  return `${SKETCH_GLOBAL_ID}.${key}`;
}

function set(key: string, value: Serializable) {
  window[SKETCH_GLOBAL_SYMBOL][key] = value;
  storage.set(_globalKey(key), value);
}

function get(key: string) {
  return window[SKETCH_GLOBAL_SYMBOL][key] || storage.get(_globalKey(key)) || null;
}

export default { set, get };
