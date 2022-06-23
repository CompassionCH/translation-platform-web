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
import _ from "../../i18n";

type State = {
  columns: Column[];
  translatorModal?: number;
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
    translatorModal: undefined,
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
        formatter: (v: boolean) => _(v ? 'Yes' : 'No'),
      },
      {
        name: 'source',
        translatable: true,
      },
      {
        name: 'target',
        translatable: true,
      },
      {
        name: 'translatorId',
        header: 'Translator',
        component: (translatorId?: number) => {
          if (!translatorId) return null;
          return {
            component: TranslatorButton,
            props: {
              translatorId,
              onClick: () => this.state.translatorModal = translatorId,
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