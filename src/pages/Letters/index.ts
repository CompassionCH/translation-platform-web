import { Component, useState } from "@odoo/owl";
import template from './letters.xml';
import { models } from "../../models";
import DAOTable from "../../components/Table/DAOTable";
import { Column } from "../../components/Table/Row";
import LetterPriority from "./LetterPriority";
import TranslatorButton from "./TranslatorButton";
import UserModal from '../../components/UserModal';
import Button from '../../components/Button';
import TableHeader from '../../components/Table/TableHeader';
import BatchEditModal from './BatchEditModal';

type State = {
  columns: Column[];
  selected: [];
  usernameModal?: string;
  batchEditModal: boolean;
};


class Letters extends Component {

  static template = template;
  static components = {
    DAOTable,
    UserModal,
    Button,
    TableHeader,
    BatchEditModal,
  };

  dao = models.letters; // Directly passed to the dataTables component

  state = useState<State>({
    selected: [],
    usernameModal: undefined,
    batchEditModal: false,
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
};

export default Letters;