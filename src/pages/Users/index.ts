import { Component, onMounted, useState } from "@odoo/owl";
import Table, { Column } from '../../components/Table';
import template from './users.xml';
import Button from "../../components/Button";

const columns: Column[] = [
  'username',
  'age',
  'translations',
  {
    name: 'available',
    header: 'Available',
    formatter: (val: boolean) => val ? 'Yes' : 'No',
  },
  {
    name: 'languages',
    formatter: (val: string[]) => val.join(', '),
  }
];

type User = {
  username: string;
  age: number;
  languages: string[];
  translations: number;
  available: boolean;
};

type State = {
  users: User[];
  loading: boolean;
  columns: Column[];
  selected: [];
};

const allUsers: User[] = [...Array(100).keys()].map(i => ({
  username: `user-${i}`,
  age: Math.round(Math.random() * 20 + 20),
  languages: ['french', 'english', 'spanish', 'chinese', 'german'].filter(() => Math.random() > 0.5),
  translations: Math.round(Math.random() * 100 + 10),
  available: Math.random() > 0.3,
}));

export default class Users extends Component {
  static template = template;

  static components = {
    Table,
    Button,
  };

  state = useState<State>({
    users: [],
    loading: false,
    columns,
    selected: [],
  });

  setup() {
    onMounted(() => {
      this.getPage(0); 
    });
  }

  onRowClick(item: any) {
    console.log('ROW CLICKED', item);
  }

  private onSelectionChange(e: any) {
    this.state.selected = e;
  }

  private getPage(i: number) {
    this.state.loading = true;
    setTimeout(() => {
      this.state.users = allUsers.slice(i*10, (i+1)*10);
      this.state.loading = false;
    }, 300 + (Math.random() * 500));
  } 
}