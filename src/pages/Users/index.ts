import { Component, useState } from "@odoo/owl";
import DAOTable from "../../components/Table/DAOTable";
import { Column } from "../../components/Table/Row";
import template from './users.xml';
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import UserModal from "../../components/UserModal";
import { models, User } from "../../models";
import TableHeader from "../../components/Table/TableHeader";

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
    formatter: (val: User) => val.available ? 'Yes' : 'No',
    searchable: false,
  },
  {
    name: 'languages',
    formatter: (val: string[]) => val.join(', '),
    sortable: false,
  }
];

type State = {
  columns: Column[];
  selected: [];
  sendMail: boolean;
  modalUserId?: string;
};

export default class Users extends Component {
  static template = template;

  static components = {
    DAOTable,
    Button,
    Modal,
    UserModal,
    TableHeader,
  };

  dao = models.users;

  state = useState<State>({
    columns,
    selected: [],
    sendMail: false,
    modalUserId: undefined,
  });
}