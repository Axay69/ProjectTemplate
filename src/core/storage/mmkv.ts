import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve();
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
    return Promise.resolve();
  },
  clear: () => {
    storage.clearAll();
    return Promise.resolve();
  },
};
