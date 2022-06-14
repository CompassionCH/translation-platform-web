import { Component, useState } from "@odoo/owl";
import template from './translations.xml';
import { Translation, models } from "../../models";
import DAOTable from "../../components/Table/DAOTable";
import { Column } from "../../components/Table/Row";
import TranslationPriority from "./TranslationPriority";
import TranslatorButton from "./TranslatorButton";
import UserModal from '../../components/UserModal';
import Button from '../../components/Button';
import TableHeader from '../../components/Table/TableHeader';
import BatchEditModal from './BatchEditModal';
import TranslationRowActions from "./TranslationRowActions";

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

  dao = models.translations; // Directly passed to the dataTables component

  state = useState<State>({
    selected: [],
    usernameModal: undefined,
    batchEditModal: false,
    columns: [
      {
        name: 'priority',
        component: (val: number) => ({
          component: TranslationPriority,
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
      },
      {
        name: 'actions',
        searchable: false,
        sortable: false,
        component: (_, translation: Translation) => ({
          component: TranslationRowActions,
          props: {
            translation,
          },
        }),
      }
    ],
  });
};

export default Letters;