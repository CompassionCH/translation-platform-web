import { Component, onMounted, useEffect, useState } from "@odoo/owl";
import template from './letterEdit.xml';
import { Letter, models } from "../../models";
import { Element } from "../../models/LetterDAO";
import notyf from "../../notifications";
import LetterViewer from "../../components/LetterViewer";
import Button from '../../components/Button';
import SignalProblem from "../../components/SignalProblem";
import ContentEditor from './ContentEditor';
import { BlurLoader } from '../../components/Loader';
import LetterSubmittedModal from "./LetterSubmittedModal";
import store from "../../store";
import _ from "../../i18n";
import useCurrentTranslator from "../../hooks/useCurrentTranslator";

type State = {
  dirty: false;
  loading: boolean;
  internalLoading: boolean;
  saveLoading: boolean;
  letter?: Letter;
  signalProblemModal: boolean;
  letterSubmitted: boolean;
  saveTimeout?: NodeJS.Timeout;
};

class LetterEdit extends Component {
  static template = template;

  static props = {
    letterId: { type: String },
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
    loading: false,
    saveLoading: false,
    internalLoading: false,
    letter: undefined,
    signalProblemModal: false,
    letterSubmitted: false,
    saveTimeout: undefined,
  });

  contentGetter: undefined | (() => Element[]) = undefined;

  currentTranslator = useCurrentTranslator();

  setup() {
    this.state.loading = true;
    onMounted(() => this.refreshLetter());

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

    this.state.internalLoading = true;
    const res = await models.letters.submit({
      ...this.state.letter as Letter,
      lastUpdate: new Date(),
      status: 'done',
      translatorId: store.userId,
      translatedElements: this.contentGetter(),
    });

    if (!res) {
      notyf.error(_('Unable to save and submit letter, please save it first and retry.'));
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
      ...this.state.letter as Letter,
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

    const updatedLetterState = await models.letters.find(this.props.letterId);
    if (!updatedLetterState) {
      console.error('Saved letter cannot be found!');
      notyf.error(_('An error occured while trying to retrieve updated state'));
    } else {
      this.state.letter = updatedLetterState;
    }


    if (!background) {
      this.state.internalLoading = false;
    }
    this.state.saveLoading = false;
  }

  async refreshLetter() {
    models.letters.find(this.props.letterId).then((letter) => {
      if (!letter) {
        notyf.error(_('Unable to find letter with identifier') + this.props.letterId);
      } else {
        this.state.letter = letter;
      }
      this.state.loading = false;
    });
  }
}

export default LetterEdit;