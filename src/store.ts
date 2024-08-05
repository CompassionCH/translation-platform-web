import { reactive, useState } from '@odoo/owl';
import {STORAGE_KEY} from "./constants";

type Store = {
  username?: string;
  // AuthData
  // Set only on the currently authenticated user
  userId?: number;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: string;
};

const baseStore: Store = {
  username: undefined,
  userId: undefined,
  accessToken: undefined,
  refreshToken: undefined,
  accessTokenExpiresAt: undefined,
}

const sessionStore = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  // Call watchers
  for (const watcher of watchers) {
    watcher(store);
  }
});

/**
 * Used for logging out, erases the session content and reload page, thus the store
 * is empty, forcing the user to log in again
 */
export const clearStoreCache = () => {
  window.localStorage.clear();

  // Restores the base store.
  for (const key in baseStore) {
    (store as any)[key] = baseStore[key as keyof Store];
  }

  // Call watchers
  for (const watcher of watchers) {
    watcher(store);
  }
}

/**
 * A useful hook to include the store in your components, simply do
 * class MyComponent extends Component {
 *  store = useStore();
 * }
 */
export const useStore = () => useState(store);

/**
 * Used to watch when the store changes and react accordingly, used for example to redirect
 * the user once he's logged in, to use in component's setup() hooks
 * @param watcher the callback to run when the store changes
 */
export const watchStore = (watcher: Watcher) => watchers.push(watcher);

/**
 * Remove a watcher from the list, to use when your component unmounts
 * @param watcher 
 */
export const unwatchStore = (watcher: Watcher) => watchers.includes(watcher) ? watchers.splice(watchers.indexOf(watcher), 1) : null;

export default store;