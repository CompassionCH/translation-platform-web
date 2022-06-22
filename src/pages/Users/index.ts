import { Component, useState } from "@odoo/owl";
import DAOTable from "../../components/Table/DAOTable";
import { Column } from "../../components/Table/Row";
import template from './users.xml';
import Button from "../../components/Button";
import TranslatorModal from "../../components/TranslatorModal";
import { models, User } from "../../models";
import TableHeader from "../../components/Table/TableHeader";
import _ from "../../i18n";

const columns: Column[] = [
  'username',
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
    name: 'available',
    header: 'Available',
    formatter: (val: User) => _(val.available ? 'Yes' : 'No'),
    searchable: false,
  },
  {
    name: 'language',
    translatable: true,
  }
];

type State = {
  columns: Column[];
  modalUserId?: string;
};

export default class Users extends Component {
  static template = template;

  static components = {
    DAOTable,
    Button,
    TranslatorModal,
    TableHeader,
  };

  dao = models.users;

  state = useState<State>({
    columns,
    modalUserId: undefined,
  });
}