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
import LetterRowActions from "./LetterRowActions";

type State = {
  columns: Column[];
  usernameModal?: string;
};


class Letters extends Component {

  static template = template;
  static components = {
    DAOTable,
    TranslatorModal,
    Button,
    TableHeader,
  };

  dao = models.letters; // Directly passed to the dataTables component

  state = useState<State>({
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
      {
        name: 'unreadComments',
        header: 'Comments',
        formatter: (v: boolean) => v ? 'Yes' : 'No',
      },
      'source',
      'target',
      {
        name: 'translatorId',
        header: 'Translator',
        component: (translatorId?: string) => {
          if (!translatorId) return null;
          return {
            component: TranslatorButton,
            props: {
              username: translatorId,
              onClick: () => this.state.usernameModal = translatorId,
            }
          };
        },
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