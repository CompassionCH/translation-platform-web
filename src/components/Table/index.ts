import { Component, onWillUpdateProps, useState } from "@odoo/owl";
import Row, { Column } from './Row';
import template from './table.xml';
import Transition from '../Transition';

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
  }

  state = useState<State>({
    columns: [],
    page: 0,
  });

  setup(): void {
    this.formatColumns(this.props.columns);
    onWillUpdateProps((nextProps) => {
      this.formatColumns(nextProps.columns);
    });
  }

  private formatColumns(columns: Column[]) {
    this.state.columns = columns.map((it) => {
      if (typeof it === 'string') {
        return {
          header: it,
          name: it,
          formatter: val => val,
        };
      } else {
        return it;
      }
    });
  }
}