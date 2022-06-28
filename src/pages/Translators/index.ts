import { Component, useState } from "@odoo/owl";
import DAOTable from "../../components/Table/DAOTable";
import { Column } from "../../components/Table/Row";
import template from './translators.xml';
import Button from "../../components/Button";
import TranslatorModal from "../../components/TranslatorModal";
import { models } from "../../models";
import TableHeader from "../../components/Table/TableHeader";
import _ from "../../i18n";

/**
 * Columns are built according to translatorFieldsMapping in models/TranslatorDAO.
 * A compound mapped field (partner_id.name) is NOT sortable
 * A non-listed field is neither searchable nor sortable
 */
const columns: Column[] = [
  {
    name: 'translatorId',
    header: 'ID',
    searchable: false,
    sortable: false,
  },
  {
    name: 'name',
    header: 'Name',
    sortable: false,
  },
  {
    name: 'email',
    header: 'E-Mail',
    sortable: false,
  },
  {
    name: 'role',
    header: 'Role',
    searchable: false,
    sortable: false,
  },
  {
    name: 'age',
    header: 'Age',
    sortable: false,
  },
  {
    name: 'lastYear',
    header: 'Last Year',
  },
  {
    name: 'year',
    header: 'This Year',
  },
  {
    name: 'total',
    header: 'Total',
  },
  {
    name: 'language',
    header: 'Language',
    searchable: false,
    translatable: false,
    sortable: false,
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