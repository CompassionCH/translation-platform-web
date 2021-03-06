import { reactive, useState } from '@odoo/owl';

type Store = {
  username?: string;
  // AuthData
  // Set only on the currently authenticated user
  userId?: number;
  password?: string;
};

// Retrieve data from session storage
// WARNING: This is a security issue, we should NOT store a plain text password in session storage
// But well, anyway :)
const STORAGE_KEY = 'translation-platform-store';

const baseStore = {
  username: undefined,
  userId: undefined,
  password: undefined,
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

/**
 * Used for logging out, erases the session content and reload page, thus the store
 * is empty, forcing the user to log in again
 */
export const clearStoreCache = () => window.sessionStorage.removeItem(STORAGE_KEY);

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