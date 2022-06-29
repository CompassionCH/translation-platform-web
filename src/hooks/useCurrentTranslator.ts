import { reactive, useState } from "@odoo/owl";
import { models, Translator } from "../models";

type Callback = (s: State) => void;
const watchers: Callback[] = [];

type State = {
  loading: boolean;
  data?: Translator;
  refresh: (userId?: number) => Promise<void>;
  loadIfNotInitialized: () => Promise<void>;
  watch: (callback: Callback) => void;
};

/**
 * This hooks allows you to load the current user in your component,
 * it works a bit like the central store but is separated in a specific hook.
 * Storing the state in the reactive primitive allows the state to be
 * shared among multiple components to avoid having to reload it each time.
 * But whenever an update is done to the authenticated user, you should call
 * the refresh method to actualize this hook's internal state.
 */
const state = reactive<State>({
  loading: false,
  data: undefined as Translator | undefined,

  async refresh() {
    this.loading = true;
    this.data = await models.translators.current();
    this.loading = false;  
  },

  async loadIfNotInitialized() {
    if (!this.data) {
      await this.refresh();
    }
  },

  watch(callback) {
    watchers.push(callback);
  },
}, () => {
  for (const watcher of watchers) {
    watcher(state);
  }
});

export default () => useState(state);