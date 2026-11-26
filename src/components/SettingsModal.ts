import { Component, xml, markup, useState } from "@odoo/owl";
import Modal from "./Modal";
import { FR, DE, GB } from 'country-flag-icons/string/3x2';
import _ from "../i18n";
import { selectedLang, setLanguage } from "../i18n";
import Button from "./Button";
import { useStore } from "../store";
import { navigateTo } from "./Router/Router";
import useCurrentTranslator from "../hooks/useCurrentTranslator";
import { models } from "../models";
import { LeaderboardVisibility } from "../models/LeaderboardDAO";
import notyf from "../notifications";


/**
 * You'll see that the template for this component would have been so much
 * better with
 */
class SettingsModal extends Component {
  _ = _;
  
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
                <p class="text-slate-800 font-medium mt-2" t-esc="_(languages[lang].name)" />
              </div>
            </div>
          </div>
        </div>
        <div t-if="store.userId and currentTranslator.data" class="p-4 border-t border-solid border-slate-200 flex flex-col items-center">
          <p class="text-sm font-semibold text-slate-700 mb-2">Leaderboard Visibility</p>
          <div class="flex gap-2 mb-2">
            <t t-foreach="visibilities" t-as="visibility" t-key="visibility">
              <Button size="'sm'"
                      level="currentVisibility === visibility ? 'primary' : 'secondary'"
                      disabled="ui.savingVisibility"
                      onClick="() => this.setVisibility(visibility)">
                <t t-esc="_(visibilities[visibility])" />
              </Button>
            </t>
          </div>
          <p class="text-xs text-center text-slate-500">Anonymous: other translators see "Anonymous translator" instead of your name. You keep your rank and your score.</p>
        </div>
        <div t-if="store.userId" class="p-4 bg-slate-100 border-t border-solid border-slate-200 flex flex-col items-center">
          <p class="text-sm font-semibold text-slate-700 mb-2">Log Out</p>
          <p class="text-sm text-center text-slate-700 mb-2">If you wish to log out you can do so by clicking the button below</p>
          <Button size="'sm'" icon="'right-from-bracket'" level="'secondary'" onClick="userLogout">Log Out</Button>
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
  currentTranslator = useCurrentTranslator();
  ui = useState({ savingVisibility: false });

  visibilities: Record<LeaderboardVisibility, string> = {
    public: 'Public',
    anonymous: 'Anonymous',
  };

  get currentVisibility(): LeaderboardVisibility {
    return this.currentTranslator.data?.leaderboardVisibility || 'public';
  }

  async setVisibility(visibility: LeaderboardVisibility) {
    const translatorId = this.currentTranslator.data?.translatorId;
    if (!translatorId || visibility === this.currentVisibility || this.ui.savingVisibility) return;

    this.ui.savingVisibility = true;
    try {
      if (await models.leaderboards.setVisibility(translatorId, visibility)) {
        await this.currentTranslator.refresh(true);
        notyf.success(_('Your leaderboard visibility has been updated'));
      }
    } finally {
      this.ui.savingVisibility = false;
    }
  }
  
  userLogout() {
    navigateTo('/logout');
  }

  setLanguage = setLanguage;
  selectedLang = selectedLang;

  languages = {
    fr_CH: { name: 'French', flag: markup(FR) },
    en_US: { name: 'English', flag: markup(GB) },
    de_DE: { name: 'German', flag: markup(DE) },
  };

}

export default SettingsModal;