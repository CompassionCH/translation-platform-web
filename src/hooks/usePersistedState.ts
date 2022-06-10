import { reactive, useState } from "@odoo/owl";

const usePersistedState = <T extends object>(state: T, key?: string, storage: Storage = window.sessionStorage) => {

  if (!key) {
    return useState(state);
  }
  
  const savedData = storage.getItem(key);
  const initialState = savedData ? JSON.parse(savedData) : state;
  const reactiveState = reactive<T>(useState<T>(initialState), () => {
    storage.setItem(key, JSON.stringify(reactiveState));
  });

  return reactiveState;
};

export default usePersistedState;