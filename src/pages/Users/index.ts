import { Component, onMounted, useState } from "@odoo/owl";
import Table, { Column } from '../../components/Table';
import template from './users.xml';
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import UserModal from "../../components/UserModal";
import { models, User } from "../../models";
import { ListQueryParams } from "../../models/BaseDAO";
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
  users: User[];
  total: number;
  loading: boolean;
  columns: Column[];
  selected: [];
  sendMail: boolean;
  modalUserId?: string;
};

export default class Users extends Component {
  static template = template;

  static components = {
    Table,
    Button,
    Modal,
    UserModal,
    TableHeader,
  };

  state = useState<State>({
    users: [],
    loading: false,
    columns,
    selected: [],
    sendMail: false,
    total: 0,
    modalUserId: undefined,
  });

  updateData(params: Partial<ListQueryParams<User>>) {
    this.state.loading = true;
    models.users.list(params).then((res) => {
      this.state.users = res.data;
      this.state.total = res.total;
      this.state.loading = false;
    });
  } 
}