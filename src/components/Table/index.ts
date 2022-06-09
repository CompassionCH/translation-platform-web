import { Component, onWillUpdateProps, useState } from "@odoo/owl";
import Row, { Column } from './Row';
import template from './table.xml';
import Transition from '../Transition';
import PageSelector from './PageSelector';
import Loader from '../Loader';
import { PropsType } from "../../UtilityTypes";
import { ListQueryParams } from '../../models/BaseDAO';
import useWatch from "../../hooks/useWatch";

type Props<T extends Record<string, any>> = {
  data: T[];
  columns: Column[];
  keyCol: string;
  total: number;
  loading?: boolean;
  onFilterChange: Function;
  class?: string;
  onSelect?: Function;
};

const props = {
  data: { type: Array },
  columns: { type: Array },
  keyCol: { type: String },
  total: { type: Number },
  loading: { type: Boolean, optional: true },
  onFilterChange: { type: Function },
  onSelect: { type: Function, optional: true },
  class: { type: String, optional: true },
  onRowClick: { type: Function, optional: true },
};

export type {
  Column
};

type State<T> = {
  columns: Column[];
  selected: T[];
  selectAll: boolean;
};

export default class Table<T extends Record<string, any>> extends Component<PropsType<typeof props>> {

  static template = template;
  static props = props;
  static components = {
    Row,
    Transition,
    PageSelector,
    Loader,
  };

  state = useState<State<T>>({
    columns: [],
    selected: [],
    selectAll: false,
  });

  filters = useWatch<ListQueryParams<T>>({
    pageNumber: 0,
    pageSize: 10,
    search: [],
    sortBy: undefined,
    sortOrder: 'desc',
  }, () => this.notifyFilterChange());

  notifyFilterChange() {
    this.props.onFilterChange(this.filters);
  }

  toggleAll() {

    // Remove internal state
    this.state.selected.splice(0);
    this.state.selectAll = !this.state.selectAll;
    
    if (this.props.onSelect) {
      if (this.state.selectAll) {
        this.props.onSelect('all');
      } else {
        this.props.onSelect(this.state.selected);
      }
    }
  }

  toggleItem(key: any) {
    console.log(this);
    const index = this.state.selected.indexOf(key);
    if (index >= 0) {
      this.state.selected.splice(index, 1);
    } else {
      this.state.selected.push(key);
    }

    // Manual change, remove selectAll state
    if (this.state.selectAll) {
      this.state.selectAll = false;
    }

    if (this.props.onSelect) {
      this.props.onSelect(this.state.selected);
    }
  }

  setup(): void {
    this.update(this.props);
    onWillUpdateProps((nextProps) => {
      this.update(nextProps);
    });
  }

  private update({ columns }: Props<T>) {
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