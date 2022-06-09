import { Component, xml } from "@odoo/owl";
import { PropsType } from "../../UtilityTypes";

export type Column = {
  header?: string;
  name: string;
  formatter?: (item: any) => string | number;
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
        <input type="checkbox" t-on-click.stop="this.props.onToggle"
          t-att="{'checked': props.selected}"
          class="rounded border-gray-300 text-compassion shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50" />
      </td>
      <t t-foreach="props.columns" t-as="col" t-key="col.name">
        <td t-if="props.data.hasOwnProperty(col.name)" class="text-slate-700 py-2 px-2" t-att-class="{'border-b border-solid border-slate-200': !props.last}">
          <span t-if="col.formatter" t-esc="col.formatter(props.data[col.name])" />
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
}