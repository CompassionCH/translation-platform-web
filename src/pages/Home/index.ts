import { Component, useState } from "@odoo/owl";
import template from './home.xml';

import Button from "../../components/Button";
import TranslationCard from './TranslationCard';
import { useStore } from "../../store";
import { Letter, models, User } from "../../models";

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
  };

  store = useStore();

  texts = [
    { id: 1, title: 'Arya Stark, Westeros' },
    { id: 2, title: 'Bart Simpson, America' },
    { id: 3, title: 'Basilic Mascarpone, Italy' },
    { id: 4, title: 'Capheus Onyango, Kenya' },
  ];

  state = useState({
    skillLetters: [] as SkillLetter[],
    loading: false,
  });

  setup() {
    // Fetch letters to display to the user for each of his translation skill
    this.fetchLetters();
  }

  async fetchLetters() {
    const user = this.store.user;
    if (!user) return;
    this.state.loading = true;
    this.state.skillLetters = await Promise.all(user.skills.map(async (skill) => {
      const skillLetters = await models.letters.list({
        sortBy: 'date',
        sortOrder: 'desc',
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
    this.state.loading = false;
  }
}