import { Component, useState } from "@odoo/owl";
import template from './home.xml';

import Button from "../../components/Button";
import TranslationCard from './TranslationCard';
import { useStore } from "../../store";
import { ListResponse } from '../../models/BaseDAO';
import { Letter, models, User } from "../../models";
import { BlurLoader } from '../../components/Loader';

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type SkillLetter = {
  skill: ArrayElement<User['skills']>,
  total: number,
  letters: Letter[],
}

export default class Home extends Component {
  static template = template;
  static components = {
    Button,
    TranslationCard,
    BlurLoader,
  };

  store = useStore();

  state = useState({
    skillLetters: [] as SkillLetter[],
    savedLetters: undefined as ListResponse<Letter> | undefined,
    loading: false,
  });

  setup() {
    // Fetch letters to display to the user for each of his translation skill
    this.state.loading = true;
    Promise.all([
      this.fetchLetters(),
      this.fetchSaved(),
    ]).then(() => {
      this.state.loading = false;
    });
  }

  async fetchSaved() {
    const user = this.store.user;
    if (!user) return;
    this.state.savedLetters = await models.letters.list({
      sortBy: 'date',
      sortOrder: 'asc',
      pageNumber: 0,
      pageSize: 5,
      search: [
        { column: 'translatorId', term: user.username },
        { column: 'status', term: 'in process' },
      ]
    });
  }

  async fetchLetters() {
    const user = this.store.user;
    if (!user) return;
    this.state.skillLetters = await Promise.all(user.skills.map(async (skill) => {
      const skillLetters = await models.letters.list({
        sortBy: 'date',
        sortOrder: 'asc',
        pageSize: 5,
        pageNumber: 0,
        search: [
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
  }
}