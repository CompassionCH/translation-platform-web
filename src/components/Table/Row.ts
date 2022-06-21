import { Component, xml } from "@odoo/owl";
import { PropsType } from "../../UtilityTypes";
import Checkbox from '../Checkbox';

type ComponentTemplate = {
  component: typeof Component;
  props: Record<string, any>;
};

/**
 * A column of a DAO Table. If no formatter nor component is
 * defined, it will dump the value as-is.
 * 
 * Note that a column can also be defined with a string, which
 * will be used as name and header.
 */
export type Column = {
  /**
   * The header is displayed on top of the column, if
   * not provided the name will be used
   */
  header?: string;

  /**
   * The name of the property of the object to display.
   */
  name: string;

  /**
   * A function allowing you to format the content of the
   * cell. The value is the current's object value at index `name`
   * (upper field), while item is the complete item.
   */
  formatter?: (value: any, item: any) => string | number;

  /**
   * A function allowing you to format the content of the
   * cell with a custom component. The value is the current's
   * object value at index `name` (upper field), while item is
   * the complete item.
   */
  component?: (value: any, item: any) => ComponentTemplate | null;

  /**
   * Whether this column is sortable or not
   */
  sortable?: boolean;

  /**
   * Whether this column is searchable or not
   */
  searchable?: boolean;
} | string;

const props = {
  data: { type: Object },
  columns: { type: Array },
  onClick: { type: Function, optional: true },
  onToggle: { type: Function, optional: true },
  selectable: { type: Boolean, optional: true },
  selected: { type: Boolean, optional: true },
  last: { type: Boolean },
};

export default class Row extends Component<PropsType<typeof props>> {

  static template = xml`
    <tr t-on-click="props.onClick ? (() => props.onClick(props.data)) : (() => null)"
      t-att-class="{'hover:bg-slate-300 transition-colors cursor-pointer': props.onClick !== undefined}"
    >
      <td t-if="props.selectable" class="p-3" t-att-class="{'border-b border-solid border-slate-200': !props.last}">
        <Checkbox onClick="props.onToggle" checked="props.selected" />
      </td>
      <t t-foreach="props.columns" t-as="col" t-key="col.name">
        <td class="text-slate-700 py-3 px-1" t-att-class="{
          'border-b border-solid border-slate-200': !props.last,
          'pl-4': col_first,
          'pr-4': col_last,
        }">
          <span t-if="col.formatter" t-out="col.formatter(props.data[col.name], props.data)" />
          <t t-elif="col.component">
            <t t-set="component" t-value="col.component(props.data[col.name], props.data)" />
            <t t-if="component" t-component="component.component" t-props="component.props" />
          </t>
          <span t-else="" t-esc="props.data[col.name]" />
        </td>
      </t>
    </tr>
  `;

  static props = props;
  static defaultProps = {
    onToggle: () => null,
  };

  static components = {
    Checkbox,
  };
}