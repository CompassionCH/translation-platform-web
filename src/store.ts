import { reactive, useState } from '@odoo/owl';
import { User } from './models';
import { EXAMPLE_USER } from './models/OdooAPI';

type Store = {
  user?: User,

  // AuthData
  // Set only on the currently authenticated user
  userId?: string;
  password?: string;
};

// Retrieve data from session storage
// WARNING: This is a security issue, we should NOT store a plain text password in session storage
// But well, anyway :)
const STORAGE_KEY = 'translation-platform-store';

const baseStore = {
  user: undefined,
  userId: undefined,
  password: undefined,
  // user: EXAMPLE_USER,
}

const sessionStore = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}');
const initialStoreValues = {
  ...baseStore,
  ...sessionStore,
};

/**
 * Define a set of store watchers notified whenever the store's
 * values changed
 */
type Watcher = (store: Store) => any;
const watchers: Watcher[] = [];

/**
 * We define a simple central store to keep useful information
 * across components and objects, such as authentication data, required
 * to perform API/JSON-RPC calls to Odoo
 */
const store = reactive<Store>(initialStoreValues, () => {
  // Persist in session on change
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));

  // Call watchers
  for (const watcher of watchers) {
    watcher(store);
  }
});

export const clearStoreCache = () => window.sessionStorage.removeItem(STORAGE_KEY);
export const useStore = () => useState(store);
export const watchStore = (watcher: Watcher) => watchers.push(watcher);
export const unwatchStore = (watcher: Watcher) => watchers.includes(watcher) ? watchers.splice(watchers.indexOf(watcher), 1) : null;

export default store;