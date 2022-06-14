import { reactive } from '@odoo/owl';

type Store = {
  userId?: string,
  username?: string,
  password?: string,
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
const store = reactive<Store>({
  userId: undefined,
  username: undefined,
  password: undefined,
}, () => {
  for (const watcher of watchers) {
    watcher(store);
  }
});

export const watchStore = (watcher: Watcher) => watchers.push(watcher);
export const unwatchStore = (watcher: Watcher) => watchers.includes(watcher) ? watchers.splice(watchers.indexOf(watcher), 1) : null;

export default store;