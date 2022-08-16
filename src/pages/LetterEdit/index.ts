import { Component, onMounted, useEffect, useState } from "@odoo/owl";
import template from './letterEdit.xml';
import { Letter, models } from "../../models";
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

  addParagraph() {
    if (!this.state.letter?.translatedElements) {
      return;
    }
    this.state.letter.translatedElements.push({
      id: Date.now(),
      type: 'paragraph',
      readonly: false,
      source: '',
      content: '',
    });
    
    if (this.props.onChange) {
      this.props.onChange();
    }
  }

  addPageBreak() {
    if (!this.state.letter?.translatedElements) {
      return;
    }
    this.state.letter.translatedElements.push({
      id: Date.now(),
      type: 'pageBreak',
      readonly: false,
    });

    if (this.props.onChange) {
      this.props.onChange();
    }
  }

  remove(elemId: string | number) {
    if (!this.state.letter?.translatedElements) {
      return;
    }
    const index = this.state.letter.translatedElements.findIndex(it => it.id === elemId);
    this.state.letter.translatedElements.splice(index, 1);

    if (this.props.onChange) {
      this.props.onChange();
    }
  }

  move(elemId: string | number, delta: number) {
    if (!this.state.letter?.translatedElements) {
      return;
    }
    // Copy array so that we dont trigger useless repatching
    const items = [...this.state.letter.translatedElements];
    const i = items.findIndex(it => it.id === elemId);
    const elem = items[i];

    // Remove elem from array before adding it back
    items.splice(i, 1);
    items.splice(i + delta, 0, elem);
    this.state.letter.translatedElements = items;

    if (this.props.onChange) {
      this.props.onChange();
    }
  }

  async submit() {
    if (!this.state.letter?.translatedElements) {
      return;
    }
    await this.currentTranslator.loadIfNotInitialized();

    this.state.internalLoading = true;
    const res = await models.letters.submit({
      ...this.state.letter as Letter,
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
    if (!this.state.letter?.translatedElements || this.state.saveLoading) {
      return;
    }

    if (!background) {
      this.state.internalLoading = true;
    }
    this.state.saveLoading = true;

    if (!this.currentTranslator.data) {
      await this.currentTranslator.refresh();
    }

    const res = await models.letters.update({...this.state.letter as Letter});

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