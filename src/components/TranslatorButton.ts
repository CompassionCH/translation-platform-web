import { Component, useState, xml } from "@odoo/owl";
import { models } from "../models";
import Loader from "./Loader";
import TranslatorModal from "./TranslatorModal";

const ERROR_DETECTED = '__error__';

// Ships with a small cache to avoid reloading translators that were already
// loaded, as we only need the name and nothing else
const cache = new Map<number, string | undefined>();
const listeners = new Map<number, Function[]>();

const getTranslatorName = async (translatorId: number): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    // Already in cache, return it
    if (cache.has(translatorId)) {
      resolve(cache.get(translatorId));
    }

    // Not yet it cache but currently fetching it
    if (listeners.has(translatorId)) {
      // listeners dont retrieve their value from the cache, it is automatically given
      // to avoid useless if checks
      (listeners.get(translatorId) as Function[]).push((name?: string) => resolve(name));
    }

    // Not yet in cache and not fetching it
    else {
      // Add current listener
      listeners.set(translatorId, [
        (name?: string, err?: Error) => err ? reject(err) : resolve(name),
      ]);

      models.translators.find(translatorId).then((translator) => {
        const name = translator ? translator.name : undefined;
        cache.set(translatorId, name);
        
        // Call all waiting listeners
        const waitingListeners = listeners.get(translatorId) || [];
        listeners.delete(translatorId);
        waitingListeners.forEach(callback => callback(name));
      }).catch((err) => {
        cache.set(translatorId, ERROR_DETECTED); // Quick and dirty
        const waitingListeners = listeners.get(translatorId) || [];
        listeners.delete(translatorId);
        waitingListeners.forEach(callback => callback(undefined, err));
      });
    }
  });
};

class TranslatorButton extends Component {

  static template = xml`
    <button t-if="state.authorized" class="text-blue-700 hover:text-compassion transition-colors flex gap-2" t-att-class="props.class || ''" t-on-click="() => state.active = true">
      <t t-if="state.translatorName" t-esc="state.translatorName" />
    </button>
    <span t-else="!state.authorized" class="text-slate-500 text-sm italic">Hidden</span>
    <Loader t-if="state.loading" />
    <TranslatorModal translatorId="state.active ? props.translatorId : undefined" onClose="() => state.active = false" />
  `;

  static props = {
    translatorId: { type: Number },
    class: { type: String, optional: true },
  };

  static components = {
    Loader,
    TranslatorModal,
  };

  state = useState({
    loading: false,
    authorized: true,
    translatorName: undefined as undefined | string,
    active: false,
  });

  setup() {
    this.state.loading = true;
    getTranslatorName(this.props.translatorId).then((name) => {
      if (name === ERROR_DETECTED) {
        this.state.authorized = false;
      } else {
        this.state.translatorName = name;
      }
    }).catch(() => {
      this.state.authorized = false;
    }).finally(() => {
      this.state.loading = false;
    });
  }
}

export default TranslatorButton;