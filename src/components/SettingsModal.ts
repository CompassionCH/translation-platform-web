import { Component, xml, markup } from "@odoo/owl";
import Modal from "./Modal";
import { FR, DE, GB, IT } from 'country-flag-icons/string/3x2';
import { selectedLang, setLanguage } from "../i18n";
import Button from "./Button";
import { clearStoreCache, useStore } from "../store";

/**
 * You'll see that the template for this component would have been so much
 * better with
 */
class SettingsModal extends Component {
  static template = xml`
    <Modal active="props.active" title="'Settings'" onClose="props.onClose">
      <div class="w-96">
        <div class="p-4">
          <div class="flex flex-col items-center">
            <p class="text-sm font-semibold text-slate-700 mb-2">Language Selection</p>
            <div class="flex justify-around">
              <div t-foreach="languages" t-as="lang" t-key="lang" class="flex flex-col items-center cursor-pointer hover:bg-slate-200 pt-4 pb-2.5 px-3 rounded-sm" t-on-click="() => setLanguage(lang)">
                <span class="w-8 ring ring-offset-1 rounded-sm overflow-hidden" t-att-class="{
                  'ring-slate-100': selectedLang !== lang,
                  'ring-compassion ring-opacity-50': selectedLang === lang,
                }" t-out="languages[lang].flag" />
                <p class="text-slate-800 font-medium mt-2" t-esc="languages[lang].name" />
              </div>
            </div>
          </div>
        </div>
        <div t-if="store.userId" class="p-4 bg-slate-100 border-t border-solid border-slate-200 flex flex-col items-center">
          <p class="text-sm font-semibold text-slate-700 mb-2">Log Out</p>
          <p class="text-sm text-center text-slate-700 mb-2">If you wish to log out you can do so by clicking the button below</p>
          <Button size="'sm'" icon="'right-from-bracket'" level="'secondary'" onClick="() => logout()">Log Out</Button>
        </div>
      </div>
    </Modal>
  `;

  static props = ['onClose', 'active'];

  static components = {
    Modal,
    Button,
  };

  store = useStore();
  setLanguage = setLanguage;
  selectedLang = selectedLang;

  languages = {
    fr_CH: { name: 'French', flag: markup(FR) },
    en_US: { name: 'English', flag: markup(GB) },
    de_DE: { name: 'German', flag: markup(DE) },
    it_IT: { name: 'Italiano', flag: markup(IT) },
  };

  logout() {
    // Clear session storage and reload page, efficient, clean, simple, bim bim
    clearStoreCache();
    window.location.reload();
  }
}

export default SettingsModal;