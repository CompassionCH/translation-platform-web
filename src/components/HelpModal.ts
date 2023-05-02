import { Component, xml, markup, useState } from "@odoo/owl";
import Modal from "./Modal";
import TipsModal from "./TipsModal";
import { FR, DE, GB, IT } from 'country-flag-icons/string/3x2';
import { selectedLang, setLanguage } from "../i18n";
import Button from "./Button";
import { useStore } from "../store";
import { navigateTo } from "./Router/Router";
import t_ from "../i18n";

type State = {
  modalOpenTips?: boolean;
};

/**
 * You'll see that the template for this component would have been so much
 * better with
 */
class HelpModal extends Component {
  static template = xml`
    <Modal active="props.active" title="'Help'" onClose="props.onClose">
      <div class="w-96">
        <div class="p-4">
          <div>
            <p class="text-center text-sm font-semibold text-slate-700 mb-2">Translation charter</p>
            <ul class="list-disc text-center ml-4 mb-4">
              <li class="mb-2">I agree not to disclose the information contained in the letter to be translated.</li>
              <li class="mb-2">I agree to submit a translation as soon as possible.</li>
              <li class="mb-2">I commit myself, through my translation, to respect the original message of the text as much as possible.</li>
            </ul>
            <div class="flex flex-col place-content-center">
              <Button size="'sm'" level="'secondary'" icon="'info'" t-on-click="() => this.openTips()">Tips for a successful translation</Button>
            </div>
          </div>
        </div>
        <div t-if="store.userId" class="p-4 bg-slate-100 border-t border-solid border-slate-200 flex flex-col items-center">
          <p class="text-sm font-semibold text-slate-700 mb-2">Tutorial</p>
          <div class="flex flex-row space-x-4">
            <Button size="'sm'" icon="'right-from-bracket'" level="'secondary'" t-on-click="startTutorial">Restart the walkthrough</Button>
            <Button size="'sm'" icon="'right-from-bracket'" level="'secondary'" t-on-click="watchVideo">Watch the video</Button>
          </div>
        </div>
      </div>
    </Modal>

    <TipsModal onClose="() => this.state.modalOpenTips = undefined" active="state.modalOpenTips !== undefined"/>
  `;

  static props = ['onClose', 'active'];

  static components = {
    Modal,
    Button,
    TipsModal,
  };

  state = useState<State>({});

  store = useStore();
  setLanguage = setLanguage;
  selectedLang = selectedLang;

  languages = {
    fr_CH: { name: 'French', flag: markup(FR) },
    en_US: { name: 'English', flag: markup(GB) },
    de_DE: { name: 'German', flag: markup(DE) },
    it_IT: { name: 'Italiano', flag: markup(IT) },
  };

  startTutorial() {
    this.props.active = false;
    navigateTo('/letters/demo-edit-letter');
  };

  watchVideo() {
    window.open(
      t_("https://vimeo.com/800516053/3d42ed291e"),
      "_blank"
    );
  };

  openTips() {
    this.state.modalOpenTips = true;
  }
}

export default HelpModal;