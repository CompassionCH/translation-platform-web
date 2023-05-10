import { Component, onMounted, onWillUpdateProps, useState } from "@odoo/owl";
import Row, { Column, ColumnObject } from './Row';
import template from './DAOTable.xml';
import Transition from '../Transition';
import PageSelector from './PageSelector';
import SortOrderViewer from "./SortOrderViewer";
import Loader from '../Loader';
import _ from "../../i18n";
import BaseDAO, { ListQueryParams } from '../../models/BaseDAO';
import usePersistedState from "../../hooks/usePersistedState";
import Icon from '../Icon';
import Checkbox from '../Checkbox';
import notyf from "../../notifications";

type Props<T extends Record<string, any>> = {
  key?: string;
  columns: Column[];
  keyCol: string;
  dao: BaseDAO<T>;
  onSelect?: Function;
  class?: string;
  onRowClick?: Function;
  baseDomain?: Function;
};

const props = {
  key: { type: String, optional: true },
  columns: { type: Array },
  keyCol: { type: String },
  dao: { type: Object },
  onSelect: { type: Function, optional: true },
  class: { type: String, optional: true },
  onRowClick: { type: Function, optional: true },
  baseDomain: { type: Function, optional: true },
};

type State<T> = {
  columns: ColumnObject[];
  selectedIds: Array<string | number>;
  allSelectedIds: boolean;
  searchTimeout?: NodeJS.Timeout;
  loading: boolean;
  pageData: T[];
  total: number;
};

/**
 * This component displays a table based on a model DAO. You can find examples
 * in the /src/pages/letters/index.ts and letters.xml.
 * 
 * A DAO Table displays data fetched asynchronously using the /src/models/BaseDAO's interface.
 * To display content you must first define the DAO and then define the columns of the table.
 */
export default class DAOTable<T extends Record<string, any>> extends Component<Props<T>> {

  static template = template;
  static props = props;
  static components = {
    Row,
    Transition,
    PageSelector,
    Loader,
    Icon,
    SortOrderViewer,
    Checkbox,
  };

  _ = _;
  
  state = useState<State<T>>({
    columns: [],
    selectedIds: [],
    allSelectedIds: false,
    pageData: [],
    searchTimeout: undefined,
    loading: false,
    total: 0,
  });

  /**
   * The current set of filters, sort and stuff applied on the table.
   * Note that it is persisted in local storage to have them kept when coming back
   * to the table.
   */
  filters = usePersistedState<ListQueryParams<T>>({
    pageNumber: 0,
    pageSize: 10,
    search: [],
    sortBy: undefined,
    sortOrder: 'desc',
  }, this.props.key);

  setup(): void {
    this.update(this.props);

    onMounted(() => {
      this.updateData();
    });

    onWillUpdateProps((nextProps) => {
      this.update(nextProps);
    });
  }

  toggleAll() {
    if (this.state.allSelectedIds) {
      this.state.allSelectedIds = false;
      this.state.selectedIds = [];
      if (this.props.onSelect) {
        this.props.onSelect(this.state.selectedIds);
      }
    } else {
      this.state.loading = true;
      if (!this.props.dao.listIds) {
        console.error('Given DAO does not implement listIds!');
        notyf.error(_('Unable to perform this operation'));
      }
      this.props.dao.listIds(this.filters).then((data) => {
        this.state.selectedIds = data;
        this.state.allSelectedIds = true;
        this.state.loading = false;
        if (this.props.onSelect) {
          this.props.onSelect(this.state.selectedIds);
        }
      });
    }
  }

  clearFilters() {
    this.filters.search = [];
    this.filters.pageNumber = 0;
    this.filters.sortBy = undefined;
    this.filters.sortOrder = 'desc';
    this.updateData();
  }

  toggleItem(key: any) {
    const index = this.state.selectedIds.indexOf(key);
    if (index >= 0) {
      this.state.selectedIds.splice(index, 1);
    } else {
      this.state.selectedIds.push(key);
    }

    // No more in an allSelectedIds state
    this.state.allSelectedIds = false;

    if (this.props.onSelect) {
      this.props.onSelect(this.state.selectedIds);
    }
  }

  async updateData(filters: ListQueryParams<T> = this.filters) {
    this.state.loading = true;
    const domain = this.props.baseDomain ? await this.props.baseDomain() : [];
    filters.search = [...domain, ...filters.search];

    const data = await this.props.dao.list(filters);
    this.state.pageData = data.data;
    this.state.total = data.total;
    this.state.loading = false;
  }

  changePage(page: number) {
    this.filters.pageNumber = page;
    this.updateData();
  }

  searchColumn(colName: string, event: InputEvent) {
    if (this.state.searchTimeout) {
      clearTimeout(this.state.searchTimeout);
    }

    // Clear selection
    this.state.allSelectedIds = false;
    this.state.selectedIds = [];
    if (this.props.onSelect) {
      this.props.onSelect(this.state.selectedIds);
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
      this.updateData();
    }, 500);
  }

  updateSortOrder(colName: string) {
    const column = this.state.columns.find(it => it.name === colName);
    if (!column || column.sortable === false) return;

    if (this.filters.sortOrder === 'asc') {
      this.filters.sortOrder = 'desc';
    } else {
      this.filters.sortOrder = 'asc';
    }
    this.filters.sortBy = colName;
    this.updateData();
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