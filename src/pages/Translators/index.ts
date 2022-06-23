import { Component, useState } from "@odoo/owl";
import DAOTable from "../../components/Table/DAOTable";
import { Column } from "../../components/Table/Row";
import template from './translators.xml';
import Button from "../../components/Button";
import TranslatorModal from "../../components/TranslatorModal";
import { models } from "../../models";
import TableHeader from "../../components/Table/TableHeader";
import _ from "../../i18n";

const columns: Column[] = [
  'translatorId',
  'name',
  'email',
  'role',
  'age',
  {
    name: 'lastYear',
    header: 'last year',
  },
  {
    name: 'year',
    header: 'this year',
  },
  'total',
  {
    name: 'language',
    translatable: true,
  }
];

type State = {
  columns: Column[];
  modalTranslatorId?: string;
};

export default class Users extends Component {
  static template = template;

  static components = {
    DAOTable,
    Button,
    TranslatorModal,
    TableHeader,
  };

  dao = models.translators;

  state = useState<State>({
    columns,
    modalTranslatorId: undefined,
  });
}