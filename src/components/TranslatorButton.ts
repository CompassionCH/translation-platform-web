import { Component, useState, xml } from "@odoo/owl";
import { models } from "../models";
import Loader from "./Loader";
import TranslatorModal from "./TranslatorModal";

// Ships with a small cache to avoid reloading translators that were already
// loaded, as we only need the name and nothing else
const cache = new Map<number, string | undefined>();
const listeners = new Map<number, Function[]>();

const getTranslatorName = async (translatorId: number): Promise<string | undefined> => {
  return new Promise((resolve) => {
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
        (name?: string) => resolve(name),
      ]);

      models.translators.find(translatorId).then((translator) => {
        const name = translator ? translator.name : undefined;
        cache.set(translatorId, name);
        
        // Call all waiting listeners
        const waitingListeners = listeners.get(translatorId) || [];
        listeners.delete(translatorId);
        waitingListeners.forEach(callback => callback(name));
      });
    }
  });
};

class TranslatorButton extends Component {

  static template = xml`
    <button class="text-blue-700 hover:text-compassion transition-colors flex gap-2" t-att-class="props.class || ''" t-on-click="() => state.active = true">
      <t t-if="state.translatorName" t-esc="state.translatorName" />
      <t t-else="" t-esc="props.translatorId" />
      <Loader t-if="state.loading" />
    </button>
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
    translatorName: undefined as undefined | string,
    active: false,
  });

  setup() {
    this.state.loading = true;
    getTranslatorName(this.props.translatorId).then((name) => {
      this.state.translatorName = name;
      this.state.loading = false;
    });
  }
}

export default TranslatorButton;