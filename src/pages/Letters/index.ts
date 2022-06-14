import { Component, useState } from "@odoo/owl";
import template from './letters.xml';
import { Letter, models } from "../../models";
import DAOTable from "../../components/Table/DAOTable";
import { Column } from "../../components/Table/Row";
import LetterPriority from "./LetterPriority";
import TranslatorButton from "./TranslatorButton";
import TranslatorModal from '../../components/TranslatorModal';
import Button from '../../components/Button';
import TableHeader from '../../components/Table/TableHeader';
import BatchEditModal from './BatchEditModal';
import LetterRowActions from "./LetterRowActions";

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
    TranslatorModal,
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
        name: 'translatorId',
        header: 'Translator',
        component: (translatorId: string) => ({
          component: TranslatorButton,
          props: {
            username: translatorId,
            onClick: () => this.state.usernameModal = translatorId,
          }
        }),
      },
      {
        name: 'date',
        searchable: false,
        formatter: (val: Date) => val.toLocaleDateString(),
      },
      {
        name: 'actions',
        searchable: false,
        sortable: false,
        component: (_, letter: Letter) => ({
          component: LetterRowActions,
          props: {
            letter,
          },
        }),
      }
    ],
  });
};

export default Letters;