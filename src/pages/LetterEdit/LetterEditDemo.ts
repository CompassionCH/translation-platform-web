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
      preferredName: 'Demo',
      fullName: 'Child',
      sex: 'M',
      age: 12,
    },
    sponsor: {
      preferredName: 'Demo',
      fullName: 'Sponsor',
      sex: 'F',
      age: 39,
    },
    translatedElements: [
      {
        id: 1,
        type: 'paragraph',
        content: '',
        source: 'Dear, how do you do on this lovely day ?',
      },
      {
        id: 2,
        type: 'pageBreak',
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
          text: _('Welcome to the translation editor. This small tutorial will walk you through the various tools at your disposal.'),
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

}

export default LetterEditDemo;