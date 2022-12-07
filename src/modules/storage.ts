function get(key: string) {
  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return null;
    }

    const value = JSON.parse(rawValue);
    return value || null;
  } catch (error) {
    console.warn(`Error loading item ${key} from storage!`);
    console.error(error);
    return null;
  }
}

function set(key: string, value: unknown) {
  const rawValue = JSON.stringify(value);
  window.localStorage.setItem(key, rawValue);
}

function remove(key: string) {
  window.localStorage.removeItem(key);
}

export default { get, set, remove };
