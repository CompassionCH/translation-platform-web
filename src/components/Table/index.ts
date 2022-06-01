import { Component, onWillUpdateProps, useState } from "@odoo/owl";
import Row, { Column } from './Row';
import template from './table.xml';
import Transition from '../Transition';
import PageSelector from './PageSelector';
import Loader from '../Loader';

type Props = {
  data: Record<string, any>[];
  columns: Column[];
  keyCol: string;
  total: number;
  loading?: boolean;
  onPageChange: Function;
  class?: string;
};

export type {
  Column
};

type State = {
  columns: Column[];
  page: number;
  pageSize: number;
};

export default class Table extends Component<Props> {

  static template = template;
  static props = {
    data: { type: Array },
    columns: { type: Array },
    keyCol: { type: String },
    total: { type: Number },
    loading: { type: Boolean, optional: true },
    onPageChange: { type: Function },
    class: { type: String, optional: true },
  };

  static components = {
    Row,
    Transition,
    PageSelector,
    Loader,
  }

  state = useState<State>({
    columns: [],
    page: 0,
    pageSize: 10,
  });

  setup(): void {
    this.update(this.props);
    onWillUpdateProps((nextProps) => {
      this.update(nextProps);
    });
  }

  moveToPage(page: number) {
    this.props.onPageChange(page);
    this.state.page = page;
  }

  private update({ columns }: Props) {
    this.state.columns = columns.map((it) => {
      if (typeof it === 'string') {
        return {
          header: it,
          name: it,
        };
      } else {
        return it;
      }
    });
  }
}