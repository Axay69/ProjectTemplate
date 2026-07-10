import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve();
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string) => {
    storage.remove(key);
    return Promise.resolve();
  },
  clearAll: () => {
    storage.clearAll();
    return Promise.resolve();
  },
};
