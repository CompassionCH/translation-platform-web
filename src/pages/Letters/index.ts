import { Component, useState } from "@odoo/owl";
import template from './letters.xml';
import { models, Letter } from "../../models";
import Table, { Column } from "../../components/Table";
import { ListQueryParams } from "../../models/BaseDAO";
import LetterPriority from "./LetterPriority";
import TranslatorButton from "./TranslatorButton";
import UserModal from '../../components/UserModal';
import Button from '../../components/Button';
import TableHeader from '../../components/Table/TableHeader';

type State = {
  letters: Letter[];
  total: number;
  loading: boolean;
  columns: Column[];
  selected: [];
  usernameModal?: string;
};


class Letters extends Component {

  static template = template;
  static components = {
    Table,
    UserModal,
    Button,
    TableHeader,
  };

  state = useState<State>({
    letters: [],
    total: 0,
    loading: false,
    selected: [],
    usernameModal: undefined,
    columns: [
      {
        name: 'priority',
        component: (val: number) => ({
          component: LetterPriority,
          props: { priority: val },
        }),
      },
      'title',
      'status',
      'source',
      'target',
      {
        name: 'translator',
        component: (username: string) => ({
          component: TranslatorButton,
          props: {
            username,
            onClick: () => this.state.usernameModal = username,
          }
        }),
      },
      {
        name: 'date',
        searchable: false,
        formatter: (val: Date) => val.toLocaleDateString(),
      }
    ],
  });

  updateData(params: Partial<ListQueryParams<Letter>> = {}) {
    this.state.loading = true;
    models.letters.list(params).then((res) => {
      this.state.letters = res.data;
      this.state.total = res.total;
      this.state.loading = false;
    });
  }
};

export default Letters;