/* 
This is a cheap copy of the translation editor to run the tutorial
and explain how everything works.

To make it work custom classes were added to various components and templates
to link the tutorial windows to such elements. Please do not remove those
classes otherwise it will break the tutorial, and I would be very sad as I 
spent a load of time on doing it :'(
 */

import { Component, onMounted, useState } from "@odoo/owl";
import Button from "../../components/Button";
import LetterViewer from "../../components/LetterViewer";
import { BlurLoader } from "../../components/Loader";
import { navigateTo } from "../../components/Router/Router";
import SignalProblem from "../../components/SignalProblem";
import useCurrentTranslator from "../../hooks/useCurrentTranslator";
import _ from "../../i18n";
import { buildTutorial } from "../../tutorial";
import ContentEditor from "./ContentEditor";
import template from './letterEdit.xml';
import LetterSubmittedModal from "./LetterSubmittedModal";

/**
 * A demonstration state with a demonstration letter
 */
const baseState = {
  letter: {
    id: 1,
    status: 'to do',
    priority: 3,
    pdfUrl: '/text.pdf',
    title: 'Demo Letter',
    source: 'English',
    target: 'French',
    unreadComments: false,
    date: new Date(),
    child: {
      firstName: 'Demo',
      lastName: 'Child',
      sex: 'M',
      age: 12,
    },
    sponsor: {
      firstName: 'Demo',
      lastName: 'Sponsor',
      sex: 'F',
      age: 39,
    },
    translatedElements: [
      {
        id: 1,
        type: 'paragraph',
        readonly: true,
        content: '',
        source: 'Dear, how do you do on this lovely day ?',
      },
      {
        id: 2,
        type: 'pageBreak',
        readonly: true,
      },
    ],
  },

  signalProblemModal: false,
  letterSubmitted: false,
  loading: true,
  saveLoading: false,
  internalLoading: false,
};

class LetterEditDemo extends Component {
  static template = template;

  static props = {
    letterId: { type: Number, optional: true },
  };

  static defaultProps = {
    letterId: 1,
  };

  state = useState(baseState);
  currentTranslator = useCurrentTranslator();

  static components = {
    SignalProblem,
    LetterViewer,
    LetterSubmittedModal,
    ContentEditor,
    Button,
    BlurLoader,
  };

  setup() {
    this.currentTranslator.loadIfNotInitialized().then(() => {
      this.state.loading = false;
    });

    onMounted(() => {
      const tutorial = buildTutorial([
        {
          text: _('Welcome to the translation editor. This small tutorial will walk you through the various tools at your disposal'),
        },
        {
          text: _('This panel displays the letter which you must translate, showing the text in paragraphs over one or multiple pages'),
          attachTo: {
            element: '#letter-viewer',
            on: 'right',
          }
        },
        {
          text: _('This panel displays information about the child, sponsor and letter you can use if necessary'),
          attachTo: {
            element: '#letter-viewer-header',
            on: 'bottom',
          }
        },
        {
          text: _('This panel is where you will write the translated text. Note that content is divided into paragraphs (where content goes) and page breaks (which represent a new page)'),
          attachTo: {
            element: '#letter-viewer-content',
            on: 'left',
          }
        },
        {
          text: _('When translating content you will write it in this box'),
          attachTo: {
            element: '#letter-viewer-content .editor-paragraph-content',
            on: 'bottom',
          }
        },
        {
          text: _('If there is a problem in a paragraph, such as a word you cannot read or something that seems strange, you can leave a comment which will be reviewed by the Compassion team'),
          attachTo: {
            element: '#letter-viewer-content .editor-paragraph-comment',
            on: 'bottom',
          }
        },
        {
          text: _('Some elements are locked, which means they cannot be moved or deleted. Those are mandatory paragraphs and page breaks which you can write translated content in, assumed to represent the layout of the letter'),
          attachTo: {
            element: '#letter-viewer-content .editor-paragraph-locked',
            on: 'left',
          }
        },
        {
          text: _('If you think the letter has more paragraphs or page break (such as writing outside of the boxes), you can add elements by clicking those buttons'),
          attachTo: {
            element: '#letter-viewer-content .buttons-add-elements',
            on: 'bottom',
          }
        },
        {
          beforeShowPromise: async () => this.state.letter.translatedElements = [
            ...this.state.letter.translatedElements,
            {
              id: 3,
              type: 'paragraph',
              readonly: false,
              content: '',
              source: '',
            },
            {
              id: 4,
              type: 'paragraph',
              readonly: false,
              content: '',
              source: '',
            },
            {
              id: 5,
              type: 'pageBreak',
              readonly: false,
            },
          ],
          text: _('We added a few elements for you, same as if you had clicked on the two buttons displayed earlier.'),
        },
        {
          text: _('Note that those elements are not locked, which means you can move and remove them as you want'),
          attachTo: {
            element: '#letter-viewer-content .editor-element:nth-child(4) .buttons-element-state',
            on: 'left'
          }
        },
        {
          text: _('The letter is automatically saved while you edit it, so that you can come back to it later, but you can force save it by clicking here'),
          attachTo: {
            element: '.action-save',
            on: 'bottom'
          },
        },
        {
          text: _('You can click the submit button once you are done with translating the letter'),
          attachTo: {
            element: '.action-submit',
            on: 'bottom'
          },
        },
        {
          text: _('If you encounter a problem, such as the PDF not displaying, a content issue or a wrong identity, you can click here to signal a problem'),
          attachTo: {
            element: '.action-problem',
            on: 'bottom'
          },
        },
        {
          beforeShowPromise: () => new Promise((resolve) => {
            this.state.signalProblemModal = true;
            setTimeout(resolve, 300);
          }),
          text: _('Once clicking it, you will be brought here where your can select a problem and provide additional details to the Compassion team'),
          attachTo: {
            element: '.modal',
            on: 'bottom',
          }
        },
        {
          beforeShowPromise: () => new Promise((resolve) => {
            this.state.signalProblemModal = false;
            setTimeout(resolve, 300);
          }),
          text: _('This bar can be dragged horizontally to expand or reduce the panel displaying the letter if you need more space to read it'),
          attachTo: {
            element: '.letter-viewer-dragger',
            on: 'right',
          }
        },
        {
          beforeShowPromise: async () => this.state.letter.pdfUrl = 'http://yoyo.emma',
          text: _('Sometimes the PDF might not load. As an alternative you can click the "source" button which appears when you hover the panel where the letter is supposed to be'),
          attachTo: {
            element: '#letter-viewer',
            on: 'right',
          },
        },
        {
          text: _('If you have any question do not hesitate to contact us. Thanks for your help in translating letters and bringing joy to children and sponsors alike'),
        },
      ]);

      tutorial.start();

      const done = () => navigateTo('/');

      // Bring back to home once done with this tutorial
      tutorial.on('cancel', done);
      tutorial.on('complete', done);
    });
  }

  async submit() {
    this.state.internalLoading = true;
    setTimeout(() => {
      this.state.internalLoading = false;
      this.state.letterSubmitted = true;
    }, 1000);
  }

  queueSave() {
    this.state.saveLoading = true;
    setTimeout(() => {
      this.state.saveLoading = false;
    }, 300);
  }

  async save(background = false) {
    this.state.saveLoading = true;
    if (!background) {
      this.state.internalLoading = true;
    }

    setTimeout(() => {
      this.state.saveLoading = false;
      this.state.internalLoading = false;
    }, 1000);
  }

  async refreshLetter() {
    this.state.saveLoading = true;
    setTimeout(() => {
      this.state.internalLoading = false;
    }, 1000);
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

}

export default LetterEditDemo;