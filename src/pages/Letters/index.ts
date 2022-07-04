import { Component, useState } from "@odoo/owl";
import template from './letters.xml';
import { Letter, models } from "../../models";
import DAOTable from "../../components/Table/DAOTable";
import { Column } from "../../components/Table/Row";
import LetterPriority from "./LetterPriority";
import TranslatorButton from "../../components/TranslatorButton";
import Button from '../../components/Button';
import TableHeader from '../../components/Table/TableHeader';
import LetterRowActions from "./LetterRowActions";
import _ from "../../i18n";
import useCurrentTranslator from "../../hooks/useCurrentTranslator";
import notyf from "../../notifications";
import { navigateTo } from "../../components/Router/Router";

type State = {
  loading: boolean;
  columns: Column[];
};


class Letters extends Component {

  static template = template;
  static components = {
    DAOTable,
    Button,
    TableHeader,
  };

  translator = useCurrentTranslator();

  dao = models.letters; // Directly passed to the dataTables component

  state = useState<State>({
    loading: false,
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
        sortable: false,
      },
      {
        name: 'target',
        translatable: true,
        sortable: false,
      },
      // Display translator only if admin
      ...(this.translator.data?.role === 'admin' ? [{
        name: 'translatorId',
        header: 'Translator',
        component: (translatorId?: number) => {
          if (!translatorId) return null;
          return {
            component: TranslatorButton,
            props: {
              translatorId,
            }
          };
        },
      }] : []),
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

  setup() {
    this.state.loading = true;
    this.translator.loadIfNotInitialized().then(() => {
      if (this.translator.data?.skills.filter(it => it.verified).length === 0) {
        this.state.loading = false;
        notyf.error(_('You cannot list letters while having 0 verified translation skill'));
        navigateTo('/');
      }
    });
  }
};

export default Letters;