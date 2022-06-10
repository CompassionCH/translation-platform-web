import { Component, onMounted, useState } from "@odoo/owl";
import Table, { Column } from '../../components/Table';
import template from './users.xml';
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { models, User } from "../../models";
import { ListQueryParams } from "../../models/BaseDAO";

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
    formatter: (val: boolean) => val ? 'Yes' : 'No',
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
};

export default class Users extends Component {
  static template = template;

  static components = {
    Table,
    Button,
    Modal,
  };

  state = useState<State>({
    users: [],
    loading: false,
    columns,
    selected: [],
    sendMail: false,
    total: 0,
  });

  setup() {
    onMounted(() => {
      this.updateData({}); 
    });
  }

  onRowClick(item: any) {
    console.log('ROW CLICKED', item);
  }

  private updateData(params: Partial<ListQueryParams<User>>) {
    this.state.loading = true;
    models.users.list(params).then((res) => {
      this.state.users = res.data;
      this.state.total = res.total;
      this.state.loading = false;
    });
  } 
}