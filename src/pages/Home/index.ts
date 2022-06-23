import { Component, useState } from "@odoo/owl";
import template from './home.xml';

import Button from "../../components/Button";
import TranslationCard from './TranslationCard';
import { useStore } from "../../store";
import { ListResponse } from '../../models/BaseDAO';
import { Letter, models, User } from "../../models";
import { BlurLoader } from '../../components/Loader';
import LanguagesPickModal from './LanguagesPickModal';
import useCurrentUser from "../../hooks/useCurrentUser";
import _ from "../../i18n";

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type SkillLetter = {
  skill: ArrayElement<User['skills']>,
  total: number,
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
  };

  store = useStore();
  user = useCurrentUser();

  // Make translation function part of the template context
  _ = _;

  state = useState({
    skillLetters: [] as SkillLetter[],
    savedLetters: undefined as ListResponse<Letter> | undefined,
    manageSkillsModal: false,
    loading: false,
  });

  setup() {
    // Fetch letters to display to the user for each of his translation skill
    this.refresh();
  }

  async refresh() {
    this.state.loading = true;
    Promise.all([
      this.fetchLetters(),
      this.fetchSaved(),
    ]).then(() => {
      this.state.loading = false;
    });
  }

  async onSkillsChange() {
    // Refetch everything so that we can display next skills translation cards
    this.state.manageSkillsModal = false;
    this.state.loading = true;
    await this.user.refresh();
    this.refresh();
  }

  async fetchSaved() {
    if (!this.user.data) return;
    this.state.savedLetters = await models.letters.list({
      sortBy: 'date',
      sortOrder: 'asc',
      pageNumber: 0,
      pageSize: 5,
      search: [
        { column: 'translatorId', term: this.user.data.username },
        { column: 'status', term: 'in progress' },
      ]
    });
  }

  async fetchLetters() {
    if (!this.user.data) return;
    const skillLetters = await Promise.all(this.user.data.skills.map(async (skill) => {
      const skillLetters = await models.letters.list({
        sortBy: 'date',
        sortOrder: 'asc',
        pageSize: 5,
        pageNumber: 0,
        search: [
          { column: 'status', term: 'to do' },
          { column: 'source', term: skill.source },
          { column: 'target', term: skill.target },
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