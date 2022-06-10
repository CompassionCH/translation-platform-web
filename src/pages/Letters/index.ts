import { Component, onMounted, useState } from "@odoo/owl";
import template from './letters.xml';
import { models, Letter } from "../../models";
import { Column } from "../../components/Table";
import { ListQueryParams } from "../../models/BaseDAO";

const columns: Column[] = [
  'title',
  'status',
  'priority',
  'source',
  'target',
  'translator',
  {
    header: 'date',
    name: 'date',
    formatter: (val: Date) => val.toLocaleDateString(),
  }
];

type State = {
  letters: Letter[];
  total: number;
  loading: boolean;
  columns: Column[];
  selected: [];
};


class Letters extends Component {

  static template = template;

  state = useState<State>({
    letters: [],
    total: 0,
    loading: false,
    columns,
    selected: [],
  });

  setup(): void {
    onMounted(() => this.updateData());
  }

  updateData(params: Partial<ListQueryParams<Letter>> = {}) {
    this.state.loading = true;
    models.letters.list(params).then((res) => {
      this.state.letters = res.data;
      this.state.total = res.total;
      this.state.loading = false;
    });
  }
};

export default Letters;