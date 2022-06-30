import { Component, useEffect, useState } from "@odoo/owl";
import template from './letterEdit.xml';
import { Letter, models, Translator } from "../../models";
import { Element } from "../../models/LetterDAO";
import notyf from "../../notifications";
import LetterViewer from "../../components/LetterViewer";
import Button from '../../components/Button';
import SignalProblem from "../../components/SignalProblem";
import ContentEditor from './ContentEditor';
import { BlurLoader } from '../../components/Loader';
import LetterSubmittedModal from "./LetterSubmittedModal";
import _ from "../../i18n";
import useCurrentTranslator from "../../hooks/useCurrentTranslator";

type State = {
  dirty: false;
  internalLoading: boolean;
  saveLoading: boolean;
  signalProblemModal: boolean;
  letterSubmitted: boolean;
  saveTimeout?: NodeJS.Timeout;
};

type Props = {
  letter: Letter,
  refreshLetter: Function,
}

class LetterEdit extends Component<Props> {
  static template = template;

  static props = {
    letter: { type: Object },
    refreshLetter: { type: Function },
  };

  static components = {
    SignalProblem,
    LetterViewer,
    LetterSubmittedModal,
    ContentEditor,
    Button,
    BlurLoader,
  };

  state = useState<State>({
    dirty: false,
    saveLoading: false,
    internalLoading: false,
    signalProblemModal: false,
    letterSubmitted: false,
    saveTimeout: undefined,
  });

  contentGetter: undefined | (() => Element[]) = undefined;

  currentTranslator = useCurrentTranslator();

  setup() {
    // This effect registers the auto-save functionnalities
    useEffect(() => {
      const listener = (event: KeyboardEvent) => {

        // On key press, enqueue a save if necessary
        this.queueSave();

        // If CTRL-S
        if (event.ctrlKey && event.key === 's') {
          event.preventDefault();

          // Remove timer if any as we manually save
          if (this.state.saveTimeout) {
            clearTimeout(this.state.saveTimeout);
            this.state.saveTimeout = undefined;
          }
          this.save(true);
        }
      }

      document.addEventListener('keydown', listener);
      return () => document.removeEventListener('keydown', listener);
    });
  }

  async submit() {
    if (!this.contentGetter) {
      return;
    }  

    await this.currentTranslator.loadIfNotInitialized();
    const translatorId = this.props.letter.translatorId || (this.currentTranslator.data as Translator).translatorId;

    this.state.internalLoading = true;
    const res = await models.letters.submit({
      ...this.props.letter,
      lastUpdate: new Date(),
      status: 'done',
      translatorId,
      translatedElements: this.contentGetter(),
    });

    if (!res) {
      notyf.error(_('Unable to save and submit letter, please save it first and retry.'));
      this.state.internalLoading = false;
    } else {
      this.state.internalLoading = false;
      this.state.letterSubmitted = true;
    }
  }

  queueSave() {
    if (this.state.saveTimeout) {
      clearTimeout(this.state.saveTimeout);
    }

    // Set the timer to automatically save in 1,5 secs
    this.state.saveTimeout = setTimeout(() => this.save(true), 1500);
  }

  async save(background = false) {
    if (!this.contentGetter || this.state.saveLoading) {
      return;
    }

    if (!background) {
      this.state.internalLoading = true;
    }
    this.state.saveLoading = true;

    if (!this.currentTranslator.data) {
      await this.currentTranslator.refresh();
    }

    const res = await models.letters.update({
      ...this.props.letter,
      lastUpdate: new Date(),
      status: 'in progress',
      // Currently editing user is submitting his letter
      translatorId: this.currentTranslator.data?.translatorId,
      translatedElements: this.contentGetter(),
    });

    if (!res) {
      notyf.error(_('Unable to save letter'));
    } else {
      if (!background) {
        notyf.success(_('Letter saved'));
      }
    }

    await this.props.refreshLetter(background);

    if (!background) {
      this.state.internalLoading = false;
    }
    this.state.saveLoading = false;
  }
}

export default LetterEdit;