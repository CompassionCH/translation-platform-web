import { Component, useState } from "@odoo/owl";
import template from './home.xml';

import Button from "../../components/Button";
import TranslationCard from './TranslationCard';
import { ListResponse } from '../../models/BaseDAO';
import { Letter, models, Translator } from "../../models";
import { BlurLoader } from '../../components/Loader';
import LanguagesPickModal from './LanguagesPickModal';
import Helper from "../../components/Helper";
import useCurrentTranslator from "../../hooks/useCurrentTranslator";
import _ from "../../i18n";
import { buildTutorial, startTutorial, showTutorial } from "../../tutorial";
import { navigateTo } from "../../components/Router/Router";

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type SkillLetter = {
  skill: ArrayElement<Translator['skills']>,
  total: number,
  letters: Letter[],
}

type LettersAwaitingValidation = {
  skill: ArrayElement<Translator['skills']>,
  letters: Letter[],
}

/**
 * The Home page is the first page the user sees when he's logged in.
 * It displays the various
 */
export default class Home extends Component {
  static template = template;
  static components = {
    Button,
    TranslationCard,
    LanguagesPickModal,
    BlurLoader,
    Helper,
  };

  currentTranslator = useCurrentTranslator();

  // Make translation function part of the template context
  _ = _;

  state = useState({
    skillLetters: [] as SkillLetter[],
    savedLetters: undefined as ListResponse<Letter> | undefined,
    lettersAwaitingValidation: [] as LettersAwaitingValidation[],
    manageSkillsModal: false,
    loading: false,
  });


  tutorial = buildTutorial([
    {
      text: _('Welcome to the Compassion Translation Platform. This small tutorial will guide you through its features and how it works. You can close it whenever you want to by clicking the "Exit" button.')
    },
    {
      // Defined, tutorial is called from within setup, post refresh, meaning the translator is fetched
      text: this.currentTranslator.data?.skills.length === 0
        ? _('You currently have no skills defined, let us begin by registering one or more')
        : _('It seems you already have translation skills defined, let us see how you can manage them'),
    },
    {
      beforeShowPromise: () => new Promise((resolve) => {
        this.state.manageSkillsModal = true;
        setTimeout(resolve, 300);
      }),
      classes: 'no-next no-exit',
      text: _('This tool allows you to register new skills. If you want to remove some please contact the Compassion team. You can add new skills by clicking the "Add Skill" button. Once done click "Cancel" if you have no changes to do, or "Register new Skills" to validate'),
      attachTo: {
        element: '.modal',
        on: 'right',
      }
    },
    {
      id: 'post-manage-skills',
      text: _('Your saved letters will be displayed here along with the ones waiting to be translated. Before picking one, let us review how the translation window works.'),
      attachTo: {
        element: '.waiting-letters-cards',
        on: 'top',
      },
      classes: 'no-next',
      buttons: [{
        classes: 'bg-compassion text-white',
        text: _('Next'),
        action: () => {
          this.tutorial.complete();
          navigateTo('/letters/demo-edit-letter');
        },
      }],
    },
  ]);

  setup() {
    // Fetch letters to display to the user for each of his translation skill
    this.refresh().then(() => {
      startTutorial(this.tutorial);
    });
  }

  async refresh() {
    this.state.loading = true;

    if (!this.currentTranslator.data) {
      this.currentTranslator.refresh();
    }

    await Promise.all([
      this.fetchLetters(),
      this.fetchSaved(),
      this.retrieveValidationLetters(),
    ]);

    this.state.loading = false;
  }

  async onSkillsChange() {
    // Refetch everything so that we can display next skills translation cards
    this.state.manageSkillsModal = false;
    this.state.loading = true;
    await this.currentTranslator.refresh();
    this.refresh();
    this.postSkillsModal();
  }

  async closeSkillsModal() {
    this.state.manageSkillsModal = false;
    this.postSkillsModal();
  }

  async postSkillsModal() {
    if (showTutorial()) {
      this.tutorial.getCurrentStep()?.hide();
      setTimeout(() => this.tutorial.getById('post-manage-skills')?.show(), 300);
    }
  }

  async fetchSaved() {
    if (!this.currentTranslator.data) return;
    this.state.savedLetters = await models.letters.list({
      sortBy: ['priority desc','date asc'],
      pageNumber: 0,
      pageSize: 5,
      search: [
        { column: 'translatorId', term: `${this.currentTranslator.data.translatorId}`, operator: '=' },
        { column: 'status', term: 'in progress' },
        { column: 'translationIssue', term: false, 'operator': '=' },
      ]
    });
  }

  async retrieveValidationLetters() {

    if (!this.currentTranslator.data) return;

    // Retrieve letters to validate for each skill of the current translator
    const lettersToValidate = await Promise.all(this.currentTranslator.data.skills.map(async (skill) => {
      const lettersToValidate = await models.letters.list({
        search: [
          { column: 'status', term: 'to validate' },
          { column: 'source', term: skill.source },
          { column: 'target', term: skill.target },
        ],
      });

      return {
        skill,
        letters: lettersToValidate.data,
      }
    }));

    // Sort the letters to have only the one that have a skill as unverified and a letter already waiting to be validated
    this.state.lettersAwaitingValidation = lettersToValidate.filter((item) => {
      return (!item.skill.verified);
    }).filter(item => item.letters.length > 0);

  };

  async fetchLetters() {
    if (!this.currentTranslator.data) return;
    const skillLetters = await Promise.all(this.currentTranslator.data.skills.map(async (skill) => {
      const skillLetters = await models.letters.list({
        sortBy: ['priority desc','date asc'],
        pageSize: 5,
        pageNumber: 0,
        search: [
          { column: 'status', term: 'to do' },
          { column: 'source', term: skill.source },
          { column: 'target', term: skill.target },
          { column: 'translationIssue', term: false, operator: '=' },
        ],
      });

      return {
        skill,
        total: skillLetters.total,
        letters: skillLetters.data,
      };
    }));

    this.state.skillLetters = skillLetters.sort((a, b) => {
      if (a.skill.verified) return 1;
      if (b.skill.verified) return -1;
      return 0;
    });
  }
}