import { Component, xml } from "@odoo/owl";
import { PropsType } from "../../UtilityTypes";
import Checkbox from '../Checkbox';

type ComponentTemplate = {
  component: typeof Component;
  props: Record<string, any>;
};

export type Column = {
  header?: string;
  name: string;
  formatter?: (value: any, item: any) => string | number;
  component?: (value: any, item: any) => ComponentTemplate;
  sortable?: boolean;
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
      <td t-if="props.selectable" class="py-1 px-2" t-att-class="{'border-b border-solid border-slate-200': !props.last}">
        <Checkbox onClick="props.onToggle" checked="props.selected" />
      </td>
      <t t-foreach="props.columns" t-as="col" t-key="col.name">
        <td t-if="props.data.hasOwnProperty(col.name)" class="text-slate-700 py-2 px-2" t-att-class="{'border-b border-solid border-slate-200': !props.last}">
          <span t-if="col.formatter" t-out="col.formatter(props.data[col.name], props.data)" />
          <t t-elif="col.component">
            <t t-set="component" t-value="col.component(props.data[col.name], props.data)" />
            <t t-component="component.component" t-props="component.props" />
          </t>
          <span t-else="" t-esc="props.data[col.name]" />
        </td>
        <td t-else=""></td>
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