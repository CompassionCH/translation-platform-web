import { Component, onMounted, onWillUpdateProps, useState } from "@odoo/owl";
import Row, { Column } from './Row';
import template from './table.xml';
import Transition from '../Transition';
import PageSelector from './PageSelector';
import SortOrderViewer from "./SortOrderViewer";
import Loader from '../Loader';
import { PropsType } from "../../UtilityTypes";
import { ListQueryParams } from '../../models/BaseDAO';
import usePersistedState from "../../hooks/usePersistedState";
import Icon from '../Icon';

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
  key: { type: String, optional: true },
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
  searchTimeout?: number;
};

export default class Table<T extends Record<string, any>> extends Component<PropsType<typeof props>> {

  static template = template;
  static props = props;
  static components = {
    Row,
    Transition,
    PageSelector,
    Loader,
    Icon,
    SortOrderViewer,
  };

  state = useState<State<T>>({
    columns: [],
    selected: [],
    selectAll: false,
    searchTimeout: undefined,
  });

  filters = usePersistedState<ListQueryParams<T>>({
    pageNumber: 0,
    pageSize: 10,
    search: [],
    sortBy: undefined,
    sortOrder: 'desc',
  }, this.props.key);

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

    onMounted(() => {
      this.notifyFilterChange();
    });

    onWillUpdateProps((nextProps) => {
      this.update(nextProps);
    });
  }

  changePage(page: number) {
    this.filters.pageNumber = page;
    this.notifyFilterChange();
  }

  searchColumn(colName: string, event: InputEvent) {
    if (this.state.searchTimeout) {
      clearTimeout(this.state.searchTimeout);
    }

    this.state.searchTimeout = setTimeout(() => {
      const value = (event.target as HTMLInputElement).value;
      const filterIndex = this.filters.search.findIndex(it => it.column === colName);

      if (value.trim() === '' && filterIndex >= 0) {
        // Remove search filter if search bar is empty
        this.filters.search.splice(filterIndex, 1);
      } else {
        // Add filter if not existing yet
        if (filterIndex >= 0) {
          this.filters.search[filterIndex].term = value;
        } else {
          this.filters.search.push({
            column: colName,
            term: value,
          });
        }
      }

      clearTimeout(this.state.searchTimeout);
      this.state.searchTimeout = undefined;
      this.filters.pageNumber = 0;
      this.notifyFilterChange();
    }, 500);
  }

  updateSortOrder(colName: string) {
    if (this.filters.sortOrder === 'asc') {
      this.filters.sortOrder = 'desc';
    } else {
      this.filters.sortOrder = 'asc';
    }
    this.filters.sortBy = colName;
    this.notifyFilterChange();
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