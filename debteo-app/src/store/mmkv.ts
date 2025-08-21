import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV();

export const mmkvStorage = {
  getItem: (key: string) => {
    const v = mmkv.getString(key);
    return v ?? null;
  },
  setItem: (key: string, value: string) => {
    mmkv.set(key, value);
  },
  removeItem: (key: string) => {
    mmkv.delete(key);
  },
};
